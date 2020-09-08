# These types have been published to [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/dockerode)

If you have an issue with the types, you can raise an issue here or on `DefinitelyTyped`

You can install types from `DefinitelyTyped` using `npm` or `yarn`:

```
yarn add @types/dockerode --dev
npm install @types/dockerode --save-dev
```

# dockerode-ts-promise

[Dockerode](https://github.com/apocas/dockerode) wrapped in TypeScript

## Why?

The dockerode library is great and has quite a large API surface.  
I found myself frequently referring to the source code of `dockerode` since the documentation is not complete.  
This is an effort to statically type that API surface which is another form of documentation.

## Where are the types?

You can view them [here](https://github.com/Seikho/dockerode-ts-promise/blob/master/dockerode.d.ts)

## Requirements

* TypeScript (1.8+)
* NodeJS

## Installation

```
npm install dockerode-ts-promise
```

## Usage

```ts
import Dockerode from 'dockerode-ts-promise';

const docker = new Dockerode({
  /** options... */
});
```

## TODOs

* Most callbacks are typed as `any`. These should be typed correctly.

## License

MIT
