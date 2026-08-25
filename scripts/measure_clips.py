#!/usr/bin/env python3
import json
import math
import os
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity as ssim

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "public" / "presence-manifest.json"

POSE_PROMPTS = {
    "idle": "a full body person standing still in a neutral idle pose",
    "glass": "a person standing with both hands pressed against a glass wall",
    "pacing": "a person walking or pacing across a room",
    "seated": "a person sitting down on a chair or bench",
    "crouched": "a person crouching low to the ground",
    "capture": "a person restrained captured or being held down",
    "staggered-still": "a person standing unsteadily after staggering and then holding still",
    "exhaustion-freeze": "an exhausted person slumped and motionless after exertion",
    "study": "a person standing and carefully observing or studying something",
    "accusation": "a person leaning forward in an accusing confrontational posture",
    "turned-away": "a person with their back turned away from the camera",
    "bowed": "a person bowing forward from the waist",
    "no-figure": "an empty scene with no person visible",
}

EXPECTED_NORMALIZE = {
    "idle": "idle",
    "glass": "glass",
    "pace": "pacing",
    "pace-start": "pacing",
    "pace-end": "pacing",
    "stride": "pacing",
    "stride-start": "pacing",
    "sit": "seated",
    "seated": "seated",
    "crouched": "crouched",
    "capture": "capture",
    "staggered-still": "staggered-still",
    "exhaustion-freeze": "exhaustion-freeze",
    "study": "study",
    "accusation": "accusation",
    "turned-away": "turned-away",
    "bow": "bowed",
    "bowed": "bowed",
    "offscreen": "no-figure",
    "no-figure": "no-figure",
}


def ffprobe(path: Path):
    cmd = [
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=avg_frame_rate,r_frame_rate,nb_frames,duration,width,height",
        "-show_entries", "format=duration",
        "-of", "json", str(path),
    ]
    out = subprocess.check_output(cmd, text=True)
    data = json.loads(out)
    st = data.get("streams", [{}])[0]
    fmt = data.get("format", {})
    dur = st.get("duration") or fmt.get("duration")
    duration_ms = int(round(float(dur) * 1000)) if dur else None
    fps_s = st.get("avg_frame_rate") or st.get("r_frame_rate") or "0/1"
    try:
        a, b = fps_s.split("/")
        fps = float(a) / float(b) if float(b) else 0.0
    except Exception:
        fps = 0.0
    return {
        "durationMs": duration_ms,
        "fps": fps,
        "width": st.get("width"),
        "height": st.get("height"),
    }


def resize_gray(frame, size=(192, 108)):
    g = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    g = cv2.resize(g, size, interpolation=cv2.INTER_AREA)
    g = cv2.GaussianBlur(g, (5, 5), 0)
    return g


def crop_center(g):
    h, w = g.shape[:2]
    y0, y1 = int(h * 0.08), int(h * 0.92)
    x0, x1 = int(w * 0.08), int(w * 0.92)
    return g[y0:y1, x0:x1]


def read_video(path: Path):
    cap = cv2.VideoCapture(str(path))
    fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
    frames_color = []
    grays = []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        frames_color.append(frame)
        grays.append(resize_gray(frame))
    cap.release()
    return fps, frames_color, grays


