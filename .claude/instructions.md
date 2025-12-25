# Metanoia Moment - Claude Instructions

## Project Context

Metanoia Moment is a video testimony platform for believers to share stories of transformation through Jesus Christ. The goal is to create a timeless, censorship-resistant archive accessible globally.

## Current State

**Phase 1 (Frontend) is complete.** The app runs with stubbed backend using Zustand stores and mock data. All pages are functional and can be tested in demo mode.

## Key Files

| Purpose | Location |
|---------|----------|
| Types | `apps/web/src/types/index.ts` |
| Mock Data | `apps/web/src/lib/mock-data.ts` |
| Auth Store | `apps/web/src/lib/stores/auth-store.ts` |
| Testimony Store | `apps/web/src/lib/stores/testimony-store.ts` |
| UI Components | `packages/ui/src/components/` |
| Translations | `apps/web/messages/` |
| Backend Spec | `docs/BACKEND_SPEC.md` |
| Roadmap | `docs/ROADMAP.md` |

## Development Guidelines

### When Creating Components

1. Add to `packages/ui/src/components/`
2. Use `cn()` utility for className merging
3. Export from `packages/ui/src/index.ts`
4. Follow existing patterns (forwardRef, TypeScript props)

### When Creating Pages

1. Add to `apps/web/src/app/[locale]/`
2. Call `setRequestLocale(locale)` for static rendering
3. Use `useTranslations()` hook for text
4. Add translation keys to `messages/en.json` and `messages/es.json`

### When Modifying Stores

1. Stores are in `apps/web/src/lib/stores/`
2. Currently use mock data from `mock-data.ts`
3. When integrating Supabase, replace mock calls with client queries
4. Keep TypeScript interfaces unchanged

### When Adding Translations

1. Add to `messages/en.json` first
2. Mirror structure in `messages/es.json`
3. Other languages can use English as fallback initially

## Design Tokens

Use these Tailwind classes for consistency:

| Element | Classes |
|---------|---------|
| Page section | `section` (py-16 md:py-24) |
| Container | `container` (max-w-7xl mx-auto px-4) |
| Heading 1 | `font-display text-4xl font-bold text-warm-900` |
| Heading 2 | `text-2xl font-semibold text-warm-900` |
| Body text | `text-warm-600` |
| Primary button | Use `<Button>` component |
| Cards | Use `<Card>` component |

## Testing Changes

```bash
# Run dev server
pnpm dev

# Build check
pnpm build

# Lint
pnpm lint
```

## Common Tasks

### Add a new testimony to mock data
Edit `apps/web/src/lib/mock-data.ts`, add to `MOCK_TESTIMONIES` array.

### Add a new language
1. Create `apps/web/messages/{locale}.json`
2. Add locale to `apps/web/src/i18n/routing.ts`

### Prepare for Supabase
See `docs/BACKEND_SPEC.md` for complete integration guide.

## Do Not

- Modify TypeScript interfaces without updating both stores and mock data
- Add Supabase dependencies until Phase 2 begins
- Create new state management patterns (use Zustand)
- Add dependencies without checking package.json first
