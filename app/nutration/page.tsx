"use client";
import React, { useState, useEffect, ChangeEvent, Suspense } from "react";
import {
  Apple,
  X,
  Calendar,
  Target,
  Activity,
  Sparkles,
  Download,
  Share2,
  Star,
  Zap,
  Trophy,
  Flame,
  Scale,
  Ruler,
  User,
  TrendingDown,
  TrendingUp,
  Minus,
  LucideIcon,
  Clock,
  Utensils,
} from "lucide-react";
import Sidebar from "../components/shared/sidebar";

// Types
interface User {
  data?: {
    user_id: string;
  };
}

interface FormData {
  user_id: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  activity_level: string;
  goal: string;
}

interface Ingredient {
  name: string;
  amount_g: number;
}

interface Meal {
  name: string;
  time: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  description: string;
  ingredients: Ingredient[];
}

interface DaySummary {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  note: string;
}

interface DayProgram {
  day_summary: DaySummary;
  meals: Meal[];
}

interface NutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface NutritionPlan {
  bmr: number;
  tdee: number;
  target: NutritionTarget;
}

interface Profile {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: string;
  goal: string;
}

interface NutritionResponseData {
  profile: Profile;
  nutrition_plan: NutritionPlan;
  day_program: DayProgram;
}

interface NutritionData {
  success?: boolean;
  data?: NutritionResponseData;
  error?: string;
  message?: string;
}

interface Option {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface MealItem {
  type: "meal" | "item" | "info";
  content: string;
  key: string;
}

interface NutritionDisplayProps {
  nutritionData: NutritionResponseData;
  onBack: () => void;
  formData: FormData;
  theme: string;
}

// Mock theme hook - replace with your actual hook
const useGetTheme = () => {
  const [theme, setTheme] = useState("dark");
  return { theme };
};

// NutritionGenerator Component
const NutritionGenerator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    user_id: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    activity_level: "",
    goal: "",
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
  const [nutritionData, setNutritionData] =
    useState<NutritionResponseData | null>(null);
  const [error, setError] = useState("");

  // Options for select boxes
  const genderOptions: Option[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const activityLevelOptions: Option[] = [
    { value: "sedentary", label: "Sedentary" },
    { value: "light", label: "Lightly Active" },
    { value: "moderate", label: "Moderately Active" },
    { value: "active", label: "Active" },
    { value: "very_active", label: "Very Active" },
  ];

  const goalOptions: Option[] = [
    { value: "loss", label: "Lose Weight", icon: TrendingDown },
    { value: "gain", label: "Gain Weight", icon: TrendingUp },
    { value: "maintain", label: "Maintain Weight", icon: Minus },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setNutritionData(null);

    try {
      const response = await fetch(
        "https://godzilla-be.vercel.app/api/v1/ai-service/generate-nutrationPlan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            age: parseInt(formData.age),
            weight: parseFloat(formData.weight),
            height: parseFloat(formData.height),
          }),
        }
      );

      const data: NutritionData = await response.json();

