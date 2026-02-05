import { RoleService } from "../services/role-service.js";

export function applyRoleUI() {

  const inputs =
    document.querySelectorAll("input");

  if (RoleService.isViewer()) {
    inputs.forEach(i => i.disabled = true);
  }

  if (RoleService.isAnalyst()) {
    inputs.forEach(i => i.disabled = false);
  }

  if (RoleService.isAdmin()) {
    inputs.forEach(i => i.disabled = false);
  }
}

export function bindRoleSelector(id) {

  const el = document.getElementById(id);

  el.addEventListener("change", e => {
    RoleService.setRole(e.target.value);
    applyRoleUI();
  });

  RoleService.loadRole();
  el.value = RoleService.currentRole;
  applyRoleUI();
}
