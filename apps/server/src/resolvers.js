"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
var dynamodb_1 = require("./db/dynamodb");
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var client_dynamodb_2 = require("@aws-sdk/client-dynamodb");
var client = new client_dynamodb_2.DynamoDBClient({
    region: 'local',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
    },
});
// Helper function to convert JavaScript values to DynamoDB AttributeValue
var toDynamoDBValue = function (value) {
    if (typeof value === 'number') {
        return { N: value.toString() };
    }
    if (typeof value === 'string') {
        return { S: value };
    }
    if (typeof value === 'boolean') {
        return { BOOL: value };
    }
    if (value === null || value === undefined) {
        return { NULL: true };
    }
    if (Array.isArray(value)) {
        return { L: value.map(toDynamoDBValue) };
    }
    if (typeof value === 'object') {
        return { M: Object.fromEntries(Object.entries(value).map(function (_a) {
                var k = _a[0], v = _a[1];
                return [k, toDynamoDBValue(v)];
            })) };
    }
    throw new Error("Unsupported value type: ".concat(typeof value));
};
// Helper function to convert DynamoDB item to Task
var convertDynamoItemToTask = function (item) {
    var _a, _b, _c, _d, _e, _f;
    return {
        id: Number(item.id.N),
        title: item.title.S,
        description: ((_a = item.description) === null || _a === void 0 ? void 0 : _a.S) || null,
        status: item.status.S,
        dueDate: ((_b = item.dueDate) === null || _b === void 0 ? void 0 : _b.S) || null,
        scheduledDate: ((_c = item.scheduledDate) === null || _c === void 0 ? void 0 : _c.S) || null,
        completionDate: ((_d = item.completionDate) === null || _d === void 0 ? void 0 : _d.S) || null,
        priority: ((_e = item.priority) === null || _e === void 0 ? void 0 : _e.S) || null,
        isRecurring: ((_f = item.isRecurring) === null || _f === void 0 ? void 0 : _f.BOOL) || false,
        assignedToId: item.assignedToId ? Number(item.assignedToId.N) : null,
        createdById: Number(item.createdById.N),
        tenantId: item.tenantId.S,
        createdAt: item.createdAt.S,
        updatedAt: item.updatedAt.S,
    };
};
// Helper function to convert DynamoDB item to User
var convertDynamoItemToUser = function (item) {
    return {
        id: Number(item.id.N),
        name: item.name.S,
        email: item.email.S,
        role: item.role.S,
        tenantId: item.tenantId.S,
    };
};
exports.resolvers = {
    Query: {
        tasks: function (_, _a) {
            var tenantId = _a.tenantId;
            return __awaiter(void 0, void 0, void 0, function () {
                var command, response, tasks, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("[Tasks Resolver] Starting task fetch for tenant: ".concat(tenantId));
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            console.log('[Tasks Resolver] Building QueryCommand with params:', {
                                TableName: dynamodb_1.TABLES.TASKS,
                                IndexName: 'TenantIndex',
                                KeyConditionExpression: '#tenantId = :tenantId',
                                ExpressionAttributeNames: {
                                    '#tenantId': 'tenantId',
                                },
                                ExpressionAttributeValues: {
                                    ':tenantId': toDynamoDBValue(tenantId),
                                },
                            });
                            command = new client_dynamodb_1.QueryCommand({
                                TableName: dynamodb_1.TABLES.TASKS,
                                IndexName: 'TenantIndex',
                                KeyConditionExpression: '#tenantId = :tenantId',
                                ExpressionAttributeNames: {
                                    '#tenantId': 'tenantId',
                                },
                                ExpressionAttributeValues: {
                                    ':tenantId': toDynamoDBValue(tenantId),
                                },
                            });
                            console.log('[Tasks Resolver] Sending QueryCommand to DynamoDB...');
                            return [4 /*yield*/, client.send(command)];
                        case 2:
                            response = _b.sent();
                            console.log('[Tasks Resolver] Raw DynamoDB response:', JSON.stringify(response, null, 2));
                            if (!response.Items || response.Items.length === 0) {
                                console.log('[Tasks Resolver] No tasks found in DynamoDB response');
                                return [2 /*return*/, []];
                            }
                            console.log("[Tasks Resolver] Found ".concat(response.Items.length, " raw items in DynamoDB response"));
                            tasks = (response.Items || []).map(function (item) {
                                console.log('[Tasks Resolver] Converting DynamoDB item to Task:', JSON.stringify(item, null, 2));
                                var task = convertDynamoItemToTask(item);
                                console.log('[Tasks Resolver] Converted Task:', JSON.stringify(task, null, 2));
                                return task;
                            });
                            console.log("[Tasks Resolver] Successfully converted ".concat(tasks.length, " tasks"));
                            // Fetch associated User objects for createdBy and assignedTo
                            console.log('[Tasks Resolver] Starting user resolution for tasks');
                            return [4 /*yield*/, Promise.all(tasks.map(function (task) { return __awaiter(void 0, void 0, void 0, function () {
                                    var createdByUserCommand, createdByUserResponse, createdBy, assignedTo, assignedToUserCommand, assignedToUserResponse, finalTask;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                console.log("[Tasks Resolver] Resolving users for task ID: ".concat(task.id, ", createdById: ").concat(task.createdById, ", assignedToId: ").concat(task.assignedToId));
                                                // Fetch createdBy User
                                                console.log("[Tasks Resolver] Fetching createdBy user with ID: ".concat(task.createdById));
                                                createdByUserCommand = new client_dynamodb_1.GetItemCommand({
                                                    TableName: dynamodb_1.TABLES.USERS,
                                                    Key: { id: toDynamoDBValue(task.createdById) },
                                                });
                                                console.log('[Tasks Resolver] CreatedBy GetItemCommand params:', JSON.stringify(createdByUserCommand.input, null, 2));
                                                return [4 /*yield*/, client.send(createdByUserCommand)];
                                            case 1:
                                                createdByUserResponse = _a.sent();
                                                console.log('[Tasks Resolver] CreatedBy DynamoDB response:', JSON.stringify(createdByUserResponse, null, 2));
                                                createdBy = createdByUserResponse.Item ? convertDynamoItemToUser(createdByUserResponse.Item) : undefined;
                                                console.log('[Tasks Resolver] Converted createdBy user:', JSON.stringify(createdBy, null, 2));
                                                if (!createdBy) {
                                                    console.error("[Tasks Resolver ERROR] createdBy user with ID ".concat(task.createdById, " not found for task ").concat(task.id));
                                                }
                                                assignedTo = null;
                                                if (!task.assignedToId) return [3 /*break*/, 3];
                                                console.log("[Tasks Resolver] Fetching assignedTo user with ID: ".concat(task.assignedToId));
                                                assignedToUserCommand = new client_dynamodb_1.GetItemCommand({
                                                    TableName: dynamodb_1.TABLES.USERS,
                                                    Key: { id: toDynamoDBValue(task.assignedToId) },
                                                });
                                                console.log('[Tasks Resolver] AssignedTo GetItemCommand params:', JSON.stringify(assignedToUserCommand.input, null, 2));
                                                return [4 /*yield*/, client.send(assignedToUserCommand)];
                                            case 2:
                                                assignedToUserResponse = _a.sent();
                                                console.log('[Tasks Resolver] AssignedTo DynamoDB response:', JSON.stringify(assignedToUserResponse, null, 2));
                                                assignedTo = assignedToUserResponse.Item ? convertDynamoItemToUser(assignedToUserResponse.Item) : undefined;
                                                console.log('[Tasks Resolver] Converted assignedTo user:', JSON.stringify(assignedTo, null, 2));
                                                if (!assignedTo) {
                                                    console.warn("[Tasks Resolver WARNING] assignedTo user with ID ".concat(task.assignedToId, " not found for task ").concat(task.id));
                                                }
                                                _a.label = 3;
                                            case 3:
                                                finalTask = __assign(__assign({}, task), { createdBy: createdBy, assignedTo: assignedTo });
                                                console.log('[Tasks Resolver] Final task with resolved users:', JSON.stringify(finalTask, null, 2));
                                                return [2 /*return*/, finalTask];
                                        }
                                    });
                                }); }))];
                        case 3:
                            tasks = _b.sent();
                            console.log("[Tasks Resolver] Successfully resolved all users for ".concat(tasks.length, " tasks"));
                            return [2 /*return*/, tasks];
                        case 4:
                            error_1 = _b.sent();
                            console.error('[Tasks Resolver ERROR] Error details:', {
                                message: error_1 instanceof Error ? error_1.message : 'Unknown error',
                                stack: error_1 instanceof Error ? error_1.stack : undefined,
                                error: error_1
                            });
                            throw new Error('Failed to fetch tasks with users.');
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        task: function (_, _a) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                var command, response, task, createdByUserCommand, createdByUserResponse, createdBy, assignedTo, assignedToUserCommand, assignedToUserResponse, finalTask, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // Temporary error test
                            if (id === 999) {
                                throw new Error('Test error: This is a simulated server error');
                            }
                            console.log("[Task Resolver] Fetching task with ID: ".concat(id));
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, , 7]);
                            command = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.TASKS,
                                Key: {
                                    id: toDynamoDBValue(id),
                                },
                            });
                            return [4 /*yield*/, client.send(command)];
                        case 2:
                            response = _b.sent();
                            console.log('[Task Resolver] DynamoDB Get Response:', JSON.stringify(response, null, 2));
                            if (!response.Item) {
                                console.warn("[Task Resolver WARNING] Task with ID ".concat(id, " not found."));
                                return [2 /*return*/, null];
                            }
                            task = convertDynamoItemToTask(response.Item);
                            console.log("[Task Resolver] Converted task:", task);
                            // Fetch createdBy User
                            console.log("[Task Resolver] Fetching createdBy user with ID: ".concat(task.createdById));
                            createdByUserCommand = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.USERS,
                                Key: { id: toDynamoDBValue(task.createdById) },
                            });
                            return [4 /*yield*/, client.send(createdByUserCommand)];
                        case 3:
                            createdByUserResponse = _b.sent();
                            createdBy = createdByUserResponse.Item ? convertDynamoItemToUser(createdByUserResponse.Item) : undefined;
                            if (!createdBy) {
                                console.error("[Task Resolver ERROR] createdBy user with ID ".concat(task.createdById, " not found for task ").concat(task.id));
                                throw new Error("User with ID ".concat(task.createdById, " not found."));
                            }
                            assignedTo = null;
                            if (!task.assignedToId) return [3 /*break*/, 5];
                            console.log("[Task Resolver] Fetching assignedTo user with ID: ".concat(task.assignedToId));
                            assignedToUserCommand = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.USERS,
                                Key: { id: toDynamoDBValue(task.assignedToId) },
                            });
                            return [4 /*yield*/, client.send(assignedToUserCommand)];
                        case 4:
                            assignedToUserResponse = _b.sent();
                            assignedTo = assignedToUserResponse.Item ? convertDynamoItemToUser(assignedToUserResponse.Item) : undefined;
                            if (!assignedTo) {
                                console.warn("[Task Resolver WARNING] assignedTo user with ID ".concat(task.assignedToId, " not found for task ").concat(task.id));
                            }
                            _b.label = 5;
                        case 5:
                            finalTask = __assign(__assign({}, task), { createdBy: createdBy, assignedTo: assignedTo });
                            console.log("[Task Resolver] Returning task with resolved users:", finalTask);
                            return [2 /*return*/, finalTask];
                        case 6:
                            error_2 = _b.sent();
                            console.error('[Task Resolver ERROR] Error fetching task from DynamoDB:', error_2);
                            throw new Error('Failed to fetch task.');
                        case 7: return [2 /*return*/];
                    }
                });
            });
        },
        users: function (_, _a) {
            var tenantId = _a.tenantId;
            return __awaiter(void 0, void 0, void 0, function () {
                var command, response, users, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("[Users Resolver] Fetching users for tenant: ".concat(tenantId));
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            command = new client_dynamodb_1.QueryCommand({
                                TableName: dynamodb_1.TABLES.USERS,
                                IndexName: 'TenantIndex',
                                KeyConditionExpression: '#tenantId = :tenantId',
                                ExpressionAttributeNames: {
                                    '#tenantId': 'tenantId',
                                },
                                ExpressionAttributeValues: {
                                    ':tenantId': toDynamoDBValue(tenantId),
                                },
                            });
                            return [4 /*yield*/, client.send(command)];
                        case 2:
                            response = _b.sent();
                            console.log('[Users Resolver] DynamoDB Query Response (Users):', JSON.stringify(response, null, 2));
                            users = (response.Items || []).map(convertDynamoItemToUser);
                            console.log("[Users Resolver] Returning ".concat(users.length, " users for tenant: ").concat(tenantId));
                            return [2 /*return*/, users];
                        case 3:
                            error_3 = _b.sent();
                            console.error('[Users Resolver ERROR] Error fetching users from DynamoDB:', error_3);
                            throw new Error('Failed to fetch users.');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        user: function (_, _a) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                var command, response, user, error_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("[User Resolver] Fetching user with ID: ".concat(id));
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            command = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.USERS,
                                Key: {
                                    id: toDynamoDBValue(id),
                                },
                            });
                            return [4 /*yield*/, client.send(command)];
                        case 2:
                            response = _b.sent();
                            console.log('[User Resolver] DynamoDB Get Response (User):', JSON.stringify(response, null, 2));
                            if (!response.Item) {
                                console.warn("[User Resolver WARNING] User with ID ".concat(id, " not found."));
                                return [2 /*return*/, null];
                            }
                            user = convertDynamoItemToUser(response.Item);
                            console.log("[User Resolver] Returning user:", user);
                            return [2 /*return*/, user];
                        case 3:
                            error_4 = _b.sent();
                            console.error('[User Resolver ERROR] Error fetching user from DynamoDB:', error_4);
                            throw new Error('Failed to fetch user.');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    },
    Mutation: {
        createTask: function (_, _a) {
            var input = _a.input;
            return __awaiter(void 0, void 0, void 0, function () {
                var scanCommand, scanResponse, existingIds, taskId, createdByUserCommand, createdByUserResponse, createdBy, now, newTask, command, assignedTo, assignedToUserCommand, assignedToUserResponse, error_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('[createTask Mutation] Input:', input);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, , 8]);
                            scanCommand = new client_dynamodb_1.ScanCommand({
                                TableName: dynamodb_1.TABLES.TASKS,
                                ProjectionExpression: 'id',
                            });
                            return [4 /*yield*/, client.send(scanCommand)];
                        case 2:
                            scanResponse = _b.sent();
                            existingIds = (scanResponse.Items || []).map(function (item) { return Number(item.id.N); });
                            taskId = Math.max.apply(Math, __spreadArray([0], existingIds, false)) + 1;
                            createdByUserCommand = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.USERS,
                                Key: { id: toDynamoDBValue(input.createdById) },
                            });
                            return [4 /*yield*/, client.send(createdByUserCommand)];
                        case 3:
                            createdByUserResponse = _b.sent();
                            createdBy = createdByUserResponse.Item ? convertDynamoItemToUser(createdByUserResponse.Item) : undefined;
                            if (!createdBy) {
                                throw new Error("User with ID ".concat(input.createdById, " not found."));
                            }
                            now = new Date().toISOString();
                            newTask = {
                                id: taskId,
                                title: input.title,
                                description: input.description || null,
                                status: input.status,
                                dueDate: input.dueDate || null,
                                scheduledDate: input.scheduledDate || null,
                                completionDate: null,
                                priority: input.priority || null,
                                isRecurring: input.isRecurring || false,
                                assignedToId: input.assignedToId || null,
                                createdById: input.createdById,
                                tenantId: input.tenantId,
                                createdAt: now,
                                updatedAt: now,
                            };
                            command = new client_dynamodb_1.PutItemCommand({
                                TableName: dynamodb_1.TABLES.TASKS,
                                Item: Object.fromEntries(Object.entries(newTask).map(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return [key, toDynamoDBValue(value)];
                                })),
                            });
                            return [4 /*yield*/, client.send(command)];
                        case 4:
                            _b.sent();
                            console.log("[createTask Mutation] Task created successfully with ID: ".concat(taskId));
                            assignedTo = null;
                            if (!input.assignedToId) return [3 /*break*/, 6];
                            assignedToUserCommand = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.USERS,
                                Key: { id: toDynamoDBValue(input.assignedToId) },
                            });
                            return [4 /*yield*/, client.send(assignedToUserCommand)];
                        case 5:
                            assignedToUserResponse = _b.sent();
                            assignedTo = assignedToUserResponse.Item ? convertDynamoItemToUser(assignedToUserResponse.Item) : undefined;
                            if (!assignedTo) {
                                console.warn("[createTask Mutation WARNING] assignedTo user with ID ".concat(input.assignedToId, " not found."));
                            }
                            _b.label = 6;
                        case 6: return [2 /*return*/, __assign(__assign({}, newTask), { createdBy: createdBy, assignedTo: assignedTo })];
                        case 7:
                            error_5 = _b.sent();
                            console.error('[createTask Mutation ERROR] Error creating task:', error_5);
                            throw new Error('Failed to create task.');
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
        updateTask: function (_, _a) {
            var input = _a.input;
            return __awaiter(void 0, void 0, void 0, function () {
                var getCommand, getResponse, currentTask, now, updateExpressions_1, expressionAttributeNames_1, expressionAttributeValues_1, addUpdateExpression, command, response, updatedTask, createdByUserCommand, createdByUserResponse, createdBy, assignedTo, assignedToUserCommand, assignedToUserResponse, error_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("[updateTask Mutation] Updating task with input:", input);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, , 8]);
                            getCommand = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.TASKS,
                                Key: {
                                    id: toDynamoDBValue(input.id),
                                },
                            });
                            return [4 /*yield*/, client.send(getCommand)];
                        case 2:
                            getResponse = _b.sent();
                            if (!getResponse.Item) {
                                throw new Error("Task with ID ".concat(input.id, " not found."));
                            }
                            currentTask = convertDynamoItemToTask(getResponse.Item);
                            now = new Date().toISOString();
                            updateExpressions_1 = [];
                            expressionAttributeNames_1 = {};
                            expressionAttributeValues_1 = {};
                            addUpdateExpression = function (key, value) {
                                var attributeName = "#".concat(key);
                                var attributeValue = ":".concat(key);
                                expressionAttributeNames_1[attributeName] = key;
                                expressionAttributeValues_1[attributeValue] = toDynamoDBValue(value);
                                updateExpressions_1.push("".concat(attributeName, " = ").concat(attributeValue));
                            };
                            // Add update expressions for each field that is provided in the input
                            if (input.title !== undefined)
                                addUpdateExpression('title', input.title);
                            if (input.description !== undefined)
                                addUpdateExpression('description', input.description);
                            if (input.status !== undefined)
                                addUpdateExpression('status', input.status);
                            if (input.dueDate !== undefined)
                                addUpdateExpression('dueDate', input.dueDate);
                            if (input.scheduledDate !== undefined)
                                addUpdateExpression('scheduledDate', input.scheduledDate);
                            if (input.completionDate !== undefined)
                                addUpdateExpression('completionDate', input.completionDate);
                            if (input.priority !== undefined)
                                addUpdateExpression('priority', input.priority);
                            if (input.isRecurring !== undefined)
                                addUpdateExpression('isRecurring', input.isRecurring);
                            if (input.assignedToId !== undefined)
                                addUpdateExpression('assignedToId', input.assignedToId);
                            addUpdateExpression('updatedAt', now);
                            command = new client_dynamodb_1.UpdateItemCommand({
                                TableName: dynamodb_1.TABLES.TASKS,
                                Key: {
                                    id: toDynamoDBValue(input.id),
                                },
                                UpdateExpression: "SET ".concat(updateExpressions_1.join(', ')),
                                ExpressionAttributeNames: expressionAttributeNames_1,
                                ExpressionAttributeValues: expressionAttributeValues_1,
                                ReturnValues: 'ALL_NEW',
                            });
                            return [4 /*yield*/, client.send(command)];
                        case 3:
                            response = _b.sent();
                            console.log('[updateTask Mutation] DynamoDB Update Response:', JSON.stringify(response, null, 2));
                            if (!response.Attributes) {
                                throw new Error('Failed to update task.');
                            }
                            updatedTask = convertDynamoItemToTask(response.Attributes);
                            createdByUserCommand = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.USERS,
                                Key: { id: toDynamoDBValue(updatedTask.createdById) },
                            });
                            return [4 /*yield*/, client.send(createdByUserCommand)];
                        case 4:
                            createdByUserResponse = _b.sent();
                            createdBy = createdByUserResponse.Item ? convertDynamoItemToUser(createdByUserResponse.Item) : undefined;
                            assignedTo = null;
                            if (!(updatedTask.assignedToId != null)) return [3 /*break*/, 6];
                            assignedToUserCommand = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.USERS,
                                Key: { id: toDynamoDBValue(updatedTask.assignedToId) },
                            });
                            return [4 /*yield*/, client.send(assignedToUserCommand)];
                        case 5:
                            assignedToUserResponse = _b.sent();
                            assignedTo = assignedToUserResponse.Item ? convertDynamoItemToUser(assignedToUserResponse.Item) : undefined;
                            _b.label = 6;
                        case 6: return [2 /*return*/, __assign(__assign({}, updatedTask), { createdBy: createdBy, assignedTo: assignedTo })];
                        case 7:
                            error_6 = _b.sent();
                            console.error('[updateTask Mutation ERROR] Error updating task:', error_6);
                            throw new Error('Failed to update task.');
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
        deleteTask: function (_, _a) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                var getCommand, getResponse, command, error_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("[deleteTask Mutation] Deleting task with ID: ".concat(id));
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            getCommand = new client_dynamodb_1.GetItemCommand({
                                TableName: dynamodb_1.TABLES.TASKS,
                                Key: { id: toDynamoDBValue(id) },
                            });
                            return [4 /*yield*/, client.send(getCommand)];
                        case 2:
                            getResponse = _b.sent();
                            if (!getResponse.Item) {
                                console.warn("[deleteTask Mutation WARNING] Task with ID ".concat(id, " not found for deletion."));
                                return [2 /*return*/, false];
                            }
                            command = new client_dynamodb_1.DeleteItemCommand({
                                TableName: dynamodb_1.TABLES.TASKS,
                                Key: {
                                    id: toDynamoDBValue(id),
                                },
                            });
                            return [4 /*yield*/, client.send(command)];
                        case 3:
                            _b.sent();
                            console.log("[deleteTask Mutation] Task deleted successfully with ID: ".concat(id));
                            return [2 /*return*/, true];
                        case 4:
                            error_7 = _b.sent();
                            console.error('[deleteTask Mutation ERROR] Error deleting task:', error_7);
                            throw new Error('Failed to delete task.');
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
    },
    // Add resolver for the Priority enum (optional, but good practice)
    Priority: {
        LOW: 'LOW',
        MEDIUM: 'MEDIUM',
        HIGH: 'HIGH',
    },
    // Add resolvers for Task fields that require special handling (like User resolution)
    Task: {
        createdBy: function (task) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // createdBy is already resolved in the parent task query/mutation resolvers
                // This resolver is here mainly for type safety and clarity
                return [2 /*return*/, task.createdBy];
            });
        }); },
        assignedTo: function (task) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // assignedTo is already resolved in the parent task query/mutation resolvers
                // This resolver is here mainly for type safety and clarity
                return [2 /*return*/, task.assignedTo];
            });
        }); },
        // Add resolvers for new fields if they require formatting or special logic
        scheduledDate: function (task) { return task.scheduledDate || null; },
        completionDate: function (task) { return task.completionDate || null; },
        priority: function (task) { return task.priority || null; },
        isRecurring: function (task) { return task.isRecurring || false; },
    },
    User: {
        id: function (user) { return typeof user.id === 'string' ? parseInt(user.id) : user.id; },
    }
};
