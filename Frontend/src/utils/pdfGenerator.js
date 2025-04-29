// utils/pdfGenerator.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateCustomerPDF = (data, columns, title) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 20);

  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  // Prepare table data
  const tableData = data.map((item) =>
    columns.map((column) => {
      if (
        column.accessor === 'createdAt' ||
        column.accessor === 'startDate' ||
        column.accessor === 'endDate'
      ) {
        return item[column.accessor]
          ? new Date(item[column.accessor]).toLocaleDateString()
          : 'N/A';
      }
      return item[column.accessor] || 'N/A';
    })
  );

  // Generate table
  doc.autoTable({
    startY: 40,
    head: [columns.map((col) => col.header)],
    body: tableData,
    theme: 'striped',
    styles: {
      fontSize: 10,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
    },
    margin: { top: 40 },
  });

  return doc;
};