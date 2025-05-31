// src/enums/index.ts
var TaskStatus = /* @__PURE__ */ ((TaskStatus2) => {
  TaskStatus2["NOT_STARTED"] = "NOT_STARTED";
  TaskStatus2["IN_PROGRESS"] = "IN_PROGRESS";
  TaskStatus2["COMPLETED"] = "COMPLETED";
  return TaskStatus2;
})(TaskStatus || {});
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["ADMIN"] = "ADMIN";
  UserRole2["MANAGER"] = "MANAGER";
  UserRole2["USER"] = "USER";
  return UserRole2;
})(UserRole || {});
var Priority = /* @__PURE__ */ ((Priority2) => {
  Priority2["LOW"] = "LOW";
  Priority2["MEDIUM"] = "MEDIUM";
  Priority2["HIGH"] = "HIGH";
  return Priority2;
})(Priority || {});
export {
  Priority,
  TaskStatus,
  UserRole
};
//# sourceMappingURL=index.js.map