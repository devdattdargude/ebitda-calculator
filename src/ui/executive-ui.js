import { ExecutiveService }
 from "../services/executive-service.js";

export function renderExecutive() {

  kpiEbitda.innerText =
    ExecutiveService.totalEBITDA();

  kpiMargin.innerText =
    ExecutiveService.avgMargin()
       .toFixed(2) + "%";

  kpiPending.innerText =
    ExecutiveService.pendingCount();

  document.getElementById("pipelineCount").innerText =
    ExecutiveService.pendingCount();

  renderRank();
  renderRisk();

  // Disable all input controls in executive mode
  document
    .querySelectorAll("input,button,select")
    .forEach(e => e.disabled = true);
}

function renderRank() {

  rankList.innerHTML = "";

  ExecutiveService
    .propertyRanking()
    .forEach(r=>{
      const li =
        document.createElement("li");
      li.innerText =
        r[0] + " — " + r[1];
      rankList.appendChild(li);
    });
}

function renderRisk() {

  riskList.innerHTML = "";

  ExecutiveService
    .riskFlags()
    .forEach(x=>{
      const li =
        document.createElement("li");
      li.innerText =
        x.property + " / " + x.name;
      riskList.appendChild(li);
    });
}
