export const formatDate = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = date
    .toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(" AM", "AM")
    .replace(" PM", "PM");

  return `${day} ${month} ${year} ${time}`;
};
