import { computed } from "vue";
import { useRoute } from "vue-router";

export function useCustomRouter() {
  const route = useRoute();
  const isCoursePage = computed(() => {
    return route.name === "course";
  });

  return { isCoursePage };
}
