# Design System

This document outlines the design system for the AsetPro application. It includes guidelines for spacing, typography, color palette, shadows, and border radius to ensure a consistent and modern UI.

## Spacing System (8-point grid)

We use an 8-point grid system for consistent spacing throughout the application. All spacing values are multiples of 8px (0.5rem):

| Token | rem  | px  | Usage                                  |
|-------|------|-----|----------------------------------------|
| 0     | 0    | 0   | No spacing                             |
| 1     | 0.25 | 4   | Minimal spacing (elements within components) |
| 2     | 0.5  | 8   | Small spacing (elements within components) |
| 3     | 0.75 | 12  | Small spacing (elements within components) |
| 4     | 1    | 16  | Default spacing (between components)   |
| 5     | 1.25 | 20  | Default spacing (between components)   |
| 6     | 1.5  | 24  | Medium spacing (between sections)      |
| 8     | 2    | 32  | Medium spacing (between sections)      |
| 10    | 2.5  | 40  | Large spacing (between sections)       |
| 12    | 3    | 48  | Large spacing (between sections)       |
| 16    | 4    | 64  | Extra large spacing (page sections)    |
| 20    | 5    | 80  | Extra large spacing (page sections)    |
| 24    | 6    | 96  | Extra large spacing (page sections)    |

## Typography Hierarchy

We use a consistent typography hierarchy to create clear visual relationships between content:

| Level | Font Size | Line Height | Font Weight | Usage                          |
|-------|-----------|-------------|-------------|--------------------------------|
| xs    | 0.75rem   | 1rem        | 400         | Helper text, captions          |
| sm    | 0.875rem  | 1.25rem     | 400         | Secondary text, labels         |
| base  | 1rem      | 1.5rem      | 400         | Body text                      |
| lg    | 1.125rem  | 1.75rem     | 400         | Body text (larger)             |
| xl    | 1.25rem   | 1.75rem     | 500         | Subheadings, card titles       |
| 2xl   | 1.5rem    | 2rem        | 600         | Section headings               |
| 3xl   | 1.875rem  | 2.25rem     | 700         | Page headings                  |
| 4xl   | 2.25rem   | 2.5rem      | 800         | Hero headings                  |
| 5xl   | 3rem      | 1           | 800         | Hero headings (large screens)  |

### Font Weights

| Weight     | Value | Usage                          |
|------------|-------|--------------------------------|
| Thin       | 100   | Ultra-light text (rarely used) |
| ExtraLight | 200   | Extra light text (rarely used) |
| Light      | 300   | Light text                     |
| Normal     | 400   | Regular text                   |
| Medium     | 500   | Medium emphasis text           |
| SemiBold   | 600   | Strong emphasis text           |
| Bold       | 700   | Very strong emphasis           |
| ExtraBold  | 800   | Maximum emphasis               |
| Black      | 900   | Extreme emphasis (rarely used) |

## Color Palette

Our color palette is designed to be accessible and provide clear visual hierarchy. Colors are defined using HSL values for better consistency and theming.

### Core Colors

| Role         | Light Theme     | Dark Theme      | Usage                              |
|--------------|-----------------|-----------------|------------------------------------|
| Primary      | hsl(221.2 83.2% 53.3%) | hsl(210 40% 98%)   | Primary actions, key elements      |
| Secondary    | hsl(210 40% 96.1%)     | hsl(222.2 47.4% 11.2%) | Secondary actions, less important elements |
| Background   | hsl(0 0% 100%)         | hsl(224 71% 4%)    | Page background                    |
| Foreground   | hsl(222.2 47.4% 11.2%) | hsl(213 31% 91%)   | Primary text                       |
| Muted        | hsl(210 40% 96.1%)     | hsl(223 47% 11%)   | Secondary background               |
| Muted-Foreground | hsl(215.4 16.3% 46.9%) | hsl(215.4 16.3% 56.9%) | Secondary text                     |
| Border       | hsl(214.3 31.8% 91.4%) | hsl(216 34% 17%)   | Element borders                    |
| Input        | hsl(214.3 31.8% 91.4%) | hsl(216 34% 17%)   | Input field borders                |
| Card         | hsl(0 0% 100%)         | hsl(224 71% 4%)    | Card backgrounds                   |
| Card-Foreground | hsl(222.2 47.4% 11.2%) | hsl(213 31% 91%)   | Text on cards                      |
| Popover      | hsl(0 0% 100%)         | hsl(224 71% 4%)    | Popover backgrounds                |
| Popover-Foreground | hsl(222.2 47.4% 11.2%) | hsl(215 20.2% 65.1%) | Text in popovers                   |
| Accent       | hsl(210 40% 96.1%)     | hsl(216 34% 17%)   | Accent elements                    |
| Accent-Foreground | hsl(222.2 47.4% 11.2%) | hsl(210 40% 98%)   | Text on accent elements            |

### Semantic Colors

| Role         | Light Theme     | Dark Theme      | Usage                              |
|--------------|-----------------|-----------------|------------------------------------|
| Destructive  | hsl(0 84.2% 60.2%)     | hsl(0 62.8% 30.6%)   | Error states, destructive actions  |
| Success      | hsl(142 76% 36%)       | hsl(142 76% 36%)     | Success states, positive actions   |
| Warning      | hsl(25 95% 53%)        | hsl(25 95% 53%)      | Warning states, caution            |
| Info         | hsl(217 91% 60%)       | hsl(217 91% 60%)     | Informational states               |

## Shadow Elevation System

We use a standardized shadow system to create depth and hierarchy:

| Shadow | Value | Usage                          |
|--------|-------|--------------------------------|
| xs     | 0 1px 2px 0 rgb(0 0 0 / 0.05) | Subtle depth for small elements |
| sm     | 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) | Default depth for cards |
| md     | 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) | Medium depth for elevated elements |
| lg     | 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) | Strong depth for dropdowns |
| xl     | 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) | Very strong depth for modals |
| 2xl    | 0 25px 50px -12px rgb(0 0 0 / 0.25) | Maximum depth for special elements |

### Semantic Shadows

| Shadow  | Value | Usage                          |
|---------|-------|--------------------------------|
| default | 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) | Default shadow for most elements |
| card    | 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) | Shadow for card components |
| dropdown | 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) | Shadow for dropdown menus |
| popover | 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) | Shadow for popover elements |

## Border Radius Guidelines

We use consistent border radius values to create a cohesive design:

| Radius | Value           | Usage                          |
|--------|-----------------|--------------------------------|
| xs     | calc(--radius - 6px) | Small elements (buttons, badges) |
| sm     | calc(--radius - 4px) | Medium elements (inputs, cards) |
| md     | calc(--radius - 2px) | Default elements               |
| lg     | var(--radius)        | Default rounded corners        |
| xl     | calc(--radius + 2px) | Larger rounded corners         |
| 2xl    | calc(--radius + 4px) | Very rounded corners           |
| 3xl    | calc(--radius + 6px) | Maximum rounded corners        |

The base radius (--radius) is set to 0.5rem (8px) by default.

## Implementation

All design system values are implemented through Tailwind CSS configuration and CSS variables. This allows for consistent application across all components while maintaining flexibility for theming.

To use these values in your components, reference the Tailwind classes directly. For example:
- Spacing: `p-4`, `m-6`, `gap-8`
- Typography: `text-base`, `text-xl`, `font-medium`
- Colors: `bg-primary`, `text-foreground`, `border-border`
- Shadows: `shadow-sm`, `shadow-lg`
- Radius: `rounded`, `rounded-lg`, `rounded-full`