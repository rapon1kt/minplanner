export default function dateFormatter(dueDate: string) {
  const date = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dueDate));
  return date;
}
