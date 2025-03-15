export const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'decimal',
    }).format(amount);
}