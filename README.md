# Petstore API Tests — Spec Driven Development with Kiro + Playwright

This package is a sample project demonstrating how to use **Spec Driven Development (SDD)** with [Kiro](https://kiro.dev) to build API tests using [Playwright](https://playwright.dev). It targets the public [Swagger Petstore API](http://petstore.swagger.io/v2/swagger.json) and covers full CRUD operations on the `Pet` resource.

The goal is to show how powerful SDD is when applied to testing — even with existing automation frameworks like Playwright. Rather than jumping straight into code, the spec-first approach ensures requirements are clear, the design is intentional, and the implementation is traceable back to business needs.

---

## What is Spec Driven Development?

SDD is a methodology where you formalize your intent before writing a single line of code. With Kiro, this means iterating through three documents:

1. **Requirements** — what the system must do, expressed as user stories and acceptance criteria
2. **Design** — how it will be built, including architecture, data models, and correctness properties
3. **Tasks** — a concrete, ordered implementation plan derived from the design

Once the spec is approved, Kiro executes the tasks autonomously, producing working, tested code that is fully traceable to the original requirements.

---

## Package Structure

```
.
├── tests/
│   └── pet.api.spec.ts        # Playwright API tests for all CRUD operations
├── .kiro/
│   └── specs/
│       └── petstore-api-tests/
│           ├── requirements.md  # Functional requirements and acceptance criteria
│           ├── design.md        # Architecture, data models, and correctness properties
│           └── tasks.md         # Implementation task list generated from the design
├── playwright.config.ts         # Playwright config (API-only, baseURL set to Petstore)
├── package.json
└── README.md
```

### Key files

- `tests/pet.api.spec.ts` — the main test file. Contains example tests for POST, GET, PUT, and DELETE on the `/pet` endpoint, using Playwright's `APIRequestContext`.
- `.kiro/specs/petstore-api-tests/requirements.md` — the requirements document produced during the SDD process, covering 5 requirements with full acceptance criteria.
- `.kiro/specs/petstore-api-tests/design.md` — the technical design, including 6 correctness properties and a property-based testing strategy using [fast-check](https://github.com/dubzzz/fast-check).
- `.kiro/specs/petstore-api-tests/tasks.md` — the task breakdown that Kiro used to implement the test suite step by step.

---

## Running the Tests

```bash
npm install
npx playwright test
```

To view the HTML report after a run:

```bash
npx playwright show-report
```

---

## Why SDD for Testing?

Testing is often treated as an afterthought — written after the fact, loosely tied to requirements, and hard to maintain. SDD flips that. By speccing out what correct behavior looks like *before* writing tests, you get:

- Tests that are directly traceable to requirements
- A design that explicitly defines correctness properties
- An implementation plan that is incremental and reviewable
- Full confidence that the test suite covers what it's supposed to cover

This project is a demo of that workflow in action, using Kiro's spec tooling with Playwright as the automation framework — no custom tooling required.
