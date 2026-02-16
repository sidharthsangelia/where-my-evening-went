import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  audioUploader: f({ audio: { maxFileSize: "16MB" } }).onUploadComplete(
    ({ file }) => {
      console.log("uploaded🌱");
    },
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
