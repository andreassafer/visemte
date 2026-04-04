# Visemte

A template generator for creating responsive emails — built with React 19, TypeScript, and MJML.

## Status

The project is currently still under development. A release is planned for 2026.

## Features

- **Editor** — create email templates visually by adding blocks to the structure tree
- **Block library** — Text, Image, Button, Divider, Spacer, Columns, Hero, Navbar, Icons, Video, Countdown, FAQ, Quote
- **MJML-powered** — renders to battle-tested, cross-client compatible HTML entirely in the browser
- **Live preview** — see changes instantly as you edit
- **HTML export** — download the finished HTML or copy it to the clipboard
- **Template library** — start from a curated set of pre-built templates
- **Undo / Redo** — full history via Zustand temporal middleware
- **Multi-tab** — work on multiple templates simultaneously
- **Dark / Light themes** — GitHub-style theme presets with accent color options
- **22 languages** — UI fully localized (Arabic, Chinese, Czech, Dutch, English, Finnish, French, German, Greek, Croatian, Hungarian, Italian, Japanese, Norwegian, Polish, Portuguese, Russian, Slovak, Slovenian, Spanish, Swedish, Turkish)
- **Offline-first** — images stored as Base64; no backend required

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Email rendering | mjml-browser |
| Drag & Drop | @hello-pangea/dnd |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 + zundo (undo/redo) |
| i18n | react-i18next 16 |

## License

MIT © Andreas Safer
