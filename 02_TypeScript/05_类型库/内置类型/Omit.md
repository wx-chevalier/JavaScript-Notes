# Omit

```ts
interface Animal {
  imageUrl: string;
  species: string;
  images: string[];
  paragraphs: string[];
}

// Creates new type with all properties of the `Animal` interface
// except 'images' and 'paragraphs' properties. We can use this
// type to render small hover tooltip for a wiki entry list.
type AnimalShortInfo = Omit<Animal, "images" | "paragraphs">;

function renderAnimalHoverInfo(animals: AnimalShortInfo[]): HTMLElement {
  const container = document.createElement("div");
  // Internal implementation.
  return container;
}
```
