interface FormatProps {
    amount: number;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
}


export const formatNumber = ({amount, maximumFractionDigits=2, minimumSignificantDigits=2}: FormatProps) => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'decimal',
        maximumFractionDigits: maximumFractionDigits,
        minimumSignificantDigits: minimumSignificantDigits,
    }).format(amount);
}

export const formatPercentage = ({amount, maximumFractionDigits=2, minimumSignificantDigits=2}: FormatProps) => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'percent',
        maximumFractionDigits: maximumFractionDigits,
        minimumSignificantDigits: minimumSignificantDigits,
    }).format(amount);
}
