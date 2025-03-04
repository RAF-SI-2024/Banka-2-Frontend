export interface Account {
  id: string
  client: {
    firstName: string
    lastName: string
    email: string
  }
  number: number
  balance: number
  availableBalance: number
  employee: {
    firstName: string
    lastName: string
    email: string
  }
  currency: {
    code: string
    symbol: string
  }
  type: {
    name: string
    description: string
  }
  dailyLimit: number
  monthlyLimit: number
  status: boolean
  creationDate: string
  expirationDate: string
  createdAt: string
  modifiedAt: string
}

export interface AccountResponse {
  items: Account[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
}
