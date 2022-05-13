"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPABASE_ANON_KEY = exports.SUPABASE_URL = exports.JWT_SECRET = exports.DB_PASSWORD = exports.DB_USER = exports.DB_PORT = exports.DB_NAME = exports.DB_HOST = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
_a = process.env, exports.PORT = _a.PORT, exports.DB_HOST = _a.DB_HOST, exports.DB_NAME = _a.DB_NAME, exports.DB_PORT = _a.DB_PORT, exports.DB_USER = _a.DB_USER, exports.DB_PASSWORD = _a.DB_PASSWORD, exports.JWT_SECRET = _a.JWT_SECRET, exports.SUPABASE_URL = _a.SUPABASE_URL, exports.SUPABASE_ANON_KEY = _a.SUPABASE_ANON_KEY;
