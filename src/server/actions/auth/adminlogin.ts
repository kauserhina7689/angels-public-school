"use server";
import { connectDB } from "@/server/DB";
import { adminModel } from "@/server/DB/models/admin";
import { verifyPassword } from "@/server/utils/password";
import { generateToken } from "@/server/utils/token";
import { cookies } from "next/headers";

interface propsType {
  mobileNumber: number;
  password: string;
}

export async function adminLogin(data: propsType) {
  try {
    await connectDB();
    const admin = await adminModel.findOne({ number: data.mobileNumber });
    if (!admin)
      return {
        success: false,
        message: "Mobile number does not exist",
        errors: { mobileNumber: "Mobile number does not exist" },
      };
    const isPasswordCorrect = await verifyPassword(
      data.password,
      admin.password
    );
    if (!isPasswordCorrect)
      return {
        success: false,
        message: "Password is incorrect!",
        errors: {
          password: "Password in incorrect",
        },
      };
    const { _id, name, number } = admin;
    const token = await generateToken({
      _id: JSON.stringify(_id),
      number,
      role: "school",
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });
    console.log("successfully logged in");

    return {
      success: true,
      message: "Logged in successfully as " + name,
      errors: {},
    };
  } catch (error) {
    console.log(error);

    return { success: false, errors: {}, message: "something went wrong!" };
  }
}
