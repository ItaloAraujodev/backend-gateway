export function generateProductHash(prefix = "EA") {
  const randomSequence = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `${prefix}${randomSequence}`;
}
