export const AlertLogService = {

  store(id, alerts){

    const all =
      JSON.parse(
        localStorage.getItem("alerts")
      ) || [];

    all.push({
      scenarioId: id,
      alerts,
      ts: Date.now()
    });

    localStorage.setItem(
      "alerts",
      JSON.stringify(all)
    );
  }

};
