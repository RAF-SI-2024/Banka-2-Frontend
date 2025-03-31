export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('sr-RS') + " (" + date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit'}) + ")"
};
