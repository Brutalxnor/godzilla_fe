
"use client";
import React, { useState, Suspense, useEffect } from "react";
import axios from "axios";
import {
  Heart,
  Send,
  X,
  Dumbbell,
  Calendar,
  Clock,
  Target,
  Activity,
  Sparkles,
  Download,
  Share2,
  Star,
  Zap,
  Trophy,
  Flame,
} from "lucide-react";
import Sidebar from "../components/shared/sidebar";
import useGetTheme from "../Hooks/useGetTheme";
import { User } from "../types/admin";

// WorkoutGenerator Component
const WorkoutGenerator = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    user_id: "",
    main_goal: "",
    workout_level: "",
    days_per_week: "",
    time_per_workout: "",
    equipment: "",
  });


    useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    setFormData((prev) => ({
      ...prev,
      user_id: storedUser?.data?.user_id || "",
    }));
  }, []);

  const [loading, setLoading] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const [error, setError] = useState("");

  // Options for select boxes
  const goalOptions = [
    { value: "Build Muscle", label: "بناء العضلات" },
    { value: "General Fitness", label: "تحسين اللياقة العامة" },
    { value: "Increase Endurance", label: "زيادة التحمل" },
    { value: "Increase Strength", label: "زيادة القوة" },
    { value: "Lose Fat", label: "فقدان الدهون" },
    { value: "Sports Performance", label: "الأداء الرياضي" },
  ];

  const levelOptions = [
    { value: "Beginner", label: "مبتدئ" },
    { value: "Intermediate", label: "متوسط" },
    { value: "Advanced", label: "متقدم" },
  ];

  const daysOptions = [
    { value: "1", label: "يوم واحد" },
    { value: "2", label: "يومين" },
    { value: "3", label: "ثلاثة أيام" },
    { value: "4", label: "أربعة أيام" },
    { value: "5", label: "خمسة أيام" },
    { value: "6", label: "ستة أيام" },
    { value: "7", label: "سبعة أيام" },
  ];

  const timeOptions = [
    { label: "1 - 5 دقائق", value: "1-5 minutes" },
    { label: "10 دقائق", value: "10 minutes" },
    { label: "10 - 15 دقيقة", value: "10-15 minutes" },
    { label: "10 - 20 دقيقة", value: "10-20 minutes" },
    { label: "120 دقيقة", value: "120 minutes" },
    { label: "120 - 150 دقيقة", value: "120-150 minutes" },
    { label: "15 دقيقة", value: "15 minutes" },
    { label: "15 - 20 دقيقة", value: "15-20 minutes" },
    { label: "15 - 30 دقيقة", value: "15-30 minutes" },
    { label: "15 - 45 دقيقة", value: "15-45 minutes" },
    { label: "15 - 60 دقيقة", value: "15-60 minutes" },
    { label: "15 - 75 دقيقة", value: "15-75 minutes" },
    { label: "20 دقيقة", value: "20 minutes" },
    { label: "20 - 25 دقيقة", value: "20-25 minutes" },
    { label: "20 - 30 دقيقة", value: "20-30 minutes" },
    { label: "20 - 35 دقيقة", value: "20-35 minutes" },
    { label: "20 - 40 دقيقة", value: "20-40 minutes" },
    { label: "20 - 45 دقيقة", value: "20-45 minutes" },
    { label: "20 - 60 دقيقة", value: "20-60 minutes" },
    { label: "25 - 30 دقيقة", value: "25-30 minutes" },
    { label: "25 - 35 دقيقة", value: "25-35 minutes" },
    { label: "25 - 45 دقيقة", value: "25-45 minutes" },
    { label: "30 دقيقة", value: "30 minutes" },
    { label: "30 - 40 دقيقة", value: "30-40 minutes" },
    { label: "30 - 45 دقيقة", value: "30-45 minutes" },
    { label: "30 - 60 دقيقة", value: "30-60 minutes" },
    { label: "30 - 75 دقيقة", value: "30-75 minutes" },
    { label: "30 - 90 دقيقة", value: "30-90 minutes" },
    { label: "35 - 40 دقيقة", value: "35-40 minutes" },
    { label: "35 - 45 دقيقة", value: "35-45 minutes" },
    { label: "40 دقيقة", value: "40 minutes" },
    { label: "40 - 60 دقيقة", value: "40-60 minutes" },
    { label: "45 دقيقة", value: "45 minutes" },
    { label: "45 - 120 دقيقة", value: "45-120 minutes" },
    { label: "45 - 60 دقيقة", value: "45-60 minutes" },
    { label: "45 - 70 دقيقة", value: "45-70 minutes" },
    { label: "45 - 75 دقيقة", value: "45-75 minutes" },
    { label: "45 - 90 دقيقة", value: "45-90 minutes" },
    { label: "5 - 15 دقيقة", value: "5-15 minutes" },
    { label: "50 دقيقة", value: "50 minutes" },
    { label: "50 - 60 دقيقة", value: "50-60 minutes" },
    { label: "50 - 70 دقيقة", value: "50-70 minutes" },
    { label: "50 - 75 دقيقة", value: "50-75 minutes" },
    { label: "55 دقيقة", value: "55 minutes" },
    { label: "60 دقيقة", value: "60 minutes" },
    { label: "60 - 75 دقيقة", value: "60-75 minutes" },
    { label: "60 - 90 دقيقة", value: "60-90 minutes" },
    { label: "65 دقيقة", value: "65 minutes" },
    { label: "75 دقيقة", value: "75 minutes" },
    { label: "75 - 90 دقيقة", value: "75-90 minutes" },
    { label: "8 دقائق", value: "8 minutes" },
    { label: "90 دقيقة", value: "90 minutes" },
    { label: "90 - 120 دقيقة", value: "90-120 minutes" },
  ];

  const equipmentOptions = [
    { value: "Bands", label: "أشرطة المقاومة" },
    { value: "Barbell", label: "باربل" },
    { value: "Bodyweight", label: "وزن الجسم" },
    { value: "Cables", label: "كابلات" },
    { value: "Dumbbells", label: "دامبل" },
    { value: "EZ Bar", label: "EZ بار" },
    { value: "Exercise Ball", label: "كرة التمرين" },
    { value: "Foam Roll", label: "فوم رول" },
    { value: "Kettle Bells", label: "كتل بيلز" },
    { value: "Machines", label: "آلات" },
    { value: "Medicine Ball", label: "كرة طبية" },
    { value: "None", label: "بدون معدات" },
    { value: "Other", label: "أخرى" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWorkoutData(null);

    try {
      const response = await axios.post(
        "https://godzilla-be.vercel.app/api/v1/ai-service/generate-workout",
        formData
      );

      if (response.data.success) {
        setWorkoutData(response.data.data);
      } else {
        setError(response.data.error || "Failed to generate workout plan");
      }
    } catch (err) {
      // setError(
      //   err.response?.data?.error || "Something went wrong. Please try again."
      // );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: user?.data?.user_id || "",
      main_goal: "",
      workout_level: "",
      days_per_week: "",
      time_per_workout: "",
      equipment: "",
    });
    setWorkoutData(null);
    setError("");
  };

  // Function to format program text with enhanced styling
  const formatProgramText = (text: string) => {
    if (!text) return [];

    const lines = text.split("\n");
    return lines.map((line, index) => {
      const formattedLine = line.trim();

      // Handle headers (###)
      if (formattedLine.startsWith("###")) {
        return (
          <h3
            key={index}
            className="text-xl font-bold text-rose-500 py-3 mt-6 mb-3 border-l-4 border-rose-500 pl-4"
          >
            {formattedLine.replace("###", "").trim()}
          </h3>
        );
      }

      // Handle bold text (**text**)
      if (formattedLine.includes("**")) {
        const parts = formattedLine.split("**");
        return (
          <p key={index} className="text-foreground mb-3 leading-relaxed">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="text-rose-500 font-semibold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // Handle list items starting with -
      if (formattedLine.startsWith("-")) {
        return (
          <li key={index} className="flex items-start mb-2 text-foreground">
            <Sparkles className="w-4 h-4 text-rose-500 mt-1 mr-3 flex-shrink-0" />
            <span>{formattedLine.replace("-", "").trim()}</span>
          </li>
        );
      }

      // Handle numbered lists
      if (/^\d+\./.test(formattedLine)) {
        return (
          <li key={index} className="flex items-start mb-2 text-foreground">
            <span className="bg-rose-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              {formattedLine.split(".")[0]}
            </span>
            <span>{formattedLine.replace(/^\d+\./, "").trim()}</span>
          </li>
        );
      }

      // Handle empty lines
      if (!formattedLine) {
        return <div key={index} className="h-4" />;
      }

      // Regular paragraphs
      return (
        <p key={index} className="text-foreground mb-3 leading-relaxed">
          {formattedLine}
        </p>
      );
    });
  };

  // Function to format exercises from rag_program
  const formatExercises = (ragProgram: string) => {
    if (!ragProgram) return [];

    const lines = ragProgram.split("\n");
    const exercises: exercises[] = [];
    let currentDay = "";

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("HEADER:")) {
        // Skip header line
        return;
      }

      if (trimmedLine.startsWith("EXERCISES:")) {
        // Skip exercises header
        return;
      }

      if (trimmedLine.includes("Day") || trimmedLine.includes("اليوم")) {
        currentDay = trimmedLine;
        exercises.push({
          type: "day",
          content: trimmedLine,
          key: `day-${index}`,
        });
      } else if (
        trimmedLine.includes("Exercise:") ||
        trimmedLine.includes("Sets:") ||
        trimmedLine.includes("Reps:")
      ) {
        exercises.push({
          type: "exercise",
          content: trimmedLine,
          key: `exercise-${index}`,
        });
      } else if (trimmedLine) {
        exercises.push({
          type: "info",
          content: trimmedLine,
          key: `info-${index}`,
        });
      }
    });

    return exercises;
  };

  const { theme } = useGetTheme();

  return (
    <div
      className={`min-h-screen overflow-x-hidden ${
        theme === "dark" ? "bg-black" : "bg-[#f7f7f7]"
      }`}
      style={
        {
          ["--sb-w"]: "0px",
          ["--extra-left"]: "0px",
        } as React.CSSProperties
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-8 overflow-x-hidden">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500 flex items-center justify-center mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            توليد برنامج التمرين
          </h1>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            احصل على برنامج تمرين مخصص باستخدام الذكاء الاصطناعي
          </p>
        </div>

        <div
          className={`rounded-2xl ${
            theme === "dark"
              ? "bg-[#0f0f10] border border-[#27272a]"
              : "bg-white shadow-sm border border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="bg-rose-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-6 h-6" />
                <h1 className="text-xl font-bold">برنامج التمرين الذكي</h1>
              </div>
              {workoutData && (
                <button
                  onClick={resetForm}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!workoutData ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-rows-2 gap-6">
                  {/* User ID */}
                  {/* <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      رقم المستخدم
                    </label>
                    <input
                      type="text"
                      name="user_id"
                      value={formData.user_id}
                      onChange={handleChange}
                      required
                      placeholder="أدخل رقم المستخدم"
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100 placeholder:text-gray-500"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900 placeholder:text-gray-400"
                      }`}
                    />
                  </div> */}

                  {/* Main Goal */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      الهدف الرئيسي
                    </label>
                    <select
                      name="main_goal"
                      value={formData.main_goal}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="">اختر الهدف</option>
                      {goalOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Workout Level */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      المستوى
                    </label>
                    <select
                      name="workout_level"
                      value={formData.workout_level}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="">اختر المستوى</option>
                      {levelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Days per Week */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      الأيام في الأسبوع
                    </label>
                    <select
                      name="days_per_week"
                      value={formData.days_per_week}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="">اختر عدد الأيام</option>
                      {daysOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time per Workout */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      مدة التمرين
                    </label>
                    <select
                      name="time_per_workout"
                      value={formData.time_per_workout}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="">اختر المدة</option>
                      {timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Equipment */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Dumbbell className="w-4 h-4" />
                      المعدات المتاحة
                    </label>
                    <select
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="">اختر المعدات</option>
                      {equipmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white font-medium px-8 py-3 rounded-xl flex items-center gap-2 transition min-w-[150px] justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        توليد البرنامج
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`border font-medium px-8 py-3 rounded-xl transition min-w-[150px] ${
                      theme === "dark"
                        ? "border-[#27272a] text-gray-300 hover:bg-[#18181b]"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    إعادة تعيين
                  </button>
                </div>
              </form>
            ) : (
              <WorkoutDisplay
                workoutData={workoutData}
                onBack={resetForm}
                formData={formData}
                formatProgramText={formatProgramText}
                formatExercises={formatExercises}
                theme={theme}
              />
            )}

            {error && (
              <div
                className={`mt-6 p-4 rounded-xl text-center ${
                  theme === "dark"
                    ? "bg-red-900/20 border border-red-800 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface exercises {
  type: string;
  content: string;
  key: string;
}

interface WorkoutDisplayProps {
  workoutData: {
    rag_program: string;
    program: string;
  };
  onBack: () => void;
  formData: {
    main_goal: string;
    workout_level: string;
    days_per_week: string;
    time_per_workout: string;
    equipment: string;
  };
  formatProgramText: (text: string) => React.ReactNode;
  formatExercises: (ragProgram: string) => exercises[];
  theme: string;
}

// Enhanced Workout Display Component
const WorkoutDisplay = ({
  workoutData,
  onBack,
  formData,
  formatProgramText,
  formatExercises,
  theme,
}: WorkoutDisplayProps) => {
  const exercises: exercises[] = formatExercises(workoutData.rag_program);

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div
        className={`p-4 rounded-xl border text-center ${
          theme === "dark"
            ? "bg-green-900/20 border-green-800 text-green-300"
            : "bg-green-50 border-green-200 text-green-700"
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-5 h-5" />
          <span className="font-semibold">تم إنشاء برنامجك بنجاح!</span>
        </div>
        <p className="text-sm">برنامج تمرين مخصص جاهز للاستخدام</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: Target, label: "الهدف", value: formData.main_goal },
          { icon: Activity, label: "المستوى", value: formData.workout_level },
          { icon: Calendar, label: "الأيام", value: formData.days_per_week },
          { icon: Clock, label: "المدة", value: formData.time_per_workout },
          { icon: Dumbbell, label: "المعدات", value: formData.equipment },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl text-center ${
              theme === "dark"
                ? "bg-[#18181b] border border-[#27272a]"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <item.icon className="w-5 h-5 text-rose-500 mb-1" />
              <div className="text-xs font-medium text-muted mb-1">
                {item.label}
              </div>
              <div className="text-sm font-bold text-foreground">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Program Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Detailed Program */}
        <div
          className={`rounded-2xl p-4 border ${
            theme === "dark"
              ? "bg-[#0f0f10] border-[#27272a]"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-foreground">
              البرنامج التفصيلي
            </h3>
          </div>
          <div className="space-y-3 text-foreground leading-relaxed">
            {formatProgramText(workoutData.program)}
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          <div
            className={`rounded-2xl p-4 border ${
              theme === "dark"
                ? "bg-[#0f0f10] border-[#27272a]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-foreground">
                تمارين البرنامج
              </h3>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {exercises.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border-l-4 ${
                    item.type === "day"
                      ? theme === "dark"
                        ? "bg-rose-500/10 border-l-rose-500"
                        : "bg-rose-50 border-l-rose-500"
                      : item.type === "exercise"
                      ? theme === "dark"
                        ? "bg-green-500/10 border-l-green-500"
                        : "bg-green-50 border-l-green-500"
                      : theme === "dark"
                      ? "bg-[#18181b] border-l-gray-600"
                      : "bg-gray-50 border-l-gray-400"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {item.type === "day" && (
                      <Flame className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    )}
                    {item.type === "exercise" && (
                      <Star className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        item.type === "day"
                          ? "font-bold text-rose-500"
                          : item.type === "exercise"
                          ? "font-medium text-green-600"
                          : "text-foreground"
                      }`}
                    >
                      {item.content}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onBack}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium px-4 py-3 rounded-xl flex items-center gap-2 justify-center transition"
            >
              <Sparkles className="w-4 h-4" />
              إنشاء برنامج جديد
            </button>
            <button
              className={`flex-1 border font-medium px-4 py-3 rounded-xl flex items-center gap-2 justify-center transition ${
                theme === "dark"
                  ? "border-[#27272a] text-gray-300 hover:bg-[#18181b]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Download className="w-4 h-4" />
              حفظ البرنامج
            </button>
            <button
              className={`flex-1 border font-medium px-4 py-3 rounded-xl flex items-center gap-2 justify-center transition ${
                theme === "dark"
                  ? "border-[#27272a] text-gray-300 hover:bg-[#18181b]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const WorkoutPage = () => {
  const { theme } = useGetTheme();

  const shellVars = {
    "--sb-w": "88px",
    "--extra-left": "24px",
  } as React.CSSProperties;

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500"></div>
          </div>
        }
      >
        <Sidebar />
      </Suspense>

      <main
        style={shellVars}
        className="
          w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))]
          lg:ml-[calc(var(--sb-w)+var(--extra-left))]
          flex flex-col
          min-h-screen
          px-3 sm:px-4 md:px-6
          py-6
          overflow-auto
        "
      >
        <WorkoutGenerator />
      </main>
    </div>
  );
};

export default WorkoutPage;
