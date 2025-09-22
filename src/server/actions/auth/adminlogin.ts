"use server";
import { generateToken } from "@/server/utils/token";
import { cookies } from "next/headers";

interface propsType {
  mobileNumber: number;
  password: string;
}

export async function adminLogin(data: propsType) {
  try {
    const ADMIN_PHONENUMBER = Number(process.env.ADMIN_PHONENUMBER!);
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
    const ADMIN_ID = process.env.ADMIN_ID!;
    const ADMIN_NAME = process.env.ADMIN_NAME!;

    if (data.mobileNumber !== ADMIN_PHONENUMBER)
      return {
        success: false,
        message: "Mobile number does not exist",
        errors: { mobileNumber: "Invalid mobile number" },
      };
    if (data.password !== ADMIN_PASSWORD) {
      return {
        success: false,
        message: "Password is incorrect",
        errors: { password: "Invalid password" },
      };
    }
    const token = await generateToken({
      _id: ADMIN_ID,
      number: ADMIN_PHONENUMBER,
      role: "school",
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });
    console.log("successfully logged in");

    return {
      success: true,
      message: "Logged in successfully as " + ADMIN_NAME,
      errors: {},
    };
  } catch (error) {
    console.log(error);

    return { success: false, errors: {}, message: "something went wrong!" };
  }
}
