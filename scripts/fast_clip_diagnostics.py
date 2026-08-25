#!/usr/bin/env python3
import json, math
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'clip-analysis-fast'; OUT.mkdir(exist_ok=True)
manifest=json.loads((ROOT/'public/presence-manifest.json').read_text())
items=[]
for cue,meta in manifest.get('cues',{}).items():
    v=meta.get('video')
    if isinstance(v,str) and v.endswith('.mp4'):
        items.append((cue,meta,v.lstrip('/')))

def frame_at(cap,i):
    cap.set(cv2.CAP_PROP_POS_FRAMES,int(i)); ok,f=cap.read(); return f if ok else None

def to_tile(frame,size=(300,169)):
    if frame is None:return Image.new('RGB',size,(60,0,0))
    f=cv2.resize(frame,size,interpolation=cv2.INTER_AREA)
    return Image.fromarray(cv2.cvtColor(f,cv2.COLOR_BGR2RGB))

def poster_tile(path,size=(300,169)):
    if not path or not path.exists():return Image.new('RGB',size,(60,0,0))
    im=Image.open(path).convert('RGB'); im.thumbnail(size)
    out=Image.new('RGB',size,(0,0,0)); out.paste(im,((size[0]-im.width)//2,(size[1]-im.height)//2)); return out

rows=[]
for cue,meta,rel in items:
    cap=cv2.VideoCapture(str(ROOT/'public'/rel)); fps=cap.get(cv2.CAP_PROP_FPS) or 24.0; n=int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fs=[frame_at(cap,0),frame_at(cap,max(0,n//2)),frame_at(cap,max(0,n-1))]; cap.release()
    pp=meta.get('poster'); pp=ROOT/'public'/str(pp).lstrip('/') if pp else None
    rows.append((rel,poster_tile(pp),*[to_tile(f) for f in fs]))

for pg,start in enumerate(range(0,len(rows),13),1):
    batch=rows[start:start+13]; tw,th=300,169; lh=38; sh=Image.new('RGB',(4*tw,len(batch)*(th+lh)),(12,12,12)); d=ImageDraw.Draw(sh)
    for r,row in enumerate(batch):
        rel,*tiles=row; y=r*(th+lh)
        for c,t in enumerate(tiles):sh.paste(t,(c*tw,y))
        d.text((5,y+th+3),f'{rel} | poster | first | mid | last',fill=(255,255,255))
    sh.save(OUT/f'poster-overview-{pg}.jpg',quality=89,optimize=True)

candidates={
 'prison/rage.mp4','prison/laugh.mp4',
 'prison/cycle-01/moriondo-capture-rage.mp4','prison/cycle-01/moriondo-rage-performed.mp4','prison/cycle-01/moriondo-rage-true-break.mp4',
 'phial/cycle-01/phial-three-smiths-strike.mp4','phial/cycle-01/phial-ruben-assemble.mp4','phial/cycle-01/phial-ignition-against-silk.mp4'
}
metrics={}
for _,_,rel in items:
    if rel not in candidates:continue
    cap=cv2.VideoCapture(str(ROOT/'public'/rel)); fps=cap.get(cv2.CAP_PROP_FPS) or 24.0
    prev=None; diffs=[]; bright=[]; idx=0
    while True:
        ok,f=cap.read()
        if not ok:break
        g=cv2.cvtColor(f,cv2.COLOR_BGR2GRAY); g=cv2.resize(g,(256,144),interpolation=cv2.INTER_AREA); g=cv2.GaussianBlur(g,(3,3),0)
        bright.append(float(np.mean(g)))
        if prev is not None:diffs.append(float(np.mean(cv2.absdiff(prev,g))))
        prev=g; idx+=1
    cap.release()
    a=np.asarray(diffs); order=np.argsort(a)[::-1][:12]
    bd=np.diff(np.asarray(bright))
    metrics[rel]={
      'topDiff':[{'ms':int(round((int(i)+1)/fps*1000)),'score':round(float(a[int(i)]),5)} for i in order],
      'maxBrightnessRiseMs':int(round((int(np.argmax(bd))+1)/fps*1000)) if len(bd) else None,
      'maxBrightnessRise':round(float(np.max(bd)),5) if len(bd) else None,
      'maxBrightnessFrameMs':int(round(int(np.argmax(bright))/fps*1000)) if bright else None,
      'brightnessMax':round(float(np.max(bright)),5) if bright else None
    }
(OUT/'fast-metrics.json').write_text(json.dumps(metrics,indent=2),encoding='utf-8')
print(json.dumps(metrics,separators=(',',':')))
