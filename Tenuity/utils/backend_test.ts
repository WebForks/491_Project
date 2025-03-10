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

// Adding user to the landlord table
const createUser = async (userEmail, userId) => {
  const { data, error } = await supabase.from("Landlords").insert({
    //id: userId,
    email: userEmail,
    first_name: "Jesse",
    last_name: "Pinkman",
    phone_number: "123-456-7890",
  });

  if (error) {
    console.log("Error while adding user to the table:", error);
    console.log(data);
  } else {
    console.log("Successfully created user!:", userEmail);
  }
};

// Signing up a test user with hard coded values
const signUpUser = async () => {
  //const { data, error } = await supabase.auth.signUp({
  //email: "joe@gmail.com",
  //password: "password",
  //});

  //if (error) {
  //console.log("Error:", error);
  //} else {
  // console.log("Successfully signed up user!");
  //}
  //
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "joe@gmail.com",
    password: "password",
  });

  //const { data, error } = await supabase.auth.getUser();
  const userEmail = data.user.email;
  const userId = data.user.id;
  console.log(userEmail);
  console.log(userId);

  if (data) {
    await createUser(userEmail, userId);
  }
};

// Calling function to complete manually insertion to the database
signUpUser();
