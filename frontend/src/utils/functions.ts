export function formatTitle(title: string): string {
  return (title + "").charAt(0).toUpperCase() + title.substr(1);
}
