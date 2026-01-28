import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Users, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useGroups } from '@/hooks/useGroups'
import { formatDate, formatCurrency } from '@/lib/format'
import { getTotalExpenses } from '@/lib/balance'

function useStrings() {
  const { t } = useTranslation()

  return {
    appName: t('app.name'),
    tagline: t('app.tagline'),
    yourGroups: t('home.yourGroups'),
    newGroup: t('home.newGroup'),
    createNewGroup: t('home.createNewGroup'),
    groupNameDescription: t('home.groupNameDescription'),
    groupName: t('home.groupName'),
    groupNamePlaceholder: t('home.groupNamePlaceholder'),
    noGroups: t('home.noGroups'),
    createFirstGroup: t('home.createFirstGroup'),
    cancel: t('common.buttons.cancel'),
    create: t('common.buttons.create'),
    created: (date: string) => t('home.created', { date }),
    participants: (count: number) => t('home.participants', { count }),
  }
}

export function Home() {
  const Strings = useStrings()
  const { groups, addGroup } = useGroups()
  const [newGroupName, setNewGroupName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return

    addGroup(newGroupName.trim())
    setNewGroupName('')
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{Strings.appName}</h1>
            <p className="text-muted-foreground mt-1">{Strings.tagline}</p>
          </div>
          <LanguageSwitcher />
        </header>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{Strings.yourGroups}</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {Strings.newGroup}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{Strings.createNewGroup}</DialogTitle>
                <DialogDescription>{Strings.groupNameDescription}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="groupName">{Strings.groupName}</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder={Strings.groupNamePlaceholder}
                  className="mt-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateGroup()
                  }}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {Strings.cancel}
                </Button>
                <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
                  {Strings.create}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {groups.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">{Strings.noGroups}</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {Strings.createFirstGroup}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Link key={group.id} to={`/group/${group.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>
                      {Strings.created(formatDate(group.createdAt))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{Strings.participants(group.participants.length)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Receipt className="w-4 h-4" />
                        <span>{formatCurrency(getTotalExpenses(group.expenses))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
