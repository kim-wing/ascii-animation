# ASCII Animation

A reusable agent skill for building procedural ASCII creatures in the browser. Filled silver character cells, anatomy-aware motion, and runnable Canvas examples.

## Install

Download this repository and place its folder at `~/.codex/skills/ascii-animation/` (or your agent’s skill directory). Start a new session so your agent discovers it. Other agents can read `SKILL.md` directly and follow its linked references.

## Use

> Use $ascii-animation to create an eagle with broad wings and articulated feathers, and provide a local preview.

Examples: `horse`, `jellyfish`, `eagle`. Fish modeling guidance is included in the references; upstream fish code is not distributed.

```sh
python3 scripts/create_example.py eagle /tmp/ascii-eagle-demo
python3 -m http.server 8765 --directory /tmp/ascii-eagle-demo --bind 127.0.0.1
# Open http://localhost:8765/eagle/
```

See [SKILL.md](SKILL.md) for modeling, rendering, and validation guidance. Inspired by [stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks); no upstream source is bundled.
