import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const addSafeColorOverride = () => {
  const style = document.createElement("style");
  style.id = "pdf-color-fix";

  style.innerHTML = `
    * {
      color: #0f172a !important;
      background: #ffffff !important;
      background-color: #ffffff !important;
      border-color: #e2e8f0 !important;
      box-shadow: none !important;
    }
  `;

  document.head.appendChild(style);
};

const removeSafeColorOverride = () => {
  const style = document.getElementById("pdf-color-fix");
  if (style) style.remove();
};

export const exportDashboardToPDF = async (
  element: HTMLElement,
  setLoading?: (v: boolean) => void,
) => {
  const elementsToRestore: Array<{
    el: HTMLElement;
    style: string | null;
  }> = [];

  const cleanUnsupportedColors = () => {
    document.querySelectorAll<HTMLElement>("*").forEach((el) => {
      const style = window.getComputedStyle(el);

      const hasUnsupported =
        /\b(lab|oklch|lch|oklab|color-mix|hwb)\s*\(/i.test(style.color) ||
        /\b(lab|oklch|lch|oklab|color-mix|hwb)\s*\(/i.test(
          style.backgroundColor,
        );

      if (hasUnsupported) {
        elementsToRestore.push({
          el,
          style: el.getAttribute("style"),
        });

        el.style.color = "#0f172a";
        el.style.backgroundColor = "#ffffff";
      }
    });
  };

  const restoreStyles = () => {
    elementsToRestore.forEach(({ el, style }) => {
      if (style === null) el.removeAttribute("style");
      else el.setAttribute("style", style);
    });
  };

  try {
    setLoading?.(true);
    addSafeColorOverride(); // ✅ ADD THIS
    cleanUnsupportedColors();

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    removeSafeColorOverride(); // ✅ ADD THIS
    restoreStyles();

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const headerH = 14;
    const marginX = 8;
    const marginTop = headerH + 4;
    const footerH = 8;

    const usableW = pageW - marginX * 2;
    const usableH = pageH - marginTop - footerH;

    const imgW = canvas.width;
    const imgH = canvas.height;

    const scale = usableW / imgW;

    const pageCanvas = document.createElement("canvas");
    const ctx = pageCanvas.getContext("2d");

    const pageHeightInCanvas = usableH / scale;

    let remaining = imgH;
    let pageIndex = 0;

    while (remaining > 0) {
      pageCanvas.width = imgW;
      pageCanvas.height = Math.min(pageHeightInCanvas, remaining);

      ctx!.drawImage(
        canvas,
        0,
        pageIndex * pageHeightInCanvas,
        imgW,
        pageCanvas.height,
        0,
        0,
        imgW,
        pageCanvas.height,
      );

      if (pageIndex > 0) pdf.addPage();

      // Header
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, pageW, headerH, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text("Incident Analytics — Officers Report", 10, 9);

      pdf.setFontSize(8);
      pdf.text(`Exported: ${new Date().toLocaleString()}`, pageW - 10, 9, {
        align: "right",
      });

      const imgData = pageCanvas.toDataURL("image/png");

      pdf.addImage(
        imgData,
        "PNG",
        marginX,
        marginTop,
        usableW,
        pageCanvas.height * scale,
      );

      // Footer
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "italic");
      pdf.text(
        "This report is auto-generated and non-editable.",
        pageW / 2,
        pageH - 3,
        { align: "center" },
      );

      remaining -= pageHeightInCanvas;
      pageIndex++;
    }

    pdf.save(`officers-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    console.error("PDF export failed:", err);
  } finally {
    setLoading?.(false);
  }
};
