"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcome = void 0;
const welcome = (req, res) => {
    res.json({
        message: 'Task Management API',
        status: 'OK',
        uptime: process.uptime()
    });
};
exports.welcome = welcome;
//# sourceMappingURL=index.controller.js.map