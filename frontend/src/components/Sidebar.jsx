import { Users } from "lucide-react";
import { useEffect, useState } from "react";

import SidebarSkeleton from "./Skeleton/SidebarSkeleton";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const [showOnlineUser, setShowOnlineUser] = useState(false);

  const { onlineUsers } = useAuthStore();
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } =
    useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineUser
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100">
      <div className="border-b border-base-300 w-full px-4 py-5">
        <div className="flex justify-center lg:justify-start items-center gap-2 w-full">
          <Users className="size-5 text-primary" />
          <span className="font-semibold text-base hidden lg:block">
            Contacts
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-1 lg:px-4 space-y-1">
        {/* Online Filter Toggle */}

        <div className="mt-3 hidden lg:flex items-center gap-2 mb-3 ">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineUser}
              onChange={(e) => setShowOnlineUser(e.target.checked)}
              className="checkbox checkbox-sm rounded-full"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
        {filteredUsers?.map((user) => {
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`group w-full flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer ${
                selectedUser?._id === user._id
                  ? "bg-base-300 shadow ring-1 ring-base-200"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0 mx-auto lg:mx-0">
                <img
                  src={user?.profileImg?.url || "/avatar.png"}
                  alt={user?.fullName || "User"}
                  className="size-11 object-cover rounded-full border border-base-300"
                />

                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="text-sm font-medium truncate text-base-content">
                  {user.fullName}
                </div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
