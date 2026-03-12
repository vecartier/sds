# SDS Figma Design System Reference

## Figma File
- **File key:** `CznAGkv0d5yjyReEGzAPqp`
- **URL:** https://www.figma.com/design/CznAGkv0d5yjyReEGzAPqp/Simple-Design-System--Community-

## Design Tokens (CSS Variables → Figma Variables)

### Colors - Primitives
Each has shades: 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
- `--sds-color-black-*`, `--sds-color-brand-*`, `--sds-color-gray-*`
- `--sds-color-green-*`, `--sds-color-pink-*`, `--sds-color-red-*`
- `--sds-color-slate-*`, `--sds-color-white-*`, `--sds-color-yellow-*`

### Colors - Semantic
**Background:** `--sds-color-background-{role}-{state}`
- Roles: default, brand, positive, warning, danger, neutral, disabled, utilities
- States: default, hover, secondary, secondary-hover, tertiary, tertiary-hover

**Text:** `--sds-color-text-{role}-{state}`
**Icon:** `--sds-color-icon-{role}-{state}`
**Border:** `--sds-color-border-{role}-{state}`

### Spacing
`--sds-size-space-{0,050,100,150,200,300,400,600,800,1200,1600,2400,4000}`

### Radius
`--sds-size-radius-{100,200,400,full}`

### Typography
- Families: `--sds-typography-family-{sans,serif,mono}` (Inter, Noto Serif, Roboto Mono)
- Weights: `--sds-typography-weight-{thin,extra-light,light,regular,medium,semibold,bold,extra-bold,black}`
- Composite fonts: `--sds-font-{title-hero,title-page,subtitle,heading,subheading,body-base,body-strong,body-emphasis,body-link,body-small,body-code}`

### Effects
- Shadows: `--sds-effects-shadows-drop-shadow-{100..600}`
- Inner shadows: `--sds-effects-shadows-inner-shadow-{100..600}`
- Backdrop blur: `--sds-effects-backdrop-filter-blur-{overlay,glass}`

---

## Components (with Figma node IDs)

### Primitives

| Component | Node ID | Key Props |
|-----------|---------|-----------|
| Button | 4185-3778 | variant (Primary/Neutral/Subtle), size (Small), label, iconStart, iconEnd, isDisabled |
| ButtonDanger | 185-852 | variant (Subtle), label, iconStart, iconEnd, size, isDisabled |
| ButtonGroup | 2072-9432 | align (Center/End/Justify/Stack), children |
| IconButton | 11-11508 | variant (Primary/Neutral/Subtle), size (Small), icon, isDisabled |
| InputField | 2136-2263 | label, description, placeholder, value, errorMessage, isDisabled |
| SelectField | 2136-2336 | label, description, placeholder, value, errorMessage, isDisabled |
| TextareaField | 9762-3088 | label, description, placeholder, value, errorMessage, isDisabled |
| Search | 2236-14989 | placeholder, value, disabled |
| CheckboxField | 9762:1441 | label, description, defaultSelected, isIndeterminate, isDisabled |
| CheckboxGroup | 9762:1426 | children (CheckboxField) |
| RadioField | 9762:1412 | label, description, isDisabled |
| RadioGroup | 624-23642 | children (RadioField) |
| SwitchField | 9762:1902 | label, description, defaultSelected, isDisabled |
| SliderField | 589-17676 | label, description, isDisabled |
| Avatar | 9762:1103 | size (Large/Small), square, initials, src |
| AvatarBlock | 2010-15581 | title, description, children |
| AvatarGroup | 56-15608 | spacing (Overlap/Spaced), children |
| Tag | 56-8830 | label, variant (Secondary), scheme (Danger/Positive/Warning/Neutral), onRemove |
| TagToggle | 157-10316 | label, iconStart |
| TagToggleGroup | 157-10352 | children (TagToggle) |
| Tab | 3729-12963 | label |
| Tabs | 3729-13362 | children (Tab) |
| Accordion | 7753-4779 | children (AccordionItem) |
| AccordionItem | 7753-4634 | title, children, dataSelected (Open) |
| NavigationPill | 7768-19970 | label, isSelected |
| NavigationButton | 515-5459 | label, icon, isSelected |
| Navigation (Pills) | 2194-14984 | children, direction (Row/Column) |
| Navigation (Buttons) | 524-503 | children, direction (Row/Column) |
| Notification | 124-8256 | title, icon, body, button, isDismissible, variant (Message/Alert) |
| Pagination | 9762:899 | children (Previous/List/Next) |
| Menu | 9762:720 | children (MenuHeader/MenuItem/MenuSeparator/MenuHeading) |
| Dialog | 192-31534 | children (DialogBody) |
| DialogBody | 9762-696 | type (Card/Sheet), heading, body, buttons |
| Tooltip | 315-32700 | title, body, placement (Top/Bottom/Left/Right) |

