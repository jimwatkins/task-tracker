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
var express_1 = require("express");
var server_1 = require("@apollo/server");
var express4_1 = require("@apollo/server/express4");
var schema_1 = require("./schema");
var resolvers_1 = require("./resolvers");
var cors_1 = require("cors");
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var app, server, PORT_1, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting server initialization...');
                    console.log('TypeDefs:', schema_1.typeDefs);
                    console.log('Resolvers:', JSON.stringify(resolvers_1.resolvers, null, 2));
                    app = (0, express_1.default)();
                    console.log('Express app created');
                    // Enable CORS for all routes
                    app.use((0, cors_1.default)());
                    app.use(express_1.default.json());
                    server = new server_1.ApolloServer({
                        typeDefs: schema_1.typeDefs,
                        resolvers: resolvers_1.resolvers,
                        introspection: true,
                        csrfPrevention: false,
                        cache: 'bounded'
                    });
                    console.log('Apollo Server instance created');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, server.start()];
                case 2:
                    _a.sent();
                    console.log('Apollo Server started successfully');
                    // Mount the GraphQL middleware
                    app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
                        context: function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                console.log('Creating context...');
                                return [2 /*return*/, {}];
                            });
                        }); }
                    }));
                    console.log('GraphQL middleware configured');
                    PORT_1 = process.env.PORT || 4001;
                    app.listen(PORT_1, function () {
                        console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(PORT_1, "/graphql"));
                        console.log('Server is listening for requests...');
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error starting server:', error_1);
                    if (error_1 instanceof Error) {
                        console.error('Error name:', error_1.name);
                        console.error('Error message:', error_1.message);
                        console.error('Error stack:', error_1.stack);
                    }
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
console.log('Starting server...');
startServer().catch(function (error) {
    console.error('Failed to start server:', error);
    if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
    }
    process.exit(1);
});
