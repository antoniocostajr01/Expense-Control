const BASE_URL = "http://localhost:5269";

export interface Person {
  id: number;
  name: string;
  age: number;
}

export interface CreatePersonRequest {
  name: string;
  age: number;
}

async function parseError(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);

  if (body?.message) {
    return body.message;
  }

  if (body?.errors) {
    return Object.values(body.errors as Record<string, string[]>)
      .flat()
      .join(" ");
  }

  return `Erro inesperado (HTTP ${response.status})`;
}

export async function getPeople(): Promise<Person[]> {
  const response = await fetch(`${BASE_URL}/people`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function createPerson(data: CreatePersonRequest): Promise<Person> {
  const response = await fetch(`${BASE_URL}/people`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function deletePerson(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/people/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
}
