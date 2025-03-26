import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateCustomerPDF = (customers, columns, title) => {
  try {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    
    // Add header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(title, 14, 22);
    
    // Add subtitle
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 32);

    // Prepare table data
    const tableData = customers.map(customer => 
      columns.map(col => {
        const value = customer[col.accessor];
        
        if (col.accessor === 'createdAt' || col.accessor === 'startDate' || col.accessor === 'endDate') {
          return value ? new Date(value).toLocaleDateString() : 'N/A';
        }
        
        return value || 'N/A';
      })
    );

    // Generate table
    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [51, 102, 153], // Dark blue
        textColor: 255,
        fontStyle: 'bold'
      },
      didDrawPage: (data) => {
        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${data.pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
      }
    });

    return doc;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};