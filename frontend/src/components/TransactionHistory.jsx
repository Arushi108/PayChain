import { useState } from "react";
import { jsPDF } from "jspdf";

export default function TransactionHistory({ transactions, account }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.message.toLowerCase().includes(search.toLowerCase()) ||
      tx.keyword.toLowerCase().includes(search.toLowerCase()) ||
      tx.sender.toLowerCase().includes(search.toLowerCase()) ||
      tx.receiver.toLowerCase().includes(search.toLowerCase());
    const isSent = tx.sender.toLowerCase() === account.toLowerCase();
    const matchesFilter =
      filter === "all" ||
      (filter === "sent" && isSent) ||
      (filter === "received" && !isSent);
    return matchesSearch && matchesFilter;
  });

  const downloadReceipt = (tx) => {
    const isSent = tx.sender.toLowerCase() === account.toLowerCase();
    const doc = new jsPDF();

    // Background
    doc.setFillColor(10, 10, 15);
    doc.rect(0, 0, 210, 297, "F");

    // Header bar
    doc.setFillColor(0, 212, 255);
    doc.rect(0, 0, 210, 2, "F");

    // Title
    doc.setTextColor(0, 212, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("PayChain", 20, 30);

    doc.setTextColor(150, 150, 170);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Blockchain Payment Receipt", 20, 40);

    // Divider
    doc.setDrawColor(40, 40, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 48, 190, 48);

    // Status badge
    doc.setFillColor(0, 230, 118);
    doc.roundedRect(20, 55, 40, 10, 2, 2, "F");
    doc.setTextColor(5, 40, 20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("CONFIRMED", 26, 62);

    // Type badge
    doc.setFillColor(isSent ? 80 : 0, isSent ? 20 : 100, isSent ? 20 : 60);
    doc.roundedRect(66, 55, 30, 10, 2, 2, "F");
    doc.setTextColor(isSent ? 255 : 0, isSent ? 80 : 230, isSent ? 80 : 118);
    doc.text(isSent ? "SENT" : "RECEIVED", 72, 62);

    // Amount (big)
    doc.setTextColor(240, 240, 245);
    doc.setFontSize(38);
    doc.setFont("helvetica", "bold");
    doc.text(`${isSent ? "-" : "+"}${tx.amount} ETH`, 20, 90);

    // Details section
    const fields = [
      ["Transaction Type", isSent ? "Outgoing Payment" : "Incoming Payment"],
      ["From", tx.sender],
      ["To", tx.receiver],
      ["Amount", `${tx.amount} ETH`],
      ["Message", tx.message],
      ["Category", `#${tx.keyword}`],
      ["Timestamp", tx.timestamp],
      ["Network", "Hardhat Local (Chain ID: 31337)"],
      ["Smart Contract", "0x5FbDB2315678afecb367f032d93F642f64180aa3"],
    ];

    let y = 110;
    fields.forEach(([label, value]) => {
      // Row background
      doc.setFillColor(20, 20, 30);
      doc.roundedRect(20, y - 5, 170, 14, 2, 2, "F");

      doc.setTextColor(100, 100, 130);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(label.toUpperCase(), 25, y + 2);

      doc.setTextColor(220, 220, 235);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const val = value.length > 45 ? value.slice(0, 42) + "..." : value;
      doc.text(val, 95, y + 2);

      y += 18;
    });

    // Footer
    doc.setDrawColor(40, 40, 55);
    doc.line(20, 265, 190, 265);
    doc.setTextColor(80, 80, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("This receipt is generated from an immutable blockchain transaction.", 20, 273);
    doc.text("PayChain • Powered by Ethereum • Tamper-proof & Trustless", 20, 280);

    // Footer accent line
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 295, 210, 2, "F");

    doc.save(`paychain-receipt-${tx.timestamp.replace(/[/,: ]/g, "-")}.pdf`);
  };

  if (transactions.length === 0) {
    return (
      <section className="card history-card">
        <div className="card-header">
          <h2>Transaction History</h2>
          <span className="card-tag">0 records</span>
        </div>
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No transactions yet. Send your first payment!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card history-card">
      <div className="card-header">
        <h2>Transaction History</h2>
        <span className="card-tag">{filtered.length} of {transactions.length} records</span>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search by address, keyword, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <div className="filter-tabs">
          {["all", "sent", "received"].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔎</span>
          <p>No transactions match your search.</p>
        </div>
      ) : (
        <div className="tx-list">
          {filtered.map((tx, i) => {
            const isSent = tx.sender.toLowerCase() === account.toLowerCase();
            return (
              <div key={i} className={`tx-item ${isSent ? "tx-sent" : "tx-received"}`}>
                <div className="tx-icon">{isSent ? "↑" : "↓"}</div>
                <div className="tx-details">
                  <div className="tx-top">
                    <span className="tx-type">{isSent ? "Sent" : "Received"}</span>
                    <span className="tx-amount">{isSent ? "-" : "+"}{tx.amount} ETH</span>
                  </div>
                  <div className="tx-addr">
                    {isSent
                      ? `To: ${tx.receiver.slice(0, 8)}...${tx.receiver.slice(-4)}`
                      : `From: ${tx.sender.slice(0, 8)}...${tx.sender.slice(-4)}`}
                  </div>
                  <div className="tx-meta">
                    <span className="tx-msg">"{tx.message}"</span>
                    <span className="tx-keyword">#{tx.keyword}</span>
                  </div>
                  <div className="tx-time">{tx.timestamp}</div>
                </div>
                <button
                  className="receipt-btn"
                  onClick={() => downloadReceipt(tx)}
                  title="Download PDF Receipt"
                >
                  ↓ Receipt
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}