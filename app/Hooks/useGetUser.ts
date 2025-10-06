"use client";
// import { User } from "@/types/admin";
import { useEffect, useState } from "react";
import { User } from "../types/admin";

const useGetUser = () => {
  const [userDB, setUserDB] = useState<User | null>(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      try {
        setUserDB(JSON.parse(localUser));
      } catch (err) {
        console.error("Error parsing local user:", err);
      }
    }
  }, []);

  return { userDB };
};

export default useGetUser;
