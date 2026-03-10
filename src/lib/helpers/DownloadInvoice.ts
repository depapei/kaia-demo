import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPrice } from "./FormatPrice";

const drawSafeBlobs = (doc: jsPDF, pageWidth: number, pageHeight: number) => {
  doc.setFillColor(229, 211, 194);
  doc.circle(15, 15, 25, "F");
  doc.circle(pageWidth - 15, pageHeight - 15, 25, "F");
};

const drawBackground = (doc: jsPDF, pageWidth: number, pageHeight: number) => {
  doc.setFillColor(240, 232, 220);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(229, 211, 194);
  doc.circle(20, 20, 40, "F");
  doc.circle(pageWidth - 20, 60, 30, "F");
  doc.circle(40, pageHeight - 30, 50, "F");
  doc.circle(pageWidth - 30, pageHeight - 10, 40, "F");
};

export const downloadInvoice = (lastTransaction: any) => {
  if (!lastTransaction) {
    alert("No transaction data");
    return;
  }

  try {
    const doc = new jsPDF({ format: "A4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const originalAddPage = doc.addPage.bind(doc);
    (doc as any).addPage = function (...args: any[]) {
      originalAddPage(...args);

      doc.setFillColor(240, 232, 220);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      drawSafeBlobs(doc, pageWidth, pageHeight);
      return this;
    };

    drawBackground(doc, pageWidth, pageHeight);

    const items =
      typeof lastTransaction.items === "string"
        ? JSON.parse(lastTransaction.items)
        : lastTransaction.items;

    doc.setTextColor(129, 18, 9);
    doc.setFontSize(36);
    doc.setFont("times", "bolditalic");
    doc.text("KAIAPANTRY", pageWidth / 2, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(76, 75, 68);
    doc.text("ARTISANAL BAKERY & TREATS", pageWidth / 2, 38, {
      align: "center",
    });

    doc.setDrawColor(129, 18, 9);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 20, 42, pageWidth / 2 + 20, 42);

    doc.setTextColor(76, 75, 68);

    doc.setFontSize(14);
    doc.setFont("times", "bolditalic");
    doc.text("Invoice Details", 25, 65);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(175, 159, 143);
    doc.text(`Invoice Date: ${lastTransaction.createdAt}`, 25, 73);
    doc.text(`Due Date: ${lastTransaction.createdAt}`, 25, 78);
    doc.text(
      `Invoice No: #${lastTransaction.id.split("-")[0].toUpperCase()}`,
      25,
      83,
    );

    doc.setTextColor(129, 18, 9);
    doc.setFontSize(14);
    doc.setFont("times", "bolditalic");
    doc.text(
      `To: ${lastTransaction.customerName || "Valued Customer"}`,
      pageWidth - 25,
      65,
      { align: "right" },
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(175, 159, 143);

    doc.text(lastTransaction.customerEmail || "-", pageWidth - 25, 73, {
      align: "right",
    });

    const addressText = lastTransaction.address || "-";
    const addressMaxWidth = 70;
    const addressStartY = 78;
    const lineHeight = 5.35;

    const splitAddress = doc.splitTextToSize(addressText, addressMaxWidth);
    doc.text(splitAddress, pageWidth - 25, addressStartY, {
      align: "right",
    });

    const extraLines = splitAddress.length - 1;
    const dynamicOffset = extraLines * lineHeight;

    const cityY = 83 + dynamicOffset;
    doc.text(
      `${lastTransaction.city || "-"}, ${lastTransaction.postalCode || "-"}`,
      pageWidth - 25,
      cityY,
      { align: "right" },
    );

    const tableStartY = 100 + dynamicOffset;

    const tableData = items.map((item: any) => [
      {
        content: item.name,
        styles: { fontStyle: "bold", textColor: [129, 18, 9] },
      },
      item.slices ? `${item.slices} Slices` : "Standard",
      item.quantity,
      formatPrice(item.price),
      formatPrice(item.price * item.quantity),
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [["Item Description", "Option", "Qty", "Unit Price", "Amount"]],
      body: tableData,
      theme: "plain",
      headStyles: {
        fillColor: [190, 194, 151],
        textColor: [76, 75, 68],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
        cellPadding: 6,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [76, 75, 68],
        cellPadding: 6,
        fillColor: [240, 232, 220],
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
      alternateRowStyles: {
        fillColor: [229, 211, 194],
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 140 + dynamicOffset;

    doc.setFontSize(12);
    doc.setFont("times", "bolditalic");
    doc.setTextColor(129, 18, 9);
    doc.text("Payment Method", 25, finalY + 20);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(175, 159, 143);
    doc.text("Account : 1234 5678 9101", 25, finalY + 28);
    doc.text(
      `A/C Name : ${lastTransaction.customerName || "Customer"}`,
      25,
      finalY + 33,
    );
    doc.text("Bank Name : Kaiapantry Central Bank", 25, finalY + 38);

    const summaryX = pageWidth - 25;
    const labelX = pageWidth - 85;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(175, 159, 143);
    doc.text("Sub Total", labelX, finalY + 20);
    doc.text(formatPrice(lastTransaction.totalPrice), summaryX, finalY + 20, {
      align: "right",
    });

    doc.text("Tax 0%", labelX, finalY + 28);
    doc.text(formatPrice(0), summaryX, finalY + 28, { align: "right" });

    const barY = finalY + 35;
    const barHeight = 14;
    const barWidth = summaryX - labelX + 15;

    doc.setFillColor(129, 18, 9);
    doc.rect(labelX - 5, barY, barWidth, barHeight, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(240, 232, 220);

    const textY = barY + 9;
    doc.text("GRAND TOTAL", labelX, textY);
    doc.text(formatPrice(lastTransaction.totalPrice), summaryX, textY, {
      align: "right",
    });

    const lastPage = doc.getNumberOfPages();
    doc.setPage(lastPage);

    doc.setFontSize(10);
    doc.setFont("times", "italic");
    doc.setTextColor(175, 159, 143);
    doc.text(
      "Thank you for choosing Kaiapantry!",
      pageWidth / 2,
      pageHeight - 25,
      { align: "center" },
    );

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Artisanal Treats Baked with Love",
      pageWidth / 2,
      pageHeight - 18,
      { align: "center" },
    );

    const cTimestamp = lastTransaction.createdAt.replace(/\//g, "-");
    const cName = lastTransaction.customerName.replace(/ /g, "-");

    doc.save(`Kaia-Bakery-invoice-${cTimestamp}-${cName}.pdf`);
  } catch (error) {
    console.error("PDF Error:", error);
    alert("Failed to generate invoice PDF");
  }
};
