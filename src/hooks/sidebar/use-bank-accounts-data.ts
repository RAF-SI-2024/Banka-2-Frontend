import {useEffect, useState} from "react";


export  function useBankAccountsData() {
    const [bankAccounts, setBankAccounts] = useState<Array<{ title: string; url: string }>>([])
    useEffect(() => {
        const fetchBankAccounts = async () => {
            try {
                const data: any = [] // TODO: FILL IN WITH ACTUAL RESPONSE DATA
                setBankAccounts(data.map(account => ({  // TODO: ADD ACTUAL RESPONSE DATA TYPE INSTEAD OF ANY
                    title: account.name,
                    url: `/accounts/${account.id}` // TODO: CHECK WITH API HOW TO GET A SINGLE BANK ACCOUNT INFO
                })))
            } catch (error) {
                console.error("Failed to fetch bank accounts:", error)
                setBankAccounts([])
            }
        }

        fetchBankAccounts()
        console.log("Fetched bank accounts")
    }, [])

    return bankAccounts;

}