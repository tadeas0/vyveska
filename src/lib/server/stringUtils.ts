export const prepName = (stationName: string): string => {
    return stationName
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "") // replace diacritic
        .replace(/[\W_]+/g, " ") // replace nonaplhanumeric
        .replace(/\s\s+/g, " "); // replace multiple whitespace chars
};