### Text Components

| Component | Node ID | Props |
|-----------|---------|-------|
| TextTitleHero | 2087-8491 | text |
| TextTitlePage | 2087-8490 | text |
| TextSubtitle | 2103-22298 | text |
| TextHeading | 2087-8488 | text |
| TextSubheading | 2103-22303 | text |
| Text | 2087-8487 | text |
| TextStrong | 2087-8486 | text |
| TextEmphasis | 2087-8485 | text |
| TextSmall | 2087-8484 | text |
| TextLink | 2087-8483 | text |
| TextCode | 2104-22325 | text |
| TextPrice | 1443-10386 | label, price, currency, size |
| TextList | 480-6149 | title, density, children |
| TextLinkList | 322-9321 | title, density, children |
| TextContentHeading | 2153-7834 | heading, subheading, align |
| TextContentTitle | 2153-7838 | title, subtitle, align |

### Compositions

| Component | Node ID | Props |
|-----------|---------|-------|
| Card | 2142-11380 | direction (Horizontal/Vertical), variant (Stroke), asset, heading, body, actions |
| PricingCard | 1444-11846 | variant (Stroke/Brand), textHeading, textPrice, list, action |
| ProductInfoCard | 7753-4465 | textProps, priceProps, descriptionProps |
| ReviewCard | 2236-16106 | headingProps, bodyProps, avatarBlockProps |
| StatsCard | 2236-15082 | descriptionProps, statProps, icon |
| TestimonialCard | 7717-3946 | headingProps, avatarBlockProps |
| Header | 2287-22651 | — |
| HeaderAuth | 18-9389 | — |
| Footer | 321-11357 | — |
| Hero Basic | 348-15896 | children (TextContentTitle) |
| Hero Actions | 348-15901 | children (TextContentTitle, ButtonGroup) |
| Hero Newsletter | 348-15919 | children (TextContentTitle, FormNewsletter) |
| Hero Form | 348-15933 | children (TextContentTitle, FormContact) |
| Hero Image | 348-15970 | children (TextContentTitle, ButtonGroup) |
| Panel ImageContent | 348-13474 | padding, gap, children |
| Panel ImageContentReverse | 348-15101 | padding, gap, children |
| Panel ImageDouble | 348-13470 | padding, gap |
| Panel Image | 348-15098 | padding |
| FormBox LogIn | 197:19740 | children |
| FormBox Contact | 197:19741 | children |
| FormBox Register | 197:19742 | children |
| FormBox Newsletter | 197:19743 | children |
| FormBox ForgotPassword | 197:19744 | children |
| FormBox Shipping | 197:23153 | legend, children |
| CardGrid Icon | 348:13221 | gap, padding, top, cards |
| CardGrid Testimonials | 348:13347 | gap, padding, top, cards |
| CardGrid ContentList | 348:13407 | gap, padding, top, cards |
| CardGrid Image | 348:14431 | gap, padding, top, cards |
| CardGrid Pricing | 348:14983 | schedule |
| CardGrid Reviews | 348:15213 | gap, padding, top, cards |
| Page Accordion | 348:13173 | title, children, padding, gap |
| Page Product | 348:15147 | textHeading, tagAndPrice, text, fields, button, accordion |
| Page Newsletter | 348:15133 | children, padding, gap |
| Page ProductResults | 348:13517 | controls, cards, padding, gap |
