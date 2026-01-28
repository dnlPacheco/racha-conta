import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Expense, Participant } from '@/types'

function useStrings() {
  const { t } = useTranslation()

  return {
    addTitle: t('expense.addTitle'),
    editTitle: t('expense.editTitle'),
    addDescription: t('expense.addDescription'),
    editDescription: t('expense.editDescription'),
    description: t('expense.description'),
    descriptionPlaceholder: t('expense.descriptionPlaceholder'),
    amount: t('expense.amount'),
    paidBy: t('expense.paidBy'),
    selectWhoPaid: t('expense.selectWhoPaid'),
    date: t('expense.date'),
    splitBetween: t('expense.splitBetween'),
    all: t('common.buttons.all'),
    none: t('common.buttons.none'),
    cancel: t('common.buttons.cancel'),
    addButton: t('expense.addButton'),
    saveButton: t('expense.saveButton'),
  }
}

interface ExpenseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  participants: Participant[]
  expense?: Expense | null
  onSave: (expense: Omit<Expense, 'id'>) => void
}

export function ExpenseForm({
  open,
  onOpenChange,
  participants,
  expense,
  onSave,
}: ExpenseFormProps) {
  const Strings = useStrings()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [payerId, setPayerId] = useState('')
  const [date, setDate] = useState('')
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  const isEditing = !!expense

  useEffect(() => {
    if (open) {
      if (expense) {
        setDescription(expense.description)
        setAmount(expense.amount.toString())
        setPayerId(expense.payerId)
        setDate(expense.date)
        setSelectedParticipants(expense.participantIds)
      } else {
        setDescription('')
        setAmount('')
        setPayerId('')
        setDate(new Date().toISOString().split('T')[0])
        setSelectedParticipants(participants.map((p) => p.id))
      }
    }
  }, [open, expense, participants])

  const handleSubmit = () => {
    if (!description.trim() || !amount || !payerId || !date || selectedParticipants.length === 0) {
      return
    }

    onSave({
      description: description.trim(),
      amount: parseFloat(amount),
      payerId,
      date,
      participantIds: selectedParticipants,
    })

    onOpenChange(false)
  }

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedParticipants(participants.map((p) => p.id))
  }

  const selectNone = () => {
    setSelectedParticipants([])
  }

  const isValid =
    description.trim() &&
    amount &&
    parseFloat(amount) > 0 &&
    payerId &&
    date &&
    selectedParticipants.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? Strings.editTitle : Strings.addTitle}</DialogTitle>
          <DialogDescription>
            {isEditing ? Strings.editDescription : Strings.addDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">{Strings.description}</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={Strings.descriptionPlaceholder}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">{Strings.amount}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="payer">{Strings.paidBy}</Label>
            <Select value={payerId} onValueChange={setPayerId}>
              <SelectTrigger>
                <SelectValue placeholder={Strings.selectWhoPaid} />
              </SelectTrigger>
              <SelectContent>
                {participants.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">{Strings.date}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label>{Strings.splitBetween}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  className="h-auto py-1 px-2 text-xs"
                >
                  {Strings.all}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectNone}
                  className="h-auto py-1 px-2 text-xs"
                >
                  {Strings.none}
                </Button>
              </div>
            </div>
            <div className="border rounded-md p-3 space-y-2 max-h-32 overflow-y-auto">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`participant-${p.id}`}
                    checked={selectedParticipants.includes(p.id)}
                    onCheckedChange={() => toggleParticipant(p.id)}
                  />
                  <label
                    htmlFor={`participant-${p.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {p.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {Strings.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {isEditing ? Strings.saveButton : Strings.addButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
