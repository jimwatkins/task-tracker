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
var exampleUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        tenantId: 'tenant1'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'MANAGER',
        tenantId: 'tenant1'
    },
    {
        id: 3,
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'USER',
        tenantId: 'tenant1'
    }
];
var exampleTasks = [
    {
        id: 1,
        title: 'Lawn Mowing',
        description: 'Mow the front and back lawns and trim the edges.',
        status: 'COMPLETED',
        dueDate: '2024-06-10',
        scheduledDate: '2024-06-08',
        completionDate: '2024-06-10',
        priority: 'MEDIUM',
        isRecurring: true,
        assignedToId: 2,
        createdById: 1,
        tenantId: 'tenant1'
    },
    {
        id: 2,
        title: 'HVAC System Inspection',
        description: 'Annual inspection and maintenance of the HVAC system.',
        status: 'IN_PROGRESS',
        dueDate: '2024-06-15',
        scheduledDate: '2024-06-14',
        completionDate: null,
        priority: 'HIGH',
        isRecurring: false,
        assignedToId: 3,
        createdById: 1,
        tenantId: 'tenant1'
    },
    {
        id: 3,
        title: 'Roof Leak Repair',
        description: 'Fix the leak above the kitchen area and inspect for further damage.',
        status: 'NOT_STARTED',
        dueDate: '2024-06-20',
        scheduledDate: '2024-06-18',
        completionDate: null,
        priority: 'HIGH',
        isRecurring: false,
        assignedToId: 2,
        createdById: 1,
        tenantId: 'tenant1'
    },
    {
        id: 4,
        title: 'Pest Control Treatment',
        description: 'Schedule pest control service for ants and spiders.',
        status: 'IN_PROGRESS',
        dueDate: '2024-06-18',
        scheduledDate: '2024-06-17',
        completionDate: null,
        priority: 'LOW',
        isRecurring: true,
        assignedToId: 3,
        createdById: 1,
        tenantId: 'tenant1'
    }
];
function seedUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, exampleUsers_1, user, item, command, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting to seed users...');
                    _i = 0, exampleUsers_1 = exampleUsers;
                    _a.label = 1;
                case 1:
                    if (!(_i < exampleUsers_1.length)) return [3 /*break*/, 6];
                    user = exampleUsers_1[_i];
                    item = {
                        id: { N: user.id.toString() },
                        name: { S: user.name },
                        email: { S: user.email },
                        role: { S: user.role },
                        tenantId: { S: user.tenantId }
                    };
                    command = new client_dynamodb_1.PutItemCommand({
                        TableName: dynamodb_1.TABLES.USERS,
                        Item: item,
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, dynamodb_1.docClient.send(command)];
                case 3:
                    _a.sent();
                    console.log("Successfully seeded user: ".concat(user.name));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error seeding user ".concat(user.name, ":"), error_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log('Finished seeding users.');
                    return [2 /*return*/];
            }
        });
    });
}
function seedTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, exampleTasks_1, task, now, item, command, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting to seed tasks...');
                    _i = 0, exampleTasks_1 = exampleTasks;
                    _a.label = 1;
                case 1:
                    if (!(_i < exampleTasks_1.length)) return [3 /*break*/, 6];
                    task = exampleTasks_1[_i];
                    now = new Date().toISOString();
                    item = {
                        id: { N: task.id.toString() },
                        title: { S: task.title },
                        status: { S: task.status },
                        tenantId: { S: task.tenantId },
                        createdById: { N: task.createdById.toString() },
                        createdAt: { S: now },
                        updatedAt: { S: now }
                    };
                    if (task.description !== null && task.description !== undefined)
                        item.description = { S: task.description };
                    if (task.dueDate !== null && task.dueDate !== undefined)
                        item.dueDate = { S: task.dueDate };
                    if (task.assignedToId !== null && task.assignedToId !== undefined)
                        item.assignedToId = { N: task.assignedToId.toString() };
                    if (task.scheduledDate !== null && task.scheduledDate !== undefined)
                        item.scheduledDate = { S: task.scheduledDate };
                    if (task.completionDate !== null && task.completionDate !== undefined)
                        item.completionDate = { S: task.completionDate };
                    if (task.priority !== null && task.priority !== undefined)
                        item.priority = { S: task.priority };
                    if (task.isRecurring !== undefined && task.isRecurring !== null)
                        item.isRecurring = { BOOL: task.isRecurring };
                    command = new client_dynamodb_1.PutItemCommand({
                        TableName: dynamodb_1.TABLES.TASKS,
                        Item: item,
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, dynamodb_1.docClient.send(command)];
                case 3:
                    _a.sent();
                    console.log("Successfully seeded task: ".concat(task.title));
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error seeding task ".concat(task.title, ":"), error_2);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log('Finished seeding tasks.');
                    return [2 /*return*/];
            }
        });
    });
}
// Run the seeding functions
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, seedUsers()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, seedTasks()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error during seeding:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
seed().catch(console.error);
