# Pick

```ts
interface Article {
  title: string;
  thumbnail: string;
  content: string;
}

// Creates new type out of the `Article` interface composed
// from the Articles' two properties: `title` and `thumbnail`.
// `ArticlePreview = {title: string; thumbnail: string}`
type ArticlePreview = Pick<Article, "title" | "thumbnail">;

// Render a list of articles using only title and description.
function renderArticlePreviews(previews: ArticlePreview[]): HTMLElement {
  const articles = document.createElement("div");

  for (const preview of previews) {
    // Append preview to the articles.
  }

  return articles;
}

const articles = renderArticlePreviews([
  {
    title: "TypeScript tutorial!",
    thumbnail: "/assets/ts.jpg",
  },
]);
```
