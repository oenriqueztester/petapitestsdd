# Requirements Document

## Introduction

This feature covers automated API tests for the Swagger Petstore API (http://petstore.swagger.io/v2) using Playwright's `APIRequestContext`. The tests validate full CRUD operations on the `Pet` resource, ensuring the API behaves correctly for create, read, update, and delete scenarios, including error conditions.

## Glossary

- **Test_Suite**: The Playwright test suite targeting the Petstore API.
- **APIRequestContext**: Playwright's built-in HTTP client used to send API requests within tests.
- **Pet**: A resource in the Petstore API representing an animal with fields: `id`, `name`, `status`, `photoUrls`, and optionally `category` and `tags`.
- **Petstore_API**: The remote REST API hosted at `http://petstore.swagger.io/v2`.
- **Pet_ID**: A unique numeric identifier assigned to a Pet resource.
- **Valid_Pet_Body**: A JSON object conforming to the Petstore Pet schema, containing at minimum `name` and `photoUrls`.
- **Updated_Pet_Body**: A Valid_Pet_Body that includes an existing Pet_ID and modified field values.

---

## Requirements

### Requirement 1: Create Pet (POST /pet)

**User Story:** As a test engineer, I want to send a POST request with a valid pet payload, so that I can verify the API creates the pet and returns the correct response.

#### Acceptance Criteria

1. WHEN a POST request is sent to `/pet` with a Valid_Pet_Body, THE Test_Suite SHALL assert that the response status code is 200.
2. WHEN a POST request is sent to `/pet` with a Valid_Pet_Body, THE Test_Suite SHALL assert that the response body contains a `id` field with a numeric value.
3. WHEN a POST request is sent to `/pet` with a Valid_Pet_Body, THE Test_Suite SHALL assert that the response body `name` field matches the value sent in the request.
4. IF a POST request is sent to `/pet` with a malformed JSON body, THEN THE Test_Suite SHALL assert that the Petstore_API returns a 4xx status code.

---

### Requirement 2: Read Pet (GET /pet/{petId})

**User Story:** As a test engineer, I want to send a GET request for an existing pet, so that I can verify the API returns the correct pet details.

#### Acceptance Criteria

1. WHEN a GET request is sent to `/pet/{petId}` for a Pet_ID that exists, THE Test_Suite SHALL assert that the response status code is 200.
2. WHEN a GET request is sent to `/pet/{petId}` for a Pet_ID that exists, THE Test_Suite SHALL assert that the response body `id` field matches the requested Pet_ID.
3. WHEN a GET request is sent to `/pet/{petId}` for a Pet_ID that exists, THE Test_Suite SHALL assert that the response body `name` field matches the name used during creation.
4. IF a GET request is sent to `/pet/{petId}` for a Pet_ID that does not exist, THEN THE Test_Suite SHALL assert that the Petstore_API returns status code 404.

---

### Requirement 3: Update Pet (PUT /pet)

**User Story:** As a test engineer, I want to send a PUT request with updated pet data, so that I can verify the API modifies the pet and returns the updated object.

#### Acceptance Criteria

1. WHEN a PUT request is sent to `/pet` with an Updated_Pet_Body, THE Test_Suite SHALL assert that the response status code is 200.
2. WHEN a PUT request is sent to `/pet` with an Updated_Pet_Body, THE Test_Suite SHALL assert that the response body `name` field reflects the updated value.
3. WHEN a PUT request is sent to `/pet` with an Updated_Pet_Body, THE Test_Suite SHALL assert that the response body `id` field matches the Pet_ID included in the Updated_Pet_Body.
4. WHEN a GET request is sent to `/pet/{petId}` after a successful PUT, THE Test_Suite SHALL assert that the returned pet data matches the Updated_Pet_Body (round-trip consistency).

---

### Requirement 4: Delete Pet (DELETE /pet/{petId})

**User Story:** As a test engineer, I want to send a DELETE request for an existing pet, so that I can verify the API removes the pet and subsequent reads return 404.

#### Acceptance Criteria

1. WHEN a DELETE request is sent to `/pet/{petId}` for a Pet_ID that exists, THE Test_Suite SHALL assert that the response status code is 200.
2. WHEN a GET request is sent to `/pet/{petId}` after a successful DELETE for that Pet_ID, THE Test_Suite SHALL assert that the Petstore_API returns status code 404.

---

### Requirement 5: Test Configuration

**User Story:** As a test engineer, I want the Playwright configuration to target the Petstore API base URL, so that tests use a consistent and maintainable base address.

#### Acceptance Criteria

1. THE Test_Suite SHALL configure `baseURL` in `playwright.config.ts` to `http://petstore.swagger.io/v2`.
2. THE Test_Suite SHALL use Playwright's `APIRequestContext` (via the `request` fixture) for all HTTP interactions, without using a browser context.
3. THE Test_Suite SHALL set the `Content-Type` header to `application/json` on all POST and PUT requests.
