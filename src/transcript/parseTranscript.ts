import { TranscriptResponse } from "youtube-transcript";
import millisecondsToTimestamp from "./millisecondsToTimestamp";

export function parseTranscript(transcript: TranscriptResponse[]) {
  const getPrintableFormat = (includeTimestamp = false) =>
    transcript.reduce((prev, curr, index) => {
      if (!includeTimestamp) {
        return prev + curr.text + " ";
      }
      const timestamp = millisecondsToTimestamp(curr.offset);
      const currLine = `[${timestamp}]${curr.text}\n`;
      return prev + currLine;
    }, "");

  return {
    getPrintableFormat,
  };
}
