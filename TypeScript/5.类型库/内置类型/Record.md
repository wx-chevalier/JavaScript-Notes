# Record

```ts
// Positions of employees in our company.
type MemberPosition = "intern" | "developer" | "tech-lead";

// Interface describing properties of a single employee.
interface Employee {
  firstName: string;
  lastName: string;
  yearsOfExperience: number;
}

// Create an object that has all possible `MemberPosition` values set as keys.
// Those keys will store a collection of Employees of the same position.
const team: Record<MemberPosition, Employee[]> = {
  intern: [],
  developer: [],
  "tech-lead": [],
};

// Our team has decided to help John with his dream of becoming Software Developer.
team.intern.push({
  firstName: "John",
  lastName: "Doe",
  yearsOfExperience: 0,
});

// `Record` forces you to initialize all of the property keys.
// TypeScript Error: "tech-lead" property is missing
const teamEmpty: Record<MemberPosition, null> = {
  intern: null,
  developer: null,
};
```
