import { Country } from "@/app/models/main";

const SMALL_BREAKPOINT = "375px";
const MEDIUM_BREAKPOINT = "768px";
const DESKTOP_BREAKPOINT = "1440px";

export const cssBreakPoints = {
  SMALL_BREAKPOINT,
  MEDIUM_BREAKPOINT,
  DESKTOP_BREAKPOINT,
};

export const removeDuplicatesByRegion = (arr: Country[]) => {
  const seen = new Set();
  return arr?.filter((item) => {
    if (seen.has(item.region)) return false;
    seen.add(item.region);
    return true;
  });
};
