import React from 'react';
import jsPDF from 'jspdf';
import type { GroupedTask } from '../types';

interface ExportMenuProps {
  searchTerm: string;
  filteredTasks: GroupedTask[];
}

const ExportMenu: React.FC<ExportMenuProps> = ({ searchTerm, filteredTasks }) => {
  // Handle PDF export - Generate PDF from scratch
  const handlePDFExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;
    const margin = 20;
    const usableWidth = pageWidth - (2 * margin);

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Kirmes Dienstplan 2025', margin, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Kirmesgesellschaft Kettig \'87 e.V', margin, currentY);
    currentY += 15;

    // Search term info
    if (searchTerm) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Dienstplan für: ${searchTerm}`, margin, currentY);
      currentY += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${filteredTasks.length} Dienste gefunden`, margin, currentY);
      currentY += 15;
    }

    // Draw tasks
    filteredTasks.forEach((task, index) => {
      // Check if we need a new page
      if (currentY > pageHeight - 60) {
        doc.addPage();
        currentY = 20;
      }

      // Task header background
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, currentY - 5, usableWidth, 25, 'F');

      // Task title
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(task.task, margin + 5, currentY + 5);

      // Date and time
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const dateTimeText = `${task.date} • ${task.time}`;
      const dateTimeWidth = doc.getTextWidth(dateTimeText);
      doc.text(dateTimeText, pageWidth - margin - dateTimeWidth - 5, currentY + 5);

      currentY += 25;

      // Assigned persons
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Zugewiesene Personen (${task.persons.length}):`, margin + 5, currentY);
      currentY += 8;

      if (task.persons.length > 0) {
        doc.setFont('helvetica', 'normal');
        const personsText = task.persons.join(', ');
        
        // Split long text into multiple lines
        const lines = doc.splitTextToSize(personsText, usableWidth - 10);
        lines.forEach((line: string) => {
          if (currentY > pageHeight - 30) {
            doc.addPage();
            currentY = 20;
          }
          doc.text(line, margin + 5, currentY);
          currentY += 6;
        });
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(200, 0, 0);
        doc.text('Nicht zugewiesen', margin + 5, currentY);
        doc.setTextColor(0, 0, 0); // Reset color
        currentY += 6;
      }

      currentY += 10; // Space between tasks

      // Add separator line
      if (index < filteredTasks.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 5;
      }
    });

    // Footer on last page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);
      
      // Page number
      doc.text(`Seite ${i} von ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
      
      // Generation date
      const now = new Date();
      const dateStr = now.toLocaleDateString('de-DE');
      const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      doc.text(`Erstellt am ${dateStr} um ${timeStr}`, margin, pageHeight - 10);
      
      doc.setTextColor(0, 0, 0); // Reset color
    }

    // Save the PDF
    const filename = `kirmes-dienstplan-${searchTerm || 'alle'}.pdf`;
    doc.save(filename);
  };

  // Handle WhatsApp sharing
  const handleWhatsAppShare = () => {
    const tasksText = filteredTasks.map(task => 
      `${task.date} um ${task.time}\n${task.task}\n${task.persons.join(', ') || 'Nicht zugewiesen'}\n`
    ).join('\n');

    const message = `Kirmes Dienstplan ${searchTerm ? `für ${searchTerm}` : ''}\n\n${tasksText}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!searchTerm) {
    return null;
  }

  return (
    <div className="export-menu">
      <div className="export-buttons">
        <span>{filteredTasks.length} Dienste gefunden {searchTerm && `für "${searchTerm}"`}</span>
        
        {/* WhatsApp sharing button */}
        <button 
          onClick={handleWhatsAppShare}
          className="nav-btn"
          title="An WhatsApp senden"
        >
          Per WhatsApp teilen
        </button>
        
        {/* PDF Export button */}
        <button 
          onClick={handlePDFExport}
          className="nav-btn"
          title="Als PDF speichern"
        >
          Als PDF speichern
        </button>
      </div>
    </div>
  );
};

export default ExportMenu;
