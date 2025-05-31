"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TABLES = exports.docClient = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var isLocal = process.env.NODE_ENV === 'development';
var client = new client_dynamodb_1.DynamoDBClient({
    region: 'local',
    endpoint: isLocal ? 'http://localhost:8000' : undefined,
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
    },
});
exports.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
// Table names
exports.TABLES = {
    TASKS: 'Tasks',
    USERS: 'Users',
};
