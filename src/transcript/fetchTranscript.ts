import ytTranscript from "youtube-transcript";
import storage from "node-persist";

export async function fetchTranscript(url: string) {
  await storage.init();
  const transcriptKey = `transcript-${url}`;

  const result = await storage.get(transcriptKey);
  if (typeof result === "string") {
    console.log("cached version of transcript found, using cached version.");
    return JSON.parse(result);
  }

  //@ts-ignore
  const YoutubeTranscript: YoutubeTranscript = ytTranscript.default;
  const transcript = await YoutubeTranscript.fetchTranscript(url);
  storage.setItem(transcriptKey, JSON.stringify(transcript));

  return transcript;
}
