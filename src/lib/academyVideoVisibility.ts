// Add a page's exact Academy pathname here only when its video is ready.
// Course overviews and individual lessons are independent; no global switch.
export const academyVideoPages: ReadonlySet<string> = new Set<string>();

export function isAcademyVideoVisible(
  pathname: string,
  enabledPages: ReadonlySet<string> = academyVideoPages,
): boolean {
  return enabledPages.has(pathname.replace(/\/$/, ""));
}