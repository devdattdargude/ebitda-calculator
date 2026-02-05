import { StorageService }
 from "./storage.js";
import { CloudAdapter }
 from "./cloud-adapter.js";

export const SyncService = {

  async pushAll() {

    const all =
      StorageService.getAll();

    for (const s of all) {
      await CloudAdapter.pushScenario(s);
    }
  },

  async pullAll() {

    const cloud =
      await CloudAdapter.pullAll();

    cloud.forEach(s =>
      StorageService.saveExternal(s));
  }

};
