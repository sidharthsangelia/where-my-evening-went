export const getAudioDuration = (blob: Blob): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    const url = URL.createObjectURL(blob);

    audio.src = url;

    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration); // duration in seconds
      URL.revokeObjectURL(url);
    });

    audio.addEventListener("error", (err) => {
      reject(err);
      URL.revokeObjectURL(url);
    });
  });
};
