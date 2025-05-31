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
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var dynamodb_1 = require("./dynamodb");
var readline_1 = require("readline");
var client = new client_dynamodb_1.DynamoDBClient({
    region: 'local',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
    },
});
var docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
var rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
function listUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var command, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = new client_dynamodb_1.ScanCommand({ TableName: dynamodb_1.TABLES.USERS });
                    return [4 /*yield*/, docClient.send(command)];
                case 1:
                    response = _a.sent();
                    console.log('Users:', JSON.stringify(response.Items, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
function listTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var command, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = new client_dynamodb_1.ScanCommand({ TableName: dynamodb_1.TABLES.TASKS });
                    return [4 /*yield*/, docClient.send(command)];
                case 1:
                    response = _a.sent();
                    console.log('Tasks:', JSON.stringify(response.Items, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
function addUser() {
    return __awaiter(this, void 0, void 0, function () {
        var id, name, email, role, tenantId, command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, question('Enter user ID: ')];
                case 1:
                    id = _a.sent();
                    return [4 /*yield*/, question('Enter name: ')];
                case 2:
                    name = _a.sent();
                    return [4 /*yield*/, question('Enter email: ')];
                case 3:
                    email = _a.sent();
                    return [4 /*yield*/, question('Enter role (ADMIN/MANAGER/USER): ')];
                case 4:
                    role = _a.sent();
                    return [4 /*yield*/, question('Enter tenant ID: ')];
                case 5:
                    tenantId = _a.sent();
                    command = new client_dynamodb_1.PutItemCommand({
                        TableName: dynamodb_1.TABLES.USERS,
                        Item: {
                            id: { S: id },
                            name: { S: name },
                            email: { S: email },
                            role: { S: role },
                            tenantId: { S: tenantId }
                        }
                    });
                    return [4 /*yield*/, docClient.send(command)];
                case 6:
                    _a.sent();
                    console.log('User added successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
function addTask() {
    return __awaiter(this, void 0, void 0, function () {
        var id, _a, title, description, status, dueDate, assignedToId, _b, createdById, _c, tenantId, now, command;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = parseInt;
                    return [4 /*yield*/, question('Enter task ID: ')];
                case 1:
                    id = _a.apply(void 0, [_d.sent()]);
                    return [4 /*yield*/, question('Enter title: ')];
                case 2:
                    title = _d.sent();
                    return [4 /*yield*/, question('Enter description: ')];
                case 3:
                    description = _d.sent();
                    return [4 /*yield*/, question('Enter status (NOT_STARTED/IN_PROGRESS/COMPLETED): ')];
                case 4:
                    status = _d.sent();
                    return [4 /*yield*/, question('Enter due date (YYYY-MM-DD): ')];
                case 5:
                    dueDate = _d.sent();
                    _b = parseInt;
                    return [4 /*yield*/, question('Enter assigned user ID: ')];
                case 6:
                    assignedToId = _b.apply(void 0, [_d.sent()]);
                    _c = parseInt;
                    return [4 /*yield*/, question('Enter creator user ID: ')];
                case 7:
                    createdById = _c.apply(void 0, [_d.sent()]);
                    return [4 /*yield*/, question('Enter tenant ID: ')];
                case 8:
                    tenantId = _d.sent();
                    now = new Date().toISOString();
                    command = new client_dynamodb_1.PutItemCommand({
                        TableName: dynamodb_1.TABLES.TASKS,
                        Item: {
                            id: { N: id.toString() },
                            title: { S: title },
                            description: { S: description },
                            status: { S: status },
                            dueDate: { S: dueDate },
                            assignedToId: { N: assignedToId.toString() },
                            createdById: { N: createdById.toString() },
                            tenantId: { S: tenantId },
                            createdAt: { S: now },
                            updatedAt: { S: now }
                        }
                    });
                    return [4 /*yield*/, docClient.send(command)];
                case 9:
                    _d.sent();
                    console.log('Task added successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
function question(query) {
    return new Promise(function (resolve) {
        rl.question(query, resolve);
    });
}
function showMenu() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('\nDynamoDB Browser');
                    console.log('1. List Users');
                    console.log('2. List Tasks');
                    console.log('3. Add User');
                    console.log('4. Add Task');
                    console.log('5. Exit');
                    return [4 /*yield*/, question('\nEnter your choice (1-5): ')];
                case 1:
                    choice = _b.sent();
                    _a = choice;
                    switch (_a) {
                        case '1': return [3 /*break*/, 2];
                        case '2': return [3 /*break*/, 4];
                        case '3': return [3 /*break*/, 6];
                        case '4': return [3 /*break*/, 8];
                        case '5': return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 11];
                case 2: return [4 /*yield*/, listUsers()];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 4: return [4 /*yield*/, listTasks()];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 6: return [4 /*yield*/, addUser()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 8: return [4 /*yield*/, addTask()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 10:
                    rl.close();
                    process.exit(0);
                    _b.label = 11;
                case 11:
                    console.log('Invalid choice!');
                    _b.label = 12;
                case 12: return [4 /*yield*/, showMenu()];
                case 13:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
showMenu().catch(console.error);
