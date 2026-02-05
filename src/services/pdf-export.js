export function exportMISPDF(report) {

  const doc = new jsPDF();

  doc.text("MIS Report", 20, 20);
  doc.text("Total EBITDA: " + report.kpis.totalEbitda, 20, 40);
  doc.save("MIS_Report.pdf");
}
