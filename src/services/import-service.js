export const ImportService = {

  readFile(file, callback) {

    const reader = new FileReader();

    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: "array" });

      const sheet = wb.Sheets["INPUT"];

      const rows =
        XLSX.utils.sheet_to_json(sheet);

      callback(this.mapRows(rows));
    };

    reader.readAsArrayBuffer(file);
  },

  mapRows(rows) {
    const obj = {};

    rows.forEach(r => {
      obj[r.Field] = r.Value;
    });

    return obj;
  }

};
