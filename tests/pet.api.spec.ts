import { test, expect } from '@playwright/test';

// --- Data Models ---

interface Category {
  id?: number;
  name?: string;
}

interface Tag {
  id?: number;
  name?: string;
}

interface Pet {
  id?: number;
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  status?: 'available' | 'pending' | 'sold';
}

// --- Helper ---

function buildPet(id: number, name?: string): Pet {
  return {
    id,
    name: name ?? `TestPet-${id}`,
    status: 'available',
    photoUrls: ['https://example.com/photo.jpg'],
  };
}

// --- Tests ---

test.describe('POST /pet', () => {
  test('POST with valid pet body asserts status 200, numeric id, and matching name', async ({ request }) => {
    // Requirements: 1.1, 1.2, 1.3, 5.3
    const id = Date.now();
    const pet = buildPet(id);

    const response = await request.post('pet', {
      data: pet,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.id).toBe('number');
    expect(body.name).toBe(pet.name);
  });

  test('POST with malformed body asserts 4xx status', async ({ request }) => {
    // Requirements: 1.4
    const response = await request.post('pet', {
      data: 'this is not valid json',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('GET /pet/{petId}', () => {
  test('GET existing pet asserts status 200, matching id and name', async ({ request }) => {
    // Requirements: 2.1, 2.2, 2.3
    const id = Date.now();
    const pet = buildPet(id);

    const postResponse = await request.post('pet', {
      data: pet,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(postResponse.status()).toBe(200);
    const created = await postResponse.json();

    const getResponse = await request.get(`pet/${created.id}`);
    expect(getResponse.status()).toBe(200);
    const body = await getResponse.json();
    expect(body.id).toBe(created.id);
    expect(body.name).toBe(pet.name);
  });

  test('GET non-existent Pet_ID asserts 404', async ({ request }) => {
    // Requirements: 2.4
    const getResponse = await request.get(`pet/${Number.MAX_SAFE_INTEGER}`);
    expect(getResponse.status()).toBe(404);
  });
});

test.describe('PUT /pet', () => {
  test('PUT with updated name asserts status 200, updated name, and matching id', async ({ request }) => {
    // Requirements: 3.1, 3.2, 3.3, 5.3
    const id = Date.now();
    const pet = buildPet(id);

    const postResponse = await request.post('pet', {
      data: pet,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(postResponse.status()).toBe(200);
    const created = await postResponse.json();

    const updatedPet = buildPet(created.id, `UpdatedPet-${created.id}`);
    const putResponse = await request.put('pet', {
      data: updatedPet,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(putResponse.status()).toBe(200);
    const body = await putResponse.json();
    expect(body.name).toBe(`UpdatedPet-${created.id}`);
    expect(body.id).toBe(created.id);
  });
});

test.describe('DELETE /pet/{petId}', () => {
  test('DELETE existing pet asserts status 200, then GET asserts 404', async ({ request }) => {
    // Requirements: 4.1, 4.2
    const id = Date.now();
    const pet = buildPet(id);

    const postResponse = await request.post('pet', {
      data: pet,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(postResponse.status()).toBe(200);
    const created = await postResponse.json();

    const deleteResponse = await request.delete(`pet/${created.id}`);
    expect(deleteResponse.status()).toBe(200);

    const getResponse = await request.get(`pet/${created.id}`);
    expect(getResponse.status()).toBe(404);
  });
});
