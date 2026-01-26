# Frontend Agent

Specialized agent for frontend development following the project's established patterns and conventions.

## Tech Stack

- React 18+ with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- shadcn/ui components (built on Radix UI)

---

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── [feature]/       # Feature-specific components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
│   └── utils.ts         # cn() and other helpers
├── types/               # TypeScript type definitions
├── stores/              # State management (if needed)
├── pages/               # Page components
└── App.tsx
```

---

## Code Conventions

### File Naming

- Components: `PascalCase.tsx` (e.g., `ExpenseCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useExpenses.ts`)
- Utilities: `camelCase.ts` (e.g., `formatCurrency.ts`)
- Types: `camelCase.ts` or co-located in component files
- Test files: `[name].test.ts` or `[name].spec.ts`

### Component Structure

```tsx
// 1. Imports (external, then internal, then types)
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Expense } from '@/types'

// 2. Types/Interfaces (if not in separate file)
interface ExpenseCardProps {
  expense: Expense
  onDelete: (id: string) => void
}

// 3. Component (named export preferred)
export function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  // Hooks first
  const [isOpen, setIsOpen] = useState(false)

  // Handlers
  const handleDelete = () => {
    onDelete(expense.id)
  }

  // Render
  return (
    <div className="rounded-lg border p-4">
      {/* content */}
    </div>
  )
}
```

### TypeScript Guidelines

- Use `interface` for object shapes, `type` for unions/intersections
- Avoid `any` - use `unknown` if type is truly unknown
- Define props interfaces inline or in the same file
- Use strict mode (`strict: true` in tsconfig)

```tsx
// Good
interface Participant {
  id: string
  name: string
}

type Status = 'pending' | 'settled'

// Avoid
const data: any = fetchData()
```

### React Patterns

- Prefer functional components with hooks
- Use named exports for components
- Keep components small and focused (single responsibility)
- Extract logic into custom hooks when reusable
- Use React.memo() only when proven necessary

```tsx
// Custom hook example
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue] as const
}
```

---

## Styling with Tailwind CSS

### General Rules

- Use Tailwind utility classes directly in JSX
- Use `cn()` helper for conditional classes (from shadcn/ui)
- Avoid inline styles unless dynamic values are required
- Follow mobile-first responsive design (`sm:`, `md:`, `lg:`)

```tsx
import { cn } from '@/lib/utils'

// cn() for conditional classes
<div className={cn(
  "rounded-lg border p-4",
  isActive && "border-primary bg-primary/10",
  disabled && "opacity-50 cursor-not-allowed"
)}>
```

### Color Usage

- Use semantic colors from Tailwind config
- Prefer CSS variables for theming
- Follow shadcn/ui color conventions

```tsx
// Good - semantic colors
<span className="text-destructive">Error message</span>
<button className="bg-primary text-primary-foreground">Submit</button>

// Avoid - hardcoded colors
<span className="text-red-500">Error message</span>
```

### Spacing

- Use consistent spacing scale (4, 8, 12, 16, 24, 32...)
- Prefer gap for flex/grid spacing over margins

```tsx
// Good
<div className="flex flex-col gap-4">

// Avoid
<div className="flex flex-col">
  <div className="mb-4">
```

---

## shadcn/ui Components

### Usage Guidelines

- Import from `@/components/ui/`
- Don't modify files in `ui/` directly - extend via wrapper components
- Use component variants as designed

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Using variants
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline">Cancel</Button>
```

### Extending Components

Create wrapper components for project-specific needs:

```tsx
// components/expense/ExpenseCard.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Expense } from '@/types'

interface ExpenseCardProps {
  expense: Expense
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  return (
    <Card>
      <CardHeader>
        <span className="font-medium">{expense.description}</span>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">
          {formatCurrency(expense.amount)}
        </span>
      </CardContent>
    </Card>
  )
}
```

---

## State Management

### localStorage Pattern

Use custom hooks for localStorage persistence:

```tsx
// hooks/useGroups.ts
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { Group } from '@/types'

export function useGroups() {
  const [groups, setGroups] = useLocalStorage<Group[]>('racha-conta:groups', [])

  const addGroup = (group: Omit<Group, 'id' | 'createdAt'>) => {
    const newGroup: Group = {
      ...group,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setGroups(prev => [...prev, newGroup])
    return newGroup
  }

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id))
  }

  return { groups, addGroup, deleteGroup }
}
```

### localStorage Keys

Use namespaced keys to avoid collisions:

```
racha-conta:groups
racha-conta:settings
```

---

## Utilities

### Currency Formatting

```tsx
// lib/formatCurrency.ts
export function formatCurrency(value: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
```

### Date Formatting

```tsx
// lib/formatDate.ts
export function formatDate(date: string | Date, locale = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
```

### cn() Helper (shadcn/ui)

```tsx
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Testing Guidelines

- Use Vitest for unit tests
- Use React Testing Library for component tests
- Test behavior, not implementation details
- Name test files with `.test.ts` or `.spec.ts` suffix

```tsx
// components/expense/ExpenseCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ExpenseCard } from './ExpenseCard'

describe('ExpenseCard', () => {
  it('renders expense description and amount', () => {
    const expense = {
      id: '1',
      description: 'Dinner',
      amount: 100,
      payerId: 'user1',
      date: '2024-01-01',
      participantIds: ['user1', 'user2'],
    }

    render(<ExpenseCard expense={expense} />)

    expect(screen.getByText('Dinner')).toBeInTheDocument()
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument()
  })
})
```

---

## Performance Guidelines

- Lazy load pages/routes with `React.lazy()`
- Use `useMemo` and `useCallback` only when necessary
- Avoid creating objects/arrays in render (move to useMemo or outside)
- Keep component tree shallow when possible

```tsx
// Lazy loading pages
const GroupDetails = lazy(() => import('./pages/GroupDetails'))

// In router
<Suspense fallback={<Loading />}>
  <GroupDetails />
</Suspense>
```

---

## Accessibility

- Use semantic HTML elements
- Include proper ARIA labels where needed
- Ensure keyboard navigation works
- shadcn/ui components are accessible by default - maintain this

```tsx
// Good
<button aria-label="Delete expense">
  <TrashIcon />
</button>

// Form labels
<Label htmlFor="description">Description</Label>
<Input id="description" />
```
