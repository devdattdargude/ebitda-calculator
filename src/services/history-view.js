import { StorageService } from "./storage.js";

export function renderHistory(containerId, property=null) {

  const list = StorageService.getAll()
    .filter(x => !property || x.property === property);

  const el = document.getElementById(containerId);

  el.innerHTML = list.map(s =>
    `<div>
      <b>${s.property}</b> — ${s.name}
      EBITDA: ${s.results.ebitda}
      Status: ${s.status || 'DRAFT'}
    </div>`
  ).join("");
}
