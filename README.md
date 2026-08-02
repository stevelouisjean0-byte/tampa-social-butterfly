# Tampa Social Butterfly — Website Redesign

Static multi-page site (plain HTML/CSS/JS, no build step). Preview by serving the folder:

```
python -m http.server 8737 --directory C:\Users\steve\tampa-social-butterfly
```

## Pages

`index` · `about` · `services` (anchored per-service sections) · `social` (platform-specific IG/FB experience) · `gallery` (category hub) · `gallery-weddings` / `gallery-birthdays` / `gallery-bachelorettes` / `gallery-photoshoots` / `gallery-holidays` / `gallery-community` (real client photos, lightbox) · `stories` · `events` · `reviews` · `contact` (booking form) · `404` · `privacy` · `terms`

## Real client media

- `assets/img/site/` — 47 images pulled from the live tampasocialbutterfly.com (owner's own content), renamed by category. Raw originals archived in `~/tsb-site-images/`.
- `~/tsb-site-images/instagram/` — media retrieved from Instagram post Da_cW57RTRw (vertical reel + cover). Confirm the person shown consents before publishing on the site. To pull more posts, provide the post URLs — same retrieval method works per-post.
- ALL pages now use only real client media (photos from the live site, video from Instagram). Constraint from owner 2026-08-02: never add stock media to this project.

## Before launch — required replacements

This is a client-preview build. The following are **stand-ins and must be replaced**:

1. ~~Pexels stand-ins~~ **REMOVED 2026-08-02**: every image and video now comes from the customer's original website or Instagram (verified: zero stock references site-wide). The hero and Instagram phone frame play the real reel from post Da_cW57RTRw. For a richer hero montage and more reel slots, pull additional Instagram posts (provide post URLs).
2. ~~Sample reviews/stories~~ **REMOVED 2026-08-02** per audit: reviews.html now shows an honest "reviews on their way" state (populate with real verified reviews only); stories.html timelines are second-person service descriptions, not fabricated cases.
3. **Booking form is fully wired to Web3Forms** (fetch, honeypot, error fallback to direct email — never a false success). ONE step remains: paste a real access key into `contact.html` (`PASTE-WEB3FORMS-ACCESS-KEY-HERE`); get a free key at web3forms.com with contact@tampasocialbutterfly.com, and enable the autoresponder in the Web3Forms dashboard.
4. **Ticket link** (`events.html`) points to posh.vip root — replace with the exact event ticket URL.
5. **Privacy/Terms** are drafts — have them reviewed.
6. Homepage "Happening next" section auto-hides after Aug 14, 2026 (`data-expires`); events.html card should be moved to the archive then.
7. **Domain**: site is on github.io. When ready, point tampasocialbutterfly.com DNS at GitHub Pages, add a CNAME file, and swap the base URL in canonical/og/sitemap/robots (search-replace `stevelouisjean0-byte.github.io/tampa-social-butterfly` → `www.tampasocialbutterfly.com`).
8. **Model releases**: obtain written releases for identifiable people in photos/reel (client-side task; Florida right of publicity).
9. **Analytics**: none installed — pick Plausible/Fathom and add before iterating further.

## Audit remediation done 2026-08-02

One IA across nav/menu/footer (all 15 pages, script-generated); og:image/canonical/twitter meta on every page; og-cover.jpg (1200×630); LocalBusiness JSON-LD; sitemap.xml + robots.txt; width/height on all local images (CLS); WCAG AA contrast tokens (`--ink-3` #6B645C, new `--gold-text` #7C612E); hero video re-encoded 4.9 MB → 1.16 MB; shoot-08 PNG→JPEG (531→78 KB); sticky mobile CTA bar; expired-event auto-hide.

## Design system

- Palette: warm paper `#FBF8F3`, cream/champagne/blush/lavender surfaces, warm charcoal ink `#292420`, single muted-gold accent `#A9843E`.
- Type: Fraunces (display serif) + Plus Jakarta Sans (body), via Google Fonts.
- Motion: IntersectionObserver reveals, custom cubic-bezier easing, full `prefers-reduced-motion` support (all animation disabled, hero video stays paused).
- Accessibility: skip link, focus rings, keyboard-accessible lightbox (Esc/arrows), aria-pressed filters, alt text on all media, pause controls on all video.
