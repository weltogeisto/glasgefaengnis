#!/usr/bin/env python3
import json, math
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "clip-analysis"
OUT.mkdir(exist_ok=True)
manifest = json.loads((ROOT/'public/presence-manifest.json').read_text())
items=[]
for cue, meta in manifest.get('cues',{}).items():
    v=meta.get('video')
    if isinstance(v,str) and v.endswith('.mp4'):
        items.append((cue,meta,v.lstrip('/')))

def read_frames(path):
    cap=cv2.VideoCapture(str(path)); fps=cap.get(cv2.CAP_PROP_FPS) or 24.0
    frames=[]
    while True:
        ok,f=cap.read()
        if not ok: break
        frames.append(f)
    cap.release(); return fps,frames

def diff_scores(frames):
    s=[]; bright=[]; prev=None
    for f in frames:
        g=cv2.cvtColor(f,cv2.COLOR_BGR2GRAY)
        g=cv2.resize(g,(256,144),interpolation=cv2.INTER_AREA)
        g=cv2.GaussianBlur(g,(3,3),0)
        bright.append(float(np.mean(g)))
        if prev is not None:
            s.append(float(np.mean(cv2.absdiff(prev,g))))
        prev=g
    return s,bright

def freeze_window(scores,fps,duration_ms):
    if not scores:return 0,duration_ms
    a=np.asarray(scores)
    low=float(np.percentile(a,5)); med=float(np.median(a)); hi=float(np.percentile(a,75))
    spread=max(hi-low,0.01)
    thr=min(max(low+0.12*spread, low*1.5+0.015, 0.025), max(0.12, med*0.45))
    still=a<=thr
    lead=0
    while lead<len(still) and still[lead]: lead+=1
    trail=0
    while trail<len(still) and still[len(still)-1-trail]: trail+=1
    start=0 if lead<4 else int(round((lead+1)/fps*1000))
    end=duration_ms if trail<4 else int(round((len(scores)-trail)/fps*1000))
    return start,end

def make_sheet(frames,fps,path,n=12,cols=4):
    if not frames:return
    idx=np.linspace(0,len(frames)-1,n).round().astype(int).tolist()
    tw,th=320,180; labelh=24; rows=math.ceil(len(idx)/cols)
    sheet=Image.new('RGB',(cols*tw,rows*(th+labelh)),(15,15,15)); d=ImageDraw.Draw(sheet)
    for k,i in enumerate(idx):
        f=cv2.resize(frames[i],(tw,th),interpolation=cv2.INTER_AREA)
        im=Image.fromarray(cv2.cvtColor(f,cv2.COLOR_BGR2RGB))
        x=(k%cols)*tw; y=(k//cols)*(th+labelh)
        sheet.paste(im,(x,y)); d.text((x+5,y+th+4),f'{i/fps:.3f}s  f{i}',fill=(255,255,255))
    sheet.save(path,quality=88,optimize=True)

def tile_from_frame(frame, size=(300,169)):
    f=cv2.resize(frame,size,interpolation=cv2.INTER_AREA)
    return Image.fromarray(cv2.cvtColor(f,cv2.COLOR_BGR2RGB))

def tile_from_poster(path,size=(300,169)):
    if not path or not path.exists():
        return Image.new('RGB',size,(50,0,0))
    im=Image.open(path).convert('RGB')
    im.thumbnail(size)
    canvas=Image.new('RGB',size,(0,0,0))
    canvas.paste(im,((size[0]-im.width)//2,(size[1]-im.height)//2))
    return canvas

def make_overview(page_no, rows):
    tw,th=300,169; labelh=40; cols=4
    sheet=Image.new('RGB',(cols*tw,len(rows)*(th+labelh)),(12,12,12)); d=ImageDraw.Draw(sheet)
    for r,(rel,poster_path,fps,frames) in enumerate(rows):
        idx=[0,len(frames)//2,len(frames)-1]
        tiles=[tile_from_poster(poster_path,(tw,th))]+[tile_from_frame(frames[i],(tw,th)) for i in idx]
        y=r*(th+labelh)
        for c,im in enumerate(tiles): sheet.paste(im,(c*tw,y))
        d.text((4,y+th+3),f'{rel} | poster | first | mid | last',fill=(255,255,255))
    sheet.save(OUT/f'poster-overview-{page_no}.jpg',quality=90,optimize=True)

stats={}; overview_rows=[]
for cue,meta,rel in items:
    p=ROOT/'public'/rel
    fps,frames=read_frames(p)
    dur=int(round(len(frames)/fps*1000)) if fps else None
    scores,bright=diff_scores(frames)
    ms,me=freeze_window(scores,fps,dur)
    order=np.argsort(np.asarray(scores))[::-1][:8] if scores else []
    topdiff=[{'ms':int(round((int(i)+1)/fps*1000)),'score':round(float(scores[int(i)]),5)} for i in order]
    bd=np.diff(np.asarray(bright)) if len(bright)>1 else np.asarray([])
    rise_i=int(np.argmax(bd))+1 if len(bd) else None
    fall_i=int(np.argmin(bd))+1 if len(bd) else None
    poster_rel=meta.get('poster')
    poster_path=ROOT/'public'/str(poster_rel).lstrip('/') if poster_rel else None
    stats[rel]={
        'cue':cue,'fps':fps,'frames':len(frames),'durationFromFramesMs':dur,
        'motionStartClonePadMs':ms,'motionEndClonePadMs':me,
        'diffMin':round(min(scores),5) if scores else None,
        'diffP05':round(float(np.percentile(scores,5)),5) if scores else None,
        'diffMedian':round(float(np.median(scores)),5) if scores else None,
        'diffP95':round(float(np.percentile(scores,95)),5) if scores else None,
        'diffMax':round(max(scores),5) if scores else None,
        'topDiff':topdiff,
        'maxBrightnessRiseMs':int(round(rise_i/fps*1000)) if rise_i is not None else None,
        'maxBrightnessRise':round(float(bd[rise_i-1]),5) if rise_i is not None else None,
        'maxBrightnessFallMs':int(round(fall_i/fps*1000)) if fall_i is not None else None,
        'maxBrightnessFall':round(float(bd[fall_i-1]),5) if fall_i is not None else None,
        'first30Diff':[round(x,4) for x in scores[:30]],
        'last30Diff':[round(x,4) for x in scores[-30:]],
    }
    safe=rel.replace('/','__').replace('.mp4','.jpg')
    make_sheet(frames,fps,OUT/safe,n=12,cols=4)
    if 'phial' in rel:
        make_sheet(frames,fps,OUT/(safe.replace('.jpg','__dense.jpg')),n=24,cols=4)
    overview_rows.append((rel,poster_path,fps,frames))

for page,start in enumerate(range(0,len(overview_rows),13),1):
    make_overview(page,overview_rows[start:start+13])

(OUT/'frame-diff-stats.json').write_text(json.dumps(stats,indent=2),encoding='utf-8')
print('CONTACT_COUNT',len(stats))
print('PEAK_DIAGNOSTICS',json.dumps({k:{'topDiff':v['topDiff'],'maxBrightnessRiseMs':v['maxBrightnessRiseMs'],'maxBrightnessRise':v['maxBrightnessRise']} for k,v in stats.items()},separators=(',',':')))
