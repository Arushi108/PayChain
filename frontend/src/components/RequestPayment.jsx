import { useState } from "react";

export default function RequestPayment({ account }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [keyword, setKeyword] = useState("");
  const [generated, setGenerated] = useState(false);

  const link = `${window.location.origin}?to=${account}&amount=${amount}&message=${encodeURIComponent(message)}&keyword=${encodeURIComponent(keyword)}`;

  const generateLink = () => {
    if (!amount || !message) return;
    setGenerated(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({ title: "PayChain Payment Request", url: link });
    } else {
      copyLink();
    }
  };

  const reset = () => {
    setGenerated(false);
    setAmount("");
    setMessage("");
    setKeyword("");
  };

  return (
    <section className="card request-card">
      <div className="card-header">
        <h2>Request Payment</h2>
        <span className="card-tag">Shareable Link</span>
      </div>

      {!generated ? (
        <div className="request-form">
          <div className="form-row">
            <div className="form-group">
              <label>Amount (ETH)</label>
              <input
                className="input"
                type="number"
                placeholder="0.05"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Keyword / Tag</label>
              <input
                className="input"
                placeholder="e.g. Rent, Food"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Message</label>
            <input
              className="input"
              placeholder="Payment for..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {(!amount || !message) && (
            <p className="req-hint">Fill amount and message to generate link</p>
          )}
          <button
            className="btn-primary"
            onClick={generateLink}
            disabled={!amount || !message}
          >
            Generate Payment Link →
          </button>
        </div>
      ) : (
        <div className="generated-link">
          <div className="link-success-icon">🔗</div>
          <p className="link-label">Your payment request link is ready</p>

          <div className="link-details">
            <div className="link-detail-row">
              <span className="link-detail-label">Requesting</span>
              <span className="link-detail-value accent">{amount} ETH</span>
            </div>
            <div className="link-detail-row">
              <span className="link-detail-label">For</span>
              <span className="link-detail-value">"{message}"</span>
            </div>
            {keyword && (
              <div className="link-detail-row">
                <span className="link-detail-label">Category</span>
                <span className="link-detail-value accent">#{keyword}</span>
              </div>
            )}
            <div className="link-detail-row">
              <span className="link-detail-label">To address</span>
              <span className="link-detail-value mono">{account.slice(0,10)}...{account.slice(-6)}</span>
            </div>
          </div>

          <div className="link-box">
            <span className="link-text">{link.slice(0, 60)}...</span>
          </div>

          <div className="link-actions">
            <button className="btn-secondary" onClick={copyLink}>
              📋 Copy Link
            </button>
            <button className="btn-secondary" onClick={shareLink}>
              ↗ Share
            </button>
            <button className="btn-outline" onClick={reset}>
              + New Request
            </button>
          </div>
        </div>
      )}
    </section>
  );
}