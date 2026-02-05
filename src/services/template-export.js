export function downloadTemplate() {

  const ws =
    XLSX.utils.json_to_sheet([
      { Field:"Revenue", Value:0 },
      { Field:"Opex", Value:0 }
    ]);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb, ws, "INPUT"
  );

  XLSX.writeFile(
    wb,
    "ebitda_template.xlsx"
  );
}
