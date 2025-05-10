import jsPDF from 'jspdf';

export const exportAsImage = () => {
  const canvas = document.querySelector('canvas');
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = 'floorplan.png';
  link.click();
};

export const exportAsPDF = (rooms) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Floor Plan Rooms', 10, 20);
  rooms.forEach((room, i) => {
    doc.text(`${i + 1}. ${room.name} (${room.type})`, 10, 30 + i * 8);
  });
  doc.save('floorplan.pdf');
};
