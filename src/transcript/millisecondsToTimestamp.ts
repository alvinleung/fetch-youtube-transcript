const isInt = (n: number) => n % 1 === 0;

export default function millisecondsToTimestamp(milliseconds: number) {
  if (typeof milliseconds !== "number") {
    throw new TypeError(`Expected a number, got ${typeof milliseconds}`);
  }

  const slicePosition = isInt(milliseconds) ? 19 : 22;

  const result = new Date(milliseconds).toISOString().slice(11, slicePosition);

  return result;
}
