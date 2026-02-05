export function exportMISExcel(report) {

  const rows = report.scenarios
    .map(s => ({
      Scenario: s.name,
      Property: s.property,
      EBITDA: s.results.ebitda,
      Margin: s.results.ebitdaMargin
    }));

  const ws = XLSX.utils.json_to_sheet(rows);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb, ws, "MIS_Report.xlsx"
  );
}
