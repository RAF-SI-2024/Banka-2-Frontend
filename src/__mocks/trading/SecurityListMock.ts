import {getSecurityTypeName, Security, SecuritySimple, SecurityType} from "@/types/exchange/security.ts";

// function sleep(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
//
// export async function generateSecurities(type: SecurityType, page: number, count: number): Promise<SecuritySimple[]> {
//     await sleep(1000); // timeout 1s - simulate loading
//
//     return Array.from({ length: count }, (_, i): SecuritySimple => ({
//         id: (page * count + i).toString(),
//         ticker: `${getSecurityTypeName(type)} ${page * count + i}`,
//         askPrice: Math.random() * 10000,
//         priceChangePercentInInterval: Math.random()*2 - 1,
//     }));
// }