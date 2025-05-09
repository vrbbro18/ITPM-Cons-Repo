import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateCustomerPDF = (data, columns, title, metadata = {}) => {
  try {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: title,
      subject: 'Customer Report',
      author: 'Construction Company',
      creator: 'Construction Company'
    });

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(4, 15, 40); // --dark: #040f28
    doc.text(title, 14, 20);

    // Add metadata (generation date, search term, total count)
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102); // #666
    let currentY = 30;
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, currentY);
    if (metadata.searchTerm) {
      currentY += 5;
      doc.text(`Search Term: ${metadata.searchTerm || 'All'}`, 14, currentY);
    }
    if (metadata.totalCount !== undefined) {
      currentY += 5;
      doc.text(`Total Records: ${metadata.totalCount}`, 14, currentY);
    }

    // Prepare table data
    const tableData = data.map(item =>
      columns.map(col => {
        const value = item[col.accessor];
        return value != null ? value.toString() : 'N/A';
      })
    );

    // Add table using autoTable
    doc.autoTable({
      startY: currentY + 10,
      head: [columns.map(col => col.header)],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [143, 156, 169], // #8f9ca9
        textColor: [38, 37, 54], // --primary-color: #262536
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: {
        textColor: [75, 85, 99], // #4b5563
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [244, 246, 248], // --light: #f4f6f8
      },
      margin: { left: 14, right: 14 },
      styles: {
        lineColor: [209, 213, 219], // #d1d5db
        lineWidth: 0.1,
      },
    });

    return doc;
  } catch (error) {
    console.error('Error in generateCustomerPDF:', error);
    throw error;
  }
};