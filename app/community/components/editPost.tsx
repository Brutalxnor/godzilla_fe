"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiUploadCloud, FiMapPin, FiHash } from "react-icons/fi";
import { useForm } from "react-hook-form";

export type EditPostType = {
  bio: string;
  image: string;
  location: string;
  tags: string[];
  watch: string;
  user_id: string;
};

type Post = {
  id: string;
  bio: string;
  image?: string;
  location?: string;
  tags?: string[];
  watch?: string;
  user_id: string;
};

type InterestType = {
  id: string;
  name: string;
};

export default function EditPostModal({
  open,
  onClose,
  post,
  interests = [],
  userAvatarUrl,
  userName,
  userId,
  onUpdate,
  maxChars = 280,
}: {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  interests?: InterestType[];
  userAvatarUrl?: string;
  userName: string;
  userId: string;
  onUpdate: (data: EditPostType) => Promise<void>;
  maxChars?: number;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditPostType>({
    defaultValues: {
      bio: "",
      image: "",
      location: "",
      tags: [],
      watch: "public",
    },
  });

  const bioValue = watch("bio") || "";
  const imageValue = watch("image");
  const tagsValue = watch("tags") || [];

  const previewUrl = imageValue || "";
  const remaining = maxChars - bioValue.length;
  const canUpdate = bioValue.trim().length > 0;

  // Populate form when post changes
  useEffect(() => {
    if (post && open) {
      reset({
        bio: post.bio || "",
        image: post.image || "",
        location: post.location || "",
        tags: post.tags || [],
        watch: post.watch || "public",
      });
    }
  }, [post, open, reset]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        reset();
      }, 200);
    }
  }, [open, reset]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: EditPostType) => {
    setIsSubmitting(true);
    try {
      await onUpdate(data);
      onClose();
      reset();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !post) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40" onClick={onClose}>
      <div className="absolute inset-x-0 top-0 flex min-h-full items-start justify-center p-4 sm:p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 bg-white rounded-t-2xl">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <FiArrowLeft />
              <span className="font-medium">Edit Post</span>
            </button>
            <button
              onClick={() => handleSubmit(onSubmit)()}
              disabled={!canUpdate || isSubmitting}
              className={[
                "rounded-full px-4 py-2 text-white text-sm font-medium",
                canUpdate && !isSubmitting
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-gray-300 cursor-not-allowed",
              ].join(" ")}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* User Info */}
            <div className="flex items-center gap-3">
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt={userName}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-gray-200 grid place-items-center text-[10px] font-semibold text-gray-700">
                  {userName?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <div>
                <div className="text-sm font-semibold">{userName}</div>
                <div className="text-xs text-gray-500">Edit your post</div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-5">
              <div className="w-full lg:w-1/2 space-y-5">
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
                    <span>Edit your post</span>
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
                        accept="image/jpeg,image/jpg,image/png"
                        hidden
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          try {
                            const validTypes = [
                              "image/jpeg",
                              "image/jpg",
                              "image/png",
                            ];
                            if (!validTypes.includes(file.type)) {
                              alert("Please upload a JPEG or PNG image");
                              return;
                            }

                            const maxSize = 5 * 1024 * 1024;
                            if (file.size > maxSize) {
                              alert("Image size should be less than 5MB");
                              return;
                            }

                            const base64 = await convertToBase64(file);
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
                {interests.length > 0 && (
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
                        {interests.map((t) => {
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
                )}
              </div>

              {/* Preview */}
              <div className="w-full lg:w-1/2 rounded-2xl border h-fit border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">
                  Preview
                </div>
                <div className="p-4">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <div className="flex items-center gap-3">
                      {userAvatarUrl ? (
                        <img
                          src={userAvatarUrl}
                          alt={userName}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gray-200 grid place-items-center text-[10px] font-semibold text-gray-700">
                          {userName?.[0]?.toUpperCase() ?? "U"}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{userName}</div>
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
        </div>
      </div>
    </div>
  );
}
