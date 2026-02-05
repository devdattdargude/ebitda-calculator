import { StorageService } from "./storage.js";

export function exportCSV() {

  const rows = StorageService.getAll();

  const header = Object.keys(rows[0] || {}).join(",");

  const body = rows.map(r =>
    Object.values(r).map(v => JSON.stringify(v)).join(",")
  ).join("\n");

  const blob = new Blob([header + "\n" + body]);

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "scenarios.csv";
  a.click();
}
