"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, SlidersHorizontal, ShieldCheck } from "lucide-react";

export default function UserMenu() {
  return (
    <UserButton
      appearance={{
        variables: {
          colorPrimary:        "#621100",
          colorText:           "#1E1B18",
          colorBackground:     "#FAF8F5",
          colorInputBackground:"#F5F2EC",
          colorInputText:      "#1E1B18",
          borderRadius:        "0.625rem",
          fontFamily:          "Inter, system-ui, sans-serif",
        },
        elements: {
          /* Outer trigger button – match the old avatar size */
          avatarBox:
            "w-12 h-12 ring-2 ring-[#621100]/20 hover:ring-[#621100]/50 transition-all duration-200",

          /* Popover card */
          userButtonPopoverCard:
            "shadow-xl border border-[#EAE6DC] bg-[#FAF8F5] rounded-xl",

          /* Top user-info section */
          userButtonPopoverActionButton:
            "hover:bg-[#F5F2EC] rounded-lg transition-colors",
          userButtonPopoverActionButtonText:
            "text-[#1E1B18] text-sm font-medium",
          userButtonPopoverActionButtonIcon: "text-[#621100]",

          /* Footer */
          userButtonPopoverFooter: "hidden",

          /* "Manage account" link */
          userPreviewMainIdentifier:
            "font-semibold text-[#1E1B18]",
          userPreviewSecondaryIdentifier:
            "text-[#9A9185] text-xs",
        },
      }}
    >
      {/* ── Custom menu items injected above Sign out ── */}
      <UserButton.MenuItems>
        {/* Notifications shortcut */}
        <UserButton.Action
          label="Notifications"
          labelIcon={<Bell size={15} />}
          onClick={() => {
            /* wire to your notification panel / route */
            console.log("open notifications");
          }}
        />

        {/* App preferences */}
        <UserButton.Action
          label="Preferences"
          labelIcon={<SlidersHorizontal size={15} />}
          onClick={() => {
            /* open preferences sheet / navigate */
            console.log("open preferences");
          }}
        />
      </UserButton.MenuItems>

      {/* ── Extra tab inside the "Manage account" modal ── */}
      <UserButton.UserProfilePage
        label="Privacy & Safety"
        labelIcon={<ShieldCheck size={16} />}
        url="privacy"
      >
        {/* Rendered inside Clerk's modal as a full custom page */}
        <div className="space-y-4 p-1">
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-neutral-900)" }}>
            Privacy & Safety
          </h2>
          <p className="text-sm" style={{ color: "var(--color-neutral-600)" }}>
            Control who can see your activity, manage data exports, and review
            connected devices.
          </p>

          {/* ── Example toggle rows ── */}
          {[
            { label: "Show activity streak publicly", defaultOn: true  },
            { label: "Allow friend requests",         defaultOn: true  },
            { label: "Share analytics with team",     defaultOn: false },
          ].map(({ label, defaultOn }) => (
            <label
              key={label}
              className="flex items-center justify-between py-3 border-b last:border-0 cursor-pointer"
              style={{ borderColor: "var(--color-neutral-200)" }}
            >
              <span className="text-sm" style={{ color: "var(--color-neutral-800)" }}>
                {label}
              </span>
              <input
                type="checkbox"
                defaultChecked={defaultOn}
                className="accent-[#621100] w-4 h-4 cursor-pointer"
              />
            </label>
          ))}
        </div>
      </UserButton.UserProfilePage>
    </UserButton>
  );
}