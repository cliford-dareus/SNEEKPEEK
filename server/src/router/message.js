"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated "));
const message_1 = require("../controller/message");
const router = express_1.default.Router();
router
    .route("/:id")
    .get(isAuthenticated_1.default, message_1.getAllMessage)
    .post(isAuthenticated_1.default, message_1.addNewMessage);
router.route("/status/:channelId").patch(isAuthenticated_1.default, message_1.updateMessageStatus);
exports.default = router;
