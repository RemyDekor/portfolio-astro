import { atom } from "nanostores";

export const createToggleStore = <T>(initialValue: T, otherValue: T) => {
  const { subscribe, set, get } = atom(initialValue);
  const toggle = () => set(get() === initialValue ? otherValue : initialValue);
  return { subscribe, toggle };
};
