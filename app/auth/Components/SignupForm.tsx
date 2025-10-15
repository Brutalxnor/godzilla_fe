// "use client";

// import { GetAllInterests } from "@/app/sign-up/Services/Interest.service";
// import { SignUoService } from "@/app/sign-up/Services/Signup.service";
// import { SignUpFormData } from "@/app/types/admin";
// import { InterestType } from "@/app/types/type";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";

// export const SignupForm = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [interest, setInterest] = useState<InterestType[]>([]);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//     watch,
//     setValue,
//   } = useForm<SignUpFormData>();

//   const fitnessInterestsList = [
//     { id: "weight_loss", label: "Weight Loss" },
//     { id: "muscle_gain", label: "Muscle Gain" },
//     { id: "endurance", label: "Endurance" },
//     { id: "strength", label: "Strength" },
//     { id: "flexibility", label: "Flexibility" },
//   ];

//   const sectionTitleStyle = {
//     fontSize: "18px",
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: "16px",
//     textAlign: "center" as const,
//   };

//   const fitnessInterestsGridStyle = {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
//     gap: "12px",
//     marginBottom: "24px",
//   };

//   const fitnessInterestButtonStyle = (isSelected: boolean) => ({
//     display: "flex",
//     flexDirection: "column" as const,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "16px 12px",
//     border: `2px solid ${isSelected ? "#ef4444" : "#e5e7eb"}`,
//     borderRadius: "12px",
//     backgroundColor: isSelected ? "#fef2f2" : "#f9fafb",
//     cursor: "pointer",
//     transition: "all 0.2s ease",
//     textAlign: "center" as const,
//     minHeight: "80px",
//   });

//   const fitnessInterestIconStyle = {
//     fontSize: "24px",
//     marginBottom: "8px",
//   };

//   const [selectedFitnessInterests, setSelectedFitnessInterests] = useState<
//     string[]
//   >([]);

//   const handleFitnessInterestToggle = (interestId: string) => {
//     const updatedInterests = selectedFitnessInterests.includes(interestId)
//       ? selectedFitnessInterests.filter((id) => id !== interestId)
//       : [...selectedFitnessInterests, interestId];

//     setSelectedFitnessInterests(updatedInterests);
//     setValue("interests", updatedInterests);
//   };


  
//   const onSubmit = async (data: SignUpFormData) => {
//     setIsSubmitting(true);
//     const formData = { ...data, avatar: selectedFile }; // avatar كـ File object – تأكد إن الـ service يدعمه

//     try {
//       const res = await SignUoService(formData); // ← إصلاح الـ typo: SignUpService

//       if ("error" in res) {
//         // Error case (افترض إن الـ service يرجع { error: string } زي LoginService)
//         console.log("Signup error:", res);
//         toast.error(res.error || "Signup failed"); // ← toast أحمر
//       } else {
//         // Success case
//         console.log("Signup success:", res);
//         toast.success("Signup Successfully! Welcome!"); // ← toast أخضر
//         // Reset form أو redirect (بدل الـ delay المصطنع)
//         setTimeout(() => {
//           // مثلاً: window.location.href = '/login'; أو router.push('/login') في Next.js
//           location.href = "/"; // أو redirect للـ login page
//         }, 1500);

//         // Reset الـ form (اختياري، لو بتستخدم react-hook-form)
//         reset(); // لو عندك reset من useForm
//       }
//     } catch (err) {
//       console.error("Unexpected error:", err);
//       toast.error("Unexpected error occurred during signup"); // ← toast عام
//     } finally {
//       setIsSubmitting(false); // ← في الـ finally عشان يتسكر دايمًا
//     }
//   };
//   const userType = watch("user_type");

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0] || null;
//     console.log("File selected:", file);

//     setSelectedFile(file);

//     if (file) {
//       console.log("Creating preview URL...");
//       const url = URL.createObjectURL(file);
//       console.log("Preview URL:", url);
//       setPreviewUrl(url);
//     } else {
//       setPreviewUrl(null);
//     }
//   };

//   useEffect(() => {
//     const fetchGetAllInterests = async () => {
//       const data = await GetAllInterests();
//       setInterest(data || []);
//     };
//     fetchGetAllInterests();
//   }, []);

//   React.useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   // إزالة الصورة المختارة
//   const removeSelectedImage = () => {
//     setSelectedFile(null);
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl);
//       setPreviewUrl(null);
//     }
//     // إعادة تعيين input
//     const fileInput = document.getElementById(
//       "avatar-upload"
//     ) as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = "";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center px-4 py-8 ">
//       <div className="w-[60pc] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden overflow-y-scroll">
//         {/* Header */}
//         <div className="text-center pt-8 pb-6 px-8 bg-gradient-to-b from-white to-gray-50">
//           <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
//             <svg
//               className="w-8 h-8 text-white"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path d="M13 2L3 14h5l-3 8 10-12h-5l3-8z" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome to Godzilla
//           </h1>
//           <p className="text-gray-600 text-sm">
//             Transform your fitness journey
//           </p>
//         </div>

//         {/* Hero Image */}
//         <div className="px-8 mb-6">
//           <div className="relative overflow-hidden rounded-2xl shadow-lg">
//             <img
//               src="godzillaImage.jpeg"
//               alt="Fitness training"
//               className="w-full h-40 object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-5">
//           {/* Role Selection */}
//           <div className="space-y-3">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">
//               Select Your Role
//             </h3>
//             <label
//               className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
//                 userType === "athlete"
//                   ? "bg-red-50 border-red-200 shadow-sm"
//                   : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//               }`}
//             >
//               <input
//                 {...register("user_type", { required: "Please select a role" })}
//                 type="radio"
//                 value="athlete"
//                 className="w-5 h-5 text-red-600 border-2 border-gray-300 focus:ring-red-500 focus:ring-2 focus:ring-offset-0 mr-4"
//               />
//               <div className="flex-1">
//                 <span
//                   className={`font-semibold block ${
//                     userType === "athlete" ? "text-red-700" : "text-gray-700"
//                   }`}
//                 >
//                   🏃‍♂️ I am an Athlete
//                 </span>
//                 <span className="text-sm text-gray-500">
//                   Track performance and connect with coaches
//                 </span>
//               </div>
//             </label>

