const KEY = "nh_viewed_stars_v1";

export function getViewedStars(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as number[];
  } catch (e) {
    return [];
  }
}

export function markStarViewed(idx: number) {
  try {
    const arr = getViewedStars();
    if (!arr.includes(idx)) {
      arr.push(idx);
      localStorage.setItem(KEY, JSON.stringify(arr));
    }
  } catch (e) {
    // ignore
  }
}
