import { FaUser } from "react-icons/fa";
import { ChevronRight } from "lucide-react"; // or from "react-icons/bs" if preferred
import { useUser } from "../../Context/ContextApt";

export default function AccountSettingsCard() {
  const { userData } = useUser();
  const email = userData?.user?.email;
  const createdAt = userData?.user?.createdAt;
  console.log(email);
  

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full my-5 divide-y py-4 divide-gray-200">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <FaUser className="text-purple-500 text-xl" />
        <h2 className="text-base font-semibold">Account settings</h2>
      </div>

      {/* Settings List */}
      <div className="divide-y divide-gray-200">
        {/* Email */}
        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
          <div className="flex-1 flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 flex-1 basis-[100px]">Email</span>
            <span className="text-gray-800 font-medium flex-1 basis-[100px]">
              {email}
            </span>
          </div>
          <div className="pl-4">
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Change Password */}
        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
          <div className="flex-1 flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 flex-1 basis-[100px]">Change password</span>
            <span className="text-gray-800 font-medium flex-1 basis-[100px]">
              ••••••••••
            </span>
          </div>
          <div className="pl-4">
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* 2FA */}
        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
          <div className="flex-1 flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 flex-1 basis-[100px]">Two-Factor Authentication</span>
            <span className="text-gray-800 font-medium flex-1 basis-[100px]">Disabled</span>
          </div>
          <div className="pl-4">
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Member Since */}
        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
          <div className="flex-1 flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 flex-1 basis-[100px]">Member since</span>
            <span className="text-gray-800 font-medium flex-1 basis-[100px]">
              {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="pl-4">
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
