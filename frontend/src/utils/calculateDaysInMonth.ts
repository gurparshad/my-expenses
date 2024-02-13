export const calculateDaysInMonth = (year: string, monthNumber: number) => {
  return new Date(parseInt(year), monthNumber, 0).getDate();
};
