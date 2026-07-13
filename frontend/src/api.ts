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

export type TransactionType = "Expense" | "Income";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  personId: number;
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  type: TransactionType;
  personId: number;
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

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${BASE_URL}/transactions`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function createTransaction(
  data: CreateTransactionRequest,
): Promise<Transaction> {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export interface PersonTotals {
  personId: number;
  name: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface OverallTotals {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface TotalsResponse {
  people: PersonTotals[];
  overall: OverallTotals;
}

export async function getTotals(): Promise<TotalsResponse> {
  const response = await fetch(`${BASE_URL}/totals`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
