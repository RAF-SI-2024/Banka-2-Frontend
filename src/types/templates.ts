import {User} from "@/types/user.ts";

export type Template = {
    id: string;
    client: User;
    name: string;
    accountNumber: string;
    deleted: boolean;
    createdAt: string;
    modifiedAt: string;
};
