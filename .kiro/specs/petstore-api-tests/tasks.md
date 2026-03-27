# Implementation Plan: Petstore API Tests

## Overview

Implement a Playwright API test suite for the Petstore API Pet resource. This covers updating `playwright.config.ts`, installing `fast-check`, and creating `tests/pet.api.spec.ts` with example and property-based tests for all CRUD operations.

## Tasks

- [x] 1. Update playwright.config.ts for API-only testing
  - Set `baseURL: 'http://petstore.swagger.io/v2'` in the `use` block
  - Replace all browser projects with a single `api` project (no `use.browserName` or device)
  - Keep `testDir: './tests'`
  - _Requirements: 5.1, 5.2_

- [x] 2. Install fast-check
  - Run `npm install --save-dev fast-check` to add the PBT library
  - _Requirements: (enables property-based tests for 1–4)_

- [x] 3. Create tests/pet.api.spec.ts with data models and helper
  - Define inline TypeScript interfaces: `Category`, `Tag`, `Pet`, `ApiResponse`
  - Implement `buildPet(id: number, name?: string): Pet` factory function
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [x] 4. Implement POST /pet example and property tests
  - [x] 4.1 Write example test: POST with a valid pet body asserts status 200, numeric `id`, and matching `name`
    - Use `Date.now()` as Pet_ID for isolation
    - Include `Content-Type: application/json` header
    - _Requirements: 1.1, 1.2, 1.3, 5.3_
  - [ ]* 4.2 Write property test for Property 1: POST creates a pet with correct fields
    - **Property 1: POST creates a pet with correct fields**
    - **Validates: Requirements 1.1, 1.2, 1.3**
    - Use `fc.record({ name: fc.string({ minLength: 1 }), id: fc.integer({ min: 1e9, max: 2e9 }) })`, `numRuns: 100`
  - [x] 4.3 Write example test: POST with malformed body asserts 4xx status
    - Send a plain string body; assert `response.status() >= 400`
    - _Requirements: 1.4_
  - [ ]* 4.4 Write property test for Property 6: POST malformed body returns 4xx
    - **Property 6: POST malformed body returns 4xx**
    - **Validates: Requirements 1.4**
    - Use `fc.string()` as raw body; assert `status >= 400 && status < 500`

- [x] 5. Implement GET /pet/{petId} example and property tests
  - [x] 5.1 Write example test: GET existing pet asserts status 200, matching `id` and `name`
    - POST a pet first, then GET using the returned `id`
    - _Requirements: 2.1, 2.2, 2.3_
  - [ ]* 5.2 Write property test for Property 2: Create → Read round-trip
    - **Property 2: Create → Read round-trip**
    - **Validates: Requirements 2.1, 2.2, 2.3**
    - Generate `id` and `name` via fast-check; POST then GET; assert `id` and `name` match
  - [x] 5.3 Write example test: GET non-existent Pet_ID asserts 404
    - Use a Pet_ID in a range that is very unlikely to exist (e.g., `Number.MAX_SAFE_INTEGER`)
    - _Requirements: 2.4_
  - [ ]* 5.4 Write property test for Property 5: GET non-existent pet returns 404
    - **Property 5: GET non-existent pet returns 404**
    - **Validates: Requirements 2.4**
    - Use `fc.integer({ min: 1e15, max: 2e15 })` for IDs unlikely to exist; assert 404

- [x] 6. Checkpoint — Ensure all tests pass so far
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement PUT /pet example and property tests
  - [x] 7.1 Write example test: PUT with updated name asserts status 200, updated `name`, and matching `id`
    - POST a pet, then PUT with a new name; assert response fields
    - Include `Content-Type: application/json` header
    - _Requirements: 3.1, 3.2, 3.3, 5.3_
  - [ ]* 7.2 Write property test for Property 3: Update → Read round-trip
    - **Property 3: Update → Read round-trip**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
    - POST a pet, PUT with generated new name, GET and assert updated name and same `id`

- [x] 8. Implement DELETE /pet/{petId} example and property tests
  - [x] 8.1 Write example test: DELETE existing pet asserts status 200, then GET asserts 404
    - POST a pet, DELETE it, GET and assert 404
    - _Requirements: 4.1, 4.2_
  - [ ]* 8.2 Write property test for Property 4: Delete → Read returns 404
    - **Property 4: Delete → Read returns 404**
    - **Validates: Requirements 4.1, 4.2**
    - POST a generated pet, DELETE it, GET and assert 404

- [x] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `numRuns: 100` and include the comment `// Feature: petstore-api-tests, Property <N>: <text>`
- All POST/PUT requests must include `Content-Type: application/json`
- Pet_IDs use `Date.now()` or high-range integers to avoid collisions on the shared public sandbox