//             <label
//               className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
//                 userType === "coach"
//                   ? "bg-red-50 border-red-200 shadow-sm"
//                   : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//               }`}
//             >
//               <input
//                 {...register("user_type")}
//                 type="radio"
//                 value="coach"
//                 className="w-5 h-5 text-red-600 border-2 border-gray-300 focus:ring-red-500 focus:ring-2 focus:ring-offset-0 mr-4"
//               />
//               <div className="flex-1">
//                 <span
//                   className={`font-semibold block ${
//                     userType === "coach" ? "text-red-700" : "text-gray-700"
//                   }`}
//                 >
//                   💪 I am a Coach
//                 </span>
//                 <span className="text-sm text-gray-500">
//                   Train athletes and manage programs
//                 </span>
//               </div>
//             </label>

//             {errors.user_type && (
//               <p className="text-red-500 text-sm flex items-center mt-2">
//                 <svg
//                   className="w-4 h-4 mr-1"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 {errors.user_type.message as string}
//               </p>
//             )}
//           </div>

//           {/* Name Fields */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 First Name
//               </label>
//               <input
//                 {...register("first_name", {
//                   required: "First name is required",
//                 })}
//                 type="text"
//                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
//                   errors.first_name
//                     ? "border-red-300 bg-red-50"
//                     : "border-gray-200 bg-gray-50 focus:bg-white"
//                 }`}
//               />
//               {errors.first_name && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.first_name.message as string}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Last Name
//               </label>
//               <input
//                 {...register("second_name", {
//                   required: "Last name is required",
//                 })}
//                 type="text"
//                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
//                   errors.second_name
//                     ? "border-red-300 bg-red-50"
//                     : "border-gray-200 bg-gray-50 focus:bg-white"
//                 }`}
//               />
//               {errors.second_name && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.second_name.message as string}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                 <svg
//                   className="w-5 h-5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
//                   />
//                 </svg>
//               </div>
//               <input
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^\S+@\S+$/i,
//                     message: "Please enter a valid email",
//                   },
//                 })}
//                 type="email"
//                 className={`w-full p-4 pl-12 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
//                   errors.email
//                     ? "border-red-300 bg-red-50"
//                     : "border-gray-200 bg-gray-50 focus:bg-white"
//                 }`}
//               />
//             </div>
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.email.message as string}
//               </p>
//             )}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number
//             </label>
//             <div className="relative">
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                 <svg
//                   className="w-5 h-5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 {...register("phone", { required: "Phone number is required" })}
//                 type="tel"
//                 className={`w-full p-4 pl-12 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
//                   errors.phone
//                     ? "border-red-300 bg-red-50"
//                     : "border-gray-200 bg-gray-50 focus:bg-white"
//                 }`}
//               />
//             </div>
//             {errors.phone && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.phone.message as string}
//               </p>
//             )}
//           </div>

//           {/* Date and Location */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Date of Birth
//               </label>
//               <input
//                 {...register("date_of_birth", {
//                   required: "Date of birth is required",
//                 })}
//                 type="date"
//                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
//                   errors.date_of_birth
//                     ? "border-red-300 bg-red-50"
//                     : "border-gray-200 bg-gray-50 focus:bg-white"
//                 }`}
//               />
//               {errors.date_of_birth && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.date_of_birth.message as string}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Location
//               </label>
//               <input
//                 {...register("location", { required: "Location is required" })}
//                 type="text"
//                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
//                   errors.location
//                     ? "border-red-300 bg-red-50"
//                     : "border-gray-200 bg-gray-50 focus:bg-white"
//                 }`}
//               />
//               {errors.location && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.location.message as string}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Experience Level */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Experience Level
//             </label>
//             <select
//               {...register("experience_level", {
//                 required: "Please select your experience level",
//               })}
//               className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 bg-gray-50 focus:bg-white ${
//                 errors.experience_level
//                   ? "border-red-300 bg-red-50"
//                   : "border-gray-200"
//               }`}
//             >
//               <option value="">Select Experience Level</option>
//               <option value="beginner">🌱 Beginner</option>
//               <option value="intermediate">💪 Intermediate</option>
//               <option value="advanced">🔥 Advanced</option>
//               <option value="expert">⚡ Expert</option>
//             </select>
//             {errors.experience_level && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.experience_level.message as string}
//               </p>
//             )}
//           </div>

//           {/* Avatar Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Profile Picture
//             </label>
//             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-300 transition-colors duration-200">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//                 id="avatar-upload"
//               />
//               <label htmlFor="avatar-upload" className="cursor-pointer">
//                 {previewUrl ? (
//                   // عرض المعاينة لو الصورة مختارة
//                   <div className="space-y-4">
//                     <div className="relative">
//                       <img
//                         src={previewUrl}
//                         alt="Preview"
//                         className="w-32 h-32 object-cover rounded-lg mx-auto shadow-md border-2 border-gray-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={removeSelectedImage}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
//                       >
//                         ×
//                       </button>
//                     </div>
//                     <p className="text-sm text-green-600 font-medium">
//                       ✓ {selectedFile?.name || "Image selected"}{" "}
//                       {/* ← الإصلاح: .name */}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Click to change or remove
//                     </p>
//                   </div>
//                 ) : (
//                   // التصميم الأصلي لو مفيش صورة مختارة
//                   <div>
//                     <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
//                       <svg
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         className="w-full h-full"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                         />
//                       </svg>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       Click to upload or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500 mt-2">
//                       PNG, JPG up to 2MB
//                     </p>
//                   </div>
//                 )}
//               </label>
//             </div>
//           </div>

