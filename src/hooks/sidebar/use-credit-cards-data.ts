import {useEffect, useState} from "react";
import {getAllCardsForClient} from "@/api/card.ts";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";
import {CardDTO} from "@/types/card.ts";

export function useCreditCardsData() {
    const [creditCards, setCreditCards] = useState<Array<{ title: string; url: string }>>([])

    useEffect(() => {
        const fetchCreditCards = async () => {
            try {
                const clientId = JSON.parse(sessionStorage.user).id;

                if(clientId == null){
                    showErrorToast({defaultTitle: "Error", defaultMessage: "Client id is missing from session storage"});
                }

                const response = await getAllCardsForClient(clientId);

                setCreditCards(response.data.map((card: CardDTO) => ({
                    title: card.name || "Unnamed card",
                    url: `/card/${card.id}`
                })));

            } catch (error) {
                showErrorToast({error, defaultMessage: "Failed to fetch credit cards"});
                setCreditCards([]);
            }
        };
        fetchCreditCards();
    }, []);
    return creditCards;
}