// app/record/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import Mic from "@/components/Mic";
import { useAuth } from "@clerk/nextjs";
import { saveRecording } from "@/actions/recordings";
import { inngest } from "@/lib/inngest/client";

export default function RecordPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const { startUpload, isUploading } = useUploadThing("audioUploader");

  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);

  const handleRecordingComplete = async (blob: Blob) => {
    // Auth check
    if (!isSignedIn) {
      // Store blob in localStorage before redirect
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        localStorage.setItem("pendingRecording", reader.result as string);
        // Redirect to Clerk sign-in with return URL
        router.push("/sign-in?redirect_url=/record");
      };
      return;
    }

    // User is authenticated, upload directly
    await uploadRecording(blob);
  };

  const uploadRecording = async (blob: Blob) => {
    const audioFile = new File([blob], `evening-${userId}-${Date.now()}.webm`, {
      type: blob.type,
    });

    const res = await startUpload([audioFile]);

    if (res?.[0]) {
      console.log("Upload Successful 🚀🌱");
      // Save to database in uplaoding core function server action
      const { entry } = await saveRecording(res[0].ufsUrl);

      // api route
      // await saveRecordingToDB({
      //   audioUrl: res[0].ufsUrl,
      //   fileName: audioFile.name,
      // });

      router.push("/archive");

      // inngest event invoked
      await inngest.send({
        name: "entry/created",
        data: {
          entryId: entry?.id,
        },
      });
    }
  };

  const saveRecordingToDB = async (params: {
    audioUrl: string;
    fileName?: string;
    duration?: number;
  }) => {
    try {
      const res = await fetch("/api/recordings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to save recording");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("❌ saveRecordingToDB failed:", err);
      throw err;
    }
  };

  // Handle upload after user returns from sign-in
  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    const pendingRecording = localStorage.getItem("pendingRecording");

    if (isSignedIn && pendingRecording) {
      // Convert base64 back to blob
      fetch(pendingRecording)
        .then((res) => res.blob())
        .then((blob) => {
          uploadRecording(blob);
          localStorage.removeItem("pendingRecording");
        })
        .catch((err) => {
          console.error("Failed to restore recording:", err);
          localStorage.removeItem("pendingRecording");
        });
    }
  }, [isSignedIn, isLoaded]);

  // Show loading while Clerk initializes
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isUploading) {
    return <div>Saving your evening...</div>;
  }

  return <Mic onRecordingComplete={handleRecordingComplete} />;
}
