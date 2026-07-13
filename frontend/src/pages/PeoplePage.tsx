import { useEffect, useState } from "react";
import { getPeople, createPerson, deletePerson, type Person } from "../api";

export function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadPeople() {
    try {
      setPeople(await getPeople());
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadPeople();
  }, []);

  async function handleSubmit() {
    setError(null);

    try {
      await createPerson({ name, age: Number(age) });
      setName("");
      setAge("");
      await loadPeople();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDelete(id: number) {
    setError(null);

    try {
      await deletePerson(id);
      await loadPeople();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section>
      <h1>Pessoas</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <input
          placeholder="Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="number"
          placeholder="Idade"
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul>
        {people.map((person) => (
          <li key={person.id}>
            {person.name} — {person.age} anos (id {person.id})
            <button onClick={() => handleDelete(person.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
