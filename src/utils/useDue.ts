import { computed, unref, type Ref } from "vue";
import dayjs from "dayjs/esm";

export function useDue(nextDate: Ref<string> | string) {
  return computed(() => {
    const next = dayjs(unref(nextDate)).valueOf();
    const today = dayjs().startOf("day").valueOf();
    return next - today <= 0;
  });
}
