export interface Participant {
  id: string
  name: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  payerId: string
  date: string
  participantIds: string[]
}

export interface Group {
  id: string
  name: string
  createdAt: string
  participants: Participant[]
  expenses: Expense[]
}

export interface Balance {
  participantId: string
  amount: number
}

export interface Transfer {
  fromId: string
  toId: string
  amount: number
}
