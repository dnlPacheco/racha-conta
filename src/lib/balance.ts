import type { Expense, Participant, Balance, Transfer } from '@/types'

export function calculateBalances(
  expenses: Expense[],
  participants: Participant[]
): Balance[] {
  const balanceMap = new Map<string, number>()

  // Initialize all participants with 0 balance
  participants.forEach((p) => {
    balanceMap.set(p.id, 0)
  })

  // Calculate balances from expenses
  expenses.forEach((expense) => {
    const { payerId, amount, participantIds } = expense
    const splitCount = participantIds.length
    if (splitCount === 0) return

    const amountPerPerson = amount / splitCount

    // Payer gets credit for what they paid
    const currentPayerBalance = balanceMap.get(payerId) || 0
    balanceMap.set(payerId, currentPayerBalance + amount)

    // Each participant owes their share
    participantIds.forEach((participantId) => {
      const currentBalance = balanceMap.get(participantId) || 0
      balanceMap.set(participantId, currentBalance - amountPerPerson)
    })
  })

  // Convert to array and round to 2 decimal places
  return Array.from(balanceMap.entries()).map(([participantId, amount]) => ({
    participantId,
    amount: Math.round(amount * 100) / 100,
  }))
}

export function simplifyDebts(balances: Balance[]): Transfer[] {
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors: { id: string; amount: number }[] = []
  const debtors: { id: string; amount: number }[] = []

  balances.forEach((balance) => {
    if (balance.amount > 0.01) {
      creditors.push({ id: balance.participantId, amount: balance.amount })
    } else if (balance.amount < -0.01) {
      debtors.push({ id: balance.participantId, amount: -balance.amount })
    }
  })

  // Sort by amount (descending) for optimal matching
  creditors.sort((a, b) => b.amount - a.amount)
  debtors.sort((a, b) => b.amount - a.amount)

  const transfers: Transfer[] = []

  // Match debtors with creditors
  let i = 0 // creditor index
  let j = 0 // debtor index

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i]
    const debtor = debtors[j]

    const transferAmount = Math.min(creditor.amount, debtor.amount)

    if (transferAmount > 0.01) {
      transfers.push({
        fromId: debtor.id,
        toId: creditor.id,
        amount: Math.round(transferAmount * 100) / 100,
      })
    }

    creditor.amount -= transferAmount
    debtor.amount -= transferAmount

    if (creditor.amount < 0.01) i++
    if (debtor.amount < 0.01) j++
  }

  return transfers
}

export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0)
}
