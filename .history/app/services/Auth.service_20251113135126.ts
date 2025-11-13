import axios from "axios";

export const GetUserById = async (id: string) => {
  try {
    const res = await axios.get(
      `https://godzilla-be.vercel.app/api/v1/auth/getusers/${id}`
    );

    return res.data;
  } catch (err) {
    console.error("Error fetching athlete subscriptions:", err);
    throw err;
  }
};


export const 