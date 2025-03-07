import {useParams} from "react-router-dom";
import {BankAccount} from "@/types/bankAccount.ts";
import {Client, Employee} from "@/types/user.ts";
import {Gender, Role} from "@/types/enums.ts";
import {BankAccountType} from "@/types/bankAccountType.ts";
import {Currency} from "@/types/currency.ts"
import BankAccountBalanceCard from "@/components/bank-account/BankAccountBalance.tsx";
import BankAccountDetailsCard from "@/components/bank-account/BankAccountDetails.tsx";
import BankAccountTransactions from "@/components/bank-account/BankAccountTransactions.tsx";

const client: Client = {
    firstName: "Bosko",
    lastName: "Zlatanovic",
    dateOfBirth: "15-01-2002",
    gender: Gender.Male,
    uniqueIdentificationNumber: "112222193123",
    email: "bzlatanovic@gmail.com",
    phoneNumber: "+381 61 1111 002",
    address: "Main st 123",
}

const employee: Employee = {
    firstName: "Mihailo",
    lastName: "Radovic",
    dateOfBirth: "15-11-2002",
    gender: Gender.Male,
    uniqueIdentificationNumber: "112222193123",
    email: "mradovic@gmail.com",
    phoneNumber: "+381 62 1111 002",
    address: "Main st 123",
    username: "mradovic",
    role: Role.Employee,
    department: "IT",
    employed: true,
}

const currency: Currency = {
    id: "1",
    name: "United states dollar",
    code: "EUR",
    symbol: "$",
    countries: [],
    description: "bla bla",
    status: true,
    createdAt: new Date(),
    modifiedAt: new Date()
}

const accountType: BankAccountType = {
    id: "1",
    name: "Foreign Exchange",
    code: "aaa",
    createdAt: new Date(),
    modifiedAt: new Date()
}

const account: BankAccount = {
    id: "1",
    name: "Racun 1",
    client: client,
    accountNumber: 11111111,
    balance: 99900000.25,
    availableBalance: 99900000.25,
    employee: employee,
    currency: currency,
    accountType: accountType,
    dailyLimit: 1000,
    monthlyLimit: 10000,
    status: true,
    creationDate: new Date(),
    expirationDate: new Date(),
    createdAt: new Date(),
    modifiedAt: new Date()
}
export default function BankAccountPage() {
    const { accountId } = useParams<{ accountId: string }>();

    return (


        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="font-display font-bold text-5xl">{account.name} overview</h1>
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <BankAccountBalanceCard account={account}/>
                <BankAccountDetailsCard account={account} onAccountNameChange={newValue => console.log(newValue)} />
                <BankAccountTransactions className="col-span-2" account={account}/>
            </div>

        </main>

    )
}
