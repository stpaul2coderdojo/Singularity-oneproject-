import { jsPDF } from 'jspdf';
import { ArXivPublication } from '../types';

/**
 * Generates an authoritative, print-ready arXiv academic preprint PDF using jsPDF.
 * Preserves standard scholarly formatting:
 * - A4 dimensions with calibrated academic margins
 * - Running headers with arXiv identifier and subject class
 * - Title and author affiliation blocks
 * - Abstract block with boundary rules and indentations
 * - Numbered academic sections (1. Introduction, 2. Problem Statement, 3. Methods, 4. Discussion)
 * - Rendered mathematical equation blocks with right-aligned formula numbering
 * - Numbered citation and reference list
 * - Running footers with dynamic "Page X of Y" page numbering and CC BY 4.0 license note
 */
export async function generateAcademicPdf(publication: ArXivPublication): Promise<void> {
  // Create A4 PDF document in portrait mode (mm units)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm for A4
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm for A4
  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 22;
  const marginBottom = 20;
  const contentWidth = pageWidth - marginLeft - marginRight; // 170mm

  let currentY = marginTop;

  // Helper to ensure enough space on page or trigger page break
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - marginBottom) {
      doc.addPage();
      currentY = marginTop;
    }
  };

  // --- Title Section ---
  doc.setFont('times', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(20, 20, 20);

  const titleLines = doc.splitTextToSize(publication.title, contentWidth);
  doc.text(titleLines, pageWidth / 2, currentY, { align: 'center' });
  currentY += titleLines.length * 7.5 + 4;

  // --- Author Block ---
  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(40, 40, 40);

  const authorNames = publication.authors.map(a => a.name).join(', ');
  const authorLines = doc.splitTextToSize(authorNames, contentWidth);
  doc.text(authorLines, pageWidth / 2, currentY, { align: 'center' });
  currentY += authorLines.length * 5 + 1;

  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);

  const affiliations = Array.from(new Set(publication.authors.map(a => a.affiliation))).join('  •  ');
  const affilLines = doc.splitTextToSize(affiliations, contentWidth);
  doc.text(affilLines, pageWidth / 2, currentY, { align: 'center' });
  currentY += affilLines.length * 4.5 + 4;

  // Metadata Subtitle (arXiv submission & version)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Preprint: ${publication.arxivId}   |   Submitted: ${publication.submittedDate}   |   Version ${publication.version}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 5;

  // Top Rule before Abstract
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.35);
  doc.line(marginLeft + 12, currentY, pageWidth - marginRight - 12, currentY);
  currentY += 5;

  // --- Abstract Block ---
  const abstractMargin = marginLeft + 12;
  const abstractWidth = contentWidth - 24;

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text('ABSTRACT', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(45, 45, 45);

  const cleanAbstract = publication.abstract.replace(/\$([^\$]+)\$/g, '$1');
  const abstractLines = doc.splitTextToSize(cleanAbstract, abstractWidth);
  doc.text(abstractLines, abstractMargin, currentY, { align: 'left', lineHeightFactor: 1.35 });
  currentY += abstractLines.length * 4.5 + 4;

  // Bottom Rule after Abstract
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.35);
  doc.line(marginLeft + 12, currentY, pageWidth - marginRight - 12, currentY);
  currentY += 8;

  // --- Sections: 1. Introduction, 2. Problem Statement, 3. Methods, 4. Discussion ---
  for (const section of publication.sections) {
    checkPageBreak(25);

    // Section Header (e.g., "1. Introduction")
    doc.setFont('times', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(15, 15, 15);
    doc.text(`${section.number}.  ${section.title}`, marginLeft, currentY);
    currentY += 6.5;

    // Section Body Paragraphs
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);

    const paragraphs = section.content.split('\n\n');
    for (const para of paragraphs) {
      if (para.startsWith('- ') || para.startsWith('• ') || para.startsWith('1.') || para.startsWith('2.')) {
        // List items
        const listItems = para.split('\n');
        for (const item of listItems) {
          checkPageBreak(12);
          const cleanItem = item.replace(/^[-•0-9.]+\s*/, '').replace(/\$([^\$]+)\$/g, '$1');
          const itemLines = doc.splitTextToSize(cleanItem, contentWidth - 8);
          
          doc.setFillColor(60, 60, 60);
          doc.circle(marginLeft + 3, currentY - 1, 0.7, 'F');
          doc.text(itemLines, marginLeft + 6, currentY, { lineHeightFactor: 1.35 });
          currentY += itemLines.length * 4.6 + 2;
        }
      } else {
        // Regular academic paragraph with standard first-line indent
        checkPageBreak(16);
        const cleanPara = para.replace(/\$([^\$]+)\$/g, '$1');
        const paraLines = doc.splitTextToSize(cleanPara, contentWidth);

        doc.text(paraLines, marginLeft, currentY, { lineHeightFactor: 1.35 });
        currentY += paraLines.length * 4.6 + 3.5;
      }
    }

    // Mathematical Equations (if any in this section)
    if (section.equations && section.equations.length > 0) {
      for (let eqIdx = 0; eqIdx < section.equations.length; eqIdx++) {
        const rawEq = section.equations[eqIdx];
        checkPageBreak(20);

        const eqBoxY = currentY;
        const eqBoxHeight = 13;

        // Equation highlight box (academic light grey)
        doc.setFillColor(247, 248, 250);
        doc.setDrawColor(220, 224, 230);
        doc.setLineWidth(0.3);
        doc.roundedRect(marginLeft + 4, eqBoxY, contentWidth - 8, eqBoxHeight, 1.5, 1.5, 'FD');

        // Formatted math text
        doc.setFont('courier', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(25, 45, 80);

        // Sanitize latex backslashes slightly for monospace reading
        const displayEq = rawEq.replace(/\\left|\\right/g, '').replace(/\s+/g, ' ');
        const eqLines = doc.splitTextToSize(displayEq, contentWidth - 32);
        doc.text(eqLines, marginLeft + 8, eqBoxY + 8);

        // Equation numbering e.g. (1.1)
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(90, 90, 90);
        const eqNumber = `(${section.number}.${eqIdx + 1})`;
        doc.text(eqNumber, pageWidth - marginRight - 8, eqBoxY + 8, { align: 'right' });

        currentY += eqBoxHeight + 5;
      }
    }

    currentY += 4;
  }

  // --- References / Citations Section ---
  if (publication.references && publication.references.length > 0) {
    checkPageBreak(30);

    doc.setFont('times', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(15, 15, 15);
    doc.text('References', marginLeft, currentY);
    currentY += 6.5;

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(45, 45, 45);

    for (let i = 0; i < publication.references.length; i++) {
      const ref = publication.references[i];
      checkPageBreak(14);

      const refNumber = `[${i + 1}]`;
      doc.setFont('times', 'bold');
      doc.text(refNumber, marginLeft, currentY);

      doc.setFont('times', 'normal');
      const refText = `${ref.authors}. "${ref.title}." ${ref.venue} (${ref.year})${ref.arxivId ? ` — ${ref.arxivId}` : ''}.`;
      const refLines = doc.splitTextToSize(refText, contentWidth - 10);
      doc.text(refLines, marginLeft + 8, currentY, { lineHeightFactor: 1.3 });

      currentY += refLines.length * 3.8 + 2.5;
    }
  }

  // --- Final Pass: Add Running Header and Page Numbers to Every Page ---
  const totalPages = doc.getNumberOfPages();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);

    // Running Header (only on page 2 and later)
    if (pageNum > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(130, 130, 130);
      doc.text(
        `${publication.arxivId} [${publication.primaryCategory}]  •  Singularity-1 Agentic Preprint`,
        marginLeft,
        12
      );
      doc.text(
        publication.title.length > 55 ? publication.title.substring(0, 52) + '...' : publication.title,
        pageWidth - marginRight,
        12,
        { align: 'right' }
      );

      // Running header rule
      doc.setDrawColor(215, 215, 215);
      doc.setLineWidth(0.25);
      doc.line(marginLeft, 14, pageWidth - marginRight, 14);
    }

    // Running Footer (on all pages)
    const footerY = pageHeight - 11;
    doc.setDrawColor(215, 215, 215);
    doc.setLineWidth(0.25);
    doc.line(marginLeft, footerY - 3, pageWidth - marginRight, footerY - 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `Singularity-1 Rubric Platform  •  License: ${publication.license || 'CC BY 4.0'}`,
      marginLeft,
      footerY
    );
    doc.text(
      `Page ${pageNum} of ${totalPages}`,
      pageWidth - marginRight,
      footerY,
      { align: 'right' }
    );
  }

  // Generate clean filename based on arXiv ID and title
  const cleanId = publication.arxivId.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${cleanId}_preprint.pdf`;

  // Trigger browser download
  doc.save(fileName);
}
