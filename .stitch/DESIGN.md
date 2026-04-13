# Gap Finder NYC - Stitch Design System

Extracted from Stitch export on 2026-04-01.

## Color Palette

### Core
| Token | Value | Usage |
|-------|-------|-------|
| background | #f7f9fb | Page background, light neutral |
| surface | #f7f9fb | Main surface color |
| surface-container | #eceef0 | Elevated containers |
| surface-container-low | #f2f4f6 | Subtle container backgrounds |
| surface-container-high | #e6e8ea | Emphasized containers |
| surface-container-highest | #e0e3e5 | Most elevated containers |
| surface-container-lowest | #ffffff | Cards, floating panels |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| on-surface | #191c1e | Primary body text |
| on-surface-variant | #45474c | Secondary/muted text |
| on-background | #191c1e | Text on background |

### Brand / Semantic
| Token | Value | Usage |
|-------|-------|-------|
| primary | #091426 | Deep navy, primary actions |
| primary-container | #1e293b | Navy headers, dark panels |
| on-primary | #ffffff | Text on primary |
| on-primary-container | #8590a6 | Muted text on navy |
| secondary | #006c49 | Green, opportunity/underserved |
| secondary-container | #6cf8bb | Bright green accent |
| on-secondary | #ffffff | Text on secondary |
| tertiary | #330002 | Deep red base |
| on-tertiary-container | #ff5250 | Red, saturated markets |
| error | #ba1a1a | Error state red |
| outline-variant | #c5c6cd | Borders, dividers |

### Mapped to Project Tokens
| Project Token | Stitch Value | Notes |
|---------------|-------------|-------|
| --color-bg | #f7f9fb | Was #ffffff, now warm white |
| --color-surface | #f2f4f6 | Was #f9fafb, slightly cooler |
| --color-border | #c5c6cd | Was #e5e7eb, matches outline-variant |
| --color-accent / underserved | #006c49 | Was #16a34a, deeper professional green |
| --color-saturated | #ff5250 | Was #ef4444, brighter Stitch red |
| --color-warning | #f59e0b | Kept (no Stitch equivalent) |
| --color-text | #191c1e | Was #1e293b, darker per Stitch |
| --color-muted | #45474c | Was #6b7280, darker per Stitch |
| --color-header | #1e293b | Kept (matches primary-container) |

## Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Headline | Manrope | 700, 800 | Page titles, section headers, bold labels |
| Body | Inter | 400, 500, 600 | Body text, descriptions, UI labels |
| Label | Inter | 400, 500, 600 | Small labels, metadata, captions |
| Mono | JetBrains Mono | variable | Data, code (project-specific, not from Stitch) |

## Spacing & Radius

| Token | Value | Usage |
|-------|-------|-------|
| border-radius default | 0.125rem (2px) | Tight, professional radius |
| border-radius lg | 0.25rem (4px) | Cards |
| border-radius xl | 0.5rem (8px) | Panels |
| border-radius full | 0.75rem (12px) | Pills, badges |

## Key Patterns

- Dark navy header bar with backdrop blur (#091426 / slate-900/85)
- White/near-white floating cards with subtle shadows (shadow-[0_12px_40px_rgba(17,28,45,0.06)])
- Green spectrum (#006c49) for opportunity/underserved indicators
- Red spectrum (#ff5250) for saturated market indicators
- 10px uppercase tracking-widest labels for data categories
- Bento grid layout for stats cards
- Progress bars with rounded-full and semantic color fills
- Map-forward design with floating panels overlaying the map canvas