//           {/* Coach Specialization */}
//           {userType === "coach" && (
//             <div className="animate-in slide-in-from-top-2 duration-300">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Specialization Description
//               </label>
//               <textarea
//                 {...register("specialization_description", {
//                   required:
//                     userType === "coach"
//                       ? "Description is required for coaches"
//                       : false,
//                 })}
//                 rows={4}
//                 placeholder="Describe your specialization and coaching philosophy..."
//                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 resize-none ${
//                   errors.specialization_description
//                     ? "border-red-300 bg-red-50"
//                     : "border-gray-200 bg-gray-50 focus:bg-white"
//                 }`}
//               />
//               {errors.specialization_description && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.specialization_description.message as string}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                 <svg
//                   className="w-5 h-5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: {
//                     value: 8,
//                     message: "Password must be at least 8 characters",
//                   },
//                 })}
//                 type={showPassword ? "text" : "password"}
//                 className={`w-full p-4 pl-12 pr-12 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
//                   errors.password
//                     ? "border-red-300 bg-red-50"
//                     : "border-gray-200 bg-gray-50 focus:bg-white"
//                 }`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
//               >
//                 {showPassword ? (
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.password.message as string}
//               </p>
//             )}
//           </div>

//           <div style={{ marginBottom: "32px" }}>
//             <h3 style={sectionTitleStyle}>Fitness Interests</h3>
//             <div style={fitnessInterestsGridStyle}>
//               {Array.isArray(interest) &&
//                 interest?.map((interest) => (
//                   <div
//                     key={interest.id}
//                     onClick={() => handleFitnessInterestToggle(interest.id)}
//                     style={fitnessInterestButtonStyle(
//                       selectedFitnessInterests.includes(interest.id)
//                     )}
//                     className={`fitness-interest ${
//                       selectedFitnessInterests.includes(interest.id)
//                         ? "selected"
//                         : ""
//                     }`}
//                   >
//                     <span
//                     // style={fitnessInterestsGridStyle(
//                     //   selectedFitnessInterests.includes(interest.id)
//                     // )}
//                     >
//                       {interest.name}
//                     </span>
//                   </div>
//                 ))}
//             </div>
//             {selectedFitnessInterests.length === 0 && (
//               <div
//                 style={{
//                   color: "#6b7280",
//                   fontSize: "14px",
//                   textAlign: "center" as const,
//                   fontStyle: "italic",
//                   marginTop: "8px",
//                 }}
//               >
//                 Select your fitness interests to get personalized
//                 recommendations
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full p-4 font-semibold rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-red-200 ${
//               isSubmitting
//                 ? "bg-gray-400 cursor-not-allowed shadow-none"
//                 : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-xl transform hover:-translate-y-1 active:transform-none"
//             }`}
//           >
//             {isSubmitting ? (
//               <div className="flex items-center justify-center">
//                 <svg
//                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Creating Account...
//               </div>
//             ) : (
//               <div className="flex items-center justify-center">
//                 <span>Create Account</span>
//                 <svg
//                   className="ml-2 w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17 8l4 4m0 0l-4 4m4-4H3"
//                   />
//                 </svg>
//               </div>
//             )}
//           </button>

//           {/* Sign In Link */}
//           <div className="text-center pt-4">
//             <p className="text-gray-600 text-sm">
//               Already have an account?
//               <span className="text-red-500 font-medium hover:text-red-600 cursor-pointer ml-1 transition-colors hover:underline">
//                 Sign in
//               </span>
//             </p>
//           </div>

//           {/* Terms */}
//           <div className="text-center pt-2">
//             <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
//               By creating an account, you agree to our
//               <span className="text-red-500 hover:text-red-600 cursor-pointer transition-colors hover:underline">
//                 {" "}
//                 Terms of Service{" "}
//               </span>
//               and
//               <span className="text-red-500 hover:text-red-600 cursor-pointer transition-colors hover:underline">
//                 {" "}
//                 Privacy Policy
//               </span>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };




// // "use client";

// // import { GetAllInterests } from "@/app/sign-up/Services/Interest.service";
// // import { SignUoService } from "@/app/sign-up/Services/Signup.service";
// // import { SignUpFormData } from "@/app/types/admin";
// // import { InterestType } from "@/app/types/type";
// // import React, { useEffect, useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { toast } from "react-toastify";
// // import { createClient } from "@supabase/supabase-js";
// // import { supabase } from "@/lib/client";

// // export const SignupForm = () => {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
// //   const [interest, setInterest] = useState<InterestType[]>([]);

// //   const {
// //     register,
// //     handleSubmit,
// //     reset,
// //     formState: { errors },
// //     watch,
// //     setValue,
// //   } = useForm<SignUpFormData>();



// //   // Function to upload file to Supabase Storage
// //   const uploadToSupabase = async (file: File): Promise<string> => {
// //     const fileName = `${Date.now()}-${file.name}`; // Unique file name
// //     const { data, error } = await supabase.storage
// //       .from("avatars")
// //       .upload(`profile-pictures/${fileName}`, file, {
// //         contentType: file.type,
// //         upsert: true, // Overwrite if file with same name exists
// //       });

// //     if (error) {
// //       console.error("Supabase upload error:", error);
// //       throw new Error("Failed to upload profile picture");
// //     }

// //     // Get public URL for the uploaded file
// //     const { data: publicUrlData } = supabase.storage
// //       .from("avatars")
// //       .getPublicUrl(`profile-pictures/${fileName}`);

// //     if (!publicUrlData?.publicUrl) {
// //       throw new Error("Failed to retrieve public URL for the uploaded file");
// //     }

// //     return publicUrlData.publicUrl;
// //   };

// //   const fitnessInterestsList = [
// //     { id: "weight_loss", label: "Weight Loss" },
// //     { id: "muscle_gain", label: "Muscle Gain" },
// //     { id: "endurance", label: "Endurance" },
// //     { id: "strength", label: "Strength" },
// //     { id: "flexibility", label: "Flexibility" },
// //   ];

// //   const sectionTitleStyle = {
// //     fontSize: "18px",
// //     fontWeight: "600",
// //     color: "#374151",
// //     marginBottom: "16px",
// //     textAlign: "center" as const,
// //   };

// //   const fitnessInterestsGridStyle = {
// //     display: "grid",
// //     gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
// //     gap: "12px",
// //     marginBottom: "24px",
// //   };

// //   const fitnessInterestButtonStyle = (isSelected: boolean) => ({
// //     display: "flex",
// //     flexDirection: "column" as const,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     padding: "16px 12px",
// //     border: `2px solid ${isSelected ? "#ef4444" : "#e5e7eb"}`,
// //     borderRadius: "12px",
// //     backgroundColor: isSelected ? "#fef2f2" : "#f9fafb",
// //     cursor: "pointer",
// //     transition: "all 0.2s ease",
// //     textAlign: "center" as const,
// //     minHeight: "80px",
// //   });

// //   const fitnessInterestIconStyle = {
// //     fontSize: "24px",
// //     marginBottom: "8px",
// //   };

// //   const [selectedFitnessInterests, setSelectedFitnessInterests] = useState<
// //     string[]
// //   >([]);

// //   const handleFitnessInterestToggle = (interestId: string) => {
// //     const updatedInterests = selectedFitnessInterests.includes(interestId)
// //       ? selectedFitnessInterests.filter((id) => id !== interestId)
// //       : [...selectedFitnessInterests, interestId];

// //     setSelectedFitnessInterests(updatedInterests);
// //     setValue("interests", updatedInterests);
// //   };

// //   const onSubmit = async (data: SignUpFormData) => {
// //     setIsSubmitting(true);
// //     let avatarUrl: string | undefined;

// //     try {
// //       // Upload avatar to Supabase if a file is selected
// //       if (selectedFile) {
// //         avatarUrl = await uploadToSupabase(selectedFile);
// //       }

// //       // Prepare form data with avatar URL (instead of File object)
// //       const formData = { ...data, avatar: avatarUrl };

// //       const res = await SignUoService(formData);

// //       if ("error" in res) {
// //         console.log("Signup error:", res);
// //         toast.error(res.error || "Signup failed");
// //       } else {
// //         console.log("Signup success:", res);
// //         toast.success("Signup Successfully! Welcome!");
// //         setTimeout(() => {
// //           location.href = "/";
// //         }, 1500);
// //         reset();
// //       }
// //     } catch (err) {
// //       console.error("Unexpected error:", err);
// //       toast.error("Unexpected error occurred during signup");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const userType = watch("user_type");

// //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = event.target.files?.[0] || null;
// //     console.log("File selected:", file);

// //     setSelectedFile(file);

// //     if (file) {
// //       console.log("Creating preview URL...");
// //       const url = URL.createObjectURL(file);
// //       console.log("Preview URL:", url);
// //       setPreviewUrl(url);
// //     } else {
// //       setPreviewUrl(null);
// //     }
// //   };

// //   useEffect(() => {
// //     const fetchGetAllInterests = async () => {
// //       const data = await GetAllInterests();
// //       setInterest(data || []);
// //     };
// //     fetchGetAllInterests();
// //   }, []);

// //   React.useEffect(() => {
// //     return () => {
// //       if (previewUrl) {
// //         URL.revokeObjectURL(previewUrl);
// //       }
// //     };
// //   }, [previewUrl]);

// //   const removeSelectedImage = () => {
// //     setSelectedFile(null);
// //     if (previewUrl) {
// //       URL.revokeObjectURL(previewUrl);
// //       setPreviewUrl(null);
// //     }
// //     const fileInput = document.getElementById(
// //       "avatar-upload"
// //     ) as HTMLInputElement;
// //     if (fileInput) {
// //       fileInput.value = "";
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center px-4 py-8">
// //       <div className="w-[60pc] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden overflow-y-scroll">
// //         {/* Header */}
// //         <div className="text-center pt-8 pb-6 px-8 bg-gradient-to-b from-white to-gray-50">
// //           <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
// //             <svg
// //               className="w-8 h-8 text-white"
// //               fill="currentColor"
// //               viewBox="0 0 24 24"
// //             >
// //               <path d="M13 2L3 14h5l-3 8 10-12h-5l3-8z" />
// //             </svg>
// //           </div>
// //           <h1 className="text-3xl font-bold text-gray-900 mb-2">
// //             Welcome to Godzilla
// //           </h1>
// //           <p className="text-gray-600 text-sm">
// //             Transform your fitness journey
// //           </p>
// //         </div>

// //         {/* Hero Image */}
// //         <div className="px-8 mb-6">
// //           <div className="relative overflow-hidden rounded-2xl shadow-lg">
// //             <img
// //               src="godzillaImage.jpeg"
// //               alt="Fitness training"
// //               className="w-full h-40 object-cover"
// //             />
// //             <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
// //           </div>
// //         </div>

// //         {/* Form */}
// //         <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-5">
// //           {/* Role Selection */}
// //           <div className="space-y-3">
// //             <h3 className="text-sm font-semibold text-gray-700 mb-3">
// //               Select Your Role
// //             </h3>
// //             <label
// //               className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
// //                 userType === "athlete"
// //                   ? "bg-red-50 border-red-200 shadow-sm"
// //                   : "bg-gray-50 border-gray-200 hover:bg-gray-100"
// //               }`}
// //             >
// //               <input
// //                 {...register("user_type", { required: "Please select a role" })}
// //                 type="radio"
// //                 value="athlete"
// //                 className="w-5 h-5 text-red-600 border-2 border-gray-300 focus:ring-red-500 focus:ring-2 focus:ring-offset-0 mr-4"
// //               />
// //               <div className="flex-1">
// //                 <span
// //                   className={`font-semibold block ${
// //                     userType === "athlete" ? "text-red-700" : "text-gray-700"
// //                   }`}
// //                 >
// //                   🏃‍♂️ I am an Athlete
// //                 </span>
// //                 <span className="text-sm text-gray-500">
// //                   Track performance and connect with coaches
// //                 </span>
// //               </div>
// //             </label>

// //             <label
// //               className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
// //                 userType === "coach"
// //                   ? "bg-red-50 border-red-200 shadow-sm"
// //                   : "bg-gray-50 border-gray-200 hover:bg-gray-100"
// //               }`}
// //             >
// //               <input
// //                 {...register("user_type")}
// //                 type="radio"
// //                 value="coach"
// //                 className="w-5 h-5 text-red-600 border-2 border-gray-300 focus:ring-red-500 focus:ring-2 focus:ring-offset-0 mr-4"
// //               />
// //               <div className="flex-1">
// //                 <span
// //                   className={`font-semibold block ${
// //                     userType === "coach" ? "text-red-700" : "text-gray-700"
// //                   }`}
// //                 >
// //                   💪 I am a Coach
// //                 </span>
// //                 <span className="text-sm text-gray-500">
// //                   Train athletes and manage programs
// //                 </span>
// //               </div>
// //             </label>

// //             {errors.user_type && (
// //               <p className="text-red-500 text-sm flex items-center mt-2">
// //                 <svg
// //                   className="w-4 h-4 mr-1"
// //                   fill="currentColor"
// //                   viewBox="0 0 20 20"
// //                 >
// //                   <path
// //                     fillRule="evenodd"
// //                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
// //                     clipRule="evenodd"
// //                   />
// //                 </svg>
// //                 {errors.user_type.message as string}
// //               </p>
// //             )}
// //           </div>

// //           {/* Name Fields */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 First Name
// //               </label>
// //               <input
// //                 {...register("first_name", {
// //                   required: "First name is required",
// //                 })}
// //                 type="text"
// //                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
// //                   errors.first_name
// //                     ? "border-red-300 bg-red-50"
// //                     : "border-gray-200 bg-gray-50 focus:bg-white"
// //                 }`}
// //               />
// //               {errors.first_name && (
// //                 <p className="text-red-500 text-xs mt-1">
// //                   {errors.first_name.message as string}
// //                 </p>
// //               )}
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Last Name
// //               </label>
// //               <input
// //                 {...register("second_name", {
// //                   required: "Last name is required",
// //                 })}
// //                 type="text"
// //                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
// //                   errors.second_name
// //                     ? "border-red-300 bg-red-50"
// //                     : "border-gray-200 bg-gray-50 focus:bg-white"
// //                 }`}
// //               />
// //               {errors.second_name && (
// //                 <p className="text-red-500 text-xs mt-1">
// //                   {errors.second_name.message as string}
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Email */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Email Address
// //             </label>
// //             <div className="relative">
// //               <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
// //                 <svg
// //                   className="w-5 h-5 text-gray-400"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
// //                   />
// //                 </svg>
// //               </div>
// //               <input
// //                 {...register("email", {
// //                   required: "Email is required",
// //                   pattern: {
// //                     value: /^\S+@\S+$/i,
// //                     message: "Please enter a valid email",
// //                   },
// //                 })}
// //                 type="email"
// //                 className={`w-full p-4 pl-12 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
// //                   errors.email
// //                     ? "border-red-300 bg-red-50"
// //                     : "border-gray-200 bg-gray-50 focus:bg-white"
// //                 }`}
// //               />
// //             </div>
// //             {errors.email && (
// //               <p className="text-red-500 text-xs mt-1">
// //                 {errors.email.message as string}
// //               </p>
// //             )}
// //           </div>

// //           {/* Phone */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Phone Number
// //             </label>
// //             <div className="relative">
// //               <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
// //                 <svg
// //                   className="w-5 h-5 text-gray-400"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
// //                   />
// //                 </svg>
// //               </div>
// //               <input
// //                 {...register("phone", { required: "Phone number is required" })}
// //                 type="tel"
// //                 className={`w-full p-4 pl-12 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
// //                   errors.phone
// //                     ? "border-red-300 bg-red-50"
// //                     : "border-gray-200 bg-gray-50 focus:bg-white"
// //                 }`}
// //               />
// //             </div>
// //             {errors.phone && (
// //               <p className="text-red-500 text-xs mt-1">
// //                 {errors.phone.message as string}
// //               </p>
// //             )}
// //           </div>

// //           {/* Date and Location */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Date of Birth
// //               </label>
// //               <input
// //                 {...register("date_of_birth", {
// //                   required: "Date of birth is required",
// //                 })}
// //                 type="date"
// //                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
// //                   errors.date_of_birth
// //                     ? "border-red-300 bg-red-50"
// //                     : "border-gray-200 bg-gray-50 focus:bg-white"
// //                 }`}
// //               />
// //               {errors.date_of_birth && (
// //                 <p className="text-red-500 text-xs mt-1">
// //                   {errors.date_of_birth.message as string}
// //                 </p>
// //               )}
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Location
// //               </label>
// //               <input
// //                 {...register("location", { required: "Location is required" })}
// //                 type="text"
// //                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
// //                   errors.location
// //                     ? "border-red-300 bg-red-50"
// //                     : "border-gray-200 bg-gray-50 focus:bg-white"
// //                 }`}
// //               />
// //               {errors.location && (
// //                 <p className="text-red-500 text-xs mt-1">
// //                   {errors.location.message as string}
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Experience Level */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Experience Level
// //             </label>
// //             <select
// //               {...register("experience_level", {
// //                 required: "Please select your experience level",
// //               })}
// //               className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 bg-gray-50 focus:bg-white ${
// //                 errors.experience_level
// //                   ? "border-red-300 bg-red-50"
// //                   : "border-gray-200"
// //               }`}
// //             >
// //               <option value="">Select Experience Level</option>
// //               <option value="beginner">🌱 Beginner</option>
// //               <option value="intermediate">💪 Intermediate</option>
// //               <option value="advanced">🔥 Advanced</option>
// //               <option value="expert">⚡ Expert</option>
// //             </select>
// //             {errors.experience_level && (
// //               <p className="text-red-500 text-xs mt-1">
// //                 {errors.experience_level.message as string}
// //               </p>
// //             )}
// //           </div>

// //           {/* Avatar Upload */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Profile Picture
// //             </label>
// //             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-300 transition-colors duration-200">
// //               <input
// //                 type="file"
// //                 accept="image/*"
// //                 onChange={handleFileChange}
// //                 className="hidden"
// //                 id="avatar-upload"
// //               />
// //               <label htmlFor="avatar-upload" className="cursor-pointer">
// //                 {previewUrl ? (
// //                   <div className="space-y-4">
// //                     <div className="relative">
// //                       <img
// //                         src={previewUrl}
// //                         alt="Preview"
// //                         className="w-32 h-32 object-cover rounded-lg mx-auto shadow-md border-2 border-gray-200"
// //                       />
// //                       <button
// //                         type="button"
// //                         onClick={removeSelectedImage}
// //                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
// //                       >
// //                         ×
// //                       </button>
// //                     </div>
// //                     <p className="text-sm text-green-600 font-medium">
// //                       ✓ {selectedFile?.name || "Image selected"}
// //                     </p>
// //                     <p className="text-xs text-gray-500">
// //                       Click to change or remove
// //                     </p>
// //                   </div>
// //                 ) : (
// //                   <div>
// //                     <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
// //                       <svg
// //                         fill="none"
// //                         stroke="currentColor"
// //                         viewBox="0 0 24 24"
// //                         className="w-full h-full"
// //                       >
// //                         <path
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                           strokeWidth={2}
// //                           d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
// //                         />
// //                       </svg>
// //                     </div>
// //                     <p className="text-sm text-gray-600">
// //                       Click to upload or drag and drop
// //                     </p>
// //                     <p className="text-xs text-gray-500 mt-2">
// //                       PNG, JPG up to 2MB
// //                     </p>
// //                   </div>
// //                 )}
// //               </label>
// //             </div>
// //           </div>

// //           {/* Coach Specialization */}
// //           {userType === "coach" && (
// //             <div className="animate-in slide-in-from-top-2 duration-300">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Specialization Description
// //               </label>
// //               <textarea
// //                 {...register("specialization_description", {
// //                   required:
// //                     userType === "coach"
// //                       ? "Description is required for coaches"
// //                       : false,
// //                 })}
// //                 rows={4}
// //                 placeholder="Describe your specialization and coaching philosophy..."
// //                 className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 resize-none ${
// //                   errors.specialization_description
// //                     ? "border-red-300 bg-red-50"
// //                     : "border-gray-200 bg-gray-50 focus:bg-white"
// //                 }`}
// //               />
// //               {errors.specialization_description && (
// //                 <p className="text-red-500 text-xs mt-1">
// //                   {errors.specialization_description.message as string}
// //                 </p>
// //               )}
// //             </div>
// //           )}

// //           {/* Password */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Password
// //             </label>
// //             <div className="relative">
// //               <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
// //                 <svg
// //                   className="w-5 h-5 text-gray-400"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
// //                   />
// //                 </svg>
// //               </div>
// //               <input
// //                 {...register("password", {
// //                   required: "Password is required",
// //                   minLength: {
// //                     value: 8,
// //                     message: "Password must be at least 8 characters",
// //                   },
// //                 })}
// //                 type={showPassword ? "text" : "password"}
// //                 className={`w-full p-4 pl-12 pr-12 border-2 rounded-xl focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 ${
// //                   errors.password
// //                     ? "border-red-300 bg-red-50"
// //                     : "border-gray-200 bg-gray-50 focus:bg-white"
// //                 }`}
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => setShowPassword(!showPassword)}
// //                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
// //               >
// //                 {showPassword ? (
// //                   <svg
// //                     className="w-5 h-5"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     viewBox="0 0 24 24"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
// //                     />
// //                   </svg>
// //                 ) : (
// //                   <svg
// //                     className="w-5 h-5"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     viewBox="0 0 24 24"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
// //                     />
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
// //                     />
// //                   </svg>
// //                 )}
// //               </button>
// //             </div>
// //             {errors.password && (
// //               <p className="text-red-500 text-xs mt-1">
// //                 {errors.password.message as string}
// //               </p>
// //             )}
// //           </div>

