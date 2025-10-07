// app/auth/services/logout.service.ts
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export interface LogoutResult {
  success: boolean;
  error?: string;
}


export const LogoutService = async (): Promise<LogoutResult> => {
  try {
 

      localStorage.removeItem("user");

  
      window.location.href = "/";
      window.location.reload();
   
      //toast.success("you are logged out successfully!");
      // setTimeout(() => {
      //     window.location.reload();
      // }, 7000);
    
    return { success: true };
  } catch (e) {
    return { success: false, error: "Logout failed" };
  }
};
