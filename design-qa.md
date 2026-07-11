# Design QA

- Current source visual truth: `C:\Users\ayuka\AppData\Local\Temp\codex-clipboard-c7659039-cf83-41d9-861b-fd36d7216d91.png`
- Current desktop implementation screenshot: `C:\Users\ayuka\OneDrive\ドキュメント\codex\renders\hoshino-mobile-card-fix\desktop-hero.png`
- Current mobile implementation screenshot: `C:\Users\ayuka\OneDrive\ドキュメント\codex\renders\hoshino-mobile-card-fix\mobile-focused.png`
- Current side-by-side comparison: `C:\Users\ayuka\OneDrive\ドキュメント\codex\renders\hoshino-mobile-card-fix\qa-comparison-mobile-card.png`
- Original direction source: `C:\Users\ayuka\OneDrive\ドキュメント\codex\renders\hoshino-instagram-redesign\selected-option-2.png`
- Desktop viewport: 1080 × 750
- Mobile viewport: 390 × 844
- State: right hero panel at desktop and 390 × 844 mobile viewport

## Full-view comparison evidence

The supplied composition and focused mobile capture were reviewed together in `qa-comparison-mobile-card.png`. The mobile implementation preserves the watercolor image, ivory copy card, Japanese Mincho hierarchy, lavender/pink palette, and soft editorial treatment while changing only the responsive placement needed to keep the woman's face visible.

## Focused region evidence

The right hero panel was reviewed at desktop and mobile sizes. At 390 × 844 the full face, hair, supporting hand, and writing hand remain unobstructed; the copy card starts near the bottom of the image and overlaps only the lower image edge by 30px. The card stays inside the viewport without horizontal overflow, and desktop retains its original overlay composition.

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
- The left hero uses two phase-shifted `hero-stars-glow` animations sampled at dim and peak states; both overlays are derived from the original starlit-path image and use feathered masks.
- The right hero image and copy panel report `transform: none` and `animation-name: none` on desktop and mobile.
- `prefers-reduced-motion` disables star animation while preserving a subtle static highlight.
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

### Pass 4 — previous request

- Earlier findings: [P1] pale body copy blended into the watercolor background; [P1] the woman's two hands read as the same hand; [P2] the hero image had no dimensional motion.
- Fixes made: added a translucent ivory contrast panel and darker text tokens; generated a corrected illustration with the left hand under the chin and right hand writing; added pointer-responsive CSS 3D parallax, a touch fallback, and reduced-motion handling.
- Post-fix evidence: `qa-comparison-desktop.png` and `hero-mobile-390x844.png` show readable copy, anatomically correct hands, stable cropping, and no horizontal overflow. Runtime inspection confirmed the 3D transforms activate.
- No actionable P0/P1/P2 mismatches remain.

### Pass 5 — previous request

- Requested change: make the stars in the navy path hero glow and restore the woman panel to a non-animated presentation.
- Fixes made: added two low-opacity, phase-shifted star-brightness passes with soft gradient masks; removed pointer parallax, touch float, transforms, transitions, and motion JavaScript from the woman panel.
- Post-fix evidence: `hero-desktop-final-dim.png` and `hero-desktop-final-peak.png` show a restrained twinkle without palette drift; `mobile-top.png` and `mobile-woman-static.png` show responsive layout with no overflow. Runtime inspection confirmed the star animation names are active and the woman image remains `transform: none` / `animation-name: none`.
- Browser console errors: none.
- No actionable P0/P1/P2 mismatches remain.

### Pass 6 — current request

- Earlier finding: [P1] at 390px width the absolute-positioned copy card covered the woman's face, obscuring the illustration's primary subject.
- Fix made: on screens up to 640px, changed the right hero to a vertical flow, gave the image a measured 390:500 aspect ratio and adjusted focal point, then placed the copy card in normal flow with a restrained 30px overlap at the image's lower edge.
- Post-fix evidence: `mobile-focused.png` and `qa-comparison-mobile-card.png` show the woman's full face and both hands unobstructed, readable copy, and consistent visual hierarchy. Desktop remains a two-column hero with the original absolute overlay.
- Runtime checks: 390 × 844 viewport, no horizontal overflow, card width 343.2px, browser console errors none.
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
