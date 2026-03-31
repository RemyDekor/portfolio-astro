export const onInterval = (
  callback: () => void,
  {
    duration, // milliseconds
    delay, // milliseconds
    immediate = false,
    executeWhenNoFocus = false,
  }: {
    duration: number | (() => number); // not sure why this would be a function
    delay?: number | (() => number); // not sure why this would be a function
    immediate?: boolean;
    executeWhenNoFocus?: boolean;
  }
): (() => void) => {
  const _duration = typeof duration === "function" ? duration() : duration;
  const _delay = typeof delay === "function" ? delay() : delay;

  let interval: ReturnType<typeof setInterval> | undefined = undefined;

  const timeout = setTimeout(() => {
    interval = setInterval(() => {
      if (document.hasFocus() || executeWhenNoFocus) {
        callback();
      }
    }, _duration);
  }, _delay ?? 0);

  if (immediate) callback();

  return () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };
};
