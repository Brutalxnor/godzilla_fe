// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Image from "next/image";
// import {
//   FiArrowLeft,
//   FiUploadCloud,
//   FiPlus,
//   FiX,
// } from "react-icons/fi";

// type Difficulty = "Beginner" | "Intermediate" | "Advanced";
// type MaterialType = "Video" | "PDF" | "Audio" | "Worksheet";

// export type CreateProgramPayload = {
//   title: string;
//   description: string;
//   category: string;
//   difficulty: Difficulty | "";
//   durationWeeks: number | "";
//   isPremium: boolean;
//   priceMonthly?: number | "";
//   originalPrice?: number | "";
//   features: string[];
//   materials: { type: MaterialType; title: string }[];
//   coverImageFile?: File | null;
//   coverImageUrl?: string | null; 
// };

// type CoachMini = {
//   name: string;
//   avatarUrl?: string;
//   initials?: string;
//   subtitle?: string;
// };

// const CATEGORIES = ["Strength", "Cardio", "Yoga", "Nutrition", "HIIT", "Mobility"];
// const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
// const MATERIAL_TYPES: MaterialType[] = ["Video", "PDF", "Audio" , "Worksheet"];

// export default function CreateProgramModal({
//   open,
//   onClose,
//   onSubmit,
//   coach,
// }: {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: CreateProgramPayload) => Promise<void> | void;
//   coach: CoachMini; // the author/coach creating the program (for preview header)
// }) {
//   // Form state
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [difficulty, setDifficulty] = useState<Difficulty | "">("");
//   const [durationWeeks, setDurationWeeks] = useState<number | "">("");
//   const [isPremium, setIsPremium] = useState(false);
//   const [priceMonthly, setPriceMonthly] = useState<number | "">("");
//   const [originalPrice, setOriginalPrice] = useState<number | "">("");
//   const [features, setFeatures] = useState<string[]>([]);
//   const [materials, setMaterials] = useState<{ type: MaterialType; title: string }[]>([]);
//   const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
//   const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

//   // Helpers for adding features/materials
//   const [featureInput, setFeatureInput] = useState("");
//   const [materialType, setMaterialType] = useState<MaterialType>("Video");
//   const [materialTitle, setMaterialTitle] = useState("");

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const canSave =
//     title.trim().length > 0 &&
//     description.trim().length > 0 &&
//     category.trim().length > 0 &&
//     difficulty !== "" &&
//     durationWeeks !== "" &&
//     (!isPremium || (isPremium && priceMonthly !== ""));

//   // Reset when closed
//   useEffect(() => {
//     if (!open) {
//       setTimeout(() => {
//         setTitle("");
//         setDescription("");
//         setCategory("");
//         setDifficulty("");
//         setDurationWeeks("");
//         setIsPremium(false);
//         setPriceMonthly("");
//         setOriginalPrice("");
//         setFeatures([]);
//         setMaterials([]);
//         setFeatureInput("");
//         setMaterialType("Video");
//         setMaterialTitle("");
//         setCoverImageFile(null);
//         if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
//         setCoverImageUrl(null);
//       }, 200);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   // Clean blob URL on unmount/change
//   useEffect(() => {
//     return () => {
//       if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
//     };
//   }, [coverImageUrl]);

//   const coachInitials = useMemo(() => {
//     if (coach.initials) return coach.initials;
//     const parts = coach.name.trim().split(/\s+/);
//     const f = parts[0]?.[0] ?? "";
//     const l = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
//     return (f + l || f || "C").toUpperCase();
//   }, [coach]);

//   function pickCover(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setCoverImageFile(f);
//     const url = URL.createObjectURL(f);
//     setCoverImageUrl(url);
//   }

//   function removeCover() {
//     if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
//     setCoverImageFile(null);
//     setCoverImageUrl(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   }

//   function addFeature() {
//     const v = featureInput.trim();
//     if (!v) return;
//     setFeatures((prev) => [...prev, v]);
//     setFeatureInput("");
//   }

//   function removeFeature(idx: number) {
//     setFeatures((prev) => prev.filter((_, i) => i !== idx));
//   }

//   function addMaterial() {
//     const t = materialTitle.trim();
//     if (!t) return;
//     setMaterials((prev) => [...prev, { type: materialType, title: t }]);
//     setMaterialTitle("");
//     setMaterialType("Video");
//   }

