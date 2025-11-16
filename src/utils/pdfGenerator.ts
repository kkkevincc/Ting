import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (element: HTMLElement, filename: string) => {
  try {
    // Configure html2canvas for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png', 1.0);

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Save the PDF
    pdf.save(filename);

    return { success: true, message: 'PDF generated successfully' };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, message: 'Failed to generate PDF' };
  }
};

export const generatePDFWithSmartLayout = async (element: HTMLElement, filename: string) => {
  try {
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Apply smart layout optimizations
    applySmartLayout(clonedElement);
    
    // Temporarily add to document for rendering
    document.body.appendChild(clonedElement);
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '-9999px';
    
    // Wait for fonts to load
    await document.fonts.ready;
    
    // Generate canvas with optimized settings
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
      logging: false,
    });

    // Remove cloned element
    document.body.removeChild(clonedElement);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Handle multi-page if needed
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);

    return { success: true, message: 'PDF generated with smart layout' };
  } catch (error) {
    console.error('Smart PDF generation error:', error);
    return { success: false, message: 'Failed to generate PDF with smart layout' };
  }
};

// Smart layout optimization function
function applySmartLayout(element: HTMLElement) {
  // Apply font scaling based on content length
  const textElements = element.querySelectorAll('p, div, span, li');
  textElements.forEach((el) => {
    const textLength = el.textContent?.length || 0;
    const currentFontSize = parseFloat(window.getComputedStyle(el).fontSize);
    
    // Scale font size based on text length
    let newFontSize = currentFontSize;
    if (textLength > 200) {
      newFontSize = Math.max(currentFontSize * 0.9, 10); // Minimum 10px
    } else if (textLength < 50) {
      newFontSize = Math.min(currentFontSize * 1.1, 16); // Maximum 16px
    }
    
    (el as HTMLElement).style.fontSize = `${newFontSize}px`;
  });

  // Adjust line spacing for better readability
  const contentBlocks = element.querySelectorAll('.mb-4, .mb-6');
  contentBlocks.forEach((block) => {
    const blockElement = block as HTMLElement;
    const contentHeight = blockElement.scrollHeight;
    
    // Adjust margin based on content density
    if (contentHeight > 100) {
      blockElement.style.marginBottom = '1.5rem';
    } else {
      blockElement.style.marginBottom = '1rem';
    }
  });

  // Ensure proper page breaks
  const sections = element.querySelectorAll('h2');
  sections.forEach((section, index) => {
    if (index > 0) {
      const sectionElement = section as HTMLElement;
      sectionElement.style.pageBreakBefore = 'auto';
      sectionElement.style.breakBefore = 'auto';
    }
  });
}