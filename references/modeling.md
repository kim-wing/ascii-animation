# Modeling living ASCII creatures

## Begin with silhouette and mechanics

Define head direction, body proportions, the parts that propel the animal, flexible appendages, and depth ordering. Check a monochrome silhouette before material detail. Shadows cannot repair an unrecognizable head or disconnected leg. Use a shared local coordinate system and transform joint anchors with body pitch and translation.

## Fish: centerline and body volume

Represent an elongated fish as cross sections around a curved centerline. The head remains relatively stable; a phase-delayed wave grows toward the tail. Interpolate radius along the spine to build head, torso and caudal taper. Attach fins at anatomical stations, deriving their orientation from the local tangent. Shade by approximate surface normal and depth. World steering, neighbor avoidance, feeding or pursuit are optional behaviors separate from body deformation. Do not require the original repository for this method.

## Jellyfish: pulse and delayed drag

The runnable reference is `assets/examples/jellyfish/`. `model.js` exports `bellShape`, `createTentacle`, and `updateTentacle`; `app.js` builds and renders the specimen. Bell contraction narrows its width and changes its height; synchronize propulsion with contraction and let expansion recover more slowly. Fill the dome and oral arms so it retains volume at a coarse grid. Tentacles use Verlet-style previous positions, damping, small flow/gravity forces, pinned roots and repeated length constraints. Reset pinned roots each solve pass. Cap delta time to avoid explosions after a background-tab pause. Keep sufficient tentacle width to survive character sampling.

## Horse: choreograph a gallop

The runnable reference is `assets/examples/horse/`. `model.js` exports `gaitAt`, `hoofAt`, and a two-bone `joint` solver. The renderer paints far limbs, tail, torso/neck/head/mane, then near limbs.

The current study uses a shared normalized cycle. Foreleg support occupies approximately .12–.34 and hindleg drive .48–.69, with a small far-side delay; other phases include gathering and suspension. These are artistic prototype timings, not a universal biomechanical standard. Preserve a continuous wrap at phase 1→0.

Key poses should read distinctly: front reach, landing/support, limbs gathered under belly, hind push-off, and airborne extension. Keep feet fixed relative to the passing ground during stance. In an in-place demo, stance feet move backward at roughly the ground-scroll velocity. Bring the recovering hoof up and forward on a different path. A symmetrical sine wave for every leg reads as paddling.

Front limbs can use shoulder-to-carpal-to-hoof chains. Hind limbs need a visible thigh/stifle and hock before the lower leg; one thick backward-bent rod does not read as a horse. Solve or author those chains with reachable targets. Two-bone IK must clamp distance and maintain the chosen bend side; inspect folds because a mathematically valid knee can still bend the wrong way visually. Use body pitch, chest rise and neck/head counter-motion to communicate weight transfer. Mane and tail trail with phase lag rather than rotating rigidly.

The examples remain starting points: evaluate the requested breed, proportions, desired strength and realism. User feedback on body thickness should change torso/shoulder/haunch shapes without casually changing the gait.

## Common failures and fixes

- Entire image moves as a rectangle: segment the subject and rig meaningful parts, or build procedural geometry.
- Jellyfish looks like blue wire: retain filled dome volume and oral-arm mass, reduce excessive glow, use neutral shaded cells.
- Horse looks mechanical: redesign support order, recovery paths, airborne interval and joint folds; speed is secondary.
- Limb detaches during body pitch: transform all attachment anchors with the same body matrix.
- Foot slides or floats during support: align contact height and ground-relative speed.
- Coarse sampling loses ears/feet/tentacles: enlarge that feature or slightly refine the grid; avoid making the whole image tiny.

## Eagle: lift and feather articulation

`assets/examples/eagle/` supplies a dorsal flight study. `flightAt` drives span, wrist height, fingertip sweep, bob and bank. Layer broad secondary feathers into a continuous inner wing; let primary feathers separate into fingers at the tips. Keep both shoulders pinned to the torso. Tail feathers fan from a shared root and the head remains relatively stable. The included projection is an artistic 2D study; use 3D joint rotation or more key poses for foreshortening and realistic gliding. Do not flap the whole bird as one rigid bitmap.
