"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated "));
const notification_1 = require("../controller/notification");
const router = express_1.default.Router();
router.route('/').get(isAuthenticated_1.default, notification_1.getNotification);
exports.default = router;
