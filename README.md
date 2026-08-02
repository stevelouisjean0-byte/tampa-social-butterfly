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
2. **Reviews** (`reviews.html`, plus the pull-quote on `index.html`) are SAMPLE placeholders marked with HTML comments. Replace with verified client reviews (names/initials with permission). Do not launch with samples.
3. **Event stories** (`stories.html`) are anonymized composite narratives marked SAMPLE. Replace with real, client-approved case studies.
4. **Booking form** (`contact.html`) is demo-only (client-side validation + success message, no submission). Wire to Web3Forms or another endpoint.
5. **Ticket link** (`events.html`) points to posh.vip root — replace with the exact event ticket URL.
6. **Privacy/Terms** are drafts — have them reviewed.
7. Events page: archive "Selling Tomorrow" after Aug 14, 2026.

## Design system

- Palette: warm paper `#FBF8F3`, cream/champagne/blush/lavender surfaces, warm charcoal ink `#292420`, single muted-gold accent `#A9843E`.
- Type: Fraunces (display serif) + Plus Jakarta Sans (body), via Google Fonts.
- Motion: IntersectionObserver reveals, custom cubic-bezier easing, full `prefers-reduced-motion` support (all animation disabled, hero video stays paused).
- Accessibility: skip link, focus rings, keyboard-accessible lightbox (Esc/arrows), aria-pressed filters, alt text on all media, pause controls on all video.
