# Introduction

Branded types in TypeScript enable the creation of new types by affixing a type tag to an existing underlying type. This tag, commonly referred to as the "brand", distinguishes values of the branded type from others sharing the same underlying type. Acting as a compile-time validator, the brand ensures that values are utilized correctly within their intended contexts.

# Issue

Imagine a scenario where a function generates a hash from a string input. Without the use of branded types, the function signature lacks specificity regarding the nature of the returned string, potentially leading to confusion or misuse in the codebase.

```
const generateHash = (input: string): string => {
  return "hashed_" + input; // For demonstration, appending "hashed_" to input
};

// Ideally, we only want to pass hashes to this function
const compareHash = (hash: string, input: string): boolean => {
  return true;
};

// Example usage
const userInput = "secretData";
const hash = generateHash(userInput);

// Without branded types, there's no indication that the returned string is a hash.
// Developers may erroneously treat it as a regular string because there's no immediate context attached to it, leading to misuse, e.g.
console.log(hash.toUpperCase());

// Notice the parameters are in incorrect order
const matches = compareHash(userInput, hash);
```

# Solution

It's fairly easy to enhance the clarity and safety of the code above by introducing a Branded type. This Branded type ensures that the returned string from the `generateHash` function is explicitly marked as a hash, preventing potential misuse or confusion in the codebase.

```
// By declaring a unique symbol, we create a distinct marker in TypeScript.
declare const __brand: unique symbol;

// Define a Branded type that combines a base type with a brand
type Branded<Type, Brand> = Type & {
  readonly [__brand]: Brand;
};
```

The `__brand` is enclosed in square brackets to denote that it is a computed property with a key that is dynamically determined at compile time. This property is defined using a unique symbol, `__brand`, ensuring that it is unique across the codebase. Unique symbols are opaque and don't have a runtime value; they're simply used as identifiers to prevent accidental collisions.With the `Branded` type defined, the `generateHash` function can be modified to return a value of type `Branded<string, 'Hash'>`. In practice, the returned string will be both a string and carry the specific brand `'Hash'`, making its intended purpose clear.

```
type Hash = Branded<string, "Hash">;

const generateHash = (input: string): Hash => {
  return ("hashed_" + input) as Hash;
};

const compareHash = (hash: Hash, input: string): boolean => {
  return true;
};

const userInput = "secretData";
const hash = generateHash(userInput); // hash is of type Hash

// This won't compile!
// Argument of type 'string' is not assignable to parameter of type 'Hash'.
//Type 'string' is not assignable to type '{ readonly [__brand]: "Hash"; }'.(2345)
const _matches = compareHash(userInput, hash);

// This, however, compiles!
const matches = compareHash(hash, userInput);
```

By changing the type of the `hash` parameter in `compareHash`, it's possible to eliminate cases where the order of arguments is incorrect. **A runtime bug is now a compile time bug.**
