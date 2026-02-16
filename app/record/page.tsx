// app/record/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import Mic from "@/components/Mic";
import { useAuth } from "@clerk/nextjs";

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
    const audioFile = new File([blob], `evening-${userId}-${Date.now}.webm`, {
      type: blob.type,
    });

    const res = await startUpload([audioFile]);

    if (res?.[0]) {
      console.log("Upload Successful 🚀🌱");
      // TODO: Save to database here
      router.push("/archive");
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
