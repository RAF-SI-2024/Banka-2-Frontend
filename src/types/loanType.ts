export interface LoanType{
    id: string,
    name: string,
    margin: number
}


export interface LoanTypeResponse{
    items: LoanType[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

