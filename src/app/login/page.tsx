"use client";

import { useState } from "react";
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
  Mail,
  Lock,
  Users,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!userType) {
      alert("Please select user type");
      return;
    }

    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (userType === "school") {
      router.push("/school");
    } else if (userType === "student") {
      router.push("/student");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-svh max-h-svh overflow-y-auto bg-gradient-to-br from-indigo-200 via-white to-purple-200 p-4 ">
      <div className="w-full flex flex-col md:flex-row items-center">
        {/* Header */}
        <div className="text-center mb-4 md:w-1/2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EduManage</h1>
          <p className="text-gray-600">
            Your complete school management solution{" "}
          </p>
        </div>
        <Card className="border-0 max-w-full md:max-w-1/2  md:w-1/2 bg-white/10 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-2 w-full ">
              <Label
                htmlFor="userType"
                className="text-sm font-medium text-gray-700 pl-2"
              >
                I am a
              </Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger className="h-32 max-h-32 p-4 w-full" size="lg">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school" className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium">School Administrator</div>
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
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password Input */}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-10 pr-10 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>

            {/* Demo Info */}
            {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="text-sm">
                <div className="font-medium text-blue-900 mb-2">
                  Demo Access
                </div>
                <div className="space-y-1 text-blue-700">
                  <div>
                    👨‍💼 <strong>Admin:</strong> Select "School Administrator" and
                    sign in
                  </div>
                  <div>
                    👨‍🎓 <strong>Student:</strong> Select "Student" and sign in
                  </div>
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  No credentials required for demo
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>
        {/* Footer */}
      </div>
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>© 2024 EduManage. All rights reserved.</p>
      </div>
    </div>
  );
}
