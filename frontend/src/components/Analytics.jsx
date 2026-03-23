import { useMemo } from "react";
import { ethers } from "ethers";

export default function Analytics({ transactions, account }) {
  const stats = useMemo(() => {
    const sent = transactions.filter(
      (tx) => tx.sender.toLowerCase() === account.toLowerCase()
    );
    const received = transactions.filter(
      (tx) => tx.receiver.toLowerCase() === account.toLowerCase()
    );
    const totalSent = sent.reduce((acc, tx) => acc + parseFloat(tx.amount), 0);
    const totalReceived = received.reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

    const keywordMap = {};
    transactions.forEach((tx) => {
      const k = tx.keyword || "other";
      keywordMap[k] = (keywordMap[k] || 0) + 1;
    });
    const topKeyword = Object.entries(keywordMap).sort((a, b) => b[1] - a[1])[0];

    return {
      totalSent: totalSent.toFixed(4),
      totalReceived: totalReceived.toFixed(4),
      sentCount: sent.length,
      receivedCount: received.length,
      topKeyword: topKeyword ? topKeyword[0] : "—",
      keywordMap,
    };
  }, [transactions, account]);

  const maxCount = Math.max(...Object.values(stats.keywordMap), 1);

  return (
    <section className="card analytics-card">
      <div className="card-header">
        <h2>Analytics</h2>
        <span className="card-tag">On-chain data</span>
      </div>

      <div className="analytics-grid">
        <div className="analytics-stat">
          <span className="a-label">Total Sent</span>
          <span className="a-value red">-{stats.totalSent} ETH</span>
          <span className="a-sub">{stats.sentCount} transactions</span>
        </div>
        <div className="analytics-stat">
          <span className="a-label">Total Received</span>
          <span className="a-value green">+{stats.totalReceived} ETH</span>
          <span className="a-sub">{stats.receivedCount} transactions</span>
        </div>
        <div className="analytics-stat">
          <span className="a-label">Top Category</span>
          <span className="a-value accent">#{stats.topKeyword}</span>
          <span className="a-sub">Most used keyword</span>
        </div>
        <div className="analytics-stat">
          <span className="a-label">Net Flow</span>
          <span className={`a-value ${parseFloat(stats.totalReceived) - parseFloat(stats.totalSent) >= 0 ? "green" : "red"}`}>
            {(parseFloat(stats.totalReceived) - parseFloat(stats.totalSent)).toFixed(4)} ETH
          </span>
          <span className="a-sub">Received minus sent</span>
        </div>
      </div>

      {Object.keys(stats.keywordMap).length > 0 && (
        <div className="keyword-chart">
          <p className="chart-title">Transactions by keyword</p>
          {Object.entries(stats.keywordMap)
            .sort((a, b) => b[1] - a[1])
            .map(([keyword, count]) => (
              <div key={keyword} className="chart-row">
                <span className="chart-label">#{keyword}</span>
                <div className="chart-bar-wrap">
                  <div
                    className="chart-bar"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="chart-count">{count}</span>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}