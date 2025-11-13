"use client";
import Sidebar from "@/app/components/shared/sidebar";
import useGetUser from "@/app/Hooks/useGetUser";
import { GetUserById } from "@/app/services/Auth.service";
import { User } from "@/app/types/type";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [user, setUser] = useState<{
    data: User;
  } | null>(null);
  const { userDB } = useGetUser();

  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      } as React.CSSProperties),
    []
  );

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await GetUserById(userDB?.data.user_id as string);
      setUser(data);
      if (data?.data) {
        reset({
          name: data.data.name,
          email: data.data.email,
          location: data.data.location,
          experience: data.data.experience,
        });
      }
    };
    fetchUser();
  }, [userDB?.data.user_id, reset]);

  const onSubmit = (formData: any) => {
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <Sidebar />
      </Suspense>
      <main
        style={shellVars}
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      >
        <div className="mx-auto w-full max-w-5xl px-3 sm:px-4 md:px-6 lg:px-0 py-8">
          <div className="bg-white rounded-xl shadow p-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold text-gray-700">
                  {user?.data?.first_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {user?.data?.first_name}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {user?.data?.email}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user?.data?.location}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-pink-500 text-white rounded-lg px-5 py-2 font-medium shadow hover:bg-pink-600">
                  Logout
                </button>
                <button className="bg-gradient-to-r from-pink-400 to-red-400 text-white rounded-lg px-5 py-2 font-medium shadow hover:from-pink-500 hover:to-red-500">
                  Edit
                </button>
              </div>
            </div>

            {/* Goals and Experience */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="text-xs text-gray-500">Experience</div>
                <div className="text-base font-medium">
                  {user?.data?.experience}
                </div>
              </div>
            </div>

            {/* Numbers and Stats (Same UI style, use your stats data here) */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="bg-white border rounded-lg p-4 flex flex-col items-center">
                <span className="text-xl font-bold">0</span>
                <span className="text-xs text-gray-500">Workouts</span>
              </div>
              <div className="bg-white border rounded-lg p-4 flex flex-col items-center">
                <span className="text-xl font-bold">4</span>
                <span className="text-xs text-gray-500">
                  Subscribed Programs
                </span>
              </div>
              <div className="bg-white border rounded-lg p-4 flex flex-col items-center">
                <span className="text-xl font-bold">0</span>
                <span className="text-xs text-gray-500">Achievements</span>
              </div>
              <div className="bg-white border rounded-lg p-4 flex flex-col items-center">
                <span className="text-xl font-bold">0</span>
                <span className="text-xs text-gray-500">Day Streak</span>
              </div>
            </div>

            {/* React Hook Form (Edit profile section) */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    className="input w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="input w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <input
                    type="text"
                    {...register("location")}
                    className="input w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Joined</label>
                  <input
                    type="text"
                    {...register("joined")}
                    className="input w-full p-2 border rounded"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Goals</label>
                  <input
                    type="text"
                    {...register("goals")}
                    className="input w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Experience</label>
                  <input
                    type="text"
                    {...register("experience")}
                    className="input w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-pink-500 text-white font-bold mt-4"
              >
                Save
              </button>
            </form>

            {/* Subscriptions Example */}
            <div className="mt-8">
              <h3 className="text-md font-semibold mb-2">
                Active Subscriptions
              </h3>
              <div className="flex flex-col gap-2">
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <span>
                    Befit{" "}
                    <span className="text-xs text-gray-400">by rawan</span>
                  </span>
                  <span className="text-green-500 font-bold text-xs bg-green-100 px-2 py-1 rounded">
                    active
                  </span>
                </div>
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <span>
                    pilates 12-week program{" "}
                    <span className="text-xs text-gray-400">by Osama</span>
                  </span>
                  <span className="text-green-500 font-bold text-xs bg-green-100 px-2 py-1 rounded">
                    active
                  </span>
                </div>
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <span>
                    Befit{" "}
                    <span className="text-xs text-gray-400">by rawan</span>
                  </span>
                  <span className="text-green-500 font-bold text-xs bg-green-100 px-2 py-1 rounded">
                    active
                  </span>
                </div>
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <span>
                    12-Week Shredss00{" "}
                    <span className="text-xs text-gray-400">by rawan</span>
                  </span>
                  <span className="text-green-500 font-bold text-xs bg-green-100 px-2 py-1 rounded">
                    active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
