export const formatNumber = (amount: number,
                             minimumFractionDigits=2,
                             maximumFractionDigits=2) => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'decimal',
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: maximumFractionDigits,
    }).format(amount);
}

export const formatPercentage = (amount:number,
                                 minimumFractionDigits=2,
                                 maximumFractionDigits=2) => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'percent',
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: maximumFractionDigits,
    }).format(amount);
}
