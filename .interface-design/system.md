# Resume website design

A concise professional resume for engineering readers. Keep the established blue topbar and Bootstrap container widths, with a modern sans-serif body. The PDF keeps its separate LaTeX serif style.

- Use Bootstrap's responsive `.container-lg` for the main page and `.container` for header/footer. Container horizontal padding is 12px; do not constrain the page to 1000px.
- Blue header: `#0055bd`, 8px vertical padding, 64px round profile image in its original crop, 24px/500 name. Navigation uses small inline icons beside labels, not icons above labels.
- IBM Plex Sans, self-hosted WOFF2 with the bundled license. Body 16px/1.65; summary 18px/1.6; section headings 18px/600; main role title 20px/600; compact titles 16px/600; metadata 14px.
- Neutral paper `#fbfbfb`, ink `#2d353e`, muted text `#58616c`; fine section rules `#ced2d8`. No cards or decorative shadows. Space on a 4px unit, with roughly 32px between sections.
- One blue accent. Links and keyboard focus use it. Keep all theme colors in `--resume-*` variables; dark paper is `#20262e`, ink `#edf0f4`, and links `#8bbcff`.
- Native 44px sun/moon button with an accessible action label and pressed state. Respect system preference before manual selection; remember a manual choice when storage is available.
- Small gray badges with blue text, 12px/500, 4px 8px padding, 2px radius, 6px gap. Only Technical skills uses badges. Keep skill group labels beside badges on desktop and above them on mobile.
- On narrow screens, put the theme button alongside the identity and allow the contact links to wrap below. Stack entry metadata, keep links keyboard-accessible, and prevent horizontal overflow.
