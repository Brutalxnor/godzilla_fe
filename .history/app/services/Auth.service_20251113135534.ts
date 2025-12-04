import axios from "axios";

export const GetUserById = async (id: string) => {
  try {
    const res = await axios.get(
      `https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/auth/getusers/${id}`
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
      `https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/auth/getusers/${id}`,
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
