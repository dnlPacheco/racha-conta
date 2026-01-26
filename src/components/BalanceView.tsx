import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { calculateBalances, simplifyDebts, getTotalExpenses } from '@/lib/balance'
import type { Expense, Participant } from '@/types'

interface BalanceViewProps {
  expenses: Expense[]
  participants: Participant[]
}

export function BalanceView({ expenses, participants }: BalanceViewProps) {
  const balances = calculateBalances(expenses, participants)
  const transfers = simplifyDebts(balances)
  const totalExpenses = getTotalExpenses(expenses)

  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || 'Unknown'
  }

  const getBalanceForParticipant = (id: string) => {
    return balances.find((b) => b.participantId === id)?.amount || 0
  }

  if (participants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Add participants to see the balance.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
        </div>

        {/* Individual Balances */}
        <div>
          <h4 className="font-medium mb-3">Individual Balances</h4>
          <ul className="space-y-2">
            {participants.map((participant) => {
              const balance = getBalanceForParticipant(participant.id)
              const isPositive = balance > 0.01
              const isNegative = balance < -0.01

              return (
                <li
                  key={participant.id}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    {isPositive && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {isNegative && <TrendingDown className="w-4 h-4 text-red-600" />}
                    {!isPositive && !isNegative && <Minus className="w-4 h-4 text-muted-foreground" />}
                    <span>{participant.name}</span>
                  </div>
                  <span
                    className={cn(
                      'font-medium',
                      isPositive && 'text-green-600',
                      isNegative && 'text-red-600'
                    )}
                  >
                    {isPositive && '+'}
                    {formatCurrency(balance)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <Separator />

        {/* Suggested Transfers */}
        <div>
          <h4 className="font-medium mb-3">Settle Up</h4>
          {transfers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {expenses.length === 0
                ? 'Add expenses to see who owes whom.'
                : 'All settled! No transfers needed.'}
            </p>
          ) : (
            <ul className="space-y-2">
              {transfers.map((transfer, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-3 px-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getParticipantName(transfer.fromId)}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{getParticipantName(transfer.toId)}</span>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatCurrency(transfer.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
