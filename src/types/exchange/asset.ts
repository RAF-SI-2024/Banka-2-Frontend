import {Currency} from "@/types/bank_user/currency.ts";
import {Security} from "@/types/exchange/security.ts";
import {Actuary} from "@/types/bank_user/actuary.ts";

export interface Asset{
    id: string;
    actuary: Actuary;
    security: Security;
    baseCurrency: Currency;
    quoteCurrency: Currency;
    quantity: number;
    averagePrice: number;
    createdAt: Date;
    modifiedAt: Date;
}

export interface AssetResponse {
    items: Asset[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}
/*
{
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "actuary": {
        "id": "73b8f8ee-ff51-4247-b65b-52b8b9a494e5",
        "firstName": "Marko",
        "lastName": "Petrović",
        "dateOfBirth": "1995-07-21",
        "gender": 1,
        "uniqueIdentificationNumber": "2107953710020",
        "username": "markop",
        "email": "client1@gmail.com",
        "phoneNumber": "+381641234567",
        "address": "Kraljice Natalije 45",
        "role": 1,
        "department": "IT department",
        "accounts": [
          {
            "id": "3f4b1e6e-a2f5-4e3b-8f88-2f70a6b42b19",
            "accountNumber": "222001112345678922"
          }
        ],
        "createdAt": "2024-10-15T09:30:00.0000000+02:00",
        "modifiedAt": "2025-02-28T12:45:00.0000000+01:00",
        "activated": true
      },
      "security": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "securityType": "0 - Stock",
        "name": null,
        "ticker": null,
        "stockExchange": {
          "id": "00b0538d-4c7e-4e3c-b8f8-e101654e57fe",
          "name": "Posit Rfq",
          "acronym": "RFQ",
          "mIC": "XRFQ",
          "polity": "Ireland",
          "timeZone": "00:00:00",
          "currency": {
            "id": "5efa312a-5ab6-4950-9579-0f605aeab4f8",
            "name": "Dolar",
            "code": "USD",
            "symbol": "$",
            "description": "Zvanična valuta Sjedinjenih Američkih Država",
            "status": true,
            "createdAt": "2025-07-16T14:17:57.5064820+02:00",
            "modifiedAt": "2025-07-16T14:17:57.5064820+02:00"
          },
          "createdAt": "2025-07-16T12:17:57.5084380+00:00",
          "modifiedAt": "2025-07-16T12:17:57.5084380+00:00"
        },
        "baseCurrency": {
          "id": "5efa312a-5ab6-4950-9579-0f605aeab4f8",
          "name": "Dolar",
          "code": "USD",
          "symbol": "$",
          "description": "Zvanična valuta Sjedinjenih Američkih Država",
          "status": true,
          "createdAt": "2025-07-16T14:17:57.5064820+02:00",
          "modifiedAt": "2025-07-16T14:17:57.5064820+02:00"
        },
        "quoteCurrency": {
          "id": "5efa312a-5ab6-4950-9579-0f605aeab4f8",
          "name": "Dolar",
          "code": "USD",
          "symbol": "$",
          "description": "Zvanična valuta Sjedinjenih Američkih Država",
          "status": true,
          "createdAt": "2025-07-16T14:17:57.5064820+02:00",
          "modifiedAt": "2025-07-16T14:17:57.5064820+02:00"
        },
        "exchangeRate": 1,
        "liquidity": "0 - High",
        "strikePrice": 1,
        "openInterest": 1,
        "settlementDate": "2025-07-16",
        "optionType": "0 - Call",
        "contractSize": 1,
        "contractUnit": "0 - Kilogram"
      },
      "quantity": 1,
      "averagePrice": 1,
      "createdAt": "2025-07-16T12:19:09.650Z",
      "modifiedAt": "2025-07-16T12:19:09.650Z"
    }
  ],
  "pageNumber": 1,
  "pageSize": 1,
  "totalElements": 1,
  "totalPages": 1
}
 */