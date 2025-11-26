import axios from "axios";

export const GetUserById = async (id: string) => {
  try {
    const res = await axios.get(
      `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/auth/getusers/`
    );
  } catch (err) {
    console.error("Error fetching athlete subscriptions:", err);
    throw err;
  }
};
