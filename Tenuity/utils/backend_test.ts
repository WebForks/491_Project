import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tedyjfkbdwhziszwjmgl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZHlqZmtiZHdoemlzendqbWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODE2MzgsImV4cCI6MjA1Njg1NzYzOH0.IuSjZGMdcgYO1yy-n4FBHs7XCW1N9mjTvZEjwmFjTvI";

// Initializing connection to the database
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Adding user to the landlord tabl
const createUser = async (user) => {
  const { error } = await supabase.from("Landlords").insert([
    {
      id: user.id,
      email: user.email,
      password: user.password,
      first_name: "Jesse",
      last_name: "Pinkman",
      phone_number: "123-456-7890",
    },
  ]);

  if (error) {
    console.log("Error while adding user to the table:", error);
  } else {
    console.log("Successfully created user!:", user.email);
  }
};

// Signing up a test user with hard coded values
const signUpUser = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: "jessepinkman@gmail.com",
    password: "password",
    email_confirm: false,
  });

  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Successfully signed up user!");
  }
  const user = data.user;

  if (user) {
    await createUser(user);
  }
};

// Calling function to complete manually insertion to the database
signUpUser();
