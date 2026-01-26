import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import { useGroups } from '@/hooks/useGroups'
import { formatDate, formatCurrency } from '@/lib/format'
import { getTotalExpenses } from '@/lib/balance'

export function Home() {
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Racha Conta</h1>
          <p className="text-muted-foreground mt-1">
            Split expenses with your friends
          </p>
        </header>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Groups</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  Enter a name for your expense-sharing group.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Weekend Trip"
                  className="mt-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateGroup()
                  }}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {groups.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You don't have any groups yet.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create your first group
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
                      Created {formatDate(group.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{group.participants.length} participants</span>
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
