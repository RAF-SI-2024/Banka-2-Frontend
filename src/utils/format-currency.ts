

export const formatCurrency = (amount: number, currency: string = 'RSD') => {
    let formatted = new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency,
    }).format(amount);

    // Zameni "US$" sa "$" ako je valuta USD
    if (currency === 'USD') {
        formatted = formatted.replace("US$", "$");
    }

    return formatted;
};
