---
name: Qatrah
colors:
  surface: '#fff8f7'
  surface-dim: '#ecd5d2'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ef'
  surface-container: '#ffe9e6'
  surface-container-high: '#fbe3e0'
  surface-container-highest: '#f5ddda'
  on-surface: '#251817'
  on-surface-variant: '#58413f'
  inverse-surface: '#3b2d2b'
  inverse-on-surface: '#ffedea'
  outline: '#8c716e'
  outline-variant: '#e0bfbb'
  surface-tint: '#ad312d'
  primary: '#680007'
  on-primary: '#ffffff'
  primary-container: '#8b1818'
  on-primary-container: '#ff998f'
  inverse-primary: '#ffb4ac'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#003352'
  on-tertiary: '#ffffff'
  tertiary-container: '#004a75'
  on-tertiary-container: '#86baeb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#8b1818'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#cee5ff'
  tertiary-fixed-dim: '#97cbfe'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#014a75'
  background: '#fff8f7'
  on-background: '#251817'
  surface-variant: '#f5ddda'
typography:
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 1rem
  stack-gap: 1rem
  inline-gap: 0.75rem
  section-padding: 1.5rem
  grid-gutter: 1rem
---

## Brand & Style
The design system for this healthcare dashboard is built on a foundation of **Corporate Modernism** with a focus on clinical precision and administrative efficiency. The brand personality is authoritative yet compassionate, prioritizing clarity for healthcare professionals managing critical data. 

The visual language utilizes a "Content-First" approach, where heavy whitespace and a restricted color palette ensure that medical information remains the focal point. The aesthetic is characterized by clean lines, subtle depth, and a structured RTL (Right-to-Left) flow that feels intuitive for Arabic-speaking users. The target audience includes clinicians, hospital administrators, and medical staff who require a high-density, low-friction mobile experience.

## Colors
The palette is rooted in the **Deep Red (#8B1818)** primary color, which signifies the vital nature of the "Qatrah" (Drop) brand while maintaining a professional, medical tone. 

- **Primary:** Used for key actions, branding elements, and active states.
- **Background:** A cool Slate Light (#F8FAFC) is used for the base layer to reduce eye strain during prolonged use.
- **Typography:** Dark Blue/Slate (#1E293B) provides high-contrast legibility for body and header text, while Gray/Slate (#64748B) is reserved for metadata and secondary descriptions.
- **Borders:** Subtle Slate (#E2E8F0) is used to define structure without adding visual noise.

## Typography
This design system utilizes **IBM Plex Sans Arabic** to provide a modern, technical, and highly legible experience. As a mobile-first dashboard, the type scale is optimized for vertical scanning.

- **Headlines:** Use Bold and SemiBold weights to anchor the page and section headers.
- **Body Text:** Standardized at 14px and 16px for optimal readability of patient data.
- **RTL Considerations:** Line heights are slightly increased compared to Latin counterparts to accommodate Arabic diacritics and ensure clear separation between lines of text.

## Layout & Spacing
The layout follows a **Fluid Mobile Grid** philosophy designed for single-column navigation. The system is built on an 8px spacing scale to ensure mathematical harmony between elements.

- **Margins:** A consistent 16px (1rem) safe-area margin is applied to the left and right of the screen.
- **Vertical Rhythm:** Elements are stacked with 16px gaps, while grouped items within cards use 12px or 8px gaps.
- **RTL Alignment:** All layout structures are mirrored; iconography that implies direction (arrows, progress bars) must be flipped to support the Right-to-Left reading pattern.

## Elevation & Depth
To maintain a clean, professional aesthetic, this design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Base):** The #F8FAFC background.
- **Level 1 (Cards/Containers):** White (#FFFFFF) surfaces with a 1px border (#E2E8F0).
- **Level 2 (Interactive/Floating):** Used for primary buttons or active modals. These feature a very soft, diffused shadow: `0 4px 12px rgba(30, 41, 59, 0.05)`.
- **Depth Hierarchy:** Visual separation is primarily achieved through background color shifts rather than shadow intensity to keep the UI feeling "light" and clinical.

## Shapes
The shape language balances approachability with structural integrity. 

- **Primary Containers (Cards):** Use a 16px radius to create a soft, modern container for data.
- **Secondary Elements:** Buttons, input fields, and tags use an 8px radius.
- **Selection Indicators:** Small indicators (like active tab underlines or status dots) use a 2px or fully rounded (pill) radius depending on the context.

## Components
- **Buttons:** Primary buttons are solid Deep Red (#8B1818) with white text and an 8px radius. Secondary buttons use a transparent background with a 1px #E2E8F0 border.
- **Cards:** The central component of the dashboard. Features a white background, 16px corner radius, and 1px border. Internal padding should be a minimum of 16px.
- **Input Fields:** 8px radius, #F8FAFC background, and #E2E8F0 border. On focus, the border shifts to Primary Red.
- **Chips/Status Tags:** Used for patient status (e.g., "Stable," "Critical"). High-saturation text on low-saturation backgrounds (e.g., Green text on light green tint).
- **Lists:** Clean rows separated by 1px horizontal lines, featuring a 16px vertical padding for touch-target optimization.
- **Progress Bars:** Used for medical metrics; 8px height with a pill-shaped track.