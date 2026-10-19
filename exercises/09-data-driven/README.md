# 09 · Data-driven testing and the Builder pattern

**Slides:** 60 (Builder), 63–66 · **Time:** ~20 min · **Level:** ⭐⭐ bonus

## Goal
Separate **test logic** from **test data**: one test, many cases from a JSON file. Generate registration data with the Builder pattern instead of copying objects.

## Task
**Part A – login (UI)**
1. Extend `logins.json` with these cases: valid login, wrong password, empty email, locked account, unknown user and an **upper-case email** (`USER@SHOP.TEST`). For each, enter the expected message, or `null` for success.
2. In `login.spec.ts`, generate the tests with a `for...of` loop (like on slide 66). Each test name must say what it checks.

**Part B – registration (API) with a Builder**
3. Create a `UserBuilder` class with `withEmail()`, `withPassword()`, `withName()` and `build()` methods, which by default generates valid data with `@faker-js/faker`.
4. Write parameterized tests for invalid data: 4 invalid emails, a 7-character password, an empty name. Check status `400` and the `field` property in the response.

## Done when
- adding a new case needs **one line** in the data and no code change,
- the report shows every case as a separate test with a readable name.

<details><summary>Hints</summary>

- Importing JSON: `import cases from './logins.json';` (`resolveJsonModule` is enabled).
- Faker: `faker.internet.email()`, `faker.person.fullName()`, `faker.internet.password({ length: 12 })`.
- Should an upper-case email work? That is a question for the business. The test records the app's current behaviour.
</details>
