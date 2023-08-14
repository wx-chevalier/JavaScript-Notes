# Extract

```ts
declare function uniqueId(): number;

const ID = Symbol("ID");

interface Person {
  [ID]: number;
  name: string;
  age: number;
}

// Allows changing the person data as long as the property key is of string type.
function changePersonData<
  Obj extends Person,
  Key extends Extract<keyof Person, string>,
  Value extends Obj[Key]
>(obj: Obj, key: Key, value: Value): void {
  obj[key] = value;
}

// Tiny Andrew was born.
const andrew = {
  [ID]: uniqueId(),
  name: "Andrew",
  age: 0,
};

// Cool, we're fine with that.
changePersonData(andrew, "name", "Pony");

// Goverment didn't like the fact that you wanted to change your identity.
changePersonData(andrew, ID, uniqueId());
```
