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

  static exportToDOCX(contractTitle: string, contractContent: string, disclaimerText?: string) {
    const disclaimer = disclaimerText || 
      'ContractIQ provides AI-generated information for educational and informational purposes only. It is not legal advice and does not replace a qualified lawyer.';

    const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${contractTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #0f172a; margin: 1in; }
    h1 { font-size: 18pt; font-weight: bold; color: #0c8de9; margin-bottom: 6pt; text-align: center; }
    p { margin-bottom: 8pt; text-align: justify; }
    .disclaimer { border: 1px solid #f43f5e; background-color: #fef2f2; padding: 10px; margin-top: 20pt; font-size: 8pt; color: #9f1238; border-radius: 4px; }
    .disclaimer-title { font-weight: bold; color: #e11d48; margin-bottom: 4pt; font-size: 9pt; }
  </style>
</head>
<body>
  <h1>${contractTitle.toUpperCase()}</h1>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;"/>
  <div style="margin-top: 20px;">
    ${contractContent.split('\n').map((line: string) => line.trim() === '' ? '<br/>' : `<p>${line}</p>`).join('')}
  </div>
  <div class="disclaimer">
    <div class="disclaimer-title">IMPORTANT LEGAL DISCLAIMER</div>
    <p>${disclaimer}</p>
  </div>
</body>
</html>
    `.trim();

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_negotiated.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
