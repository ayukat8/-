# Design QA

- Current source visual truth: `C:\Users\ayuka\AppData\Local\Temp\codex-clipboard-fe1d5760-1c36-497e-8a0c-4265d85ee942.png`
- Current desktop implementation screenshot: `C:\Users\ayuka\OneDrive\ドキュメント\codex\renders\hoshino-hero-update\hero-desktop-1080x750.png`
- Current mobile implementation screenshot: `C:\Users\ayuka\OneDrive\ドキュメント\codex\renders\hoshino-hero-update\hero-mobile-390x844.png`
- Current side-by-side comparison: `C:\Users\ayuka\OneDrive\ドキュメント\codex\renders\hoshino-hero-update\qa-comparison-desktop.png`
- Original direction source: `C:\Users\ayuka\OneDrive\ドキュメント\codex\renders\hoshino-instagram-redesign\selected-option-2.png`
- Desktop viewport: 1080 × 750
- Mobile viewport: 390 × 844
- State: homepage top and focused right hero panel; pointer-neutral and pointer-active states

## Full-view comparison evidence

The supplied screenshot and final desktop capture were normalized to the same 1080 × 750 frame and reviewed together in `qa-comparison-desktop.png`. The edited illustration preserves the watercolor composition while correcting the anatomy: the left hand supports the chin and the right hand writes. The live page preserves the selected navy/cream split direction, warm rose CTA, Japanese Mincho hierarchy, and soft lavender editorial treatment.

## Focused region evidence

The right hero panel was reviewed at desktop and mobile sizes. The translucent ivory copy panel, darker navy headline, darker body copy, and pink script remain legible against the detailed watercolor background. On mobile the card stays inside the viewport without horizontal overflow, while the corrected writing hand and night-window setting remain visible.

## Required fidelity surfaces

- Fonts and typography: Shippori Mincho provides the editorial display treatment and Zen Maru Gothic provides friendly body copy. Final headline wraps into the intended two lines on desktop, remains readable on mobile, and uses no more than two font families.
- Spacing and layout rhythm: the desktop hero uses an equal two-column split with aligned heights and no image bands. Header, hero, teaser, and detailed sections have consistent spacing and rounded-surface rhythm. Mobile has no horizontal overflow.
- Colors and tokens: deep navy, warm ivory, pale lavender, dusty pink, muted rose, and gold imagery match the selected mock and Instagram feed. Text and CTA contrast remain readable.
- Image quality and asset fidelity: all visible custom illustrations are raster assets. The hero woman, starlit path, and all three fortune images load successfully with no broken images or placeholder art.
- Copy and content: service claims, 20/50-minute durations, prices, gentle tone, and the required one-time-use language remain accurate. No fabricated testimonial, countdown, or social-proof claim was added.
- Icons: no custom SVG, emoji, CSS-drawn, or placeholder icon substitutes are visible in the redesigned surfaces.
- Accessibility: semantic headings, descriptive hero alt text, decorative teaser images with empty alt text, keyboard-focus styles, reduced-motion handling, and mobile tap targets are present.

## Interaction and runtime checks

- Three fortune teaser links detected; the first link moved the page to `#fortune` with the section positioned below the sticky header.
- Five reservation CTAs resolve to the same configured STORES reservation URL.
- Desktop pointer movement changed the hero image and copy panel to non-trivial `matrix3d(...)` transforms; pointer leave resets the CSS variables.
- Touch-capable devices receive a restrained ambient 3D float, and `prefers-reduced-motion` disables both animation and transitions.
- Browser console errors checked: none.
- Corrected hero asset loaded at its full 1536 × 1024 natural size; no broken images detected.
- Desktop and mobile horizontal overflow checked: none.

## Comparison history

### Pass 1

- Earlier findings: [P1] the right hero image left navy bands because the grid retained centered alignment; [P2] the desktop headline wrapped into three lines.
- Fixes made: forced stretched grid alignment, made the hero image cover the full panel, and reduced the display size and letter spacing.
- Post-fix evidence: `implementation-desktop-v4.png` removed the bands and restored the intended two-line headline.

### Pass 2

- Earlier findings: [P1] the generated woman was cropped out of the desktop hero; [P2] the full desktop navigation pushed the booking button outside the header.
- Fixes made: moved the hero image focal point to the right, widened the header container, and tightened navigation spacing.
- Post-fix evidence: `implementation-desktop-final.png` shows the woman, desk, window, full navigation, and booking CTA without overflow.

### Pass 3

- No actionable P0/P1/P2 mismatches remain.
- Remaining P3: the source mock uses an organic watercolor seam between the hero halves; the implementation uses a straight split to keep responsive cropping and text positioning predictable.

### Pass 4 — current request

- Earlier findings: [P1] pale body copy blended into the watercolor background; [P1] the woman's two hands read as the same hand; [P2] the hero image had no dimensional motion.
- Fixes made: added a translucent ivory contrast panel and darker text tokens; generated a corrected illustration with the left hand under the chin and right hand writing; added pointer-responsive CSS 3D parallax, a touch fallback, and reduced-motion handling.
- Post-fix evidence: `qa-comparison-desktop.png` and `hero-mobile-390x844.png` show readable copy, anatomically correct hands, stable cropping, and no horizontal overflow. Runtime inspection confirmed the 3D transforms activate.
- No actionable P0/P1/P2 mismatches remain.

## Findings

No actionable P0/P1/P2 findings remain.

## Open Questions

None.

## Implementation Checklist

- [x] Selected option 2 recreated as responsive HTML/CSS.
- [x] Custom raster assets placed in the live site.
- [x] Desktop and mobile layouts checked.
- [x] Primary anchors and reservation links checked.
- [x] Console and broken-image checks passed.

## Follow-up Polish

- P3: consider a future dedicated social-share image using the same navy-to-lavender visual language.

final result: passed
