import supabase from "./supabase";

export interface User {
  email: string;
  password: string;
}

export async function login({ email, password }: User) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export default login;
