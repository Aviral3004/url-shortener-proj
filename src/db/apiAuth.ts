import supabase, { supabaseUrl } from "./supabase";
import { supabaseAdmin } from "./supabase";
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

  if (data.user) {
    const { error: profileError } = await supabase
      .from("profile_images")
      .insert({
        user_id: data.user.id,
        profile_img_path: fileName,
      });

    if (profileError) {
      throw new Error(profileError.message);
    }
  }

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteUserAndResources(user_id: string) {
  try {
    //* Fetching all files related to that user (profile_pic and qr images)
    const { data: profileImages, error: profileError } = await supabase
      .from("profile_images")
      .select("profile_img_path")
      .eq("user_id", user_id);

    if (profileError) {
      throw profileError;
    }

    const { data: qrImages, error: qrError } = await supabase
      .from("qr_images")
      .select("qr_img_path")
      .eq("user_id", user_id);

    if (qrError) {
      console.log("could not fetch qr images");
      throw qrError;
    }

    //* Deletion from storage (profile_pic and qrs)
    if (profileImages && profileImages.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("profile_pic")
        .remove(profileImages.map((file) => file.profile_img_path));

      if (storageError) {
        throw storageError;
      }
    }

    if (qrImages && qrImages.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("qrs")
        .remove(qrImages.map((file) => file.qr_img_path));

      if (storageError) {
        throw storageError;
      }
    }

    //* Deleting all rows related to the user_id from profile_images and qr_images
    const { error: profileDelError } = await supabase
      .from("profile_images")
      .delete()
      .eq("user_id", user_id);

    if (profileDelError) {
      throw profileDelError;
    }

    const { error: qrDelError } = await supabase
      .from("qr_images")
      .delete()
      .eq("user_id", user_id);

    if (qrDelError) {
      throw qrDelError;
    }

    //* Deletion of user row
    const { error: userErr } = await supabaseAdmin.auth.admin.deleteUser(
      user_id
    );
    if (userErr) {
      throw userErr;
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to delete user and resources:", err);
    throw err;
  }
}