def motion_metrics(grays, fps, duration_ms):
    if len(grays) < 2 or not fps:
        return None, None, None, {"threshold": None, "coverage": None, "peakScore": None}
    raw = []
    for a, b in zip(grays[:-1], grays[1:]):
        da = crop_center(a)
        db = crop_center(b)
        d = cv2.absdiff(da, db).astype(np.float32)
        changed = float(np.mean(d > 10.0))
        mean_d = float(np.mean(d))
        raw.append(mean_d + changed * 18.0)
    arr = np.asarray(raw, dtype=np.float32)
    win = max(3, int(round(fps * 0.20)))
    kernel = np.ones(win, dtype=np.float32) / win
    sm = np.convolve(arr, kernel, mode="same")
    med = float(np.median(sm))
    mad = float(np.median(np.abs(sm - med)))
    p20 = float(np.percentile(sm, 20))
    p75 = float(np.percentile(sm, 75))
    threshold = max(med + 2.8 * max(mad, 0.08), p20 + 1.35 * max(p75 - p20, 0.15), 0.65)
    active = sm > threshold
    min_run = max(3, int(round(fps * 0.28)))
    cleaned = np.zeros_like(active, dtype=bool)
    i = 0
    while i < len(active):
        if not active[i]:
            i += 1
            continue
        j = i
        while j < len(active) and active[j]:
            j += 1
        if j - i >= min_run:
            cleaned[i:j] = True
        i = j
    idx = np.flatnonzero(cleaned)
    if len(idx) == 0:
        motion_start = 0
        motion_end = 0
        coverage = 0.0
    else:
        coverage = float(np.mean(cleaned))
        motion_start = int(round((idx[0] / fps) * 1000))
        motion_end = int(round(((idx[-1] + 1) / fps) * 1000))
        motion_end = min(duration_ms or motion_end, motion_end)
        if coverage > 0.90:
            motion_start = 0
            motion_end = duration_ms
    peak_idx = int(np.argmax(sm))
    peak_val = float(sm[peak_idx])
    p90 = float(np.percentile(sm, 90))
    peak_ms = None
    if peak_val > max(threshold * 1.35, p90 * 1.22, med + 5.0 * max(mad, 0.08)):
        peak_ms = int(round(((peak_idx + 1) / fps) * 1000))
        if duration_ms is not None:
            peak_ms = min(duration_ms, peak_ms)
    return motion_start, motion_end, peak_ms, {
        "threshold": round(threshold, 4),
        "coverage": round(coverage, 4),
        "peakScore": round(peak_val, 4),
        "medianScore": round(med, 4),
        "p90Score": round(p90, 4),
    }


def frame_ssim(a, b):
    if a is None or b is None:
        return None
    if a.shape != b.shape:
        b = cv2.resize(b, (a.shape[1], a.shape[0]), interpolation=cv2.INTER_AREA)
    return float(ssim(a, b, data_range=255))


def loop_metric(grays):
    if not grays:
        return False, None
    score = frame_ssim(grays[0], grays[-1])
    return bool(score is not None and score >= 0.90), round(score, 4) if score is not None else None


def uniform_indices(n, k):
    if n <= 0:
        return []
    if n <= k:
        return list(range(n))
    return sorted(set(int(round(x)) for x in np.linspace(0, n - 1, k)))


def pil_from_bgr(frame):
    return Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))


def load_models():
    yolo = None
    clip_model = clip_processor = None
    blip_model = blip_processor = None
    try:
        from ultralytics import YOLO
        yolo = YOLO("yolo11n.pt")
    except Exception as e:
        print("MODEL_WARN yolo", repr(e), flush=True)
    try:
        from transformers import CLIPModel, CLIPProcessor
        clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        clip_model.eval()
    except Exception as e:
        print("MODEL_WARN clip", repr(e), flush=True)
    try:
        from transformers import BlipForConditionalGeneration, BlipProcessor
        blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
        blip_model.eval()
    except Exception as e:
        print("MODEL_WARN blip", repr(e), flush=True)
    return yolo, clip_model, clip_processor, blip_model, blip_processor


def yolo_people(yolo, frames, indices):
    if yolo is None or not indices:
        return None, []
    imgs = [frames[i] for i in indices]
    try:
        results = yolo.predict(imgs, classes=[0], conf=0.22, iou=0.5, verbose=False, imgsz=640)
    except Exception as e:
        print("YOLO_WARN", repr(e), flush=True)
        return None, []
    counts = []
    for idx, r in zip(indices, results):
        c = int(len(r.boxes)) if r.boxes is not None else 0
        counts.append((idx, c))
    return (max((c for _, c in counts), default=0)), counts


