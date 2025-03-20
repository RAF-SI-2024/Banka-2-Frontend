export const formatCurrency = (
    amount: number,
    currency: string = "RSD",
    minimumFractionDigits: number = 2,
    maximumFractionDigits: number = 2
) => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: maximumFractionDigits,
    }).format(amount);
};

