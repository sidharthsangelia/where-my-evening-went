"use client";

import { useState } from "react";

interface AccordionItemProps {
  title:    string;
  children: React.ReactNode;
}

function AccordionItem({ title, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid var(--color-neutral-200)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span
          className="text-[13px] font-semibold"
          style={{ color: "var(--color-neutral-800)" }}
        >
          {title}
        </span>
        <span
          className="text-[16px] transition-transform duration-300 shrink-0"
          style={{
            color:     "var(--color-neutral-400)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display:   "inline-block",
          }}
        >
          ↓
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-400"
        style={{ maxHeight: open ? "600px" : "0px" }}
      >
        <div
          className="pb-4 text-[12px] leading-[1.8]"
          style={{ color: "var(--color-neutral-600)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function PrivacySection() {
  return (
    <div className="px-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[9px] font-black uppercase tracking-[0.25em]"
          style={{ color: "var(--color-neutral-500)" }}
        >
          ◈ privacy & legal
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--color-neutral-200)" }} />
      </div>

      <div
        className="rounded-[20px] px-5"
        style={{
          background: "var(--card)",
          border: "1px solid var(--color-neutral-200)",
        }}
      >
        <AccordionItem title="Privacy Policy">
          <p className="mb-2 font-semibold" style={{ color: "var(--color-neutral-700)" }}>
            Last updated: January 2025
          </p>
          <p className="mb-3">
            We collect only what we need to make the app work. That means your
            email address (via Clerk), your recorded audio, and any data you
            explicitly add — moods, notes.
          </p>
          <p className="mb-3">
            <strong>Audio & transcripts:</strong> If AI processing is enabled,
            your audio is transcribed using a third-party API. The transcript
            and derived insights are stored in our database. Raw audio files are
            stored in secure cloud storage and are never shared with third
            parties for training.
          </p>
          <p className="mb-3">
            <strong>AI processing:</strong> AI features are opt-in only. If
            disabled, your audio is stored as-is and no external API receives
            your data.
          </p>
          <p className="mb-3">
            <strong>Data retention:</strong> Deleted entries are soft-deleted
            and purged from our systems within 30 days. You may request
            immediate deletion at any time.
          </p>
          <p>
            <strong>Third parties:</strong> We use Clerk for authentication,
            and cloud storage for audio. We do not sell, rent, or share your
            personal data with advertisers.
          </p>
        </AccordionItem>

        <AccordionItem title="Terms of Service">
          <p className="mb-3">
            By using this app you agree to use it only for personal,
            non-commercial journalling. You may not attempt to reverse-engineer,
            scrape, or misuse the service.
          </p>
          <p className="mb-3">
            You retain full ownership of your content. By storing data with us
            you grant us a limited licence to process it solely for the purpose
            of providing the service to you.
          </p>
          <p>
            We reserve the right to suspend accounts that violate these terms.
            We'll always try to give notice first.
          </p>
        </AccordionItem>

        <AccordionItem title="Data we store">
          <ul className="space-y-1.5 list-none">
            {[
              ["Email address", "Account identification via Clerk"],
              ["Display name",  "Shown in your greeting"],
              ["Audio files",   "Your recorded evening entries"],
              ["Transcripts",   "AI-generated — only if opt-in enabled"],
              ["Mood tags",     "What you select before recording"],
              ["AI insights",   "Patterns, themes, pull quotes — opt-in only"],
              ["Timezone",      "Used to calculate your local day"],
            ].map(([label, desc]) => (
              <li key={label} className="flex items-start gap-2">
                <span style={{ color: "var(--color-primary)" }}>◈</span>
                <span>
                  <strong style={{ color: "var(--color-neutral-700)" }}>{label}</strong>
                  {" — "}{desc}
                </span>
              </li>
            ))}
          </ul>
        </AccordionItem>

        <AccordionItem title="Your rights">
          <p className="mb-3">
            You have the right to access, correct, export, or delete any data we
            hold about you. You can export your entry archive or delete your
            account at any time from this page.
          </p>
          <p>
            For any privacy concerns write to us at{" "}
            <a
              href="mailto:privacy@yourapp.com"
              className="underline"
              style={{ color: "var(--color-primary)" }}
            >
              privacy@yourapp.com
            </a>
            . We respond within 48 hours.
          </p>
        </AccordionItem>
      </div>
    </div>
  );
}