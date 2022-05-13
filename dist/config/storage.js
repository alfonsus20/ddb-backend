"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const _1 = require(".");
const supabaseUrl = _1.SUPABASE_URL;
const supabaseAnonKey = _1.SUPABASE_ANON_KEY;
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
exports.default = supabase.storage;
