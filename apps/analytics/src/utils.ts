import url from "url"

export function getBaseUrl(fullUrl: string): string {
  const parsed = url.parse(fullUrl);

  return `${parsed.protocol}//${parsed.hostname}`;
}