      if (data.success && data.data) {
        setNutritionData(data.data);
      } else {
        setError(data.error || "Failed to generate nutrition plan");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: user?.data?.user_id || "",
      age: "",
      gender: "",
      weight: "",
      height: "",
      activity_level: "",
      goal: "",
    });
    setNutritionData(null);
    setError("");
  };

  const { theme } = useGetTheme();

  const isFormValid =
    formData.age &&
    formData.gender &&
    formData.weight &&
    formData.height &&
    formData.activity_level &&
    formData.goal;

  return (
    <div
      className={`min-h-screen overflow-x-hidden ${
        theme === "dark" ? "bg-black" : "bg-[#f7f7f7]"
      }`}
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
      <div className="max-w-6xl mx-auto px-4 py-8 overflow-x-hidden">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500 flex items-center justify-center mb-4">
            <Apple className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            Generate Nutrition Plan
          </h1>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Get a personalized nutrition plan using AI
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
                <Apple className="w-6 h-6" />
                <h1 className="text-xl font-bold">Smart Nutrition Plan</h1>
              </div>
              {nutritionData && (
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
            {!nutritionData ? (
              <div className="space-y-6">
                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100 placeholder:text-gray-500"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900 placeholder:text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Scale className="w-4 h-4" />
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Enter your weight"
                      min="1"
                      step="0.1"
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100 placeholder:text-gray-500"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900 placeholder:text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Ruler className="w-4 h-4" />
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="Enter your height"
                      min="1"
                      step="0.1"
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100 placeholder:text-gray-500"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900 placeholder:text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Activity Level */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      Activity Level
                    </label>
                    <select
                      name="activity_level"
                      value={formData.activity_level}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 border ${
                        theme === "dark"
                          ? "bg-[#18181b] border-[#27272a] text-gray-100"
                          : "bg-[#f7f7fb] border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="">Select Activity Level</option>
                      {activityLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Goal */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      Goal
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
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
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid}
                    className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-xl flex items-center gap-2 transition min-w-[150px] justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Plan
                      </>
                    )}
                  </button>
                  <button
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
              </div>
            ) : (
              <NutritionDisplay
                nutritionData={nutritionData}
                onBack={resetForm}
                formData={formData}
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

// Enhanced Nutrition Display Component
const NutritionDisplay: React.FC<NutritionDisplayProps> = ({
  nutritionData,
  onBack,
  formData,
  theme,
}) => {
  const { profile, nutrition_plan, day_program } = nutritionData;

  // Function to render nutrition metrics
  const renderMetricCard = (
    title: string,
    value: number,
    unit: string,
    icon: React.ReactNode
  ) => (
    <div
      className={`p-4 rounded-xl border ${
        theme === "dark"
          ? "bg-[#18181b] border-[#27272a]"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-muted mb-1">{title}</div>
          <div className="text-2xl font-bold text-foreground">
            {value} <span className="text-sm font-normal">{unit}</span>
          </div>
        </div>
        <div className="text-rose-500">{icon}</div>
      </div>
    </div>
  );

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
          <span className="font-semibold">Plan Generated Successfully!</span>
        </div>
        <p className="text-sm">Your personalized nutrition plan is ready</p>
      </div>

      {/* Profile Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { icon: Calendar, label: "Age", value: `${profile.age} years` },
          {
            icon: User,
            label: "Gender",
            value: profile.gender === "male" ? "Male" : "Female",
          },
          { icon: Scale, label: "Weight", value: `${profile.weight} kg` },
          { icon: Ruler, label: "Height", value: `${profile.height} cm` },
          { icon: Activity, label: "Activity", value: profile.activity_level },
          { icon: Target, label: "Goal", value: profile.goal },
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

      {/* Nutrition Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {renderMetricCard(
          "BMR",
          nutrition_plan.bmr,
          "kcal",
          <Flame className="w-5 h-5" />
        )}
        {renderMetricCard(
          "TDEE",
          nutrition_plan.tdee,
          "kcal",
          <Activity className="w-5 h-5" />
        )}
        {renderMetricCard(
          "Protein",
          nutrition_plan.target.protein,
          "g",
          <Scale className="w-5 h-5" />
        )}
        {renderMetricCard(
          "Carbs",
          nutrition_plan.target.carbs,
          "g",
          <Zap className="w-5 h-5" />
        )}
      </div>

      {/* Day Summary */}
      <div
        className={`rounded-2xl p-6 border ${
          theme === "dark"
            ? "bg-[#0f0f10] border-[#27272a]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-bold text-foreground">Daily Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-500">
              {day_program?.day_summary?.total_calories}
            </div>
            <div className="text-sm text-muted">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {day_program?.day_summary?.total_protein}g
            </div>
            <div className="text-sm text-muted">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {day_program?.day_summary?.total_carbs}g
            </div>
            <div className="text-sm text-muted">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {day_program?.day_summary?.total_fats}g
            </div>
            <div className="text-sm text-muted">Fats</div>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <div className="text-sm text-green-500 font-medium">
              ✓ On Target
            </div>
            <div className="text-xs text-muted">
              {day_program?.day_summary?.note}
            </div>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div
        className={`rounded-2xl p-6 border ${
          theme === "dark"
            ? "bg-[#0f0f10] border-[#27272a]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Utensils className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-bold text-foreground">Daily Meals</h3>
        </div>
        <div className="space-y-4">
          {day_program.meals.map((meal, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-l-4 ${
                theme === "dark"
                  ? "bg-[#18181b] border-l-rose-500"
                  : "bg-gray-50 border-l-rose-500"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {meal.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{meal.time}</span>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    {meal.description}
                  </p>

                  {/* Nutrition Info */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="text-center">
                      <div className="font-bold text-rose-500">
                        {meal.calories}
                      </div>
                      <div className="text-xs text-muted">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-500">
                        {meal.protein_g}g
                      </div>
                      <div className="text-xs text-muted">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-500">
                        {meal.carbs_g}g
                      </div>
                      <div className="text-xs text-muted">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-yellow-500">
                        {meal.fats_g}g
                      </div>
                      <div className="text-xs text-muted">Fats</div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">
                      Ingredients:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {meal.ingredients.map((ingredient, ingIndex) => (
                        <span
                          key={ingIndex}
                          className={`px-3 py-1 rounded-full text-xs ${
                            theme === "dark"
                              ? "bg-[#27272a] text-gray-300"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {ingredient.name} ({ingredient.amount_g}g)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
          إنشاء خطة جديدة
        </button>
        <button
          className={`flex-1 border font-medium px-4 py-3 rounded-xl flex items-center gap-2 justify-center transition ${
            theme === "dark"
              ? "border-[#27272a] text-gray-300 hover:bg-[#18181b]"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Download className="w-4 h-4" />
          حفظ الخطة
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
  );
};

// Main Export
export default NutritionGenerator;
