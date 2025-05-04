import { signal } from "@cyftech/signal";
import { HabitEditorPage } from "../../../@components";
import { HabitUI } from "../../../@common/types";
import { getHabitFromUrl } from "../../../@common/transforms";

const editableHabit = signal<HabitUI | undefined>(undefined);

const onPageMount = () => {
  const fetchedHabit = getHabitFromUrl();
  if (!fetchedHabit) {
    throw "Invalid habit ID in query params. No habit fetched.";
  }

  editableHabit.value = fetchedHabit;
};

export default HabitEditorPage({
  editableHabit: editableHabit,
  onMount: onPageMount,
});
