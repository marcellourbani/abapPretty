export const btoa = (encoded: string) =>
  encoded && Buffer.from(encoded, "base64").toString("utf8")
export const atob = (decoded: string) =>
  decoded && Buffer.from(decoded, "utf8").toString("base64")
