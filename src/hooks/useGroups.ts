import { useLocalStorage } from './useLocalStorage'
import type { Group, Participant, Expense } from '@/types'

const STORAGE_KEY = 'racha-conta:groups'

export function useGroups() {
  const [groups, setGroups] = useLocalStorage<Group[]>(STORAGE_KEY, [])

  const addGroup = (name: string): Group => {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      participants: [],
      expenses: [],
    }
    setGroups((prev) => [...prev, newGroup])
    return newGroup
  }

  const updateGroup = (id: string, updates: Partial<Omit<Group, 'id' | 'createdAt'>>) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, ...updates } : group
      )
    )
  }

  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((group) => group.id !== id))
  }

  const getGroup = (id: string): Group | undefined => {
    return groups.find((group) => group.id === id)
  }

  // Participant operations
  const addParticipant = (groupId: string, name: string): Participant | undefined => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      name,
    }

    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, participants: [...group.participants, newParticipant] }
          : group
      )
    )

    return newParticipant
  }

  const removeParticipant = (groupId: string, participantId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group

        // Remove participant and clean up expenses
        const updatedExpenses = group.expenses
          .map((expense) => ({
            ...expense,
            participantIds: expense.participantIds.filter((id) => id !== participantId),
          }))
          .filter((expense) => expense.payerId !== participantId)

        return {
          ...group,
          participants: group.participants.filter((p) => p.id !== participantId),
          expenses: updatedExpenses,
        }
      })
    )
  }

  // Expense operations
  const addExpense = (groupId: string, expense: Omit<Expense, 'id'>): Expense | undefined => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    }

    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, expenses: [...group.expenses, newExpense] }
          : group
      )
    )

    return newExpense
  }

  const updateExpense = (groupId: string, expenseId: string, updates: Partial<Omit<Expense, 'id'>>) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              expenses: group.expenses.map((expense) =>
                expense.id === expenseId ? { ...expense, ...updates } : expense
              ),
            }
          : group
      )
    )
  }

  const deleteExpense = (groupId: string, expenseId: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, expenses: group.expenses.filter((e) => e.id !== expenseId) }
          : group
      )
    )
  }

  return {
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
    getGroup,
    addParticipant,
    removeParticipant,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}
