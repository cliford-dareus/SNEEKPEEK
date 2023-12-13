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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./lib/socket/socket"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const ioServer = new socket_io_1.Server(httpServer, {
    cors: { origin: "http://localhost:5173" },
});
const auth_1 = __importDefault(require("./router/auth"));
const post_1 = __importDefault(require("./router/post"));
const comment_1 = __importDefault(require("./router/comment"));
const user_1 = __importDefault(require("./router/user"));
const conversation_1 = __importDefault(require("./router/conversation"));
const message_1 = __importDefault(require("./router/message"));
const notification_1 = __importDefault(require("./router/notification"));
const connect_1 = __importDefault(require("./db/connect"));
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("combined"));
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/post", post_1.default);
app.use("/api/v1/comment", comment_1.default);
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/conversation", conversation_1.default);
app.use("/api/v1/message", message_1.default);
app.use("/api/v1/notification", notification_1.default);
const PORT = process.env.PORT || 4000;
ioServer.use((socket, next) => {
    console.log(socket.handshake.auth);
    const username = socket.handshake.auth.name;
    const userId = socket.handshake.auth.id;
    if (!username || !userId) {
        return;
    }
    // @ts-ignore
    socket.username = username;
    // @ts-ignore
    socket.userId = userId;
    next();
});
(0, socket_1.default)(ioServer);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.default)(process.env.MONGO_URI);
        httpServer.listen(PORT, () => {
            console.log("Listening on port " + PORT);
        });
    }
    catch (error) { }
});
start();
