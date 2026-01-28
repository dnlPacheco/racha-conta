# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Guidelines

- Always write all documentation in English
- When developing frontend code, always use the frontend subagent (`.claude/agents/frontend.md`) to follow established code patterns and conventions
- **Always update documentation**: When implementing new features, adding dependencies, or changing project structure, update both `CLAUDE.md` and relevant subagent files (`.claude/agents/*.md`) to reflect the changes

## Project Overview

**racha-conta** (Portuguese for "split the bill") - A bill-splitting/expense-sharing application.

## Tech Stack

- **Architecture**: Frontend-only (localStorage for persistence)
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Internationalization**: react-i18next (i18next)

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Add shadcn/ui components
npx shadcn@latest add [component-name]
```

## Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization
│   ├── index.ts      # i18n configuration
│   └── locales/      # Translation files (en, pt-BR, es)
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
├── pages/            # Page components
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles + Tailwind
```

---

# Project Specifications

## Overview

Web application for splitting expenses among multiple participants, allowing expense registration and automatic debt calculation between members.

---

## Features

### 1. Group Management

- Create an expense-sharing group
- Add participants to the group (name/identifier)
- Remove participants from the group
- View participant list

### 2. Expense Registration

- Add new expense with:
  - Expense description
  - Total amount
  - Who paid (participant)
  - Expense date
  - Participants included in the split (default: all)
- Edit existing expense
- Remove expense
- List all group expenses

### 3. Split Calculation

- Equal split among selected participants
- Automatic calculation of how much each person owes
- Balance calculation for each participant (creditor or debtor)

### 4. Balance View

- View individual balance for each participant
- View "who owes whom" summary
- View total group expenses
- Debt simplification (minimize number of required transactions)

---

## Business Rules

### BR01 - Equal Split
The expense amount is divided equally among all selected participants.

```
Amount per person = Total amount / Number of participants
```

### BR02 - Balance Calculation
- Participant who paid: receives credit for total amount - their share
- Other participants: owe their proportional share

**Example:**
- Expense of $100.00 paid by Ana, split among Ana, Bruno, and Carlos
- Ana paid $100, owes $33.33 → Balance: +$66.67 (credit)
- Bruno paid $0, owes $33.33 → Balance: -$33.33 (debit)
- Carlos paid $0, owes $33.33 → Balance: -$33.33 (debit)

### BR03 - Debt Simplification
The system calculates the most efficient way to settle all debts, minimizing the number of transfers.

### BR04 - Rounding
Values are rounded to 2 decimal places. Cent differences are absorbed by the original payer.

---

## Entities

### Group
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Group name |
| createdAt | date | Creation date |
| participants | Participant[] | List of participants |
| expenses | Expense[] | List of expenses |

### Participant
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Participant name |

### Expense
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| description | string | Expense description |
| amount | number | Total amount |
| payerId | string | ID of who paid |
| date | date | Expense date |
| participantIds | string[] | IDs of participants in the split |

---

## User Flows

### Flow 1: Create Group and Add Participants
1. User accesses the application
2. Creates a new group with a name
3. Adds participants by entering their names
4. Group is ready to register expenses

### Flow 2: Register Expense
1. User selects the group
2. Clicks "Add Expense"
3. Fills in description, amount, and date
4. Selects who paid
5. Selects who participates in the split (default: all)
6. Confirms the registration

### Flow 3: View Balance
1. User accesses the group
2. Views expense list
3. Views each participant's balance
4. Views summary of transfers needed to settle debts

---

## Screens

### Screen 1: Home / Group List
- List of existing groups
- Button to create new group
- Access group on click

### Screen 2: Group Details
- Group name
- Participant list with add/remove option
- Expense list with add/edit/remove option
- Balance summary (balances and transfers)

### Screen 3: Add/Edit Expense
- Form with expense fields
- Payer selection
- Multiple selection of split participants
- Save/cancel buttons

### Screen 4: Detailed Balance
- Each participant's balance
- List of suggested transfers ("Person A owes $X to Person B")
- Total group expenses

---

## Non-Functional Requirements

### Persistence
- Data must be persisted (localStorage for MVP, database for full version)

### Responsiveness
- Interface must work on mobile and desktop devices

### Usability
- Simple and intuitive interface
- Visual feedback for user actions
- Form validation

### Performance
- Fast loading
- Real-time calculations

---

## Future Scope (Not included in v1)

- [ ] User authentication
- [ ] Proportional split (different percentages)
- [ ] Expense categories
- [ ] Payment/settlement history
- [ ] Report export
- [ ] Notifications
- [ ] Multiple currencies
- [ ] Group sharing via link
- [x] Internationalization (i18n) - Supports English, Portuguese (BR), and Spanish

---

## Glossary

| Term | Definition |
|------|------------|
| Group | Set of participants who share expenses |
| Participant | Person who is part of a group |
| Expense | Expense registered in the group |
| Payer | Participant who made the expense payment |
| Balance | Difference between what the person paid and what they owe |
| Settlement | Financial summary of the group |
