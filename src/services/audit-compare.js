import { diffObjects }
  from "../utils/diff-engine.js";

export const AuditCompare = {

  compareVersions(v1, v2) {

    return {
      inputDiff:
        diffObjects(v1.inputs, v2.inputs),

      resultDiff:
        diffObjects(v1.results, v2.results)
    };

  }

};
