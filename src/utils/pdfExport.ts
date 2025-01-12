import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  date: string;
  currencyPair: string;
  type: string;
  amount: number;
  status: string;
}

interface ExportFilters {
  dateFrom?: string;
  dateTo?: string;
  transactionId?: string;
  amountFrom?: string;
  amountTo?: string;
  type?: string;
  status?: string;
  currencyPair?: string;
}

export const exportTransactionsToPDF = (
  transactions: Transaction[],
  filters: ExportFilters
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add company logo and header
  doc.setFontSize(20);
  doc.setTextColor(43, 43, 61); // #2b2b3d
  doc.text('BOS FX Dealer', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Transaction Report', pageWidth / 2, 30, { align: 'center' });

  // Add export info
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${format(new Date(), 'dd.MM.yyyy HH:mm:ss')}`, 14, 40);

  // Add applied filters section if any filters are active
  const activeFilters = Object.entries(filters).filter(([_, value]) => value);
  if (activeFilters.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text('Applied Filters:', 14, 50);
    
    let yPos = 55;
    activeFilters.forEach(([key, value]) => {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`${formatFilterLabel(key)}: ${value}`, 20, yPos);
      yPos += 5;
    });
    yPos += 5;
  }

  // Create table
  autoTable(doc, {
    startY: activeFilters.length > 0 ? 70 : 50,
    head: [[
      'Transaction ID',
      'Date & Time',
      'Currency Pair',
      'Type',
      'Amount',
      'Status'
    ]],
    body: transactions.map(transaction => [
      transaction.id,
      format(new Date(transaction.date), 'dd.MM.yyyy HH:mm:ss'),
      transaction.currencyPair,
      transaction.type,
      formatAmount(transaction.amount),
      transaction.status
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [43, 43, 61],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      4: { halign: 'right' }, // Right align amounts
    },
    didDrawPage: (data) => {
      // Add page number at the bottom
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.text(
        `Page ${pageNumber}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    },
  });

  // Save the PDF
  doc.save(`transactions-${format(new Date(), 'yyyyMMdd-HHmmss')}.pdf`);
};

const formatFilterLabel = (key: string): string => {
  const labels: Record<string, string> = {
    dateFrom: 'Date From',
    dateTo: 'Date To',
    transactionId: 'Transaction ID',
    amountFrom: 'Amount From',
    amountTo: 'Amount To',
    type: 'Type',
    status: 'Status',
    currencyPair: 'Currency Pair'
  };
  return labels[key] || key;
};

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
