"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_schemas_1 = require("../schemas/auth.schemas");
const router = express_1.default.Router();
router.post('/signup', (0, validation_middleware_1.validate)(auth_schemas_1.signupSchema), auth_controller_1.signup);
router.get('/verify-email/:token', (0, validation_middleware_1.validate)(auth_schemas_1.verifyEmailSchema), auth_controller_1.verifyEmail);
router.post('/login', (0, validation_middleware_1.validate)(auth_schemas_1.loginSchema), auth_controller_1.login);
router.post('/forgot-password', (0, validation_middleware_1.validate)(auth_schemas_1.forgotPasswordSchema), auth_controller_1.forgotPassword);
router.post('/reset-password/:token', (0, validation_middleware_1.validate)(auth_schemas_1.resetPasswordSchema), auth_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map