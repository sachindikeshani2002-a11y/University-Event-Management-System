const roleLabels = {
  student: "Student",
  organizer: "Organizer",
  admin: "Administrator",
};

export function getUserDisplayName(user) {
  return typeof user?.name === "string" && user.name.trim()
    ? user.name.trim()
    : "Profile unavailable";
}

export function getUserRoleLabel(user) {
  return roleLabels[user?.role] || "Role unavailable";
}

export function getUserInitials(user) {
  const name = typeof user?.name === "string" ? user.name.trim() : "";
  if (!name) return "?";
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
