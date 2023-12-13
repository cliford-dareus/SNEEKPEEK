"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
var status;
(function (status) {
    status[status["READ"] = 0] = "READ";
    status[status["RECIEVED"] = 1] = "RECIEVED";
    status[status["DELIVERED"] = 2] = "DELIVERED";
})(status || (exports.status = status = {}));
var TYPE;
(function (TYPE) {
    TYPE[TYPE["FOLLOW"] = 0] = "FOLLOW";
    TYPE[TYPE["TAG"] = 1] = "TAG";
    TYPE[TYPE["LIKE"] = 2] = "LIKE";
    TYPE[TYPE["COMMENT"] = 3] = "COMMENT";
})(TYPE || (TYPE = {}));