// //           <div style={{ marginBottom: "32px" }}>
// //             <h3 style={sectionTitleStyle}>Fitness Interests</h3>
// //             <div style={fitnessInterestsGridStyle}>
// //               {Array.isArray(interest) &&
// //                 interest?.map((interest) => (
// //                   <div
// //                     key={interest.id}
// //                     onClick={() => handleFitnessInterestToggle(interest.id)}
// //                     style={fitnessInterestButtonStyle(
// //                       selectedFitnessInterests.includes(interest.id)
// //                     )}
// //                     className={`fitness-interest ${
// //                       selectedFitnessInterests.includes(interest.id)
// //                         ? "selected"
// //                         : ""
// //                     }`}
// //                   >
// //                     <span>{interest.name}</span>
// //                   </div>
// //                 ))}
// //             </div>
// //             {selectedFitnessInterests.length === 0 && (
// //               <div
// //                 style={{
// //                   color: "#6b7280",
// //                   fontSize: "14px",
// //                   textAlign: "center" as const,
// //                   fontStyle: "italic",
// //                   marginTop: "8px",
// //                 }}
// //               >
// //                 Select your fitness interests to get personalized
// //                 recommendations
// //               </div>
// //             )}
// //           </div>

// //           {/* Submit Button */}
// //           <button
// //             type="submit"
// //             disabled={isSubmitting}
// //             className={`w-full p-4 font-semibold rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-red-200 ${
// //               isSubmitting
// //                 ? "bg-gray-400 cursor-not-allowed shadow-none"
// //                 : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-xl transform hover:-translate-y-1 active:transform-none"
// //             }`}
// //           >
// //             {isSubmitting ? (
// //               <div className="flex items-center justify-center">
// //                 <svg
// //                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   fill="none"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <circle
// //                     className="opacity-25"
// //                     cx="12"
// //                     cy="12"
// //                     r="10"
// //                     stroke="currentColor"
// //                     strokeWidth="4"
// //                   ></circle>
// //                   <path
// //                     className="opacity-75"
// //                     fill="currentColor"
// //                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// //                   ></path>
// //                 </svg>
// //                 Creating Account...
// //               </div>
// //             ) : (
// //               <div className="flex items-center justify-center">
// //                 <span>Create Account</span>
// //                 <svg
// //                   className="ml-2 w-4 h-4"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M17 8l4 4m0 0l-4 4m4-4H3"
// //                   />
// //                 </svg>
// //               </div>
// //             )}
// //           </button>

