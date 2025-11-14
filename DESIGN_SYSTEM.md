# CivicPro Design System

## Overview
A purpose-built design system for political accountability and civic engagement, focused on trust, transparency, and data clarity.

---

## 1. Core Design Principles

### Political Neutrality
- Avoid party-specific bias in primary design elements
- Use balanced color treatments for all parties
- Present data objectively without visual manipulation

### Trust & Credibility
- Clean, professional aesthetics that convey seriousness
- Transparent data presentation without hidden information
- Clear source attribution and timestamps

### Data Clarity
- Make complex political information scannable
- Use progressive disclosure for detailed data
- Prioritize key metrics and performance indicators

### Accessibility First
- WCAG 2.1 AA compliance minimum
- Support keyboard navigation and screen readers
- Ensure sufficient color contrast (4.5:1 for text)

---

## 2. Color System

### Primary Palette (Civic Neutrality)
```
Civic Blue (Primary)
- civic-50:  #EFF6FF  (backgrounds, hover states)
- civic-100: #DBEAFE  (subtle highlights)
- civic-200: #BFDBFE  (borders, dividers)
- civic-300: #93C5FD  (secondary elements)
- civic-500: #3B82F6  (primary actions, links)
- civic-600: #2563EB  (primary buttons)
- civic-700: #1D4ED8  (active states)
- civic-800: #1E40AF  (headers, emphasis)
- civic-900: #1E3A8A  (deep emphasis)

Use case: Primary CTAs, navigation, trusted elements
Psychology: Trust, stability, authority without aggression
```

### Party Colors (Balanced Treatment)
```
Democratic Blue
- demo-500: #2563EB
- demo-100: #DBEAFE (light background)

Republican Red  
- repub-500: #DC2626
- repub-100: #FEE2E2 (light background)

Independent Amber
- indep-500: #F59E0B
- indep-100: #FEF3C7 (light background)

Note: Always use with equal visual weight and prominence
```

### Semantic Colors (Promise & Status)
```
Success (Fulfilled Promise)
- success-50:  #F0FDF4
- success-500: #22C55E  (checkmarks, fulfilled badges)
- success-700: #15803D  (emphasis)

Warning (In Progress)
- warning-50:  #FFFBEB
- warning-500: #F59E0B  (progress indicators)
- warning-700: #B45309

Danger (Broken/Unfulfilled)
- danger-50:  #FEF2F2
- danger-500: #EF4444  (alerts, unfulfilled)
- danger-700: #B91C1C

Neutral (No Data/Abstained)
- gray-50:  #F9FAFB
- gray-300: #D1D5DB  (borders, disabled)
- gray-500: #6B7280  (secondary text)
- gray-700: #374151  (body text)
- gray-900: #111827  (headings)
```

### Voting Record Colors
```
For:      #22C55E (success green)
Against:  #EF4444 (danger red)  
Abstain:  #F59E0B (warning amber)
Absent:   #9CA3AF (gray)
```

### Rating Colors
```
1-2 stars: #EF4444 (red)
3 stars:   #F59E0B (amber)
4-5 stars: #22C55E (green)
```

---

## 3. Typography

### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-display: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Type Scale
```
Hero:        text-5xl (48px) - bold - tight tracking
H1:          text-4xl (36px) - bold - Landing sections
H2:          text-3xl (30px) - semibold - Page titles  
H3:          text-2xl (24px) - semibold - Section headers
H4:          text-xl (20px) - semibold - Card titles
H5:          text-lg (18px) - medium - Subsections
Body Large:  text-lg (18px) - regular - Lead paragraphs
Body:        text-base (16px) - regular - Main content
Body Small:  text-sm (14px) - regular - Secondary info
Caption:     text-xs (12px) - regular - Metadata, timestamps
Stat Large:  text-6xl (60px) - bold - Key metrics
Stat Medium: text-4xl (36px) - bold - Dashboard numbers
Stat Small:  text-2xl (24px) - semibold - Card statistics
```

### Line Heights
```
Tight:   1.25 (headings, stats)
Normal:  1.5  (body text)
Relaxed: 1.75 (long-form content)
```

---

## 4. Spacing System (8px base)

```
0:   0px
1:   4px   (tight inline spacing)
2:   8px   (default gap between related elements)
3:   12px  (small padding)
4:   16px  (default padding, standard gap)
5:   20px  
6:   24px  (card padding, section spacing)
8:   32px  (large section gaps)
10:  40px  
12:  48px  (major section separation)
16:  64px  (hero section padding)
20:  80px  
24:  96px  (page section spacing)
```

---

## 5. Component Patterns

