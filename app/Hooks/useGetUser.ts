"use client";

import { useEffect, useState } from "react";
import { User } from "../types/admin";

const useGetUser = () => {
  const [userDB, setUserDB] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("user");
    console.log("user: ", stored);
    if (stored) {
      setUserDB(JSON.parse(stored));
    }

    setLoadingUser(false);
  }, []);

  return { userDB, loadingUser };
};

export default useGetUser;
