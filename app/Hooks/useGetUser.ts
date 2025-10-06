"use client";
// import { User } from "@/types/admin";
import { useEffect, useState } from "react";

const useGetUser = () => {
  const [userDB, setUserDB] = useState(null);

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