### Politician Card (Enhanced)
```
Structure:
- Avatar (64x64) with party border color
- Name (H4 - semibold)
- Party badge + Parish (small text)
- Star rating (with count)
- Promise fulfillment bar chart
- Quick stats row (votes, years in office)
- Action buttons (View Profile, Compare)

States:
- Default (white bg, subtle shadow)
- Hover (lifted shadow, border highlight)
- Selected (for comparison - civic-100 bg)

Variants:
- Compact (list view)
- Featured (larger, more details)
- Comparison (side-by-side layout)
```

### Promise Tracker Component
```
Timeline view with status indicators:
- Fulfilled: green checkmark, completion date
- In Progress: amber arrow, percentage
- Unfulfilled: red X, reason if available

Include:
- Promise title and description
- Date promised
- Current status with icon
- Progress indicator
- Evidence/source links
```

### Voting Record Table
```
Columns:
- Bill title (with link to details)
- Date voted
- Vote (color-coded badge)
- Bill outcome
- Alignment indicator (if comparing)

Features:
- Sortable columns
- Filter by vote type
- Search bills
- Export to CSV
```

### Rating Component
```
Display:
- Star rating (5-star scale)
- Average score (large number)
- Total ratings count
- Distribution chart (5-4-3-2-1 bars)
- Recent comments (approved only)

Interactive:
- Submit rating modal
- Filter by rating level
- Sort by date/helpfulness
```

### Comparison Layout
```
3-column grid:
- Left: Politician A data
- Center: Metric labels
- Right: Politician B data

With visual indicators:
- Green highlights for similarities
- Red outlines for key differences
- Charts for voting alignment %
- Side-by-side promise fulfillment
```

### Data Visualization Components
```
Promise Fulfillment Chart:
- Stacked bar: fulfilled (green) / in-progress (amber) / unfulfilled (red)
- Percentage label
- Tooltip with counts

Voting Alignment Chart:
- Circular progress indicator
- Percentage in center
- Color gradient (high alignment = green, low = red)

Rating Distribution:
- Horizontal bar chart
- 5 rows (5-star to 1-star)
- Count labels
- Percentage of total
```

---

## 6. UI Patterns

### Cards
```
Default Card:
- Background: white
- Border: 1px solid gray-200
- Border radius: 12px (rounded-xl)
- Shadow: sm (subtle)
- Padding: 24px
- Hover: shadow-md + border-civic-200

Stat Card:
- Large number (stat-large)
- Label below (text-sm, gray-600)
- Icon (colored accent)
- Optional trend indicator
```

### Buttons
```
Primary (Actions):
- Background: civic-600
- Text: white
- Hover: civic-700
- Padding: py-3 px-6
- Border radius: lg (8px)
- Font: semibold

Secondary (Cancel, Back):
- Border: 2px civic-600
- Text: civic-600
- Background: white
- Hover: civic-50 background

Danger (Delete, Remove):
- Background: danger-500
- Text: white
- Hover: danger-600

Ghost (Tertiary actions):
- No border
- Text: civic-600
- Hover: civic-50 background
```

### Badges
```
Status Badges:
- Small, rounded-full
- Padding: px-2.5 py-0.5
- Font: text-xs, semibold
- Colors based on status

Party Badges:
- Party color background (light)
- Party color text (dark)
- Pill shape

Vote Badges:
- Icon + text
- Color coded (For=green, Against=red, etc.)
```

### Forms
```
Input Fields:
- Height: 44px (touch-friendly)
- Border: 1px gray-300
- Border radius: 8px
- Focus: ring-2 civic-500
- Padding: px-4

Labels:
- Font: semibold, text-sm
- Color: gray-700
- Margin bottom: 6px

Validation:
- Error: red border, red text below
- Success: green border, checkmark icon
- Helper text: gray-600, text-sm
```

---

## 7. Layout Grid

### Desktop (1440px container)
```
12-column grid
Gap: 24px
Padding: 64px horizontal
Max width: 1440px
```

### Tablet (768px - 1024px)
```
8-column grid  
Gap: 20px
Padding: 32px horizontal
```

### Mobile (< 768px)
```
4-column grid
Gap: 16px
Padding: 16px horizontal
Single column for most content
```

---

## 8. Animation & Transitions

```
Fast: 150ms (hover states, small movements)
Normal: 300ms (modal open/close, page transitions)
Slow: 500ms (loading states, complex animations)

Easing:
- ease-in-out (default)
- ease-out (enters)
- ease-in (exits)
```

### Key Animations
```
Card Hover:
- Lift: translateY(-4px)
- Shadow: sm -> md
- Duration: 150ms

Page Transitions:
- Fade in: opacity 0 -> 1
- Slide up: translateY(20px) -> 0
- Duration: 300ms

Loading States:
- Skeleton pulse
- Spinner rotation
- Progress bar fill
```

---

