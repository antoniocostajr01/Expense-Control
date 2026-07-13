import { useEffect, useState } from "react";
import { getTotals, type TotalsResponse } from "../api";

export function TotalsPage() {
  const [totals, setTotals] = useState<TotalsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTotals()
      .then(setTotals)
      .catch((err) => setError((err as Error).message));
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!totals) {
    return <p>Carregando...</p>;
  }

  return (
    <section>
      <h1>Totais</h1>

      <table>
        <thead>
          <tr>
            <th>Pessoa</th>
            <th>Receitas</th>
            <th>Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {totals.people.map((person) => (
            <tr key={person.personId}>
              <td>{person.name}</td>
              <td>R$ {person.totalIncome.toFixed(2)}</td>
              <td>R$ {person.totalExpense.toFixed(2)}</td>
              <td>R$ {person.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Geral</td>
            <td>R$ {totals.overall.totalIncome.toFixed(2)}</td>
            <td>R$ {totals.overall.totalExpense.toFixed(2)}</td>
            <td>R$ {totals.overall.balance.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
