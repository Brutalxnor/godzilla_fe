"use client";
import Sidebar from "@/app/components/shared/sidebar";
import useGetUser from "@/app/Hooks/useGetUser";
import { GetUserById, UpdateUser } from "@/app/services/Auth.service";
import { User } from "@/app/types/type";
import { supabase } from "@/lib/client";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import useGetTheme from "@/app/Hooks/useGetTheme";

const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true, contentType: file.type });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return publicUrl;
};

type ProfileFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  experience_level: string;
  avatar_url?: string | null;
};

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    const maybeAxiosError = error as {
      response?: { data?: { message?: unknown } };
      message?: unknown;
    };
    const responseMessage = maybeAxiosError.response?.data?.message;
    if (typeof responseMessage === "string") return responseMessage;
    if (typeof maybeAxiosError.message === "string")
      return maybeAxiosError.message;
  }
  if (error instanceof Error) return error.message;
  return "Unknown error";
};

const Page = () => {
  const { userDB } = useGetUser();
  const { theme } = useGetTheme(); // ← استخدام الثيم
  const [user, setUser] = useState<{ data: User } | null>(null);
  const { register, handleSubmit, reset, setValue } =
    useForm<ProfileFormValues>();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const shellVars = useMemo(
    () => ({ "--sb-w": "88px", "--extra-left": "24px" } as React.CSSProperties),
    []
  );

  useEffect(() => {
    const fetchUser = async () => {
      const data = await GetUserById(userDB?.data.user_id as string);
      setUser(data);
      if (data?.data) {
        reset({
          first_name: data.data.first_name ?? "",
          last_name: data.data.second_name ?? "",
          email: data.data.email ?? "",
          location: data.data.location ?? "",
          experience_level: data.data.experience_level ?? "",
        });
      }
    };
    fetchUser();
  }, [userDB?.data.user_id, reset]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userDB?.data.user_id) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file, userDB.data.user_id);
      setValue("avatar_url", avatarUrl);
      setPreview(avatarUrl);
    } catch (err: unknown) {
      alert("Upload failed: " + getErrorMessage(err));
      setPreview(user?.data.avatar_url || null);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (formData) => {
    setSaving(true);
    try {
      const { avatar_url, ...profilePayload } = formData;
      await UpdateUser(
        {
          ...profilePayload,
          location: profilePayload.location ?? "",
          experience: profilePayload.experience_level ?? "",
          avatar_url: avatar_url ?? userDB?.data?.user?.avatar_url ?? "",
        },
        userDB?.data?.user_id as string
      );
      toast.success("Profile updated successfully!");
      if (formData.avatar_url) setPreview(formData.avatar_url);

      const storedData = localStorage.getItem("user");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const updatedUser = {
          ...parsed,
          data: {
            ...parsed.data,
            user: {
              ...parsed.data.user,
              ...profilePayload,
              avatar_url: formData.avatar_url ?? parsed.data.user.avatar_url,
            },
          },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err: unknown) {
      console.error("Update failed:", err);
      toast.error("Save failed: " + getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-zinc-900 text-white" : "bg-[#fafafa] text-black"
      }`}
    >
      <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <Sidebar />
      </Suspense>
      <main
        style={shellVars}
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      >
        <div className="mx-auto w-full max-w-5xl px-3 sm:px-4 md:px-6 lg:px-0 py-8">
          <div
            className={`rounded-xl shadow p-8 flex flex-col gap-6 ${
              theme === "dark" ? "bg-zinc-800" : "bg-white"
            }`}
          >
            <header className="py-3 sm:py-4 flex items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                Edit Profile
              </h1>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
              <div className="flex items-center gap-6 mb-10">
                <div className="relative">
                  <img
                    src={
                      preview || user?.data.avatar_url || "/default-avatar.png"
                    }
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-lg"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">Uploading...</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="cursor-pointer px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition">
                    Change Avatar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  "first_name",
                  "last_name",
                  "email",
                  "location",
                  "experience_level",
                ].map((field) => (
                  <div key={field}>
                    <label className="text-sm text-gray-400">
                      {field
                        .replace("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      {...register(field as keyof ProfileFormValues)}
                      className={`input w-full p-2 border rounded ${
                        theme === "dark"
                          ? "bg-zinc-700 border-zinc-600 text-white"
                          : ""
                      }`}
                    />
                  </div>
                ))}
              </div>

              {saving ? (
                <span className="flex items-center gap-3 text-white">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving Changes...
                </span>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-pink-500 text-white font-bold mt-4"
                >
                  Save
                </button>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
