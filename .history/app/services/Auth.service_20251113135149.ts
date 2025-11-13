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

export const UpdateUser = async (data: {
  first_name
last_name
email
location
experience
}) => {
  try {
    const res = await axios.put(
      `https://godzilla-be.vercel.app/api/v1/auth/getusers/${id}`
    );

    return res.data;
  } catch (err) {
    console.error("Error fetching athlete subscriptions:", err);
    throw err;
  }
};
