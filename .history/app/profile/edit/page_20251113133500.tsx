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
          first_name: data.data.first_name,
          last_name: data.data.name,
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

  console.log(user);

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

            <header className="py-3 sm:py-4 flex items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                Edit Profile
              </h1>
            </header>

            {/* React Hook Form (Edit profile section) */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">First Name</label>
                  <input
                    type="text"
                    {...register("first_name")}
                    defaultValue={user?.data.first_name}
                    className="input w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Last Name</label>
                  <input
                    type="text"
                    {...register("last_name")}
                    defaultValue={user?.data.second_name}
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
                  <label className="text-sm text-gray-600">Experience</label>
                  <input
                    type="text"
                    {...register("experience")}
                    defaultValue={user?.data.experience_level}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
