export function timestampToString(timestamp: number): string {
  if (timestamp === 0) {
    return "--";
  }
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function timestampToDate(timestamp: number): string {
  if (timestamp === 0) {
    return "--";
  }
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}
