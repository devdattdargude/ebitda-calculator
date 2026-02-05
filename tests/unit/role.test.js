import { RoleService }
  from "../../src/services/role-service.js";

RoleService.setRole("viewer");
console.assert(RoleService.isViewer());
