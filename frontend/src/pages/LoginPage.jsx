import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Eye, EyeOff } from "lucide-react";

import AuthImagePattern from "../components/AuthImagePattern";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const navigate = useNavigate();

  const { isLoggingIn, login } = useAuthStore();
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill all required fields");
      return;
    }

    const success = await login(formData);

    if (success) {
      navigate("/");
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordShow(!isPasswordShow);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:pt-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold select-none">Welcome Back</h1>
              <p className="text-sm text-base-content/60 select-none">
                sign in your account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 mt-10">
            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>

              <input
                type="email"
                name="email"
                placeholder="user@example.com"
                required="required"
                autoComplete="email"
                onChange={handleInputChange}
                value={formData.email}
                className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              />
            </div>

            {/* Password */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>

                <Link
                  to={"/forgot-password"}
                  className="ml-auto inline-block text-xs font-semibold hover:text-[#8c75f3] hover:underline transition duration-75 ease-in-out"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={isPasswordShow ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  minLength={8}
                  required="required"
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  value={formData.password}
                  className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                />

                {formData.password && (
                  <div
                    onClick={togglePasswordVisibility}
                    className="absolute top-5 right-5 transform -translate-y-1/2 cursor-pointer text-gray-700"
                  >
                    {isPasswordShow ? <Eye size={18} /> : <EyeOff size={18} />}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-col">
              <button
                type="submit"
                className="w-full text-white bg-[#3430de] hover:bg-[#3a37c1] focus:outline-none focus:ring-4 focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 transition cursor-pointer"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <LoadingSpinner content="Logging in..." />
                ) : (
                  "Login"
                )}
              </button>

              <Link
                to="/signup"
                className="w-full text-whtie border border-primary hover:text-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
              >
                Signup
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title="Join our comunity "
        subTitle="Connect with frieds, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default LoginPage;