// //           {/* Sign In Link */}
// //           <div className="text-center pt-4">
// //             <p className="text-gray-600 text-sm">
// //               Already have an account?
// //               <span className="text-red-500 font-medium hover:text-red-600 cursor-pointer ml-1 transition-colors hover:underline">
// //                 Sign in
// //               </span>
// //             </p>
// //           </div>

// //           {/* Terms */}
// //           <div className="text-center pt-2">
// //             <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
// //               By creating an account, you agree to our
// //               <span className="text-red-500 hover:text-red-600 cursor-pointer transition-colors hover:underline">
// //                 {" "}
// //                 Terms of Service{" "}
// //               </span>
// //               and
// //               <span className="text-red-500 hover:text-red-600 cursor-pointer transition-colors hover:underline">
// //                 {" "}
// //                 Privacy Policy
// //               </span>
// //             </p>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };



"use client";

import { GetAllInterests } from "@/app/sign-up/Services/Interest.service";
import { SignUoService } from "@/app/sign-up/Services/Signup.service";
import { SignUpFormData } from "@/app/types/admin";
import { InterestType } from "@/app/types/type";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Link from "next/link";


export const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [interest, setInterest] = useState<InterestType[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignUpFormData>();

  const [selectedFitnessInterests, setSelectedFitnessInterests] = useState<string[]>([]);
  const handleFitnessInterestToggle = (interestId: string) => {
    const updated = selectedFitnessInterests.includes(interestId)
      ? selectedFitnessInterests.filter((id) => id !== interestId)
      : [...selectedFitnessInterests, interestId];
    setSelectedFitnessInterests(updated);
    setValue("interests", updated);
  };

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    const formData = { ...data, avatar: selectedFile };

    try {
      const res = await SignUoService(formData);
      if ("error" in res) {
        toast.error(res.message || "This email already has an account!");
        console.log(res);
        
      } else {
        toast.success("Signup Successfully! Welcome!");
        setTimeout(() => (location.href = "/"), 1500);
        reset();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userType = watch("user_type");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    const fetchGetAllInterests = async () => {
      const data = await GetAllInterests();
      setInterest(data || []);
    };
    fetchGetAllInterests();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const removeSelectedImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    const fileInput = document.getElementById("avatar-upload") as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[var(--background)]">
      <div className="w-[60pc] rounded-3xl shadow-2xl border overflow-hidden overflow-y-scroll bg-[var(--surface)] border-[var(--border)]">
        {/* Header (no white gradient) */}
        <div className="text-center pt-8 pb-6 px-8 bg-[var(--surface)]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg bg-gradient-to-br from-red-500 to-red-600">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h5l-3 8 10-12h-5l3-8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Welcome to Godzilla</h1>
          <p className="text-[var(--muted)] text-sm">Transform your fitness journey</p>
        </div>

        {/* Hero Image */}
        <div className="px-8 mb-6">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img src="godzillaImage.jpeg" alt="Fitness training" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-5">
          {/* Role Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--foreground)]/80 mb-3">Select Your Role</h3>

            <label
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors
                          ${userType === "athlete"
                            ? "bg-[var(--accent-soft)] border-[var(--accent-border)]"
                            : "bg-[var(--chip)] border-[var(--border)] hover:opacity-90"}`}
            >
              <input
                {...register("user_type", { required: "Please select a role" })}
                type="radio"
                value="athlete"
                className="w-5 h-5 mr-4 accent-red-600"
              />
              <div className="flex-1">
                <span className="font-semibold block text-[var(--foreground)]">🏃‍♂️ I am an Athlete</span>
                <span className="text-sm text-[var(--muted)]">Track performance and connect with coaches</span>
              </div>
            </label>

            <label
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors
                          ${userType === "coach"
                            ? "bg-[var(--accent-soft)] border-[var(--accent-border)]"
                            : "bg-[var(--chip)] border-[var(--border)] hover:opacity-90"}`}
            >
              <input
                {...register("user_type")}
                type="radio"
                value="coach"
                className="w-5 h-5 mr-4 accent-red-600"
              />
              <div className="flex-1">
                <span className="font-semibold block text-[var(--foreground)]">💪 I am a Coach</span>
                <span className="text-sm text-[var(--muted)]">Train athletes and manage programs</span>
              </div>
            </label>

            {errors.user_type && (
              <p className="text-red-500 text-sm flex items-center mt-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.user_type.message as string}
              </p>
            )}
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">First Name</label>
              <input
                {...register("first_name", { required: "First name is required" })}
                type="text"
                className={`w-full p-4 border-2 rounded-xl transition-all
                            bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
                            focus:outline-none focus:ring-2 focus:ring-red-500/30
                            ${errors.first_name ? "border-red-400" : ""}`}
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Last Name</label>
              <input
                {...register("second_name", { required: "Last name is required" })}
                type="text"
                className={`w-full p-4 border-2 rounded-xl transition-all
                            bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
                            focus:outline-none focus:ring-2 focus:ring-red-500/30
                            ${errors.second_name ? "border-red-400" : ""}`}
              />
              {errors.second_name && (
                <p className="text-red-500 text-xs mt-1">{errors.second_name.message as string}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
              </div>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email" },
                })}
                type="email"
                className={`w-full p-4 pl-12 border-2 rounded-xl transition-all
                            bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
                            focus:outline-none focus:ring-2 focus:ring-red-500/30
                            ${errors.email ? "border-red-400" : ""}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <input
                {...register("phone", { required: "Phone number is required" })}
                type="tel"
                className={`w-full p-4 pl-12 border-2 rounded-xl transition-all
                            bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
                            focus:outline-none focus:ring-2 focus:ring-red-500/30
                            ${errors.phone ? "border-red-400" : ""}`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
          </div>

          {/* Date + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Date of Birth</label>
              <input
                {...register("date_of_birth", { required: "Date of birth is required" })}
                type="date"
                className={`w-full p-4 border-2 rounded-xl transition-all
                            bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
                            focus:outline-none focus:ring-2 focus:ring-red-500/30
                            ${errors.date_of_birth ? "border-red-400" : ""}`}
              />
              {errors.date_of_birth && (
                <p className="text-red-500 text-xs mt-1">{errors.date_of_birth.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Location</label>
              <input
                {...register("location", { required: "Location is required" })}
                type="text"
                className={`w-full p-4 border-2 rounded-xl transition-all
                            bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
                            focus:outline-none focus:ring-2 focus:ring-red-500/30
                            ${errors.location ? "border-red-400" : ""}`}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message as string}</p>}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Experience Level</label>
            <select
              {...register("experience_level", { required: "Please select your experience level" })}
              className={`w-full p-4 border-2 rounded-xl transition-all
                          bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
                          focus:outline-none focus:ring-2 focus:ring-red-500/30
                          ${errors.experience_level ? "border-red-400" : ""}`}
            >
              <option value="">Select Experience Level</option>
              <option value="beginner">🌱 Beginner</option>
              <option value="intermediate">💪 Intermediate</option>
              <option value="advanced">🔥 Advanced</option>
              <option value="expert">⚡ Expert</option>
            </select>
            {errors.experience_level && (
              <p className="text-red-500 text-xs mt-1">{errors.experience_level.message as string}</p>
            )}
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Profile Picture</label>
            <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors
                            bg-[var(--surface)] border-[var(--border)] hover:border-red-400">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="avatar-upload" />
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg mx-auto shadow-md border-2 border-[var(--border)]"
                      />
                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm text-emerald-500 font-medium">
                      ✓ {selectedFile?.name || "Image selected"}
                    </p>
                    <p className="text-xs text-[var(--muted)]">Click to change or remove</p>
                  </div>
                ) : (
                  <div>
                    <div className="mx-auto w-12 h-12 text-[var(--muted)] mb-4">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-[var(--foreground)]/80">Click to upload or drag and drop</p>
                    <p className="text-xs text-[var(--muted)] mt-2">PNG, JPG up to 2MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Coach specialization */}
          {userType === "coach" && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Specialization Description
              </label>
              <textarea
                {...register("specialization_description", {
                  required: userType === "coach" ? "Description is required for coaches" : false,
                })}
                rows={4}
                placeholder="Describe your specialization and coaching philosophy..."
                className={`w-full p-4 border-2 rounded-xl transition-all resize-none
                            bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
                            focus:outline-none focus:ring-2 focus:ring-red-500/30
                            ${errors.specialization_description ? "border-red-400" : ""}`}
              />
              {errors.specialization_description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.specialization_description.message as string}
                </p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
                type={showPassword ? "text" : "password"}
                className={`w-full p-4 pl-12 pr-12 border-2 rounded-xl transition-all
                            bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
                            focus:outline-none focus:ring-2 focus:ring-red-500/30
                            ${errors.password ? "border-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          {/* Fitness Interests */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-[var(--foreground)] text-center mb-4">Fitness Interests</h3>

            <div className="grid gap-3"
                 style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
              {Array.isArray(interest) && interest.map((i) => {
                const selected = selectedFitnessInterests.includes(i.id);
                return (
                  <button
                    type="button"
                    key={i.id}
                    onClick={() => handleFitnessInterestToggle(i.id)}
                    className={`flex flex-col items-center justify-center min-h-20 p-4 rounded-xl border-2 transition
                                ${selected
                                  ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]"
                                  : "border-[var(--border)] bg-[var(--chip)] text-[var(--foreground)]/90 hover:opacity-95"}`}
                  >
                    <span>{i.name}</span>
                  </button>
                );
              })}
            </div>

            {selectedFitnessInterests.length === 0 && (
              <div className="text-center text-sm italic mt-2 text-[var(--muted)]">
                Select your fitness interests to get personalized recommendations
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 font-semibold rounded-xl transition-all shadow-lg focus:outline-none
                        ${isSubmitting
                          ? "bg-neutral-500/40 cursor-not-allowed shadow-none"
                          : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-4 focus:ring-red-500/30"}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Create Account</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            )}
          </button>

          {/* Sign in link / Terms */}
          {/* <div className="text-center pt-4">
            <p className="text-[var(--muted)] text-sm">
              Already have an account?
              <span className="text-red-500 font-medium hover:text-red-600 cursor-pointer ml-1 underline-offset-2 hover:underline">
                Sign in
              </span>
            </p>
          </div> */}
          <div className="text-center pt-4">
  <p className="text-[var(--muted)] text-sm">
    Already have an account?
    <Link
      href="/"   // ← change to your actual route if different (e.g. "/login")
      className="text-red-500 font-medium hover:text-red-600 cursor-pointer ml-1 underline-offset-2 hover:underline"
    >
      Sign in
    </Link>
  </p>
</div>


          <div className="text-center pt-2">
            <p className="text-xs leading-relaxed max-w-sm mx-auto text-[var(--muted)]">
              By creating an account, you agree to our
              <span className="text-red-500 hover:text-red-600 cursor-pointer ml-1 underline">Terms of Service</span>
              and
              <span className="text-red-500 hover:text-red-600 cursor-pointer ml-1 underline">Privacy Policy</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
