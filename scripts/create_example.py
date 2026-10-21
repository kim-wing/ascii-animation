#!/usr/bin/env python3
"""Copy one self-contained ASCII study into a new local preview folder."""
import argparse
from pathlib import Path
import shutil
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('example', choices=['horse','jellyfish','eagle'])
p.add_argument('output', type=Path)
a=p.parse_args()
dest=a.output.expanduser().resolve()
if dest.exists():
 p.error('Output already exists; choose a new folder to avoid overwriting work.')
source=Path(__file__).resolve().parents[1]/'assets/examples'
dest.mkdir(parents=True)
shutil.copytree(source/a.example,dest/a.example)
shutil.copy2(source/'icon.svg',dest/'icon.svg')
# Demo home links should work without the original ocean application.
(dest/'index.html').write_text('<!doctype html><meta charset="utf-8"><title>ASCII studies</title><a href="'+a.example+'/">Open '+a.example+' study</a>')
print('Created '+str(dest))
print('Serve this folder over HTTP, then open /'+a.example+'/')
