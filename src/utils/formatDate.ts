export const formatDate = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = date
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(/\s+/g, "");

  return `${day} ${month} ${year} ${time}`;
};
