
import "./CoinRow.css";

function CoinRow({ coin, formatCurrency }) {
  const change = Number(coin.price_change_percentage_24h);
  const changeIsNegative = change < 0;

  return (
    <tr>
      <td className="rank-cell">{coin.market_cap_rank ?? "—"}</td>

      <td>
        <div className="coin-name-cell">
          <img
            className="coin-image"
            src={coin.image}
            alt=""
            loading="lazy"
          />

          <div className="coin-details">
            <span className="coin-name">{coin.name}</span>
            <span className="coin-symbol">
              {coin.symbol.toUpperCase()}
            </span>
          </div>
        </div>
      </td>

      <td className="price-cell">
        {formatCurrency(coin.current_price)}
      </td>

      <td>
        <span
          className={`change-badge ${
            changeIsNegative ? "negative" : "positive"
          }`}
        >
          {Number.isFinite(change)
            ? `${change > 0 ? "+" : ""}${change.toFixed(2)}%`
            : "—"}
        </span>
      </td>

      <td>{formatCurrency(coin.market_cap)}</td>
      <td>{formatCurrency(coin.total_volume)}</td>
    </tr>
  );
}

export default CoinRow;
