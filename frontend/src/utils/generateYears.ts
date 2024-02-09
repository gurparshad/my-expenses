export const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10;
  const endYear = currentYear;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  return years.reverse();
}
