

export const formatCurrency = (amount: number, currency: string = 'RSD') => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency,
    }).format(amount);
};