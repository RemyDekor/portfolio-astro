import { type PreinitializedMapStore } from "nanostores";

import { parseURL, parseQuery, withQuery } from "ufo";

export function isKey<T extends object>(
  obj: T,
  key: PropertyKey
): key is keyof T {
  return key in obj;
}

type Options = {
  replaceHistory?: boolean;
};
export const bindStoreToSearchParam = (
  searchParamKey: string,
  store: PreinitializedMapStore<Record<string, boolean>> & {
    reset: () => void;
  },
  options?: Options
) => {
  const { replaceHistory = false } = options ?? {};

  const boundURL = parseURL(window.location.href);
  const initialValues = store.get();

  document.addEventListener("astro:page-load", () => {
    const currentURL = parseURL(window.location.href);
    if (boundURL.pathname !== currentURL.pathname) return;

    const currentFiltersParam = currentURL.search;

    const searchParamValue = parseQuery(currentFiltersParam)[searchParamKey];

    if (!searchParamValue) {
      store.set(initialValues);
    }

    if (Array.isArray(searchParamValue)) {
      store.set(
        searchParamValue.reduce((acc, curr) => {
          if (!isKey(initialValues, curr)) return acc;
          return { ...acc, [curr]: true };
        }, initialValues)
      );
    } else if (isKey(initialValues, searchParamValue)) {
      store.set({ ...initialValues, [searchParamValue]: true });
    }
  });

  // listen to store updates and update the URL too
  store.listen((values) => {
    const nextURL = withQuery(window.location.href, {
      [searchParamKey]: Object.entries(values)
        .filter(([_key, value]) => value)
        .map((entry) => entry[0]),
    });

    if (replaceHistory) {
      window.history.replaceState({ title: document.title }, "", nextURL);
    } else {
      window.history.pushState({ title: document.title }, "", nextURL);
    }
  });
};
