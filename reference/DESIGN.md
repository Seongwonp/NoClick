---
name: Truth-Centric Consumer Utility
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#a43a3a'
  on-tertiary: '#ffffff'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 16px
  margin: 24px
---

## Brand & Style

This design system is built to bridge the gap between complex data analysis and intuitive consumer utility. The brand personality is that of a "trusted friend with a sharp eye"—someone who helps you navigate noise without adding to the clutter. The UI avoids the cold, sterile aesthetic of traditional business intelligence in favor of a warm, approachable environment that encourages exploration.

The chosen style is **Minimalism** blended with **Modern Consumer Softness**. It prioritizes extreme clarity and generous whitespace to reduce cognitive load. The goal is to make the act of "finding the truth" feel effortless, transparent, and satisfying rather than clinical or investigative.

## Colors

The palette is anchored by a fresh **Mint/Teal** (#10B981) as the primary brand color, signaling growth, health, and a fresh start. This is supported by a **Trustworthy Blue** (#3B82F6) for secondary actions and links.

The background uses a pristine **White (#FFFFFF)** or a **Very Light Gray (#F9FAFB)** to keep the interface feeling airy and open. Accents are strictly pastel-based to serve as gentle highlights rather than aggressive interruptions. 
- **Soft Yellow:** Highlights potential inconsistencies or warnings.
- **Soft Green:** Identifies verified facts and high-trust signals.
- **Soft Red:** Flags suspected advertisements or bot-generated content.

## Typography

This design system utilizes **Plus Jakarta Sans** for its welcoming, open apertures and modern geometric structure. It strikes the perfect balance between professional reliability and friendly consumer design. 

A generous line-height (1.6x for body text) ensures that review summaries are easy to scan and digest. Headlines are kept approachable by using medium to semi-bold weights rather than heavy black weights, ensuring the tone remains helpful and never aggressive.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with a focus on "White Space as a Feature." Information is never cramped; instead, it is grouped into logical modules with significant breathing room between sections.

A 12-column grid is used for desktop views, transitioning to a single-column stack on mobile. Spacing follows an 8px rhythm to maintain mathematical harmony while allowing for the generous padding required to achieve the "consumer tool" vibe. Margins are set wide (24px+) to keep content centered and focused.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layers** rather than harsh lines. 

- **Surface Level:** The main background is #F9FAFB.
- **Card Level:** Interactive elements and content cards sit on white (#FFFFFF) backgrounds with extra-diffused, low-opacity shadows (e.g., `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04)`).
- **Interactive State:** When hovered, cards may rise slightly with a more pronounced but still soft shadow.
- **Low-Contrast Outlines:** Very subtle 1px borders in #F3F4F6 are used to define boundaries on white surfaces without breaking the minimalist flow.

## Shapes

The design system adopts a **High Roundness** philosophy to evoke friendliness and safety. 

Base components like buttons and input fields utilize a 12px radius. Content containers, such as review cards and analysis modules, utilize a 16px radius. This softness removes the "clinical" edge of data analysis, making the tool feel like a modern, tactile application. Large "pill" shapes are reserved for tags and status indicators.

## Components

### Buttons
Primary buttons use the Mint/Teal background with white text, featuring 12px rounded corners. They should feel "squishy" and interactive. Secondary buttons use a light gray or transparent background with a subtle border.

### Cards
Cards are the primary vehicle for reviews. They use 16px corner radius, a soft shadow, and plenty of internal padding (24px). Headers within cards use the accent pastel colors to categorize the review type (e.g., "Verified Buyer" in a Soft Green chip).

### Review Chips
Small, pill-shaped indicators used for "ad-suspect," "highly-rated," or "verified." These use 100px radius and high-legibility label text.

### Progress & Trust Bars
Instead of sharp, thin lines, trust meters use thick (8px - 12px) rounded bars with soft color transitions to communicate the "truth score" of a review set.

### Inputs
Search bars and filter inputs use a 12px radius and a subtle background fill (#F3F4F6) that disappears or turns white on focus, providing a clear "active" signal.