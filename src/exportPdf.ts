/**
 * Opens the browser print dialog with only the letter content visible.
 * The browser's native PDF renderer preserves real selectable text.
 */
export function exportToPdf(
  element: HTMLElement,
  fileName: string
): void {
  const originalTitle = document.title;
  document.title = fileName;
  element.classList.add("printing");

  const cleanup = () => {
    element.classList.remove("printing");
    document.title = originalTitle;
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  window.print();
}