def clip_pose(clip_model, clip_processor, frame, expected=None, visible_people=None):
    if frame is None:
        return None, None
    if visible_people == 0:
        return "no-figure", {"top": "no-figure", "prob": 1.0, "margin": 1.0}
    if clip_model is None or clip_processor is None:
        return expected, None
    try:
        import torch
        labels = list(POSE_PROMPTS.keys())
        texts = [POSE_PROMPTS[x] for x in labels]
        inputs = clip_processor(text=texts, images=pil_from_bgr(frame), return_tensors="pt", padding=True)
        with torch.no_grad():
            outputs = clip_model(**inputs)
            probs = outputs.logits_per_image.softmax(dim=1)[0].cpu().numpy()
        order = np.argsort(-probs)
        top = labels[int(order[0])]
        p1 = float(probs[order[0]])
        p2 = float(probs[order[1]]) if len(order) > 1 else 0.0
        margin = p1 - p2
        accepted = None
        if p1 >= 0.26 and margin >= 0.045:
            accepted = top
        elif expected == top and p1 >= 0.17:
            accepted = top
        elif expected is not None and expected in labels:
            ei = labels.index(expected)
            if float(probs[ei]) >= 0.16 and int(np.where(order == ei)[0][0]) <= 1:
                accepted = expected
        return accepted, {"top": top, "prob": round(p1, 4), "margin": round(margin, 4), "expected": expected}
    except Exception as e:
        print("CLIP_POSE_WARN", repr(e), flush=True)
        return expected, None


def clip_poster_similarity(clip_model, clip_processor, poster_path, frames, indices):
    if not poster_path.exists() or not indices:
        return None
    if clip_model is None or clip_processor is None:
        return None
    try:
        import torch
        images = [Image.open(poster_path).convert("RGB")] + [pil_from_bgr(frames[i]) for i in indices]
        inputs = clip_processor(images=images, return_tensors="pt")
        with torch.no_grad():
            feats = clip_model.get_image_features(**inputs)
            feats = feats / feats.norm(dim=-1, keepdim=True)
        poster = feats[0]
        vid = feats[1:]
        mean = vid.mean(dim=0)
        mean = mean / mean.norm()
        sim_mean = float((poster * mean).sum().cpu())
        sim_max = float((vid @ poster).max().cpu())
        return {"mean": round(sim_mean, 4), "max": round(sim_max, 4)}
    except Exception as e:
        print("CLIP_POSTER_WARN", repr(e), flush=True)
        return None


def blip_caption(blip_model, blip_processor, frame):
    if blip_model is None or blip_processor is None or frame is None:
        return None
    try:
        import torch
        img = pil_from_bgr(frame)
        inputs = blip_processor(images=img, return_tensors="pt")
        with torch.no_grad():
            out = blip_model.generate(**inputs, max_new_tokens=28)
        return blip_processor.decode(out[0], skip_special_tokens=True).strip()
    except Exception as e:
        print("BLIP_WARN", repr(e), flush=True)
        return None


def expected_pose(entry):
    return EXPECTED_NORMALIZE.get(entry)


