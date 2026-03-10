/**
 * Opens the browser print dialog with only the letter content visible.
 * The browser's native PDF renderer preserves real selectable text.
 */
export function exportToPdf(
  _element: HTMLElement,
  fileName: string
): void {
  const originalTitle = document.title;
  document.title = fileName;

  const cleanup = () => {
    document.title = originalTitle;
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  window.print();
}
