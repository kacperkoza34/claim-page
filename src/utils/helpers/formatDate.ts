export const formatDate = (date: Date): string => {
  const dateAsLocalDateString = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
  }).format(date);
  
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  
  return `${dateAsLocalDateString} at ${time}`;
};
