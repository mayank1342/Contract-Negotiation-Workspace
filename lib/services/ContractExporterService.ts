import jsPDF from 'jspdf';

export class ContractExporterService {
  static exportToPDF(contractTitle: string, contractContent: string, disclaimerText?: string) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;

    // Header Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(12, 141, 233); // Brand blue
    doc.text('CONTRACTIQ — FINAL NEGOTIATED AGREEMENT', margin, 20);

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(contractTitle, margin, 30);

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 34, pageWidth - margin, 34);

    // Body Text
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    const splitText = doc.splitTextToSize(contractContent, maxLineWidth);
    let cursorY = 42;

    splitText.forEach((line: string) => {
      if (cursorY > 260) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, margin, cursorY);
      cursorY += 6;
    });

    // Mandatory Legal Disclaimer
    if (cursorY > 240) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setDrawColor(244, 63, 94);
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, cursorY + 5, maxLineWidth, 25, 3, 3, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(225, 29, 72);
    doc.text('IMPORTANT LEGAL DISCLAIMER', margin + 5, cursorY + 13);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(159, 18, 57);
    const disclaimer = disclaimerText || 
      'ContractIQ provides AI-generated information for educational and informational purposes only. It is not legal advice and does not replace a qualified lawyer.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, maxLineWidth - 10);
    doc.text(splitDisclaimer, margin + 5, cursorY + 20);

    // Save File
    doc.save(`${contractTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_negotiated.pdf`);
  }
}
