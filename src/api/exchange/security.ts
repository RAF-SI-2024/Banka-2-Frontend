import {api_exchange} from "@/api/axios.ts";
import {
    getSecurityTypeName,
    getSecurityTypeRoute,
    QuoteFilterQuery,
    QuoteIntervalType,
    Security,
    SecurityDailyResponse,
    SecuritySimpleResponse,
    SecurityType
} from "@/types/exchange/security.ts";

export const getAllSecuritiesOfType = async (
    type: SecurityType,
    page: number,
    size: number,
    filters: QuoteFilterQuery = {interval: QuoteIntervalType.Week},
): Promise<SecuritySimpleResponse> => {
    try {
        // Futures are not from API
        if(type == SecurityType.Future)
            filters.interval = QuoteIntervalType.Max;
        const response = await api_exchange.get(`${getSecurityTypeRoute(type)}`, {
            params: {
                ...filters,
                page,
                size,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error(`❌ Error fetching securities of type ${getSecurityTypeName(type)}:`, error);
        throw error;
    }
}

export const getSecurityOfType = async (
    type: SecurityType,
    id: string,
): Promise<Security> => {
    try {
        const response = await api_exchange.get(`${getSecurityTypeRoute(type)}/${id}`, {
        });
        return response.data;
    }
    catch (error) {
        console.error(`❌ Error fetching security of type ${getSecurityTypeName(type)} with id ${id}:`, error);
        throw error;
    }
}

export const getSecurityOfTypeDaily = async (
    type: SecurityType,
    id: string,
): Promise<SecurityDailyResponse> => {
    try {
        const response = await api_exchange.get(`${getSecurityTypeRoute(type)}/daily/${id}`, {
            params:{
                interval: QuoteIntervalType.Max
            }
        });
        // console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error(`❌ Error fetching daily security of type ${getSecurityTypeName(type)} with id ${id}:`, error);
        throw error;
    }
}
