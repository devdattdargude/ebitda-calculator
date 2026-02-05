import { StorageService }
 from "../services/storage.js";

import { AuditCompare }
 from "../services/audit-compare.js";

function flagBigChange(val1,val2) {
  return Math.abs(val2-val1) > 10000;
}

export function loadTimeline(id) {

  const v =
    StorageService.getScenarioVersions(id);

  versionSelect.innerHTML = "";

  v.forEach((x,i) => {

    const o = document.createElement("option");
    o.value = i;
    o.text =
      new Date(x.timestamp)
      .toLocaleString();

    versionSelect.appendChild(o);

  });

}

export function renderDiff(id) {

  const v =
    StorageService.getScenarioVersions(id);

  if (v.length < 2) return;

  const last = v[v.length-1];
  const prev = v[v.length-2];

  const d =
    AuditCompare.compareVersions(prev,last);

  diffOutput.innerText =
    JSON.stringify(d,null,2);

  // Add compare chart
  new Chart(document.getElementById("compareChart"), {
    type:"bar",
    data:{
      labels:["Before","After"],
      datasets:[{
        data:[prev.results.ebitda,last.results.ebitda]
      }]
    }
  });
}
