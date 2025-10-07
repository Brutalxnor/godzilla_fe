"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiMapPin,
  FiHash,
} from "react-icons/fi";

type Visibility = "public" | "followers";

export type CreatePostPayload = {
  text: string;
  imageFile?: File | null;
  imageUrl?: string | null; // preview
  location?: string;
  tags: string[];
  visibility: Visibility;
};

type UserMini = {
  name: string;
  initials?: string;    // fallback if no avatar
  avatarUrl?: string;
  subtitle?: string;    // e.g. “Share with your community”
};

export default function CreatePostModal({
  open,
  onClose,
  onSubmit,
  user,
  suggestedTags = [
    "StrengthTraining",
    "Nutrition",
    "MorningWorkout",
    "Motivation",
    "TransformationTuesday",
    "FitnessJourney",
    "GainZ",
    "HealthyLifestyle",
  ],
  maxChars = 280,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostPayload) => Promise<void> | void;
  user: UserMini;
  suggestedTags?: string[];
  maxChars?: number;
}) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("public");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const remaining = maxChars - text.length;
  const canPost = text.trim().length > 0 || !!imageFile;

  // reset when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setText("");
        setImageFile(null);
        setImageUrl(null);
        setLocation("");
        setTags([]);
        setVisibility("public");
      }, 200); // after transition
    }
  }, [open]);

  // clean blob url
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const userInitials = useMemo(() => {
    if (user.initials) return user.initials;
    const parts = user.name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
    return (first + last || first || "U").toUpperCase();
  }, [user]);

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
  }

  function removeImage() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(null);
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function submit() {
    if (!canPost) return;
    await onSubmit({ text, imageFile, imageUrl, location, tags, visibility });
    onClose();
  }

  // Simple fade/scale modal
  return (
    <div
      className={[
        "fixed inset-0 z-[100] transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute inset-x-0 top-0 flex min-h-full items-start justify-center p-4 sm:p-6">
        <div
          className={[
            "w-full max-w-5xl rounded-2xl bg-white shadow-2xl",
            "transition-transform duration-200",
            open ? "translate-y-0" : "-translate-y-3",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Create Post"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 bg-white rounded-t-2xl">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <FiArrowLeft />
              <span className="font-medium">Create Post</span>
            </button>
            <button
              disabled={!canPost}
              onClick={submit}
              className={[
                "rounded-full px-4 py-2 text-white text-sm font-medium",
                canPost ? "bg-rose-500 hover:bg-rose-600" : "bg-rose-300 cursor-not-allowed",
              ].join(" ")}
            >
              Post
            </button>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* User row */}
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 grid place-items-center text-xs font-semibold text-gray-700">
                  {userInitials}
                </div>
              )}
              <div>
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500">
                  {user.subtitle ?? "Share with your community"}
                </div>
              </div>
            </div>

            <div className="flex gap-5 ">
            <div className="w-1/2">

       
            {/* Caption */}
            <section className="rounded-2xl border border-gray-200 overflow-hidden">
              <textarea
                value={text}
                onChange={(e) =>
                  setText(e.target.value.slice(0, maxChars))
                }
                placeholder="Share your fitness journey, achievements, or tips"
                className="w-full min-h-[120px] resize-y bg-gray-100/70 px-4 py-3 outline-none"
              />
              <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
                <span>Share your fitness journey, achievements, or tips</span>
                <span>{text.length}/{maxChars}</span>
              </div>

              {/* Image uploader */}
              <div className="m-4 rounded-xl border border-dashed border-gray-300">
                <div className="px-4 py-8 text-center">
                  {imageUrl ? (
                    <div className="space-y-3">
                      <div className="relative mx-auto h-48 w-full max-w-[520px] overflow-hidden rounded-xl border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
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
                          onClick={removeImage}
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-3xl mx-auto w-10 text-gray-400">
                        <FiUploadCloud className="mx-auto" />
                      </div>
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
                    accept="image/*"
                    hidden
                    onChange={handleFilePick}
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                <FiMapPin className="text-gray-500" />
                <span className="text-sm font-medium">Location (Optional)</span>
              </div>
              <div className="p-4">
                <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 flex items-center gap-2">
                  <FiMapPin className="text-gray-400" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                <div className="text-sm text-gray-500 mb-2">Suggested tags:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((t) => {
                    const active = tags.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTag(t)}
                        className={[
                          "rounded-full border px-3 py-1 text-sm",
                          active
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        #{t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Visibility */}
            <section className="rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                <span className="text-sm font-medium">Who can see this?</span>
              </div>
              <div className="p-4 flex justify-items-end space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="visibility"
                    className="mt-1"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                  />
                  <div>
                    <div className="text-sm font-medium">Public</div>
                    <div className="text-xs text-gray-500">
                      Anyone can see this post
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="visibility"
                    className="mt-1"
                    checked={visibility === "followers"}
                    onChange={() => setVisibility("followers")}
                  />
                  <div>
                    <div className="text-sm font-medium">Followers only</div>
                    <div className="text-xs text-gray-500">
                      Only your followers can see this
                    </div>
                  </div>
                </label>
              </div>
            </section>

            </div>

            <div className="rounded-2xl border h-fit border-gray-200 ">

            {/* Preview */}
            <div className="rounded-2xl  w-100 border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">
                Preview
              </div>
              <div className="p-4">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-gray-200 grid place-items-center text-[10px] font-semibold text-gray-700">
                        {userInitials}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-[11px] text-gray-500">Just now</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-800 whitespace-pre-line">
                    {text || " "}
                  </div>
                </div>
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
