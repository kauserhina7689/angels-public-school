"use server";
import { generateToken } from "@/server/utils/token";
import { cookies } from "next/headers";

interface propsType {
  mobileNumber: number;
  password: string;
}

export async function adminLogin(data: propsType) {
  try {
    const {mobileNumber,password}=data;
    const adminNumber = Number(process.env.ADMIN_MOBILE_NUMBER!);
    const adminPassword = process.env.ADMIN_PASSWORD!;
 
    if (adminNumber!==mobileNumber)
      return {
        success: false,
        message: "Mobile number does not exist",
        errors: { mobileNumber: "Mobile number does not exist" },
      };
    if (adminPassword!==password)
      return {
        success: false,
        message: "Password is incorrect!",
        errors: {
          password: "Password in incorrect",
        },
      };
    const token = await generateToken({
      _id: "admin_user_id",
      number:mobileNumber,
      role: "school",
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });
    console.log("successfully logged in");

    return {
      success: true,
      message: "Logged in successfully as " +  process.env.ADMIN_USER_NAME!,
      errors: {},
    };
  } catch (error) {
    console.log(error);

    return { success: false, errors: {}, message: "something went wrong!" };
  }
}
