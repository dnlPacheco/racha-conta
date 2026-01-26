import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Expense, Participant } from '@/types'

interface ExpenseListProps {
  expenses: Expense[]
  participants: Participant[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, participants, onEdit, onDelete }: ExpenseListProps) {
  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || 'Unknown'
  }

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No expenses yet. Add one to start tracking.
          </p>
        ) : (
          <ul className="space-y-3">
            {sortedExpenses.map((expense) => (
              <li
                key={expense.id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      Paid by {getParticipantName(expense.payerId)} • {formatDate(expense.date)}
                    </p>
                  </div>
                  <span className="text-lg font-semibold">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {expense.participantIds.map((id) => (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {getParticipantName(id)}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(expense)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete expense?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{expense.description}".
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(expense.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
