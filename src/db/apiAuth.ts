import supabase, { supabaseUrl } from "./supabase";

export interface User {
  email: string;
  password: string;
}

export interface UserSignup {
  email: string;
  name: string;
  password: string;
  profile_pic: string | null;
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

export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session.session) {
    return null;
  }
  if (error) {
    throw new Error(error.message);
  }

  return session.session?.user;
}

export async function signup({
  name,
  email,
  password,
  profile_pic,
}: UserSignup) {
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from("profile_pic")
    .upload(fileName, profile_pic as string);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile_pic: `${supabaseUrl}/storage/v1/object/profile_pic/${fileName}`,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
