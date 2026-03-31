function random(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function shuffle<T>(
  array: T[],
  seed: number = Math.random() * 100
): T[] {
  let currId: number = array.length;

  let t: T;
  let i: number;

  while (currId !== 0) {
    i = Math.floor(random(seed) * currId);
    currId -= 1;

    t = array[currId];
    array[currId] = array[i];
    array[i] = t;
    ++seed;
  }

  return array;
}
