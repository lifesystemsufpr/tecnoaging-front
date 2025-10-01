export function parseJwt(token: string): Record<string, any> {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(json);
  } catch {
    return {};
  }
}
