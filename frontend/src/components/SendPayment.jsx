import { useState } from "react";
import { ethers } from "ethers";
import TxStatus from "./TxStatus";

export default function SendPayment({ contract, account, loading, setLoading, onSuccess }) {
  const [form, setForm] = useState(() => {
    const prefill = window._prefill || {};
    return {
      receiver: prefill.receiver || "",
      amount: prefill.amount || "",
      message: prefill.message || "",
      keyword: prefill.keyword || "",
    };
  });
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [txStatus, setTxStatus] = useState("idle");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { receiver, amount, message, keyword } = form;
    if (!receiver || !amount || !message || !keyword) {
      setError("All fields are required.");
      return;
    }
    if (!ethers.utils.isAddress(receiver)) {
      setError("Invalid Ethereum address.");
      return;
    }
    try {
      setLoading(true);
      setTxHash(null);
      setError(null);
      setTxStatus("signing");

      const tx = await contract.sendPayment(
        receiver,
        message,
        keyword,
        { value: ethers.utils.parseEther(amount) }
      );

      setTxStatus("broadcasting");
      setTxHash(tx.hash);

      // Don't wait for mining — mark confirmed immediately after broadcast
      setTimeout(() => {
        setTxStatus("confirmed");
        setForm({ receiver: "", amount: "", message: "", keyword: "" });
        setLoading(false);
        onSuccess();
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.reason || err.message || "Transaction failed.");
      setTxStatus("idle");
      setLoading(false);
    }
  };

  return (
    <section className="card send-card">
      <div className="card-header">
        <h2>Send Payment</h2>
        <span className="card-tag">On-Chain</span>
      </div>
      <div className="send-layout">
        <form onSubmit={handleSubmit} className="send-form">
          <div className="form-group">
            <label>Receiver Address</label>
            <input
              name="receiver"
              value={form.receiver}
              onChange={handleChange}
              placeholder="0x..."
              className="input"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (ETH)</label>
              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.01"
                type="number"
                step="0.0001"
                min="0"
                className="input"
              />
            </div>
            <div className="form-group">
              <label>Keyword / Tag</label>
              <input
                name="keyword"
                value={form.keyword}
                onChange={handleChange}
                placeholder="e.g. Food, Rent"
                className="input"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Message</label>
            <input
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Payment for..."
              className="input"
            />
          </div>
          {error && <div className="error-msg">⚠ {error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? "Processing..." : "Send Payment →"}
          </button>
        </form>
        <TxStatus status={txStatus} txHash={txHash} />
      </div>
    </section>
  );
}