## 9. Iconography

### Icon Library: Lucide React (already installed)

### Icon Sizes
```
xs: 16px (inline with text)
sm: 20px (buttons, badges)
md: 24px (default UI)
lg: 32px (featured elements)
xl: 48px (empty states, illustrations)
```

### Common Icons
```
Politician: User
Promise: CheckCircle, Clock, XCircle
Voting: ThumbsUp, ThumbsDown, MinusCircle
Rating: Star, StarHalf
Compare: BarChart2, Scale
Filter: Filter, Search, SlidersHorizontal
Actions: Edit, Trash2, Eye, Share2
Navigation: ChevronRight, ChevronLeft, Menu
Status: AlertCircle, Info, Check, X
```

---

## 10. Responsive Breakpoints

```css
/* Mobile first approach */
sm:  640px  /* Small tablets, large phones */
md:  768px  /* Tablets */
lg:  1024px /* Laptops */
xl:  1280px /* Desktops */
2xl: 1536px /* Large desktops */
```

---

## 11. Accessibility Requirements

### Color Contrast
- Text (16px+): 4.5:1 minimum
- Large text (24px+): 3:1 minimum
- UI components: 3:1 minimum
- Never rely on color alone for information

### Keyboard Navigation
- Tab order follows visual flow
- All interactive elements focusable
- Focus indicators clearly visible
- Skip to main content link
- Escape closes modals

### Screen Readers
- Semantic HTML (nav, main, article, etc.)
- Alt text for all meaningful images
- ARIA labels for icon buttons
- ARIA live regions for dynamic content
- Form labels properly associated

### Touch Targets
- Minimum 44x44px
- Adequate spacing between targets
- No hover-only functionality

---

## 12. Empty States & Error Handling

### Empty States
```
Structure:
- Icon (large, colored)
- Heading (clear explanation)
- Description (why empty, what to do)
- Primary CTA button
- Optional: Secondary help link

Examples:
- No politicians found → Adjust filters CTA
- No ratings yet → Be the first to rate CTA
- No voting records → Check back soon message
```

### Error States
```
Structure:
- Error icon (alert triangle)
- Clear error message (non-technical)
- Suggested action
- Retry button or contact support

Levels:
- Info: blue alert icon
- Warning: amber alert icon
- Error: red alert icon
- Success: green check icon
```

---

## 13. Loading States

### Skeleton Screens
```
Use for:
- Politician cards
- Profile pages
- Data tables
- Comparison grids

Style:
- Gray background (gray-200)
- Pulse animation
- Match content shape/size
```

### Progress Indicators
```
Spinner: For short waits (< 3 seconds)
Progress Bar: For uploads, multi-step processes
Skeleton: For content loading
```

---

## 14. Mobile Optimization

### Navigation
- Bottom tab bar for main navigation
- Hamburger menu for secondary nav
- Sticky header with key actions

### Cards
- Full-width on mobile
- Reduced padding
- Simplified layout
- Larger touch targets

### Tables
- Horizontal scroll
- Or: Convert to stacked cards
- Prioritize most important columns

### Forms
- One column layout
- Larger inputs (44px height)
- Native select dropdowns
- Clear validation messages

---

## Implementation Priority

### Phase 1 (Foundation) - Week 1
1. ✅ Set up color tokens in Tailwind config
2. ✅ Update typography scale
3. ✅ Create base button components
4. ✅ Standardize card styles

### Phase 2 (Core Components) - Week 2
1. Enhanced politician cards
2. Promise tracker redesign
3. Rating component improvements
4. Voting record table

### Phase 3 (Advanced Features) - Week 3
1. Comparison interface redesign
2. Profile page enhancements
3. Data visualizations
4. Admin dashboard UI

### Phase 4 (Polish) - Week 4
1. Animations and transitions
2. Loading and empty states
3. Mobile responsive refinements
4. Accessibility audit

---

## Design Tokens File Location

```
/client/src/styles/
  ├── tokens.css          (CSS custom properties)
  ├── components.css      (Component-specific styles)
  └── utilities.css       (Custom utility classes)
```

## Component Documentation

Create: `/client/src/components/README.md`
- Component usage examples
- Props documentation
- Visual examples
- Dos and don'ts

---

## Tools & Resources

- **Design**: Figma (for mockups and prototyping)
- **Icons**: Lucide React (already installed)
- **Charts**: Recharts (already installed)
- **Colors**: Test contrast at https://webaim.org/resources/contrastchecker/
- **Accessibility**: axe DevTools browser extension

---

## Next Steps

1. Review this design system with stakeholders
2. Create Tailwind config with custom tokens
3. Build component library in Storybook (optional)
4. Implement Phase 1 components
5. Test with real data
6. Iterate based on user feedback
