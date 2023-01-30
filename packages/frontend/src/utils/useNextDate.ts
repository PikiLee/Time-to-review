import { reactify } from "@vueuse/core";
import { useSetting } from "./../database/setting";
import {
  type ProgressStage,
  ProgressStageObject,
} from "./../types/progress.type";
import dayjs from "dayjs/esm";

export function getNextDate(lastTime: string | number, stage: ProgressStage) {
  const setting = useSetting();
  const lastDate = dayjs(lastTime);
  const nextDate =
    stage === ProgressStageObject["Reviewed Fourth Times"]
      ? "Done"
      : lastDate
          .add(setting.value.progressStageInterval[stage], "day")
          .format("YYYY-MM-DD");

  return nextDate;
}

export const useNextDate = reactify(getNextDate);
