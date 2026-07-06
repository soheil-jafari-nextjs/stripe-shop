export const sum = (numbers: number[]) => numbers.reduce((total, n) => total + n, 0);
export const average = (numbers: number[]) => numbers.length ? sum(numbers) / numbers.length : 0;