import { map } from "nanostores";

const createFiltersState = (initialValues: Record<string, boolean>) => {
  const store = map<Record<string, boolean>>(initialValues);
  return {
    ...store,
    reset: () => {
      store.set(initialValues);
    },
  };
};

export const filtersState = createFiltersState({
  code: false,
  design: false,
  draw: false,
});
