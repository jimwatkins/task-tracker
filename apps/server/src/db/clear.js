"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var dynamodb_1 = require("./dynamodb");
function clearUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var scanCommand, Items, _i, Items_1, item, deleteCommand, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting to clear users...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    scanCommand = new client_dynamodb_1.ScanCommand({
                        TableName: dynamodb_1.TABLES.USERS
                    });
                    return [4 /*yield*/, dynamodb_1.docClient.send(scanCommand)];
                case 2:
                    Items = (_a.sent()).Items;
                    if (!Items || Items.length === 0) {
                        console.log('No users found to delete.');
                        return [2 /*return*/];
                    }
                    _i = 0, Items_1 = Items;
                    _a.label = 3;
                case 3:
                    if (!(_i < Items_1.length)) return [3 /*break*/, 6];
                    item = Items_1[_i];
                    deleteCommand = new client_dynamodb_1.DeleteItemCommand({
                        TableName: dynamodb_1.TABLES.USERS,
                        Key: {
                            id: item.id
                        }
                    });
                    return [4 /*yield*/, dynamodb_1.docClient.send(deleteCommand)];
                case 4:
                    _a.sent();
                    console.log("Deleted user with ID: ".concat(item.id.S));
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log('Successfully cleared all users.');
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error('Error clearing users:', error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function clearTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var scanCommand, Items, _i, Items_2, item, deleteCommand, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting to clear tasks...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    scanCommand = new client_dynamodb_1.ScanCommand({
                        TableName: dynamodb_1.TABLES.TASKS
                    });
                    return [4 /*yield*/, dynamodb_1.docClient.send(scanCommand)];
                case 2:
                    Items = (_a.sent()).Items;
                    if (!Items || Items.length === 0) {
                        console.log('No tasks found to delete.');
                        return [2 /*return*/];
                    }
                    _i = 0, Items_2 = Items;
                    _a.label = 3;
                case 3:
                    if (!(_i < Items_2.length)) return [3 /*break*/, 6];
                    item = Items_2[_i];
                    deleteCommand = new client_dynamodb_1.DeleteItemCommand({
                        TableName: dynamodb_1.TABLES.TASKS,
                        Key: {
                            id: item.id
                        }
                    });
                    return [4 /*yield*/, dynamodb_1.docClient.send(deleteCommand)];
                case 4:
                    _a.sent();
                    console.log("Deleted task with ID: ".concat(item.id.S));
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log('Successfully cleared all tasks.');
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error('Error clearing tasks:', error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Run the clearing functions
function clear() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, clearUsers()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, clearTasks()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error during clearing:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
clear().catch(console.error);
