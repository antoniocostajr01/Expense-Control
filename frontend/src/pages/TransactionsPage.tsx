import { useEffect, useState } from "react";
import {
  getTransactions,
  getPeople,
  createTransaction,
  type Transaction,
  type Person,
  type TransactionType,
} from "../api";

const TYPE_LABELS: Record<TransactionType, string> = {
  Expense: "Despesa",
  Income: "Receita",
};

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("Expense");
  const [personId, setPersonId] = useState("");

  async function loadData() {
    try {
      const [transactionsData, peopleData] = await Promise.all([
        getTransactions(),
        getPeople(),
      ]);
      setTransactions(transactionsData);
      setPeople(peopleData);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function personName(id: number): string {
    return people.find((person) => person.id === id)?.name ?? `#${id}`;
  }

  async function handleCreate() {
    setError(null);

    try {
      await createTransaction({
        description,
        amount: Number(amount),
        type,
        personId: Number(personId),
      });
      setDescription("");
      setAmount("");
      setType("Expense");
      setPersonId("");
      await loadData();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section>
      <h1>Transações</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleCreate();
        }}
      >
        <input
          placeholder="Descrição"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as TransactionType)}
        >
          <option value="Expense">Despesa</option>
          <option value="Income">Receita</option>
        </select>
        <select
          className={personId === "" ? "placeholder" : ""}
          value={personId}
          onChange={(event) => setPersonId(event.target.value)}
        >
          <option value="">Selecione a pessoa</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        <button type="submit">Adicionar</button>
      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Pessoa</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>{TYPE_LABELS[transaction.type]}</td>
              <td className={transaction.type === "Income" ? "income" : "expense"}>
                {transaction.type === "Income" ? "+" : "-"} R${" "}
                {transaction.amount.toFixed(2)}
              </td>
              <td>{personName(transaction.personId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
