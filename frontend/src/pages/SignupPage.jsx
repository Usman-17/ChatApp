import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Eye, EyeOff } from "lucide-react";

import LoadingSpinner from "../components/LoadingSpinner";
import AuthImagePattern from "../components/AuthImagePattern";
// Imports End

const SignupPage = () => {
  const { isSigningUp, signup } = useAuthStore();
  const navigate = useNavigate();

  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, mobile, password } = formData;

    if (!fullName || !email || !mobile || !password) {
      toast.error("Please fill all required fields");
      return;
    }

    const success = await signup(formData);

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
      <div className="flex flex-col justify-center items-center p-6 sm:pt-20">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold select-none">Create Account</h1>
              <p className="text-sm text-base-content/60 select-none">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2 mt-2">
            {/* Full Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>

              <input
                type="text"
                name="fullName"
                required="required"
                value={formData.fullName}
                autoComplete="name"
                placeholder="Ener your full name"
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              />
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>

              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="user@example.com"
                required="required"
                onChange={handleInputChange}
                value={formData.email}
                className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              />
            </div>

            {/* Mobile */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Mobile</span>
              </label>

              <input
                type="text"
                inputMode="numeric"
                name="mobile"
                autoComplete="tel"
                placeholder="03000000000"
                pattern="03[0-9]{9}"
                onChange={handleInputChange}
                minLength={11}
                maxLength={11}
                value={formData.mobile}
                required="required"
                className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              />
            </div>

            {/* Password */}
            <div className="mb-4 sm:mb-6">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <div className="relative">
                <input
                  type={isPasswordShow ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={8}
                  required="required"
                  onChange={handleInputChange}
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
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <LoadingSpinner content="Signing up..." />
                ) : (
                  "Create Account"
                )}
              </button>

              <Link
                to="/login"
                className="w-full text-whtie border border-primary hover:text-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
              >
                Already have an account? Login
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

export default SignupPage;
