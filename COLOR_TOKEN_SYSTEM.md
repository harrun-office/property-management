# Property Management Platform - Complete Color Token System

## Overview
This document contains the complete color token system for the Property Management Platform, including all color scales, CSS variables, and usage patterns.

---

## 1. Brand Colors

### Obsidian (Primary Brand Color)
**Purpose**: Primary brand color (replaces legacy "primary")
**Default**: `#3F76A8` (obsidian-500)
**Usage**: Primary actions, brand elements, links

```
obsidian-50:  #F3F7FA  (lightest)
obsidian-100: #E6EEF5
obsidian-200: #C9DAEA
obsidian-300: #ACC6DF
obsidian-400: #6F9FC4
obsidian-500: #3F76A8  (DEFAULT - main brand)
obsidian-600: #35638E
obsidian-700: #2B5074
obsidian-800: #213D5A
obsidian-900: #162A40  (darkest)
```

### Brass/Eucalyptus (Accent Color)
**Purpose**: Accent/secondary brand color
**Default**: `#2F9F88` (brass-500)
**Usage**: Accents, success states, highlights
**Note**: `eucalyptus` is mapped to `brass` for compatibility

```
brass-50:  #F1FAF8
brass-100: #DFF2ED
brass-200: #BFE5DB
brass-300: #9FD8C9
brass-400: #5FBDA6
brass-500: #2F9F88  (DEFAULT - main accent)
brass-600: #26806D
brass-700: #1D6053
brass-800: #144039
brass-900: #0B201F
```

**Eucalyptus (Alias for Brass)**
```
eucalyptus-50:  #F1FAF8
eucalyptus-100: #DFF2ED
eucalyptus-200: #BFE5DB
eucalyptus-300: #9FD8C9
eucalyptus-400: #5FBDA6
eucalyptus-500: #2F9F88  (DEFAULT)
eucalyptus-600: #26806D
eucalyptus-700: #1D6053
eucalyptus-800: #144039
eucalyptus-900: #0B201F
```

---

## 2. Neutral Colors

### Stone (Neutral Backgrounds)
**Purpose**: Neutral backgrounds and surfaces
**Default**: `#F1F5F9` (stone-DEFAULT)

```
stone-50:  #F9FAFB
stone-100: #F3F4F6
stone-200: #E5E7EB
stone-300: #D1D5DB
stone-400: #9CA3AF
stone-500: #6B7280
stone-600: #4B5563
stone-700: #374151
stone-800: #1F2937
stone-900: #111827
```

### Porcelain (Light Backgrounds)
**Purpose**: Lightest backgrounds
**Default**: `#F9FAFB`

```
porcelain:      #F9FAFB  (DEFAULT)
porcelain-50:   #F9FAFB
porcelain-100:  #F3F4F6
porcelain-200:  #E5E7EB
```

### Charcoal (Dark Text)
**Purpose**: Primary text color
**Default**: `#1F2933`

```
charcoal:       #1F2933  (DEFAULT)
charcoal-50:    #4B5563
charcoal-100:   #1F2933
charcoal-200:   #4B5563
```

### Architectural (Muted Text)
**Purpose**: Secondary/muted text
**Default**: `#6B7280`

```
architectural:      #6B7280  (DEFAULT)
architectural-50:   #9CA3AF
architectural-100:  #6B7280
architectural-200:  #4B5563
```

---

## 3. Semantic Colors

### Success
**Purpose**: Success states, positive actions
**Default**: `#1F9D55` (success-500)

```
success-50:  #E8F5EE
success-100: #D1EBDD
success-200: #A3D7BB
success-300: #76C399
success-400: #48AF78
success-500: #1F9D55  (DEFAULT)
success-600: #187C44
success-700: #125C33
success-800: #0C3D22
success-900: #061F11
```

### Warning
**Purpose**: Warning states, caution
**Default**: `#F59E0B` (warning-500)

```
warning-50:  #FEF3C7
warning-100: #FDE68A
warning-200: #FCD34D
warning-300: #FBBF24
warning-400: #F59E0B
warning-500: #D97706  (DEFAULT: #F59E0B)
warning-600: #B45309
warning-700: #92400E
warning-800: #78350F
warning-900: #451A03
```

