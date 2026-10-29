
import { useEffect, useState } from "react";
import CoinRow from "./CoinRow";
import "./App.css";

const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCoins() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 429
              ? "API rate limit reached. Please try again shortly."
              : `Failed to fetch data (HTTP ${response.status}).`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response.");
        }

        setCoins(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load cryptocurrency data.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCoins();

    return () => controller.abort();
  }, []);

  const formatCurrency = (value) => {
    if (value == null || !Number.isFinite(Number(value))) {
      return "—";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: Number(value) < 1 ? 6 : 2,
    }).format(value);
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MARKET OVERVIEW</p>
          <h1>Crypto Market</h1>
          <p className="subtitle">
            Track the top 10 cryptocurrencies by market capitalization.
          </p>
        </div>

        <div className="live-label">
          <span className="live-dot" />
          Market data
        </div>
      </header>

      <section className="market-summary">
        <div>
          <span className="summary-label">Assets displayed</span>
          <strong>{coins.length}</strong>
        </div>

        <div>
          <span className="summary-label">Currency</span>
          <strong>USD ($)</strong>
        </div>

        <div>
          <span className="summary-label">Sorted by</span>
          <strong>Market cap</strong>
        </div>
      </section>

      <section className="table-card" aria-label="Cryptocurrency prices">
        <div className="table-heading">
          <h2>Top cryptocurrencies</h2>
          <span className="asset-count">{coins.length} assets</span>
        </div>

        {loading && (
          <div className="status-message" role="status">
            <span className="spinner" />
            Loading cryptocurrency data...
          </div>
        )}

        {!loading && error && (
          <div className="error-panel" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && coins.length === 0 && (
          <p className="status-message">
            No cryptocurrency data is available.
          </p>
        )}

        {!loading && !error && coins.length > 0 && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">24h Change</th>
                  <th scope="col">Market Cap</th>
                  <th scope="col">24h Volume</th>
                </tr>
              </thead>

              <tbody>
                {coins.map((coin) => (
                  <CoinRow
                    key={coin.id}
                    coin={coin}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="dashboard-footer">
        Market information provided by CoinGecko. Prices may change.
      </footer>
    </main>
  );
}

export default App;
