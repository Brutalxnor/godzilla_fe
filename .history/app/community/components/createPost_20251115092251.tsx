"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FiArrowLeft, FiUploadCloud, FiMapPin, FiHash } from "react-icons/fi";
import { GetAllInterests } from "@/app/sign-up/Services/Interest.service";
import { InterestType } from "@/app/types/type";
import { CreatePost, GetAllPosts } from "@/app/sign-up/Services/posts.service";
import { useForm } from "react-hook-form";
import useGetUser from "@/app/Hooks/useGetUser";
import { v4 } from "uuid";

type Visibility = "public" | "followers";

export interface CreatePostType {
  bio: string;
  image: string;
  location: string;
  tags: string[];
  watch: string;
  user_id: string;
}

type SidebarUserDB = {
  data?: {
    user?: {
      first_name?: string;
      second_name?: string;
    };
    email?: string;
  };
};

type UserMini = {
  name: string;
  initials?: string;
  avatarUrl?: string;
  subtitle?: string;
};

export default function CreatePostModal({
  open,
  onClose,
  onSubmit,
  user,
  maxChars = 280,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostType) => Promise<void> | void;
  user: UserMini;
  maxChars?: number;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { userDB } = useGetUser();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePostType>({
    defaultValues: {
      bio: "",
      image: "",
      location: "",
      tags: [],
      watch: "public",
    },
  });

  // Watch form values
  const bioValue = watch("bio") || "";
  const imageValue = watch("image");
  const tagsValue = watch("tags") || [];
  const previewUrl = imageValue
    ? typeof imageValue === "string"
      ? imageValue
      : URL.createObjectURL(imageValue as File)
    : "";

  const remaining = maxChars - bioValue.length;
  const canPost = bioValue.trim().length > 0 || !!imageValue;
  // const fileName = `${userDB?.data?.user_id}-${v4()}.${fileExt}`;
  // Fetch interests
  const [interest, setInterest] = useState<InterestType[]>([]);

  useEffect(() => {
    const fetchInterests = async () => {
      const data = await GetAllInterests();
      setInterest(data);
    };
    fetchInterests();
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        reset();
      }, 200);
    }
  }, [open, reset]);

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // احتفظ بالـ data URL كاملاً
        resolve(result);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);

  const refreshPosts = async () => {
    setIsRefreshing(true);
    try {
      const newPosts = await GetAllPosts(); // الفانكشن بتاعتك لجلب الـ posts
      setPosts(newPosts);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // في الـ CreatePost Component
  const OnSubmit = async (data: CreatePostType) => {
    try {
      const postData: CreatePostType = {
        bio: data.bio.trim(),
        image: data.image,
        location: data.location?.trim() || "",
        tags: data.tags || [],
        watch: "publiv",
        user_id: userDB?.data?.user_id || data.user_id,
      };

      const response = await CreatePost(postData);

      if (response.error || !response.success) {
        console.error("Server error:", response);
        alert(response.message || "Failed to create post");
        return;
      }

      console.log("Post created successfully:", response);

      // refresh الداتا
      // await refreshPosts(); // callback من الكومبوننت الأب
      window.location.reload();

      onClose();
      reset();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post.");
    }
  };

  const typedUser = (userDB as SidebarUserDB | undefined)?.data;
  const users = typedUser?.user;
  const email = typedUser?.email ?? "";
  const displayName = (() => {
    const raw =
      `${users?.first_name ?? ""} ${users?.second_name ?? ""}`.trim() ||
      (email ? email.split("@")[0] : "") ||
      "User";
    return raw
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  })();

  return (
    <div
      className={[
        "fixed inset-0 z-[100] transition-opacity",
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-x-0 top-0 flex min-h-full items-start justify-center p-4 sm:p-6">
        <form
          onSubmit={handleSubmit(OnSubmit)}
          className={[
            "w-full max-w-5xl rounded-2xl bg-white shadow-2xl",
            "transition-transform duration-200",
            open ? "translate-y-0" : "-translate-y-3",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 bg-white rounded-t-2xl">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <FiArrowLeft />
              <span className="font-medium">Create Post</span>
            </button>
            <button
              type="submit"
              disabled={!canPost}
              className={[
                "rounded-full px-4 py-2 text-white text-sm font-medium",
                canPost
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-gray-300 cursor-not-allowed",
              ].join(" ")}
            >
              Post
            </button>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* User Info */}
            <div className="flex items-center gap-3">
              {userDB?.data?.user?.avatar_url ? (
                <img
                  src={userDB?.data?.user?.avatar_url ?? ""}
                  alt={user.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-gray-200 grid place-items-center text-[10px] font-semibold text-gray-700">
                  {displayName?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <div>
                <div className="text-sm font-semibold">{displayName}</div>
                <div className="text-xs text-gray-500">
                  {user?.subtitle ?? "Share with your community"}
                </div>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-1/2 space-y-5">
                {/* Caption */}
                <section className="rounded-2xl border border-gray-200 overflow-hidden">
                  <textarea
                    {...register("bio", {
                      required: "Post content is required",
                      maxLength: {
                        value: maxChars,
                        message: `Maximum ${maxChars} characters allowed`,
                      },
                    })}
                    placeholder="Share your fitness journey, achievements, or tips"
                    className="w-full min-h-[120px] resize-y bg-gray-100/70 px-4 py-3 outline-none"
                  />
                  <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
                    <span>Share your fitness journey</span>
                    <span className={remaining < 0 ? "text-red-500" : ""}>
                      {bioValue.length}/{maxChars}
                    </span>
                  </div>
                  {errors.bio && (
                    <p className="text-red-500 text-xs px-4 pb-2">
                      {errors.bio.message}
                    </p>
                  )}

                  {/* Image uploader */}
                  <div className="m-4 rounded-xl border border-dashed border-gray-300">
                    <div className="px-4 py-8 text-center">
                      {previewUrl ? (
                        <div className="space-y-3">
                          <div className="relative mx-auto h-48 w-full max-w-[520px] overflow-hidden rounded-xl border border-gray-200">
                            <img
                              src={previewUrl}
                              alt="Selected"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                            >
                              <FiUploadCloud />
                              Replace Photo
                            </button>
                            <button
                              type="button"
                              onClick={() => setValue("image", "")}
                              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
                          <div className="text-sm text-gray-600">
                            Add a photo to your post
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            <FiUploadCloud />
                            Choose Photo
                          </button>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png" // صيغ محددة فقط
                        hidden
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          try {
                            // التحقق من نوع الملف
                            const validTypes = [
                              "image/jpeg",
                              "image/jpg",
                              "image/png",
                            ];
                            if (!validTypes.includes(file.type)) {
                              alert("Please upload a JPEG or PNG image");
                              return;
                            }

                            // التحقق من حجم الملف
                            const maxSize = 5 * 1024 * 1024; // 5MB
                            if (file.size > maxSize) {
                              alert("Image size should be less than 5MB");
                              return;
                            }

                            console.log("File type:", file.type);
                            console.log("File size:", file.size);

                            // تحويل إلى base64
                            const base64 = await convertToBase64(file);

                            console.log(
                              "Base64 prefix:",
                              base64.substring(0, 50)
                            );

                            setValue("image", base64);
                          } catch (error) {
                            console.error("Error uploading image:", error);
                            alert("Failed to upload image. Please try again.");
                          }
                        }}
                      />
                    </div>
                  </div>
                </section>

                {/* Location */}
                <section className="rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                    <FiMapPin className="text-gray-500" />
                    <span className="text-sm font-medium">
                      Location (Optional)
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 flex items-center gap-2">
                      <FiMapPin className="text-gray-400" />
                      <input
                        {...register("location")}
                        placeholder="Add Location"
                        className="w-full outline-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Tags */}
                <section className="rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                    <FiHash className="text-gray-500" />
                    <span className="text-sm font-medium">Tags</span>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-2">
                      Suggested tags:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {interest.map((t) => {
                        const active = tagsValue.includes(t.name);

                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              if (active) {
                                setValue(
                                  "tags",
                                  tagsValue.filter((tag) => tag !== t.name)
                                );
                              } else {
                                setValue("tags", [...tagsValue, t.name]);
                              }
                            }}
                            className={[
                              "rounded-full border px-3 py-1 text-sm transition",
                              active
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                            ].join(" ")}
                          >
                            #{t.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Visibility */}
                {/* <section className="rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                    <span className="text-sm font-medium">
                      Who can see this?
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value="public"
                        {...register("watch")}
                        defaultChecked
                        className="mt-0.5"
                      />
                      <div>
                        <div className="text-sm font-medium">Public</div>
                        <div className="text-xs text-gray-500">
                          Anyone can see this post
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value="followers"
                        {...register("watch")}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="text-sm font-medium">
                          Followers only
                        </div>
                        <div className="text-xs text-gray-500">
                          Only your followers can see this
                        </div>
                      </div>
                    </label>
                  </div>
                </section> */}
              </div>

              {/* Preview */}
              <div className="w-1/2 rounded-2xl border h-fit border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">
                  Preview
                </div>
                <div className="p-4">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <div className="flex items-center gap-3">
                      {userDB?.data?.user?.avatar_url ? (
                        <img
                          src={userDB?.data?.user?.avatar_url ?? ""}
                          alt={user.name}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gray-200 grid place-items-center text-[10px] font-semibold text-gray-700">
                          {displayName?.[0]?.toUpperCase() ?? "U"}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{displayName}</div>
                        <div className="text-[11px] text-gray-500">
                          Just now
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-800 whitespace-pre-line">
                      {bioValue || "Your post content will appear here..."}
                    </div>
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="mt-3 rounded-lg w-full object-cover max-h-64"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
