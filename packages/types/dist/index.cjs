"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Priority: () => Priority,
  TaskStatus: () => TaskStatus,
  UserRole: () => UserRole
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Priority,
  TaskStatus,
  UserRole
});
//# sourceMappingURL=index.cjs.map