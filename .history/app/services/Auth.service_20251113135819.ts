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

export const UpdateUser = async (
  data: {
    first_name: string;
    last_name: string;
    email: string;
    location: string;
    experience: string;
  },
  id: string
) => {
  try {
    const res = await axios.put(
      `https://godzilla-be.vercel.app/api/v1/auth/updateuser/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Error fetching athlete subscriptions:", err);
    throw err;
  }
};