### Error
**Purpose**: Error states, destructive actions
**Default**: `#DC2626` (error-500)

```
error-50:  #FEE2E2
error-100: #FECACA
error-200: #FCA5A5
error-300: #F87171
error-400: #EF4444
error-500: #DC2626  (DEFAULT)
error-600: #B91C1C
error-700: #991B1B
error-800: #7F1D1D
error-900: #450A0A
```

### Info
**Purpose**: Informational states, links
**Default**: `#2563EB` (info-500)

```
info-50:  #EFF6FF
info-100: #DBEAFE
info-200: #BFDBFE
info-300: #93C5FD
info-400: #60A5FA
info-500: #2563EB  (DEFAULT)
info-600: #1D4ED8
info-700: #1E40AF
info-800: #1E3A8A
info-900: #172554
```

### Border Colors
**Purpose**: Border and divider colors

```
border:        #D1D5DB  (DEFAULT)
border-strong: #9CA3AF
```

---

## 4. CSS Custom Properties (CSS Variables)

### Text Colors
```css
--text-primary: #1F2933 (charcoal)
--text-secondary: #4B5563 (charcoal-light)
--text-light: #FFFFFF
--color-text-primary: var(--text-primary)
--color-text-secondary: var(--text-secondary)
--color-text-inverse: var(--text-light)
```

### Background Colors
```css
--bg-primary: #F9FAFB (porcelain)
--bg-secondary: #F1F5F9 (stone-primary)
--bg-tertiary: #E5E7EB (stone-light)
--bg-dark: #111827
--color-bg-primary: var(--bg-primary)
--color-bg-secondary: var(--bg-secondary)
--color-bg-tertiary: var(--bg-tertiary)
```

### Surface Colors
```css
--color-surface: #FFFFFF
--color-surface-alt: #F8FAFC
```

### Border Colors
```css
--color-border: #D1D5DB
--color-border-strong: #9CA3AF
```

### Primary Color Variants
```css
--color-primary: #3F76A8 (obsidian-primary)
--color-primary-strong: #2B5074 (obsidian-700)
--color-primary-soft: #E6EEF5 (obsidian-100)
```

### Semantic Color Variables
```css
--success: #1F9D55
--warning: #F59E0B
--error: #DC2626
--info: #2563EB
--color-success: var(--success)
--color-warning: var(--warning)
--color-error: var(--error)
--color-info: var(--info)
```

### Legacy Brand Color Variables (for compatibility)
```css
--obsidian-primary: #3F76A8
--obsidian-light: #6F9FC4
--stone-primary: #F1F5F9
--stone-light: #E5E7EB
--brass-primary: #2F9F88
--brass-light: #5FBDA6
--eucalyptus-primary: #2F9F88
```

### Neutral Color Variables
```css
--porcelain: #F9FAFB
--porcelain-dark: #F1F5F9
--charcoal: #1F2933
--charcoal-light: #4B5563
--architectural: #6B7280
```

### Focus Ring
```css
--focus-ring: var(--color-info)  /* #2563EB */
```

---

## 5. Dark Mode Colors

### Dark Mode Brand Colors
```css
.dark {
  --obsidian-primary: #6FA8DC
  --brass-primary: #4FBFA5
}
```

### Dark Mode Text Colors
```css
.dark {
  --charcoal: #F9FAFB
  --charcoal-light: #D1D5DB
  --architectural: #9CA3AF
  --text-primary: var(--charcoal)
  --text-secondary: var(--charcoal-light)
  --text-light: #111827
  --color-text-primary: var(--text-primary)
  --color-text-secondary: var(--text-secondary)
  --color-text-inverse: var(--text-light)
}
```

### Dark Mode Background Colors
```css
.dark {
  --bg-primary: #0F172A
  --bg-secondary: #111827
  --bg-tertiary: #1F2937
  --color-bg-primary: var(--bg-primary)
  --color-bg-secondary: var(--bg-secondary)
  --color-bg-tertiary: var(--bg-tertiary)
}
```

### Dark Mode Surface Colors
```css
.dark {
  --color-surface: #020617
  --color-surface-alt: #020617
}
```

