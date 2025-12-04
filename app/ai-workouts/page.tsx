"use client"
import React, { Suspense, useState } from 'react'
import Sidebar from '../components/shared/sidebar'
import useGetTheme from '../Hooks/useGetTheme'
import { Apple } from 'lucide-react'
import WorkoutPage from "../workout/page"
import NutritionGenerator from "../nutration/page"

const Page = () => {
    const [page , setpage] = useState<"Workouts" | "Nutrition">("Workouts")
    const {theme} = useGetTheme();
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


<div className="max-w-6xl mx-auto px-4 py-8 overflow-x-hidden"></div>
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


        <div className="flex justify-center gap-4 mb-10">
            <button
                onClick={() => setpage("Workouts")}
                className={`px-6 py-2 rounded-xl font-medium transition ${
                page === "Workouts"
                    ? "bg-rose-500 text-white"
                    : theme === "dark"
                    ? "bg-[#18181b] text-gray-300 border border-[#27272a]"
                    : "bg-white text-gray-700 border"
                }`}
            >
                Workouts
            </button>

            <button
                onClick={() => setpage("Nutrition")}
                className={`px-6 py-2 rounded-xl font-medium transition ${
                page === "Nutrition"
                    ? "bg-rose-500 text-white"
                    : theme === "dark"
                    ? "bg-[#18181b] text-gray-300 border border-[#27272a]"
                    : "bg-white text-gray-700 border"
                }`}
            >
                Nutrition
            </button>
            </div>

            {page === "Workouts" && (
               
                 <WorkoutPage/>
                
            )}

            {/* Nutrition Section */}
            {page === "Nutrition" && (
                <NutritionGenerator/>
            )}

            
        </div>
  )
}

export default Page