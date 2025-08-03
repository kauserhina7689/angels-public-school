"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Phone,
  Lock,
  Users,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { adminLogin } from "@/server/actions/auth/adminlogin";
import { studentLogin } from "@/server/actions/auth/studentLogin";
import { useState } from "react";

// 🔁 Changed mobileNumber to number
export const loginSchema = z.object({
  mobileNumber: z
    .number({
      required_error: "Mobile number is required",
      invalid_type_error: "Mobile number must be a number",
    })
    .min(1000000000, { message: "Mobile number must be 10 digits" })
    .max(999999999999999, { message: "Invalid mobile number" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  userType: z.enum(["school", "student"], {
    required_error: "Please select user type",
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobileNumber: 1234567890,
      password: "password",
      userType: "school",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const toastId = toast.loading("Logging in to your account");

    try {
      if (data.userType === "school") {
        const { success, message, errors } = await adminLogin({
          mobileNumber: data.mobileNumber,
          password: data.password,
        });
        if (!success) {
          Object.entries(errors).forEach(([Key, msg]) => {
            setError(
              Key as
                | "mobileNumber"
                | "password"
                | "userType"
                | `root.${string}`
                | "root",
              { message: msg }
            );
          });
          toast.error(message, { id: toastId });
          return;
        }
        toast.success(message, { id: toastId });
        router.refresh();
      } else {
        const { success, message, errors } = await studentLogin({
          mobileNumber: data.mobileNumber,
          password: data.password,
        });
        if (!success) {
          Object.entries(errors).forEach(([Key, msg]) => {
            setError(
              Key as
                | "mobileNumber"
                | "password"
                | "userType"
                | `root.${string}`
                | "root",
              { message: msg }
            );
          });
          toast.error(message, { id: toastId });
          return;
        }
        toast.success(message, { id: toastId });
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="min-h-svh bg-gradient-to-br from-indigo-200 via-white to-purple-200 p-4">
      <div className="w-full flex flex-col md:flex-row items-center">
        {/* Header */}
        <div className="text-center mb-4 md:w-1/2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EduManage</h1>
          <p className="text-gray-600">
            Your complete school management solution
          </p>
        </div>

        <Card className="border-0 max-w-full md:max-w-1/2 md:w-1/2 bg-white/10 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* User Type */}
              <div className="space-y-2 w-full">
                <Label
                  htmlFor="userType"
                  className="text-sm font-medium text-gray-700 pl-2"
                >
                  I am a
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("userType", value as "school" | "student")
                  }
                >
                  <SelectTrigger className="h-32 p-4 w-full" size="lg">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school" className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            School Administrator
                          </div>
                          <div className="text-sm text-gray-500">
                            Manage students, teachers & classes
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="student" className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">Student</div>
                          <div className="text-sm text-gray-500">
                            View grades, assignments & attendance
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.userType && (
                  <p className="text-red-500 text-sm">
                    {errors.userType.message}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="mobileNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="mobileNumber"
                    type="number"
                    placeholder="Enter your mobile number"
                    {...register("mobileNumber", { valueAsNumber: true })}
                    className="h-12 pl-10 rounded-xl"
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="h-12 pl-10 pr-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8 text-sm text-gray-500">
        <p>© 2024 EduManage. All rights reserved.</p>
      </div>
    </div>
  );
}
