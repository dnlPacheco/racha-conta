import { useTranslation } from 'react-i18next'
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

function useStrings() {
  const { t } = useTranslation()

  return {
    title: t('expense.title'),
    empty: t('expense.empty'),
    deleteTitle: t('expense.deleteTitle'),
    cancel: t('common.buttons.cancel'),
    delete: t('common.buttons.delete'),
    unknown: t('common.labels.unknown'),
    paidByInfo: (name: string, date: string) => t('expense.paidByInfo', { name, date }),
    deleteDescription: (name: string) => t('expense.deleteDescription', { name }),
  }
}

interface ExpenseListProps {
  expenses: Expense[]
  participants: Participant[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, participants, onEdit, onDelete }: ExpenseListProps) {
  const Strings = useStrings()

  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || Strings.unknown
  }

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{Strings.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {Strings.empty}
          </p>
        ) : (
          <ul className="space-y-3">
            {sortedExpenses.map((expense) => (
              <li key={expense.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      {Strings.paidByInfo(
                        getParticipantName(expense.payerId),
                        formatDate(expense.date)
                      )}
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
                          <AlertDialogTitle>{Strings.deleteTitle}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {Strings.deleteDescription(expense.description)}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{Strings.cancel}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(expense.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {Strings.delete}
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
