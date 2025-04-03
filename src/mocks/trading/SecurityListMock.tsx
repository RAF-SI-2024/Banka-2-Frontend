import {getSecurityTypeName, Security, SecurityType} from "@/types/security.ts";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateSecurities(type: SecurityType, page: number, count: number): Promise<Security[]> {
    await sleep(1000); // timeout 1s - simulate loading

    return Array.from({ length: count }, (_, i) => ({
        id: (page * count + i).toString(),
        name: `${getSecurityTypeName(type)} ${page * count + i}`,
        type: type,
        price: Math.random() * 10000,
        priceChange: Math.random()*2 - 1,
    }));
}