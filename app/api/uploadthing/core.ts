import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  audioUploader: f({ audio: { maxFileSize: "16MB" } }).onUploadComplete(
    ({ file }) => {
      console.log("audio file uploaded🌱");
    },
  ),

  imageUploader: f({ image: { maxFileSize: "8MB" } }).onUploadComplete(
    async ({ file }) => {
      console.log("image file uploaded🌱");
    },
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
