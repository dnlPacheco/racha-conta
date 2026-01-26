import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { ParticipantList } from '@/components/ParticipantList'
import { ExpenseList } from '@/components/ExpenseList'
import { ExpenseForm } from '@/components/ExpenseForm'
import { BalanceView } from '@/components/BalanceView'
import { useGroups } from '@/hooks/useGroups'
import type { Expense } from '@/types'

export function GroupDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    getGroup,
    deleteGroup,
    addParticipant,
    removeParticipant,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useGroups()

  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const group = getGroup(id || '')

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Group not found</h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleDeleteGroup = () => {
    deleteGroup(group.id)
    navigate('/')
  }

  const handleAddParticipant = (name: string) => {
    addParticipant(group.id, name)
  }

  const handleRemoveParticipant = (participantId: string) => {
    removeParticipant(group.id, participantId)
  }

  const handleSaveExpense = (expense: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      updateExpense(group.id, editingExpense.id, expense)
    } else {
      addExpense(group.id, expense)
    }
    setEditingExpense(null)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setIsExpenseFormOpen(true)
  }

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpense(group.id, expenseId)
  }

  const handleOpenExpenseForm = () => {
    setEditingExpense(null)
    setIsExpenseFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <p className="text-muted-foreground mt-1">
                {group.participants.length} participants • {group.expenses.length} expenses
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Group
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete group?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{group.name}" and all its data.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteGroup}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Participants */}
          <div className="lg:col-span-1">
            <ParticipantList
              participants={group.participants}
              onAdd={handleAddParticipant}
              onRemove={handleRemoveParticipant}
            />
          </div>

          {/* Middle Column - Expenses */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold sr-only">Expenses</h2>
              <Button
                onClick={handleOpenExpenseForm}
                disabled={group.participants.length === 0}
                className="w-full lg:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
            <ExpenseList
              expenses={group.expenses}
              participants={group.participants}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>

          {/* Right Column - Balance */}
          <div className="lg:col-span-1">
            <BalanceView
              expenses={group.expenses}
              participants={group.participants}
            />
          </div>
        </div>

        {/* Expense Form Dialog */}
        <ExpenseForm
          open={isExpenseFormOpen}
          onOpenChange={setIsExpenseFormOpen}
          participants={group.participants}
          expense={editingExpense}
          onSave={handleSaveExpense}
        />
      </div>
    </div>
  )
}