//   function removeMaterial(idx: number) {
//     setMaterials((prev) => prev.filter((_, i) => i !== idx));
//   }

//   async function save() {
//     if (!canSave) return;
//     await onSubmit({
//       title,
//       description,
//       category,
//       difficulty,
//       durationWeeks,
//       isPremium,
//       priceMonthly,
//       originalPrice,
//       features,
//       materials,
//       coverImageFile,
//       coverImageUrl,
//     });
//     onClose();
//   }

//   return (
//     <div
//       className={[
//         "fixed inset-0 z-[100] transition-opacity",
//         open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
//       ].join(" ")}
//       aria-hidden={!open}
//     >
//       {/* Backdrop */}
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />

//       {/* Sheet */}
//       <div className="absolute inset-x-0 top-0 flex min-h-full items-start justify-center p-4 sm:p-6">
//         <div
//           className={[
//             "w-full max-w-6xl rounded-2xl bg-white shadow-2xl",
//             "transition-transform duration-200",
//             open ? "translate-y-0" : "-translate-y-3",
//           ].join(" ")}
//           role="dialog"
//           aria-modal="true"
//           aria-label="Create Program"
//         >
//           {/* Header */}
//           <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 bg-white rounded-t-2xl">
//             <button
//               onClick={onClose}
//               className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
//             >
//               <FiArrowLeft />
//               <span className="font-medium">Create New Program</span>
//             </button>

//             <button
//               disabled={!canSave}
//               onClick={save}
//               className={[
//                 "rounded-full px-4 py-2 text-white text-sm font-medium",
//                 canSave ? "bg-rose-500 hover:bg-rose-600" : "bg-rose-300 cursor-not-allowed",
//               ].join(" ")}
//             >
//               Save Program
//             </button>
//           </div>

//           {/* Body */}
//           <div className="px-4 sm:px-6 py-4 sm:py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
//             <div className="flex gap-6">
//               {/* LEFT: form */}
//               <div className="w-full lg:w-1/2 space-y-6">
//                 {/* Basic information */}
//                 <section className="rounded-2xl border border-gray-200">
//                   <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">
//                     Basic Information
//                   </div>
//                   <div className="p-4 space-y-4">
//                     <div>
//                       <label className="text-sm text-gray-700">Program Title</label>
//                       <input
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         placeholder="e.g., Advanced Strength Training"
//                         className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm text-gray-700">Description</label>
//                       <textarea
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         placeholder="Describe your program in detail..."
//                         className="mt-1 w-full min-h-[120px] rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <div>
//                         <label className="text-sm text-gray-700">Category</label>
//                         <select
//                           value={category}
//                           onChange={(e) => setCategory(e.target.value)}
//                           className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
//                         >
//                           <option value="">Select category</option>
//                           {CATEGORIES.map((c) => (
//                             <option key={c} value={c}>
//                               {c}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="text-sm text-gray-700">Difficulty</label>
//                         <select
//                           value={difficulty}
//                           onChange={(e) => setDifficulty(e.target.value as Difficulty | "")}
//                           className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
//                         >
//                           <option value="">Select difficulty</option>
//                           {DIFFICULTIES.map((d) => (
//                             <option key={d} value={d}>
//                               {d}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-sm text-gray-700">Duration (weeks)</label>
//                       <input
//                         type="number"
//                         min={1}
//                         value={durationWeeks as number | ""}
//                         onChange={(e) =>
//                           setDurationWeeks(e.target.value === "" ? "" : Number(e.target.value))
//                         }
//                         placeholder="e.g., 12"
//                         className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
//                       />
//                     </div>
//                   </div>
//                 </section>

