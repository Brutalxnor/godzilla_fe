import axios from "axios";

export const GetUserById = async (id: string) => {
  try {
    const res = await axios.get(
      `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/auth/getusers/${id}`
    );

    return res.data;
  } catch (err) {
    console.error("Error fetching athlete subscriptions:", err);
    throw err;
  }
};

export const UpdateUser = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  experience: string;
}) => {
  try {
    const res = await axios.put(
      `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/auth/getusers/${id}`,
      data,{
        headers: 
      }
    );

    return res.data;
  } catch (err) {
    console.error("Error fetching athlete subscriptions:", err);
    throw err;
  }
};
