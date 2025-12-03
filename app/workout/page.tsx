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
    equipment: [] as string[],
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
    { value: "Build Muscle", label: "Build Muscle" },
    { value: "General Fitness", label: "General Fitness" },
    { value: "Increase Endurance", label: "Increase Endurance" },
    { value: "Increase Strength", label: "Increase Strength" },
    { value: "Lose Fat", label: "Lose Fat" },
    { value: "Sports Performance", label: "Sports Performance" },
  ];

  const levelOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  const daysOptions = [
    { value: "1", label: "1 Day" },
    { value: "2", label: "2 Days" },
    { value: "3", label: "3 Days" },
    { value: "4", label: "4 Days" },
    { value: "5", label: "5 Days" },
    { value: "6", label: "6 Days" },
    { value: "7", label: "7 Days" },
  ];

  const timeOptions = [
    { label: "1 - 5 minutes", value: "1-5 minutes" },
    { label: "10 minutes", value: "10 minutes" },
    { label: "10 - 15 minutes", value: "10-15 minutes" },
    { label: "10 - 20 minutes", value: "10-20 minutes" },
    { label: "120 minutes", value: "120 minutes" },
    { label: "120 - 150 minutes", value: "120-150 minutes" },
    { label: "15 minutes", value: "15 minutes" },
    { label: "15 - 20 minutes", value: "15-20 minutes" },
    { label: "15 - 30 minutes", value: "15-30 minutes" },
    { label: "15 - 45 minutes", value: "15-45 minutes" },
    { label: "15 - 60 minutes", value: "15-60 minutes" },
    { label: "15 - 75 minutes", value: "15-75 minutes" },
    { label: "20 minutes", value: "20 minutes" },
    { label: "20 - 25 minutes", value: "20-25 minutes" },
    { label: "20 - 30 minutes", value: "20-30 minutes" },
    { label: "20 - 35 minutes", value: "20-35 minutes" },
    { label: "20 - 40 minutes", value: "20-40 minutes" },
    { label: "20 - 45 minutes", value: "20-45 minutes" },
    { label: "20 - 60 minutes", value: "20-60 minutes" },
    { label: "25 - 30 minutes", value: "25-30 minutes" },
    { label: "25 - 35 minutes", value: "25-35 minutes" },
    { label: "25 - 45 minutes", value: "25-45 minutes" },
    { label: "30 minutes", value: "30 minutes" },
    { label: "30 - 40 minutes", value: "30-40 minutes" },
    { label: "30 - 45 minutes", value: "30-45 minutes" },
    { label: "30 - 60 minutes", value: "30-60 minutes" },
    { label: "30 - 75 minutes", value: "30-75 minutes" },
    { label: "30 - 90 minutes", value: "30-90 minutes" },
    { label: "35 - 40 minutes", value: "35-40 minutes" },
    { label: "35 - 45 minutes", value: "35-45 minutes" },
    { label: "40 minutes", value: "40 minutes" },
    { label: "40 - 60 minutes", value: "40-60 minutes" },
    { label: "45 minutes", value: "45 minutes" },
    { label: "45 - 120 minutes", value: "45-120 minutes" },
    { label: "45 - 60 minutes", value: "45-60 minutes" },
    { label: "45 - 70 minutes", value: "45-70 minutes" },
    { label: "45 - 75 minutes", value: "45-75 minutes" },
    { label: "45 - 90 minutes", value: "45-90 minutes" },
    { label: "5 - 15 minutes", value: "5-15 minutes" },
    { label: "50 minutes", value: "50 minutes" },
    { label: "50 - 60 minutes", value: "50-60 minutes" },
    { label: "50 - 70 minutes", value: "50-70 minutes" },
    { label: "50 - 75 minutes", value: "50-75 minutes" },
    { label: "55 minutes", value: "55 minutes" },
    { label: "60 minutes", value: "60 minutes" },
    { label: "60 - 75 minutes", value: "60-75 minutes" },
    { label: "60 - 90 minutes", value: "60-90 minutes" },
    { label: "65 minutes", value: "65 minutes" },
    { label: "75 minutes", value: "75 minutes" },
    { label: "75 - 90 minutes", value: "75-90 minutes" },
    { label: "8 minutes", value: "8 minutes" },
    { label: "90 minutes", value: "90 minutes" },
    { label: "90 - 120 minutes", value: "90-120 minutes" },
  ];

  const equipmentOptions = [
    { value: "Bands", label: "Bands" },
    { value: "Barbell", label: "Barbell" },
    { value: "Bodyweight", label: "Bodyweight" },
    { value: "Cables", label: "Cables" },
    { value: "Dumbbells", label: "Dumbbells" },
    { value: "EZ Bar", label: "EZ Bar" },
    { value: "Exercise Ball", label: "Exercise Ball" },
    { value: "Foam Roll", label: "Foam Roll" },
    { value: "Kettle Bells", label: "Kettle Bells" },
    { value: "Machines", label: "Machines" },
    { value: "Medicine Ball", label: "Medicine Ball" },
    { value: "None", label: "None" },
    { value: "Other", label: "Other" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "equipment" && e.target instanceof HTMLSelectElement) {
      const select = e.target;
      const selectedValues = Array.from(
        select.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWorkoutData(null);

    try {
      const response = await axios.post(
        "https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/ai-service/generate-workout",
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
      equipment: [],
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
            Generate Workout Plan
          </h1>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Get a personalized workout plan using AI
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
                <h1 className="text-xl font-bold">Smart Workout Plan</h1>
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
                      Main Goal
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
                      <option value="">Select Goal</option>
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
                      Level
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
                      <option value="">Select Level</option>
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
                      Days per Week
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
                      <option value="">Select Days</option>
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
                      Workout Duration
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
                      <option value="">Select Duration</option>
                      {timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Equipment */}
                  {/* Equipment - Enhanced Multi Select */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Dumbbell className="w-4 h-4" />
                      Available Equipment
                    </label>

                    {/* Custom Multi Select Dropdown */}
                    <div className="relative">
                      {/* Selected Items Display */}
                      <div
                        className={`w-full px-4 py-3 rounded-xl border cursor-pointer min-h-[52px] flex flex-wrap items-center gap-2 ${
                          theme === "dark"
                            ? "bg-[#18181b] border-[#27272a] text-gray-100"
                            : "bg-[#f7f7fb] border-gray-200 text-gray-900"
                        }`}
                        onClick={() => {
                          const dropdown =
                            document.getElementById("equipment-dropdown");
                          if (dropdown) {
                            dropdown.classList.toggle("hidden");
                          }
                        }}
                      >
                        {formData.equipment.length === 0 ? (
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Select Equipment
                          </span>
                        ) : (
                          formData.equipment.map((equip) => {
                            const equipment = equipmentOptions.find(
                              (opt) => opt.value === equip
                            );
                            return (
                              <div
                                key={equip}
                                className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1 rounded-full text-sm"
                              >
                                <span>{equipment?.label}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                      ...prev,
                                      equipment: prev.equipment.filter(
                                        (item) => item !== equip
                                      ),
                                    }));
                                  }}
                                  className="hover:bg-rose-600 rounded-full w-4 h-4 flex items-center justify-center ml-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Dropdown Options */}
                      <div
                        id="equipment-dropdown"
                        className={`hidden absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border z-10 ${
                          theme === "dark"
                            ? "bg-[#18181b] border-[#27272a]"
                            : "bg-[#f7f7fb] border-gray-200"
                        }`}
                      >
                        {equipmentOptions.map((option) => (
                          <div
                            key={option.value}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b ${
                              theme === "dark"
                                ? "border-[#27272a] hover:bg-[#27272a]"
                                : "border-gray-200 hover:bg-gray-100"
                            } ${
                              formData.equipment.includes(option.value)
                                ? "bg-rose-500/10"
                                : ""
                            }`}
                            onClick={() => {
                              setFormData((prev) => {
                                const isSelected = prev.equipment.includes(
                                  option.value
                                );
                                return {
                                  ...prev,
                                  equipment: isSelected
                                    ? prev.equipment.filter(
                                        (item) => item !== option.value
                                      )
                                    : [...prev.equipment, option.value],
                                };
                              });
                            }}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                formData.equipment.includes(option.value)
                                  ? "bg-rose-500 border-rose-500"
                                  : theme === "dark"
                                  ? "border-gray-500"
                                  : "border-gray-400"
                              }`}
                            >
                              {formData.equipment.includes(option.value) && (
                                <div className="w-2 h-2 bg-white rounded-sm" />
                              )}
                            </div>
                            <span
                              className={
                                theme === "dark"
                                  ? "text-gray-100"
                                  : "text-gray-900"
                              }
                            >
                              {option.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Click to select or remove equipment
                    </p>
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
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Program
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
                    Reset
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
    equipment: string[]; // Change from string to string[]
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
          <span className="font-semibold">Program Generated Successfully!</span>
        </div>
        <p className="text-sm">Your personalized workout program is ready</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: Target, label: "Goal", value: formData.main_goal },
          { icon: Activity, label: "Level", value: formData.workout_level },
          { icon: Calendar, label: "Days", value: formData.days_per_week },
          { icon: Clock, label: "Duration", value: formData.time_per_workout },
          { icon: Dumbbell, label: "Equipment", value: formData.equipment },
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
              Detailed Program
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
                Program Exercises
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
              Generate New Program
            </button>
            <button
              className={`flex-1 border font-medium px-4 py-3 rounded-xl flex items-center gap-2 justify-center transition ${
                theme === "dark"
                  ? "border-[#27272a] text-gray-300 hover:bg-[#18181b]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Download className="w-4 h-4" />
              Save Program
            </button>
            <button
              className={`flex-1 border font-medium px-4 py-3 rounded-xl flex items-center gap-2 justify-center transition ${
                theme === "dark"
                  ? "border-[#27272a] text-gray-300 hover:bg-[#18181b]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Share2 className="w-4 h-4" />
              Share
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
