import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfilePage = () => {
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
  const [isShowConfirmNewPassword, setIsConfirmNewPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    profileImg: "",
    fullName: "",
    email: "",
    mobile: "",
    currentPassword: "",
    newPassword: "",
  });

  const {
    authUser,
    checkAuth,
    isCheckingAuth,
    isUpdatingProfile,
    updateProfile,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      setFormData({
        profileImg: authUser.profileImg?.url || "",
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        mobile: authUser.mobile || "",
        currentPassword: "",
        newPassword: "",
      });

      setPreviewUrl(authUser.profileImg?.url || "");
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleCurrentPassword = () =>
    setIsShowCurrentPassword(!isShowCurrentPassword);

  const toggleConfirmPassword = () =>
    setIsConfirmNewPassword(!isShowConfirmNewPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("currentPassword", formData.currentPassword);
    data.append("newPassword", formData.newPassword);
    if (selectedImage) {
      data.append("profileImg", selectedImage);
    }

    await updateProfile(data);
  };

  if (isCheckingAuth || !authUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner content="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="pt-10">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p>Your profile Information</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={previewUrl || formData.profileImg || "/avatar.png"}
                  alt="Profile Image"
                  className="size-32 rounded-full object-cover border-4"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400 mb-8">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                {/* Full Name */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Muhammad Usman"
                    required
                    onChange={handleInputChange}
                    value={formData.fullName}
                    className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Email */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <input
                      disabled
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="user@gmail.com"
                      className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:cursor-not-allowed text-sm"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">
                        Mobile Number
                      </span>
                    </label>
                    <input
                      disabled
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="03001234567"
                      maxLength={11}
                      minLength={11}
                      className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:cursor-not-allowed text-sm"
                    />
                  </div>
                </div>

                {/* Passwords */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Current Password */}
                  <div className="relative form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">
                        Current Password
                      </span>
                    </label>
                    <input
                      type={isShowCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      placeholder="••••••••"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                    />
                    {formData.currentPassword && (
                      <div
                        onClick={toggleCurrentPassword}
                        className="absolute top-11 right-3 transform -translate-y-1/2 cursor-pointer text-gray-700"
                      >
                        {isShowCurrentPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="relative form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">
                        New Password
                      </span>
                    </label>
                    <input
                      type={isShowConfirmNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="••••••••"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                    />
                    {formData.newPassword && (
                      <div
                        onClick={toggleConfirmPassword}
                        className="absolute top-11 right-3 transform -translate-y-1/2 cursor-pointer text-gray-700"
                      >
                        {isShowConfirmNewPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div className="mt-6 bg-base-300 rounded-xl py-6">
                  <h2 className="font-medium text-lg mb-4">
                    Account Information
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                      <span>Member Since</span>
                      <span>{authUser?.createdAt?.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Account Status</span>
                      <span className="text-green-500">Active</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full text-white bg-gray-950 hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 transition cursor-pointer"
                >
                  {isUpdatingProfile ? (
                    <LoadingSpinner content="Updating..." />
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