### Dark Mode Primary Colors
```css
.dark {
  --color-primary: var(--obsidian-primary)
  --color-primary-strong: #2B5074
  --color-primary-soft: #6FA8DC
}
```

### Dark Mode Border Colors
```css
.dark {
  --color-border: #374151
  --color-border-strong: #4B5563
}
```

### Dark Mode Semantic Colors
```css
.dark {
  --color-success: #22C55E
  --color-warning: #FBBF24
  --color-error: #EF4444
  --color-info: #60A5FA
  --focus-ring: var(--color-info)
}
```

---

## 6. Usage Patterns

### Tailwind CSS Classes
Use Tailwind utility classes with the color tokens:

**Background Colors:**
- `bg-obsidian-500` - Primary brand background
- `bg-brass-500` - Accent background
- `bg-stone-100` - Light neutral background
- `bg-success-500` - Success state background
- `bg-error-500` - Error state background
- `bg-warning-500` - Warning state background
- `bg-info-500` - Info state background

**Text Colors:**
- `text-obsidian-500` - Primary brand text
- `text-brass-500` - Accent text
- `text-charcoal` - Primary text
- `text-architectural` - Muted text
- `text-success-500` - Success text
- `text-error-500` - Error text

**Border Colors:**
- `border-stone-200` - Light border
- `border-stone-300` - Default border
- `border-obsidian-500` - Brand border

### CSS Variables
Use CSS custom properties for semantic color usage:

```css
/* Text */
color: var(--color-text-primary);
color: var(--color-text-secondary);

/* Backgrounds */
background-color: var(--color-bg-primary);
background-color: var(--color-bg-secondary);

/* Primary Colors */
background-color: var(--color-primary);
color: var(--color-primary-strong);

/* Semantic Colors */
color: var(--color-success);
background-color: var(--color-error);
border-color: var(--color-warning);
```

### Utility Classes (from theme.css)
```css
.text-obsidian { color: var(--obsidian-primary); }
.bg-obsidian { background-color: var(--obsidian-primary); color: var(--text-light); }
.bg-stone { background-color: var(--stone-primary); }
.bg-porcelain { background-color: var(--porcelain); }
.text-charcoal { color: var(--charcoal); }
.text-architectural { color: var(--architectural); }
.text-brass { color: var(--brass-primary); }
.bg-brass { background-color: var(--brass-primary); color: white; }
.text-eucalyptus { color: var(--eucalyptus-primary); }
.bg-eucalyptus { background-color: var(--eucalyptus-primary); color: white; }
```

---

## 7. Color Scale System

All major colors follow a 50-900 scale system:
- **50-200**: Lightest shades (backgrounds, subtle accents)
- **300-400**: Light shades (hover states, secondary elements)
- **500**: Default/primary shade (main brand color)
- **600-700**: Medium shades (hover states, emphasis)
- **800-900**: Darkest shades (text on light backgrounds, strong emphasis)

---

## 8. File Locations

- **Tailwind Config**: `Client/tailwind.config.js` (lines 27-158)
- **Theme CSS Variables**: `Client/src/styles/theme.css`
- **Design System CSS**: `Client/src/styles/design-system.css`

---

## 9. Color Accessibility

All color combinations should meet WCAG AA contrast requirements:
- Text on backgrounds: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1 contrast ratio
- Interactive elements: Clear focus states with `--focus-ring`

---

## 10. Quick Reference

### Primary Colors
- **Obsidian**: `#3F76A8` (Primary brand)
- **Brass/Eucalyptus**: `#2F9F88` (Accent)

### Neutral Colors
- **Porcelain**: `#F9FAFB` (Lightest background)
- **Stone**: `#F1F5F9` (Neutral background)
- **Charcoal**: `#1F2933` (Primary text)
- **Architectural**: `#6B7280` (Muted text)

### Semantic Colors
- **Success**: `#1F9D55`
- **Warning**: `#F59E0B`
- **Error**: `#DC2626`
- **Info**: `#2563EB`

---

*Last Updated: Based on current codebase analysis*
*Design System Version: International Design Redesign Plan*