def main():
    manifest = json.loads(MANIFEST.read_text())
    cues = manifest.get("cues", {})
    items = []
    for cue, meta in cues.items():
        v = meta.get("video")
        p = meta.get("poster")
        if isinstance(v, str) and v.endswith(".mp4"):
            items.append((cue, meta, v, p))
    print(f"CLIP_COUNT {len(items)}", flush=True)

    yolo, clip_model, clip_processor, blip_model, blip_processor = load_models()
    results = []
    diagnostics = {}
    phial_timeline = {}

    for num, (cue, meta, video_rel, poster_rel) in enumerate(items, 1):
        video_path = ROOT / "public" / video_rel.lstrip("/")
        poster_path = ROOT / "public" / poster_rel.lstrip("/") if poster_rel else Path("/__missing__")
        out_file = video_rel.lstrip("/")
        print(f"MEASURE {num}/{len(items)} {out_file}", flush=True)
        if not video_path.exists():
            results.append({
                "file": out_file,
                "durationMs": None,
                "motionStartMs": None,
                "motionEndMs": None,
                "entryPose": None,
                "exitPose": None,
                "loopsSeamlessly": False,
                "peakMs": None,
                "posterMatches": False,
                "peopleVisible": None,
                "whatHappens": "Clip could not be read from the checked-out repository.",
            })
            continue
        try:
            probe = ffprobe(video_path)
            fps, frames, grays = read_video(video_path)
            duration_ms = probe["durationMs"]
            motion_start, motion_end, peak_ms, motion_diag = motion_metrics(grays, fps, duration_ms)
            loop_ok, loop_ssim = loop_metric(grays)
            sample_idx = uniform_indices(len(frames), 12)
            people_max, people_counts = yolo_people(yolo, frames, sample_idx)
            first_people = None
            last_people = None
            if yolo is not None and frames:
                _, edge_counts = yolo_people(yolo, frames, [0, len(frames)-1])
                if len(edge_counts) == 2:
                    first_people = edge_counts[0][1]
                    last_people = edge_counts[1][1]
            e_exp = expected_pose(meta.get("entryPose"))
            x_exp = expected_pose(meta.get("exitPose"))
            entry_pose, entry_diag = clip_pose(clip_model, clip_processor, frames[0] if frames else None, e_exp, first_people)
            exit_pose, exit_diag = clip_pose(clip_model, clip_processor, frames[-1] if frames else None, x_exp, last_people)
            poster_sim = clip_poster_similarity(clip_model, clip_processor, poster_path, frames, uniform_indices(len(frames), 9))
            poster_matches = None if poster_sim is None else bool(poster_sim["mean"] >= 0.76)

            cap_indices = [0]
            if peak_ms is not None and fps and frames:
                cap_indices.append(min(len(frames)-1, max(0, int(round((peak_ms/1000.0)*fps)))))
            if frames:
                cap_indices.append(len(frames)-1)
            cap_indices = sorted(set(cap_indices))
            caps = [(i, blip_caption(blip_model, blip_processor, frames[i])) for i in cap_indices]
            caps_clean = [c for _, c in caps if c]
            if not caps_clean:
                what = "Visible motion was measured, but no reliable descriptive caption was produced."
            elif len(set(caps_clean)) == 1:
                what = caps_clean[0].rstrip(".") + "."
            else:
                what = "; then ".join(c.rstrip(".") for c in caps_clean) + "."

            result = {
                "file": out_file,
                "durationMs": duration_ms,
                "motionStartMs": motion_start,
                "motionEndMs": motion_end,
                "entryPose": entry_pose,
                "exitPose": exit_pose,
                "loopsSeamlessly": loop_ok,
                "peakMs": peak_ms,
                "posterMatches": poster_matches,
                "peopleVisible": people_max,
                "whatHappens": what,
            }
            results.append(result)
            diagnostics[out_file] = {
                "cue": cue,
                "manifestEntry": meta.get("entryPose"),
                "manifestExit": meta.get("exitPose"),
                "fps": round(float(fps), 4),
                "frames": len(frames),
                "motion": motion_diag,
                "loopFirstLastSsim": loop_ssim,
                "posterClipSimilarity": poster_sim,
                "entryClassifier": entry_diag,
                "exitClassifier": exit_diag,
                "samplePeopleCounts": [[int(round((i/fps)*1000)) if fps else None, c] for i, c in people_counts],
                "captions": [[int(round((i/fps)*1000)) if fps else None, c] for i, c in caps],
            }

            if out_file.startswith("phial/"):
                timeline_idx = uniform_indices(len(frames), max(2, int(math.ceil((duration_ms or 10000) / 500))))
                _, tl_counts = yolo_people(yolo, frames, timeline_idx)
                cap_every = uniform_indices(len(frames), max(2, int(math.ceil((duration_ms or 10000) / 1000))))
                cap_tl = []
                for i in cap_every:
                    cap_tl.append([int(round((i/fps)*1000)) if fps else None, blip_caption(blip_model, blip_processor, frames[i])])
                phial_timeline[out_file] = {
                    "peopleTimeline500ms": [[int(round((i/fps)*1000)) if fps else None, c] for i, c in tl_counts],
                    "captionsApprox1s": cap_tl,
                    "maxPeople": people_max,
                }
        except Exception as e:
            print("MEASURE_ERROR", out_file, repr(e), flush=True)
            results.append({
                "file": out_file,
                "durationMs": None,
                "motionStartMs": None,
                "motionEndMs": None,
                "entryPose": None,
                "exitPose": None,
                "loopsSeamlessly": False,
                "peakMs": None,
                "posterMatches": None,
                "peopleVisible": None,
                "whatHappens": f"Clip could not be measured: {type(e).__name__}.",
            })

    print("===RESULT_JSON===", flush=True)
    print(json.dumps(results, ensure_ascii=False, separators=(",", ":")), flush=True)
    print("===DIAGNOSTICS_JSON===", flush=True)
    print(json.dumps(diagnostics, ensure_ascii=False, separators=(",", ":")), flush=True)
    print("===PHIAL_TIMELINE_JSON===", flush=True)
    print(json.dumps(phial_timeline, ensure_ascii=False, separators=(",", ":")), flush=True)


if __name__ == "__main__":
    main()
