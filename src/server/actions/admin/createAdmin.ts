"use server";
import { adminModel } from "@/server/DB/models/admin";
import { admintype } from "@/lib/types";
import { connectDB } from "@/server/DB";
import { hashPassword } from "@/server/utils/password";

export async function createAdmin() {
  try {
    await connectDB();
    const admin: admintype = {
      name: "admin name",
      number: 1234567890,
    };
    const password = await hashPassword("password");
    await adminModel.create({ ...admin, password });
    console.log("created admin succesfully");
  } catch (error) {
    console.log(error, "error while creating admin");
  }
}
