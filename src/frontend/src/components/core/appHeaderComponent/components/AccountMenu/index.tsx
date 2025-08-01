import { FaDiscord, FaGithub } from "react-icons/fa";
import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import {
  DATASTAX_DOCS_URL,
  DISCORD_URL,
  DOCS_URL,
  GITHUB_URL,
  TWITTER_URL,
} from "@/constants/constants";
import { useLogout } from "@/controllers/API/queries/auth";
import { CustomProfileIcon } from "@/customization/components/custom-profile-icon";
import { CustomSochflowHeaderMenu } from "@/customization/components/custom-header-menu";
import { ENABLE_DATASTAX_LANGFLOW, SOCHFLOW } from "@/customization/feature-flags";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useAuthStore from "@/stores/authStore";
import { useDarkStore } from "@/stores/darkStore";
import { cn, stripReleaseStageFromVersion } from "@/utils/utils";
import {
  HeaderMenu,
  HeaderMenuItemButton,
  HeaderMenuItemLink,
  HeaderMenuItems,
  HeaderMenuToggle,
} from "../HeaderMenu";
import ThemeButtons from "../ThemeButtons";

export const AccountMenu = () => {
  // If SOCHFLOW feature flag is enabled, use the custom header menu
  if (SOCHFLOW) {
    return <CustomSochflowHeaderMenu />;
  }

  // Original AccountMenu implementation for non-Sochflow
  const version = useDarkStore((state) => state.version);
  const latestVersion = useDarkStore((state) => state.latestVersion);
  const navigate = useCustomNavigate();
  const { mutate: mutationLogout } = useLogout();

  const { isAdmin, autoLogin } = useAuthStore((state) => ({
    isAdmin: state.isAdmin,
    autoLogin: state.autoLogin,
  }));

  const handleLogout = () => {
    mutationLogout();
  };

  const isLatestVersion = (() => {
    if (!version || !latestVersion) return false;

    const currentBaseVersion = stripReleaseStageFromVersion(version);
    const latestBaseVersion = stripReleaseStageFromVersion(latestVersion);

    return currentBaseVersion === latestBaseVersion;
  })();

  return (
    <>
      <HeaderMenu>
        <HeaderMenuToggle>
          <div
            className="group h-9 w-9 overflow-hidden rounded-full ring-2 ring-border/50 transition-all duration-300 hover:ring-4 hover:ring-border focus-visible:outline-0 active:scale-95"
            data-testid="user-profile-settings"
          >
            <CustomProfileIcon />
          </div>
        </HeaderMenuToggle>
        <HeaderMenuItems position="right" classNameSize="w-[320px]">
          <div className="divide-y divide-border/10 overflow-hidden rounded-xl bg-background/80 shadow-lg backdrop-blur-sm">
            {/* <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span
                  data-testid="menu_version_button"
                  id="menu_version_button"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Version
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shadow-sm transition-all duration-300",
                    isLatestVersion 
                      ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20" 
                      : "animate-pulse bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20"
                  )}
                >
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isLatestVersion ? "bg-emerald-500" : "bg-amber-500"
                  )} />
                  {version}
                  <span className="opacity-60">
                    {isLatestVersion ? "(latest)" : "(update available)"}
                  </span>
                </div>
              </div>
            </div> */}

            <div className="space-y-1 p-1.5">
              {/* <HeaderMenuItemButton
                onClick={() => navigate("/settings")}
                icon="Settings"
              >
                <div className="flex items-center gap-3 px-2">
                  <div className="rounded-md bg-muted p-1.5">
                    <ForwardedIconComponent name="Settings" className="h-4 w-4 text-foreground/70" />
                  </div>
                  <span className="font-medium">Settings</span>
                </div>
              </HeaderMenuItemButton> */}

              {isAdmin && !autoLogin && (
                <HeaderMenuItemButton
                  onClick={() => navigate("/admin")}
                  icon="Shield"
                >
                  <div className="flex items-center gap-3 px-2">
                    <div className="rounded-md bg-muted p-1.5">
                      <ForwardedIconComponent name="Shield" className="h-4 w-4 text-foreground/70" />
                    </div>
                    <span className="font-medium">Admin Page</span>
                  </div>
                </HeaderMenuItemButton>
              )}
            </div>

            {/* <div className="p-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                <div className="relative">
                  <ThemeButtons />
                </div>
              </div>
            </div> */}

            {!autoLogin && (
              <div className="p-1.5">
                <HeaderMenuItemButton onClick={handleLogout} icon="log-out">
                  <div className="flex items-center gap-3 px-2">
                    <div className="rounded-md bg-destructive/10 p-1.5">
                      <ForwardedIconComponent name="LogOut" className="h-4 w-4 text-destructive" />
                    </div>
                    <span className="font-medium text-destructive">Logout</span>
                  </div>
                </HeaderMenuItemButton>
              </div>
            )}
            <HeaderMenuItemLink
              newPage
              href={ENABLE_DATASTAX_LANGFLOW ? DATASTAX_DOCS_URL : DOCS_URL}
            >
              <span data-testid="menu_docs_button" id="menu_docs_button">
                Docs
              </span>
            </HeaderMenuItemLink>
          </div>

          <div>
            <HeaderMenuItemLink newPage href={GITHUB_URL}>
              <span
                data-testid="menu_github_button"
                id="menu_github_button"
                className="flex items-center gap-2"
              >
                <FaGithub className="h-4 w-4" />
                GitHub
              </span>
            </HeaderMenuItemLink>
            <HeaderMenuItemLink newPage href={DISCORD_URL}>
              <span
                data-testid="menu_discord_button"
                id="menu_discord_button"
                className="flex items-center gap-2"
              >
                <FaDiscord className="h-4 w-4 text-[#5865F2]" />
                Discord
              </span>
            </HeaderMenuItemLink>
            <HeaderMenuItemLink newPage href={TWITTER_URL}>
              <span
                data-testid="menu_twitter_button"
                id="menu_twitter_button"
                className="flex items-center gap-2"
              >
                <ForwardedIconComponent
                  strokeWidth={2}
                  name="TwitterX"
                  className="h-4 w-4"
                />
                X
              </span>
            </HeaderMenuItemLink>
          </div>

          <div className="flex items-center justify-between px-4 py-[6.5px] text-sm">
            <span className="">Theme</span>
            <div className="relative top-[1px] float-right">
              <ThemeButtons />
            </div>
          </div>

          {!autoLogin && (
            <div>
              <HeaderMenuItemButton onClick={handleLogout} icon="log-out">
                Logout
              </HeaderMenuItemButton>
            </div>
          )}
        </HeaderMenuItems>
    </HeaderMenu>
    </>
  );
};
