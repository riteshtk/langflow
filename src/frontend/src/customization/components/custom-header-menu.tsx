import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import { useLogout } from "@/controllers/API/queries/auth";
import { CustomProfileIcon } from "@/customization/components/custom-profile-icon";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useAuthStore from "@/stores/authStore";
import { useDarkStore } from "@/stores/darkStore";
import { cn } from "@/utils/utils";
import { FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import {
  HeaderMenu,
  HeaderMenuItemButton,
  HeaderMenuItems,
  HeaderMenuToggle,
} from "@/components/core/appHeaderComponent/components/HeaderMenu";

export const CustomSochflowHeaderMenu = () => {
  const version = useDarkStore((state) => state.version);
  const latestVersion = useDarkStore((state) => state.latestVersion);
  const navigate = useCustomNavigate();
  const { mutate: mutationLogout } = useLogout();

  const { isAdmin, autoLogin, userData } = useAuthStore((state) => ({
    isAdmin: state.isAdmin,
    autoLogin: state.autoLogin,
    userData: state.userData,
  }));

  const handleLogout = () => {
    mutationLogout();
  };

  const isLatestVersion = version === latestVersion;

  return (
    <HeaderMenu>
      <HeaderMenuToggle>
        <div
          className="group h-9 w-9 overflow-hidden rounded-full ring-2 ring-gray-200 transition-all duration-200 hover:ring-2 hover:ring-indigo-500 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
          data-testid="user-profile-settings"
        >
          <CustomProfileIcon />
        </div>
      </HeaderMenuToggle>
      <HeaderMenuItems position="right" classNameSize="w-[240px]">
        <div className="overflow-hidden rounded-xl bg-white/95 shadow-lg backdrop-blur-md border border-gray-200/50">

          {/* Menu Items */}
          <div className="p-1.5">
            {isAdmin && !autoLogin && (
              <HeaderMenuItemButton
                onClick={() => navigate("/admin")}
                icon="Shield"
              >
                <div className="flex items-center gap-3 rounded-lg hover:bg-indigo-50 transition-colors duration-150 group">
                  <div className="rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                    <FaShieldAlt className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm">Admin Panel</span>
                </div>
              </HeaderMenuItemButton>
            )}

            {!autoLogin && (
              <HeaderMenuItemButton onClick={handleLogout} icon="log-out">
                <div className="flex items-center gap-3  rounded-lg hover:bg-red-50 transition-colors duration-150 group">
                  <div className="rounded-md bg-red-100 group-hover:bg-red-200 transition-colors">
                    <FaSignOutAlt className="h-3.5 w-3.5 text-red-600" />
                  </div>
                  <span className="font-medium text-red-600 text-sm">Sign Out</span>
                </div>
              </HeaderMenuItemButton>
            )}
          </div>
        </div>
      </HeaderMenuItems>
    </HeaderMenu>
  );
}; 