//                 {/* Pricing */}
//                 <section className="rounded-2xl border border-gray-200">
//                   <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">
//                     Pricing
//                   </div>
//                   <div className="p-4 space-y-4">
//                     <label className="flex items-center gap-3">
//                       <input
//                         type="checkbox"
//                         checked={isPremium}
//                         onChange={(e) => setIsPremium(e.target.checked)}
//                       />
//                       <span className="text-sm text-gray-700">Premium Program</span>
//                     </label>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <div>
//                         <label className="text-sm text-gray-700">Price (monthly)</label>
//                         <input
//                           type="number"
//                           min={0}
//                           disabled={!isPremium}
//                           value={(priceMonthly as number | "")}
//                           onChange={(e) =>
//                             setPriceMonthly(e.target.value === "" ? "" : Number(e.target.value))
//                           }
//                           placeholder="e.g., 49"
//                           className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none disabled:opacity-60"
//                         />
//                       </div>
//                       <div>
//                         <label className="text-sm text-gray-700">Original Price (optional)</label>
//                         <input
//                           type="number"
//                           min={0}
//                           disabled={!isPremium}
//                           value={(originalPrice as number | "")}
//                           onChange={(e) =>
//                             setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))
//                           }
//                           placeholder="e.g., 69"
//                           className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none disabled:opacity-60"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </section>

//                 {/* Features */}
//                 <section className="rounded-2xl border border-gray-200">
//                   <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">
//                     Program Features
//                   </div>
//                   <div className="p-4 space-y-3">
//                     <div className="flex gap-2">
//                       <input
//                         value={featureInput}
//                         onChange={(e) => setFeatureInput(e.target.value)}
//                         placeholder="Add a feature (e.g., Video tutorials)"
//                         className="flex-1 rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
//                       />
//                       <button
//                         type="button"
//                         onClick={addFeature}
//                         className="inline-flex items-center gap-1 rounded-xl bg-rose-500 text-white px-3 py-2 hover:bg-rose-600"
//                       >
//                         <FiPlus />
//                         Add
//                       </button>
//                     </div>

//                     {features.length > 0 && (
//                       <div className="flex flex-wrap gap-2">
//                         {features.map((f, idx) => (
//                           <span
//                             key={idx}
//                             className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs"
//                           >
//                             {f}
//                             <button
//                               className="text-gray-500 hover:text-gray-700"
//                               onClick={() => removeFeature(idx)}
//                             >
//                               <FiX />
//                             </button>
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </section>

//                 {/* Materials */}
//                 <section className="rounded-2xl border border-gray-200">
//                   <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">
//                     Program Materials
//                   </div>
//                   <div className="p-4 space-y-3">
//                     <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2">
//                       <select
//                         value={materialType}
//                         onChange={(e) => setMaterialType(e.target.value as MaterialType)}
//                         className="rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
//                       >
//                         {MATERIAL_TYPES.map((t) => (
//                           <option key={t} value={t}>
//                             {t}
//                           </option>
//                         ))}
//                       </select>
//                       <input
//                         value={materialTitle}
//                         onChange={(e) => setMaterialTitle(e.target.value)}
//                         placeholder="Material title"
//                         className="rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
//                       />
//                       <button
//                         type="button"
//                         onClick={addMaterial}
//                         className="inline-flex items-center justify-center gap-1 rounded-xl bg-rose-500 text-white px-3 py-2 hover:bg-rose-600"
//                       >
//                         <FiPlus />
//                         Add
//                       </button>
//                     </div>

//                     {materials.length > 0 && (
//                       <ul className="space-y-2">
//                         {materials.map((m, idx) => (
//                           <li
//                             key={`${m.type}-${idx}`}
//                             className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
//                           >
//                             <span className="text-gray-700">
//                               <b>{m.type}</b> — {m.title}
//                             </span>
//                             <button
//                               className="text-gray-500 hover:text-gray-700"
//                               onClick={() => removeMaterial(idx)}
//                             >
//                               <FiX />
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 </section>

//                 {/* Cover image */}
//                 <section className="rounded-2xl border border-gray-200">
//                   <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">
//                     Cover Image
//                   </div>
//                   <div className="p-4">
//                     <div className="rounded-xl border border-dashed border-gray-300">
//                       <div className="px-4 py-8 text-center">
//                         {coverImageUrl ? (
//                           <div className="space-y-3">
//                             <div className="relative mx-auto h-48 w-full max-w-[560px] overflow-hidden rounded-xl border border-gray-200">
//                               {/* eslint-disable-next-line @next/next/no-img-element */}
//                               <img
//                                 src={coverImageUrl}
//                                 alt="Cover"
//                                 className="h-full w-full object-cover"
//                               />
//                             </div>
//                             <div className="flex items-center justify-center gap-3">
//                               <button
//                                 type="button"
//                                 onClick={() => fileInputRef.current?.click()}
//                                 className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
//                               >
//                                 <FiUploadCloud />
//                                 Replace Image
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={removeCover}
//                                 className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
//                               >
//                                 Remove
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="space-y-3">
//                             <div className="text-3xl mx-auto w-10 text-gray-400">
//                               <FiUploadCloud className="mx-auto" />
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               Upload your program cover image
//                             </div>
//                             <button
//                               type="button"
//                               onClick={() => fileInputRef.current?.click()}
//                               className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
//                             >
//                               <FiUploadCloud />
//                               Choose File
//                             </button>
//                           </div>
//                         )}

