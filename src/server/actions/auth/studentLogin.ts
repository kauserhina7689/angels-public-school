"use server";
import { connectDB } from "@/server/DB";
import { StudentModel } from "@/server/DB/models/student";
import { verifyPassword } from "@/server/utils/password";
import { generateToken } from "@/server/utils/token";
import { cookies } from "next/headers";
interface propsType {
  mobileNumber: number;
  password: string;
}
export async function studentLogin(data: propsType) {
  try {
    await connectDB();
    const admin = await StudentModel.findOne({ number: data.mobileNumber });
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
    const { _id, name, mobileNumber: number } = admin;
    const token = await generateToken({
      _id: JSON.stringify(_id),
      number,
      role: "student",
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });

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
