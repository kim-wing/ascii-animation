---
name: ascii-animation
description: Build procedural animated ASCII creatures in the browser, with filled character cells, anatomical silhouettes, articulated gaits or soft-body motion. Use for swimming fish, pulsing jellyfish, galloping horses, or similar living character art, rather than static text conversion.
---

# ASCII Animation

Produce recognizable, living creatures with coherent anatomy and motion. Treat character art as a rendering of a deforming body, not a static text image translated around the screen.

## Choose the motion model

Read [modeling.md](references/modeling.md) for anatomy, phase design and the lessons from fish, jellyfish and horse iterations. Read [rendering.md](references/rendering.md) for the specific filled-cell material and verification criteria.

- Fish / elongated swimmers: body centerline, tapered cross sections, traveling wave with increasing tail amplitude, separate fins; steer the whole animal smoothly.
- Jellyfish / soft bodies: contracting bell drives movement; rooted, constrained tentacles lag behind it. Adapt `assets/examples/jellyfish/`.
- Horse / articulated runners: shared gait phase, timed support and suspension, joint chains and distinct near/far limbs. Adapt `assets/examples/horse/` as an editable prototype, not an anatomical ground truth.
- Eagle / flying birds: broad articulated wings, layered secondary feathers, separated primary tips, body counter-motion and a fan tail. Adapt `assets/examples/eagle/`.
- Other creatures: choose body parts and force-producing actions appropriate to that creature. Do not reuse a horse gait or fish tail wave merely because the renderer is shared.

## Implement

Inspect the target project and retain its stack and UI conventions. Keep anatomy/motion separate from character rendering. The bundled examples use Canvas 2D, ES modules and no build step. Their HTML is optional demo UI; the model and renderer can be integrated independently.

To create a standalone local reference:

```sh
python3 <skill-dir>/scripts/create_example.py horse <new-output-dir>
# Or use jellyfish or eagle instead of horse.
python3 -m http.server 8765 --directory <new-output-dir> --bind 127.0.0.1
```

The script prints the route to open. For a new species, start from the closest model, then replace its anatomy and motion; copying a demo does not complete a new creature request.

Use one animation clock with delta-time clamping, explicit pause and speed controls, device-pixel-ratio handling, and a reduced-motion initial state. Keep alpha outside the silhouette transparent before ASCII sampling. Preserve filled body mass and negative space between limbs.

## Verify and deliver

Inspect the actual browser animation and representative extended, gathered, contact and airborne poses. Check silhouette readability at the intended viewport, grounded feet, joint continuity, coherent near/far ordering, and no clipping. A syntax check or one attractive screenshot does not establish a convincing gait. Use available browser tools; none are mandatory dependencies of this skill.

For joint or constraint changes, sample a full cycle for finite coordinates, segment lengths and contact/suspension timing. Adjust actual anatomy or phase timing when the pose looks wrong; changing speed alone will not repair it.

Provide a working preview and a screenshot, briefly describing motion and controls. Follow the user's delivery scope; a local example does not imply permission to deploy.

## Provenance

This skill was distilled from a fish-inspired ASCII ocean plus locally authored jellyfish, horse and eagle studies. The original inspiration is [stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks). Its retrieved source had no LICENSE file; upstream source is not bundled here. If directly reusing upstream code, inspect its current terms and preserve attribution without inventing a license. The bundled examples are project-authored reference implementations and carry no assertion of a third-party license grant.
