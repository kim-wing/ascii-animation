# Filled-cell ASCII material

The accepted visual language has a black canvas, very faint grid, grey/silver filled cells, mostly dark glyphs, and sparse vivid character accents. It is neither plain white text nor neon line art.

## Suggested starting parameters

- Logical cell width: clamp(round(viewportWidth / 124), 8, 13) CSS pixels.
- Cell height: round(width × 1.45). Font: semibold monospace around .74 × cell height.
- Fill each occupied cell with a shaded rectangle and an approximately 1 px gutter. Align glyph at its center.
- Body ramp: `:;t%SX8#@`. Select glyph using luminance, local texture and a deterministic hash.
- Most glyphs dark (`#0e0f13` / `#1b1d24`); about 9% colored accents and another 4% white highlights is a useful starting point.
- Silver tint around [0.92, 0.97, 1.05]. Keep a real luminance range across the surface; a uniform rectangle fill flattens the animal.

These are starting values, not fixed requirements. Preserve the desired character scale when adapting viewport or species.

## Geometry to glyphs

A practical Canvas pipeline paints a shaded anatomical silhouette into a transparent offscreen buffer, samples it at a fixed screen-space grid, and emits one filled cell and glyph per occupied sample. Alpha gates silhouette coverage. Never fill the entire image bounding box. Avoid reading an oversized full-resolution buffer unnecessarily; a small model buffer is enough for coarse ASCII cells.

An alternative is to rasterize procedural 3D/cross-section geometry directly into a character depth grid. Keep depth ordering consistent either way. Separate simulation/model time from material sampling so shading cannot accidentally drive motion.

Keep material texture stable in model coordinates when it should travel with the body. A screen-space hash, as used in the simple demos, is convenient but can shimmer when the animal crosses cells. Do not use fresh random glyphs on every frame unless noise is intentionally requested.

## Visual checks

Check light/dark cell contrast, recognizable body mass, separated limbs, visible small features, stable colors, no clipped tail or ears, and fit at desktop/mobile viewports. Inspect at normal speed and slow motion. Verify pause/resume and speed controls, and sample a full cycle after rig edits. Respect reduced-motion settings. Retain the host page's typography and controls rather than imposing a new product design.
