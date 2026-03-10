import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Checks if a canvas slice is effectively blank (all white).
 */
function isBlankCanvas(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return true;
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) return false;
  }
  return true;
}

/**
 * Renders the given DOM element to an A4-sized PDF and triggers a download.
 */
export async function exportToPdf(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  const a4WidthMm = 210;
  const a4HeightMm = 297;

  // Temporarily remove min-height so only actual content is captured
  const origMinHeight = element.style.minHeight;
  element.style.minHeight = "0";

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  element.style.minHeight = origMinHeight;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const ratio = a4WidthMm / canvas.width;
  const totalImgHeightMm = canvas.height * ratio;

  if (totalImgHeightMm <= a4HeightMm) {
    // Fits on one page
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      a4WidthMm,
      totalImgHeightMm
    );
  } else {
    const pageHeightPx = Math.floor(a4HeightMm / ratio);
    const totalPages = Math.ceil(canvas.height / pageHeightPx);

    for (let page = 0; page < totalPages; page++) {
      const srcY = page * pageHeightPx;
      const sliceHeight = Math.min(pageHeightPx, canvas.height - srcY);

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;

      const ctx = pageCanvas.getContext("2d");
      if (!ctx) continue;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0, srcY, canvas.width, sliceHeight,
        0, 0, canvas.width, sliceHeight
      );

      // Skip blank trailing pages
      if (page > 0 && isBlankCanvas(pageCanvas)) continue;

      if (page > 0) pdf.addPage();

      const sliceHeightMm = sliceHeight * ratio;
      pdf.addImage(
        pageCanvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        a4WidthMm,
        sliceHeightMm
      );
    }
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9_-]/g, "_");
  pdf.save(`${safeName}.pdf`);
}
