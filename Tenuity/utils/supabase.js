"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
require("react-native-url-polyfill/auto");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = "https://tedyjfkbdwhziszwjmgl.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZHlqZmtiZHdoemlzendqbWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODE2MzgsImV4cCI6MjA1Njg1NzYzOH0.IuSjZGMdcgYO1yy-n4FBHs7XCW1N9mjTvZEjwmFjTvI";
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: async_storage_1.default,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
