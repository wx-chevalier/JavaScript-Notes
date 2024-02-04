# ID 类型

```ts
type UserId = `user_${string}`;
type GroupId = `group_${string}`;

function updateUser(id: UserId): void {
  //
}

// Imagine somewhere in the code you have an id variable that is a GroupId
declare const id: GroupId;

updateUser(id); // Error: Argument of type '`group_${string}`' is not assignable to parameter of type '`user_${string}`'
```
