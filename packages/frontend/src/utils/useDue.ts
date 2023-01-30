import dayjs from "dayjs/esm";
import { reactify } from "@vueuse/core";

export function getIsDue(nextDate: string | number) {
  const next = dayjs(nextDate).valueOf();
  const today = dayjs().startOf("day").valueOf();
  return next - today <= 0;
}

export const useDue = reactify(getIsDue);
