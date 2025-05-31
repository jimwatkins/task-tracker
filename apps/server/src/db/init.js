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
var client_dynamodb_2 = require("@aws-sdk/client-dynamodb");
var dynamodb_1 = require("./dynamodb");
var child_process_1 = require("child_process");
var client = new client_dynamodb_2.DynamoDBClient({
    region: 'local',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
    },
});
function dropTables() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Dropping tables...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.send(new client_dynamodb_1.DeleteTableCommand({ TableName: dynamodb_1.TABLES.USERS }))];
                case 2:
                    _a.sent();
                    console.log("".concat(dynamodb_1.TABLES.USERS, " table dropped successfully."));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.name === 'ResourceNotFoundException') {
                        console.warn("".concat(dynamodb_1.TABLES.USERS, " table not found. Skipping drop."));
                    }
                    else {
                        console.error("Error dropping ".concat(dynamodb_1.TABLES.USERS, " table:"), error_1);
                        throw error_1; // Re-throw other errors
                    }
                    return [3 /*break*/, 4];
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, client.send(new client_dynamodb_1.DeleteTableCommand({ TableName: dynamodb_1.TABLES.TASKS }))];
                case 5:
                    _a.sent();
                    console.log("".concat(dynamodb_1.TABLES.TASKS, " table dropped successfully."));
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    if (error_2.name === 'ResourceNotFoundException') {
                        console.warn("".concat(dynamodb_1.TABLES.TASKS, " table not found. Skipping drop."));
                    }
                    else {
                        console.error("Error dropping ".concat(dynamodb_1.TABLES.TASKS, " table:"), error_2);
                        throw error_2; // Re-throw other errors
                    }
                    return [3 /*break*/, 7];
                case 7:
                    console.log('Finished dropping tables.');
                    return [2 /*return*/];
            }
        });
    });
}
function createTables() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Creating Users table...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.send(new client_dynamodb_1.CreateTableCommand({
                            TableName: dynamodb_1.TABLES.USERS,
                            KeySchema: [
                                { AttributeName: 'id', KeyType: 'HASH' },
                            ],
                            AttributeDefinitions: [
                                { AttributeName: 'id', AttributeType: 'N' },
                                { AttributeName: 'tenantId', AttributeType: 'S' },
                            ],
                            GlobalSecondaryIndexes: [
                                {
                                    IndexName: 'TenantIndex',
                                    KeySchema: [
                                        { AttributeName: 'tenantId', KeyType: 'HASH' },
                                    ],
                                    Projection: { ProjectionType: 'ALL' },
                                    ProvisionedThroughput: {
                                        ReadCapacityUnits: 5,
                                        WriteCapacityUnits: 5,
                                    },
                                },
                            ],
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 5,
                                WriteCapacityUnits: 5,
                            },
                        }))];
                case 2:
                    _a.sent();
                    console.log('Users table created successfully');
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    if (error_3.name === 'ResourceInUseException') {
                        console.warn('Users table already exists. Skipping creation.');
                    }
                    else {
                        console.error('Error creating Users table:', error_3);
                        throw error_3; // Re-throw other errors
                    }
                    return [3 /*break*/, 4];
                case 4:
                    console.log('Creating Tasks table...');
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, client.send(new client_dynamodb_1.CreateTableCommand({
                            TableName: dynamodb_1.TABLES.TASKS,
                            KeySchema: [
                                { AttributeName: 'id', KeyType: 'HASH' },
                            ],
                            AttributeDefinitions: [
                                { AttributeName: 'id', AttributeType: 'N' },
                                { AttributeName: 'tenantId', AttributeType: 'S' },
                            ],
                            GlobalSecondaryIndexes: [
                                {
                                    IndexName: 'TenantIndex',
                                    KeySchema: [
                                        { AttributeName: 'tenantId', KeyType: 'HASH' },
                                    ],
                                    Projection: { ProjectionType: 'ALL' },
                                    ProvisionedThroughput: {
                                        ReadCapacityUnits: 5,
                                        WriteCapacityUnits: 5,
                                    },
                                },
                            ],
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 5,
                                WriteCapacityUnits: 5,
                            },
                        }))];
                case 6:
                    _a.sent();
                    console.log('Tasks table created successfully');
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _a.sent();
                    if (error_4.name === 'ResourceInUseException') {
                        console.warn('Tasks table already exists. Skipping creation.');
                    }
                    else {
                        console.error('Error creating Tasks table:', error_4);
                        throw error_4; // Re-throw other errors
                    }
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var shouldDropTables, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shouldDropTables = process.argv.includes('--drop');
                    if (!shouldDropTables) return [3 /*break*/, 2];
                    return [4 /*yield*/, dropTables()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, createTables()];
                case 3:
                    _a.sent();
                    // Call the seed script
                    console.log('Starting to seed data...');
                    (0, child_process_1.exec)('npx ts-node src/db/seed.ts', function (error, stdout, stderr) {
                        if (error) {
                            console.error("Error seeding data: ".concat(error.message));
                            return;
                        }
                        if (stderr) {
                            console.error("Seed script stderr: ".concat(stderr));
                            return;
                        }
                        console.log("Seed script stdout:\n".concat(stdout));
                        console.log('Data seeding finished.');
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    console.error('Error initializing database:', error_5);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
init();
