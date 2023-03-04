# ReturnType

```ts
/** Provides every element of the iterable `iter` into the `callback` function and stores the results in an array. */
function mapIter<
  Elem,
  Func extends (elem: Elem) => any,
  Ret extends ReturnType<Func>
>(iter: Iterable<Elem>, callback: Func): Ret[] {
  const mapped: Ret[] = [];

  for (const elem of iter) {
    mapped.push(callback(elem));
  }

  return mapped;
}

const setObject: Set<string> = new Set();
const mapObject: Map<number, string> = new Map();

mapIter(setObject, (value: string) => value.indexOf("Foo")); // number[]

mapIter(mapObject, ([key, value]: [number, string]) => {
  return key % 2 === 0 ? value : "Odd";
}); // string[]
```
