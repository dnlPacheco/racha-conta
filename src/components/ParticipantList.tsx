import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { Participant } from '@/types'

function useStrings() {
  const { t } = useTranslation()

  return {
    title: t('participant.title'),
    addPlaceholder: t('participant.addPlaceholder'),
    empty: t('participant.empty'),
    removeTitle: t('participant.removeTitle'),
    cancel: t('common.buttons.cancel'),
    remove: t('common.buttons.remove'),
    removeDescription: (name: string) => t('participant.removeDescription', { name }),
  }
}

interface ParticipantListProps {
  participants: Participant[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
}

export function ParticipantList({ participants, onAdd, onRemove }: ParticipantListProps) {
  const Strings = useStrings()
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    onAdd(newName.trim())
    setNewName('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{Strings.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={Strings.addPlaceholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
          />
          <Button onClick={handleAdd} disabled={!newName.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {participants.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {Strings.empty}
          </p>
        ) : (
          <ul className="space-y-2">
            {participants.map((participant) => (
              <li
                key={participant.id}
                className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-muted-foreground" />
                  <span>{participant.name}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{Strings.removeTitle}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {Strings.removeDescription(participant.name)}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{Strings.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onRemove(participant.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {Strings.remove}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
