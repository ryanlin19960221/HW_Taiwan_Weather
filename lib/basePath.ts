// 支援 Vercel、本機與 GitHub Pages 子路徑 (basePath) 的靜態資源路徑解析輔助函式。

export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (!process.env.VERCEL && process.env.GITHUB_ACTIONS === "true"
    ? "/HW_Taiwan_Weather"
    : "");

/**
 * 自動處理公開資源路徑，相容本機、Vercel (hw-taiwan-weather.vercel.app) 與 GitHub Pages
 */
export function assetUrl(path: string): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}
