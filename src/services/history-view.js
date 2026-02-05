import { StorageService } from "./storage.js";

export function renderHistory(containerId) {
  const list = StorageService.getAll();
  const el = document.getElementById(containerId);

  el.innerHTML = list.map(s =>
    `<div>
       <b>${s.name}</b>
       <small>${s.ts}</small>
       EBITDA: ${s.results.ebitda}
     </div>`
  ).join("");
}
