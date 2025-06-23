import { CircleCheck, MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const { isForgotingPassword, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    const success = await forgotPassword({ email });

    if (success) {
      setShowAlert(true);
      toast.success("Reset email sent. Please check your inbox.");
      setEmail("");

      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold select-none">
                Forgot Password
              </h1>
              <p className="text-sm text-base-content/60 select-none">
                Please enter your email to reset your password.
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
                placeholder="user@gmail.com"
                required="required"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              />
            </div>

            {showAlert && (
              <div
                role="alert"
                className="alert flex items-center gap-2 bg-[#3430de] text-white p-3 rounded shadow transition-all"
              >
                <CircleCheck />
                <span>Reset email sent successfully!</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full text-white bg-[#3430de] hover:bg-[#3a37c1] focus:outline-none focus:ring-4 focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 transition cursor-pointer"
                disabled={isForgotingPassword}
              >
                {isForgotingPassword ? (
                  <LoadingSpinner content="Submitting..." />
                ) : (
                  "Submit"
                )}
              </button>
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

export default ForgotPasswordPage;