//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           accept="image/*"
//                           hidden
//                           onChange={pickCover}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </section>
//               </div>

//               {/* RIGHT: Live Preview (sticky) */}
//               <div className="w-full lg:w-1/2">
//                 <div className="sticky top-16">
//                   <div className="rounded-2xl border border-gray-200">
//                     <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">
//                       Preview
//                     </div>

//                     {/* Program Card Preview */}
//                     <div className="p-4">
//                       <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
//                         {/* Cover */}
//                         <div className="relative h-56 w-full bg-gray-100">
//                           {coverImageUrl ? (
//                             // eslint-disable-next-line @next/next/no-img-element
//                             <img
//                               src={coverImageUrl}
//                               alt="Program cover"
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             <div className="grid h-full place-items-center text-gray-400 text-sm">
//                               No cover yet
//                             </div>
//                           )}

//                           {/* Premium + Price ribbons */}
//                           {isPremium && (
//                             <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-medium text-white">
//                               premium
//                             </span>
//                           )}
//                           {isPremium && priceMonthly !== "" && (
//                             <div className="absolute right-3 top-3 grid gap-1 text-xs">
//                               {originalPrice !== "" && (
//                                 <span className="rounded-full bg-white/90 px-3 py-1 line-through">
//                                   ${originalPrice}/month
//                                 </span>
//                               )}
//                               <span className="rounded-full bg-white/90 px-3 py-1 font-semibold">
//                                 ${priceMonthly}/month
//                               </span>
//                             </div>
//                           )}
//                         </div>

//                         {/* Body */}
//                         <div className="p-4">
//                           <h3 className="text-lg font-semibold">
//                             {title || "Program title"}
//                           </h3>

//                           {/* Coach */}
//                           <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
//                             {coach.avatarUrl ? (
//                               <Image
//                                 src={coach.avatarUrl}
//                                 alt={coach.name}
//                                 width={20}
//                                 height={20}
//                                 className="h-5 w-5 rounded-full object-cover"
//                               />
//                             ) : (
//                               <div className="h-5 w-5 rounded-full bg-gray-200 grid place-items-center text-[10px] font-semibold text-gray-700">
//                                 {coachInitials}
//                               </div>
//                             )}
//                             <span>{coach.name || "Coach"}</span>
//                           </div>

//                           {/* Meta */}
//                           <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
//                             <span>⭐ 4.9 (156)</span>
//                             <span>🕒 {durationWeeks || 12} weeks</span>
//                             <span>🏷️ {difficulty || "Beginner"}</span>
//                           </div>

//                           {/* Description */}
//                           <p className="mt-3 text-sm text-gray-700 line-clamp-3">
//                             {description ||
//                               "Build a solid foundation of strength with this comprehensive beginner program."}
//                           </p>

//                           {/* Features chips */}
//                           {features.length > 0 && (
//                             <div className="mt-3 flex flex-wrap gap-2">
//                               {features.map((f, i) => (
//                                 <span
//                                   key={`${f}-${i}`}
//                                   className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
//                                 >
//                                   {f}
//                                 </span>
//                               ))}
//                             </div>
//                           )}

//                           {/* Actions */}
//                           <div className="mt-4 flex items-center gap-3">
//                             <button
//                               type="button"
//                               className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
//                             >
//                               ▶ Preview
//                             </button>
//                             <button
//                               type="button"
//                               className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
//                             >
//                               {isPremium && priceMonthly !== ""
//                                 ? `Subscribe`
//                                 : `Add to Library`}
//                             </button>
//                           </div>
//                         </div>
//                       </article>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* END Right */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FiArrowLeft, FiUploadCloud, FiX } from "react-icons/fi";

