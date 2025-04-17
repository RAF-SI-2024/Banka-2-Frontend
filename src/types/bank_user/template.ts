import {User} from "@/types/bank_user/user.ts";

export type Template = {
    id: string;
    client: User;
    name: string;
    accountNumber: string;
    deleted: boolean;
    createdAt: string;
    modifiedAt: string;
};