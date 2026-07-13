import { useState } from "react";
import { PeoplePage } from "./pages/PeoplePage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { TotalsPage } from "./pages/TotalsPage";

type Page = "people" | "transactions" | "totals";

function App() {
  const [page, setPage] = useState<Page>("people");

  return (
    <div className="app">
      <nav>
        <button
          type="button"
          className={page === "people" ? "active" : ""}
          onClick={() => setPage("people")}
        >
          Pessoas
        </button>
        <button
          type="button"
          className={page === "transactions" ? "active" : ""}
          onClick={() => setPage("transactions")}
        >
          Transações
        </button>
        <button
          type="button"
          className={page === "totals" ? "active" : ""}
          onClick={() => setPage("totals")}
        >
          Totais
        </button>
      </nav>

      {page === "people" && <PeoplePage />}
      {page === "transactions" && <TransactionsPage />}
      {page === "totals" && <TotalsPage />}
    </div>
  );
}

export default App;
