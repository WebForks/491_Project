import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ixspfaizwlkvzozfaiyx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZHlqZmtiZHdoemlzendqbWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODE2MzgsImV4cCI6MjA1Njg1NzYzOH0.IuSjZGMdcgYO1yy-n4FBHs7XCW1N9mjTvZEjwmFjTvI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