type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type CreateProgramPayload = {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty_level: DifficultyLevel | "";
  duration_weeks: number | "";
  sessions_per_week: number | "";
  minutes_per_session: number | "";
  price: number | "";
  discount_percentage?: number | "";
  equipment_needed: string;
  space_required: string;
  target_audience: string;
  prerequisites: string;
  expected_results: string;
  includes_meal_plan: boolean;
  includes_supplement_guide: boolean;
  includes_progress_tracking: boolean;
  includes_chat_support: boolean;
  coverImageFile?: File | null;
  cover_image_url?: string | null;
};

type CoachMini = {
  name: string;
  avatarUrl?: string;
  initials?: string;
  subtitle?: string;
};

const CATEGORIES = ["Strength", "Cardio", "Yoga", "Nutrition", "HIIT", "Mobility"];
const DIFFICULTIES: DifficultyLevel[] = ["beginner", "intermediate", "advanced"];

export default function CreateProgramModal({
  open,
  onClose,
  onSubmit,
  coach,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProgramPayload) => Promise<void> | void;
  coach: CoachMini;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "">("");
  const [durationWeeks, setDurationWeeks] = useState<number | "">("");
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number | "">("");
  const [minutesPerSession, setMinutesPerSession] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [discountPercentage, setDiscountPercentage] = useState<number | "">("");
  const [equipmentNeeded, setEquipmentNeeded] = useState("");
  const [spaceRequired, setSpaceRequired] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [expectedResults, setExpectedResults] = useState("");
  const [includesMealPlan, setIncludesMealPlan] = useState(false);
  const [includesSupplementGuide, setIncludesSupplementGuide] = useState(false);
  const [includesProgressTracking, setIncludesProgressTracking] = useState(false);
  const [includesChatSupport, setIncludesChatSupport] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSave =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    category.trim().length > 0 &&
    difficulty !== "" &&
    durationWeeks !== "" &&
    sessionsPerWeek !== "" &&
    minutesPerSession !== "" &&
    price !== "";

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setTitle("");
        setSlug("");
        setDescription("");
        setCategory("");
        setDifficulty("");
        setDurationWeeks("");
        setSessionsPerWeek("");
        setMinutesPerSession("");
        setPrice("");
        setDiscountPercentage("");
        setEquipmentNeeded("");
        setSpaceRequired("");
        setTargetAudience("");
        setPrerequisites("");
        setExpectedResults("");
        setIncludesMealPlan(false);
        setIncludesSupplementGuide(false);
        setIncludesProgressTracking(false);
        setIncludesChatSupport(false);
        setCoverImageFile(null);
        if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
        setCoverImageUrl(null);
      }, 200);
    }
  }, [open]); // eslint-disable-line

  useEffect(() => {
    return () => {
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
    };
  }, [coverImageUrl]);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      setSlug(generatedSlug);
    }
  }, [title, slug]);

  const coachInitials = useMemo(() => {
    if (coach.initials) return coach.initials;
    const parts = coach.name.trim().split(/\s+/);
    const f = parts[0]?.[0] ?? "";
    const l = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
    return (f + l || f || "C").toUpperCase();
  }, [coach]);

  const originalPrice = useMemo(() => {
    if (price !== "" && discountPercentage !== "" && discountPercentage > 0) {
      return Number(price) / (1 - Number(discountPercentage) / 100);
    }
    return null;
  }, [price, discountPercentage]);

  function pickCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverImageFile(f);
    const url = URL.createObjectURL(f);
    setCoverImageUrl(url);
  }

  function removeCover() {
    if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
    setCoverImageFile(null);
    setCoverImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function save() {
    if (!canSave) return;
    await onSubmit({
      title,
      slug,
      description,
      category,
      difficulty_level: difficulty,
      duration_weeks: durationWeeks,
      sessions_per_week: sessionsPerWeek,
      minutes_per_session: minutesPerSession,
      price,
      discount_percentage: discountPercentage,
      equipment_needed: equipmentNeeded,
      space_required: spaceRequired,
      target_audience: targetAudience,
      prerequisites,
      expected_results: expectedResults,
      includes_meal_plan: includesMealPlan,
      includes_supplement_guide: includesSupplementGuide,
      includes_progress_tracking: includesProgressTracking,
      includes_chat_support: includesChatSupport,
      coverImageFile,
      cover_image_url: coverImageUrl,
    });
    onClose();
  }

  return (
    <div
      className={[
        "fixed inset-0 z-[100] transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-0 flex min-h-full items-start justify-center p-4 sm:p-6">
        <div
          className={[
            "w-full max-w-7xl rounded-2xl bg-white shadow-2xl",
            "transition-transform duration-200",
            open ? "translate-y-0" : "-translate-y-3",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Create Program"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 bg-white rounded-t-2xl">
            <button onClick={onClose} className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <FiArrowLeft />
              <span className="font-medium">Create New Program</span>
            </button>
            <button
              disabled={!canSave}
              onClick={save}
              className={[
                "rounded-full px-4 py-2 text-white text-sm font-medium",
                canSave ? "bg-rose-500 hover:bg-rose-600" : "bg-rose-300 cursor-not-allowed",
              ].join(" ")}
            >
              Save Program
            </button>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="flex gap-6">
              {/* LEFT: form */}
              <div className="w-full lg:w-1/2 space-y-6">
                {/* Basic information */}
                <section className="rounded-2xl border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">Basic Information</div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm text-gray-700">Program Title *</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., 12-Week Shred"
                        className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Slug</label>
                      <input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g., 12-week-shred (auto-generated)"
                        className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                      />
                      <p className="mt-1 text-xs text-gray-500">URL-friendly identifier (auto-generated from title)</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Description *</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Complete fat-loss and conditioning program..."
                        className="mt-1 w-full min-h-[120px] rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-700">Category *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                        >
                          <option value="">Select category</option>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c.toLowerCase()}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-700">Difficulty Level *</label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | "")}
                          className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                        >
                          <option value="">Select difficulty</option>
                          {DIFFICULTIES.map((d) => (
                            <option key={d} value={d}>
                              {d.charAt(0).toUpperCase() + d.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Program Details */}
                <section className="rounded-2xl border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">Program Details</div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm text-gray-700">Duration (weeks) *</label>
                        <input
                          type="number"
                          min={1}
                          value={durationWeeks as number | ""}
                          onChange={(e) => setDurationWeeks(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="e.g., 12"
                          className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700">Sessions/Week *</label>
                        <input
                          type="number"
                          min={1}
                          value={sessionsPerWeek as number | ""}
                          onChange={(e) => setSessionsPerWeek(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="e.g., 5"
                          className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700">Minutes/Session *</label>
                        <input
                          type="number"
                          min={1}
                          value={minutesPerSession as number | ""}
                          onChange={(e) => setMinutesPerSession(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="e.g., 60"
                          className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Equipment Needed</label>
                      <input
                        value={equipmentNeeded}
                        onChange={(e) => setEquipmentNeeded(e.target.value)}
                        placeholder="e.g., dumbbells, jump rope, mat"
                        className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Space Required</label>
                      <input
                        value={spaceRequired}
                        onChange={(e) => setSpaceRequired(e.target.value)}
                        placeholder="e.g., Small room with 2m x 2m free space"
                        className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Target Audience & Goals */}
                <section className="rounded-2xl border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">Target Audience & Goals</div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm text-gray-700">Target Audience</label>
                      <input
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="e.g., Busy intermediates aiming to cut fat"
                        className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Prerequisites</label>
                      <input
                        value={prerequisites}
                        onChange={(e) => setPrerequisites(e.target.value)}
                        placeholder="e.g., Basic movement competency and doctor clearance"
                        className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Expected Results</label>
                      <textarea
                        value={expectedResults}
                        onChange={(e) => setExpectedResults(e.target.value)}
                        placeholder="e.g., 3–6 kg fat loss and improved conditioning"
                        className="mt-1 w-full min-h-[80px] rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Pricing */}
                <section className="rounded-2xl border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">Pricing</div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-700">Price *</label>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={price as number | ""}
                          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="e.g., 49.99"
                          className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700">Discount %</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={discountPercentage as number | ""}
                          onChange={(e) => setDiscountPercentage(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="e.g., 10"
                          className="mt-1 w-full rounded-xl bg-gray-100/70 px-3 py-2 outline-none"
                        />
                      </div>
                    </div>
                    {originalPrice && (
                      <p className="text-sm text-gray-600">
                        Original price: ${originalPrice.toFixed(2)} → Discounted: ${price}
                      </p>
                    )}
                  </div>
                </section>

                {/* Program Includes */}
                <section className="rounded-2xl border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">Program Includes</div>
                  <div className="p-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includesMealPlan}
                        onChange={(e) => setIncludesMealPlan(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Meal Plan</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includesSupplementGuide}
                        onChange={(e) => setIncludesSupplementGuide(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Supplement Guide</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includesProgressTracking}
                        onChange={(e) => setIncludesProgressTracking(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Progress Tracking</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includesChatSupport}
                        onChange={(e) => setIncludesChatSupport(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Chat Support</span>
                    </label>
                  </div>
                </section>

                {/* Cover image */}
                <section className="rounded-2xl border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">Cover Image</div>
                  <div className="p-4">
                    <div className="rounded-xl border border-dashed border-gray-300">
                      <div className="px-4 py-8 text-center">
                        {coverImageUrl ? (
                          <div className="space-y-3">
                            <div className="relative mx-auto h-48 w-full max-w-[560px] overflow-hidden rounded-xl border border-gray-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={coverImageUrl} alt="Cover" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                              >
                                <FiUploadCloud />
                                Replace Image
                              </button>
                              <button
                                type="button"
                                onClick={removeCover}
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
                            <div className="text-sm text-gray-600">Upload your program cover image</div>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                            >
                              <FiUploadCloud />
                              Choose File
                            </button>
                          </div>
                        )}

                        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={pickCover} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT: preview */}
              <div className="w-full lg:w-1/2">
                <div className="sticky top-16">
                  <div className="rounded-2xl border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium">Preview</div>
                    <div className="p-4">
                      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="relative h-56 w-full bg-gray-100">
                          {coverImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={coverImageUrl} alt="Program cover" className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full place-items-center text-gray-400 text-sm">No cover yet</div>
                          )}
                          {price !== "" && price > 0 && (
                            <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-medium text-white">
                              premium
                            </span>
                          )}
                          {price !== "" && price > 0 && (
                            <div className="absolute right-3 top-3 grid gap-1 text-xs">
                              {originalPrice && (
                                <span className="rounded-full bg-white/90 px-3 py-1 line-through">
                                  ${originalPrice.toFixed(2)}/month
                                </span>
                              )}
                              <span className="rounded-full bg-white/90 px-3 py-1 font-semibold">${price}/month</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold">{title || "Program title"}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            {coach.avatarUrl ? (
                              <Image
                                src={coach.avatarUrl}
                                alt={coach.name}
                                width={20}
                                height={20}
                                className="h-5 w-5 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-gray-200 grid place-items-center text-[10px] font-semibold text-gray-700">
                                {coachInitials}
                              </div>
                            )}
                            <span>{coach.name || "Coach"}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
                            <span>⭐ 4.9 (156)</span>
                            <span>🕒 {durationWeeks || 12} weeks</span>
                            <span>🏷️ {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "Beginner"}</span>
                            {sessionsPerWeek && <span>📅 {sessionsPerWeek}x/week</span>}
                            {minutesPerSession && <span>⏱️ {minutesPerSession} min</span>}
                          </div>
                          <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                            {description || "Build a solid foundation with this comprehensive program."}
                          </p>
                          
                          {/* Show includes as tags */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {includesMealPlan && (
                              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
                                🍽️ Meal Plan
                              </span>
                            )}
                            {includesSupplementGuide && (
                              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
                                💊 Supplement Guide
                              </span>
                            )}
                            {includesProgressTracking && (
                              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
                                📊 Progress Tracking
                              </span>
                            )}
                            {includesChatSupport && (
                              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
                                💬 Chat Support
                              </span>
                            )}
                          </div>

                          {equipmentNeeded && (
                            <div className="mt-3 text-sm text-gray-600">
                              <strong>Equipment:</strong> {equipmentNeeded}
                            </div>
                          )}
                          
                          {targetAudience && (
                            <div className="mt-2 text-sm text-gray-600">
                              <strong>For:</strong> {targetAudience}
                            </div>
                          )}

                          <div className="mt-4 flex items-center gap-3">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                            >
                              ▶ Preview
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
                            >
                              {price !== "" && price > 0 ? `Subscribe` : `Add to Library`}
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
              {/* END Right */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
