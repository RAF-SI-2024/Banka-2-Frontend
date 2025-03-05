import api from "./axios"
import { API_BASE } from "../constants/endpoints"
import { AccountResponse } from "@/types/bankAccount"

export const getAllAccounts = async (
  pageNumber: number,
  pageSize: number,
  filters: { accountNumber?: string; firstName?: string; lastName?: string;}
): Promise<AccountResponse> => {
  try {
    // After route is done
    /*const response = await api.get("/accounts", {
      params: {
        accountNumber: filters.accountNumber || undefined,
        firstName: filters.firstName || undefined,
        lastName: filters.lastName || undefined,
        pageNumber,
        pageSize,
      },
    })*/
   
    //return response.data

    //For testing purposes
    const response = [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        client: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
        accountNumber: "123456",
        balance: 1000.5,
        availableBalance: 900.0,
        employee: {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
        },
        currency: { code: "USD", symbol: "$" },
        type: { name: "Personal", description: "Standard" },
        dailyLimit: 500.0,
        monthlyLimit: 5000.0,
        status: true,
        creationDate: "2023-01-01",
        expirationDate: "2026-01-01",
        createdAt: "2023-01-01T12:00:00Z",
        modifiedAt: "2024-01-01T12:00:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        client: {
          firstName: "Alice",
          lastName: "Brown",
          email: "alice.brown@example.com",
        },
        accountNumber: "654321",
        balance: 2500.75,
        availableBalance: 2400.5,
        employee: {
          firstName: "Tom",
          lastName: "Wilson",
          email: "tom.wilson@example.com",
        },
        currency: { code: "EUR", symbol: "€" },
        type: {
          name: "Business",
          description: "DOO",
        },
        dailyLimit: 1000.0,
        monthlyLimit: 10000.0,
        status: false,
        creationDate: "2022-06-15",
        expirationDate: "2025-06-15",
        createdAt: "2022-06-15T09:30:00Z",
        modifiedAt: "2024-02-01T10:45:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        client: {
          firstName: "Charlie",
          lastName: "Johnson",
          email: "charlie.j@example.com",
        },
        accountNumber: "789012",
        balance: 3200.0,
        availableBalance: 3100.0,
        employee: {
          firstName: "Emma",
          lastName: "Davis",
          email: "emma.d@example.com",
        },
        currency: { code: "GBP", symbol: "£" },
        type: { name: "Business", description: "AD" },
        dailyLimit: 2000.0,
        monthlyLimit: 20000.0,
        status: true,
        creationDate: "2021-03-20",
        expirationDate: "2026-03-20",
        createdAt: "2021-03-20T08:15:00Z",
        modifiedAt: "2024-02-10T14:22:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        client: {
          firstName: "Daniel",
          lastName: "White",
          email: "daniel.white@example.com",
        },
        accountNumber: "456789",
        balance: 1800.5,
        availableBalance: 1600.0,
        employee: {
          firstName: "Sophia",
          lastName: "Clark",
          email: "sophia.c@example.com",
        },
        currency: { code: "USD", symbol: "$" },
        type: { name: "Personal", description: "Savings" },
        dailyLimit: 1500.0,
        monthlyLimit: 12000.0,
        status: false,
        creationDate: "2020-07-10",
        expirationDate: "2025-07-10",
        createdAt: "2020-07-10T10:45:00Z",
        modifiedAt: "2024-01-05T11:30:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        client: {
          firstName: "Emily",
          lastName: "Harris",
          email: "emily.h@example.com",
        },
        accountNumber: "987654",
        balance: 500.0,
        availableBalance: 450.0,
        employee: {
          firstName: "Michael",
          lastName: "Jones",
          email: "michael.j@example.com",
        },
        currency: { code: "AUD", symbol: "A$" },
        type: { name: "Personal", description: "Student" },
        dailyLimit: 250.0,
        monthlyLimit: 3000.0,
        status: true,
        creationDate: "2023-09-05",
        expirationDate: "2028-09-05",
        createdAt: "2023-09-05T15:20:00Z",
        modifiedAt: "2024-02-15T17:00:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        client: {
          firstName: "George",
          lastName: "Miller",
          email: "george.m@example.com",
        },
        accountNumber: "112233",
        balance: 12000.0,
        availableBalance: 11000.0,
        employee: {
          firstName: "Laura",
          lastName: "Scott",
          email: "laura.s@example.com",
        },
        currency: { code: "CAD", symbol: "C$" },
        type: { name: "Business", description: "Foundation" },
        dailyLimit: 5000.0,
        monthlyLimit: 50000.0,
        status: true,
        creationDate: "2019-05-18",
        expirationDate: "2030-05-18",
        createdAt: "2019-05-18T07:30:00Z",
        modifiedAt: "2024-01-20T08:40:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440006",
        client: {
          firstName: "Hannah",
          lastName: "Anderson",
          email: "hannah.a@example.com",
        },
        accountNumber: "334455",
        balance: 7800.5,
        availableBalance: 7000.0,
        employee: {
          firstName: "David",
          lastName: "Moore",
          email: "david.m@example.com",
        },
        currency: { code: "EUR", symbol: "€" },
        type: { name: "Personal", description: "Savings" },
        dailyLimit: 2000.0,
        monthlyLimit: 15000.0,
        status: true,
        creationDate: "2021-11-22",
        expirationDate: "2026-11-22",
        createdAt: "2021-11-22T13:45:00Z",
        modifiedAt: "2024-02-02T14:10:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440007",
        client: {
          firstName: "Jack",
          lastName: "Taylor",
          email: "jack.t@example.com",
        },
        accountNumber: "556677",
        balance: 950.0,
        availableBalance: 800.0,
        employee: {
          firstName: "Olivia",
          lastName: "Thomas",
          email: "olivia.t@example.com",
        },
        currency: { code: "USD", symbol: "$" },
        type: { name: "Personal", description: "Student" },
        dailyLimit: 300.0,
        monthlyLimit: 2000.0,
        status: false,
        creationDate: "2023-04-30",
        expirationDate: "2028-04-30",
        createdAt: "2023-04-30T16:20:00Z",
        modifiedAt: "2024-02-20T12:30:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440008",
        client: {
          firstName: "Isabella",
          lastName: "Martinez",
          email: "isabella.m@example.com",
        },
        accountNumber: "778899",
        balance: 4320.5,
        availableBalance: 4200.0,
        employee: {
          firstName: "James",
          lastName: "Hernandez",
          email: "james.h@example.com",
        },
        currency: { code: "GBP", symbol: "£" },
        type: { name: "Personal", description: "Standard" },
        dailyLimit: 1000.0,
        monthlyLimit: 8000.0,
        status: true,
        creationDate: "2022-01-12",
        expirationDate: "2027-01-12",
        createdAt: "2022-01-12T11:00:00Z",
        modifiedAt: "2024-02-18T15:00:00Z",
      },
    ]

    const filteredData = response.filter((account) => {
      return (
        (!filters.accountNumber || account.accountNumber.toLowerCase().includes(filters.accountNumber.toLowerCase())) &&
        (!filters.firstName || account.client.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) &&
        (!filters.lastName || account.client.lastName.toLowerCase().includes(filters.lastName.toLowerCase()))
      )
    })

    const totalElements = filteredData.length
    const totalPages = Math.ceil(totalElements / pageSize)
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = startIndex + pageSize
    const items = filteredData.slice(startIndex, endIndex)

    return {
      items,
      pageNumber,
      pageSize,
      totalElements,
      totalPages,
    }
  } catch (error) {
    console.error("❌ Error fetching accounts:", error)
    throw error
  }
}
