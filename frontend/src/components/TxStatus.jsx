export default function TxStatus({ status, txHash }) {
  const steps = [
    { id: 1, label: "Initiated", desc: "Transaction created" },
    { id: 2, label: "Signing", desc: "MetaMask confirmation" },
    { id: 3, label: "Broadcasting", desc: "Sent to blockchain" },
    { id: 4, label: "Confirmed", desc: "Recorded on-chain" },
  ];

  const activeStep =
    status === "idle" ? 0 :
    status === "signing" ? 1 :
    status === "broadcasting" ? 2 :
    status === "confirmed" ? 4 : 0;

  if (status === "idle") {
    return (
      <div className="tx-status-wrap">
        <div className="tx-status-idle">
          <div className="tx-idle-icon">⛓</div>
          <p className="tx-idle-title">Ready to send</p>
          <p className="tx-idle-sub">Fill the form and confirm in MetaMask</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tx-status-wrap">
      <p className="tx-status-heading">Transaction Status</p>
      <div className="tx-steps">
        {steps.map((step, i) => {
          const isDone = activeStep > step.id;
          const isActive = activeStep === step.id;
          return (
            <div key={step.id} className="tx-step">
              <div className="tx-step-left">
                <div className={`tx-step-circle ${isDone ? "done" : isActive ? "active" : ""}`}>
                  {isDone ? "✓" : step.id}
                </div>
                {i < steps.length - 1 && (
                  <div className={`tx-step-line ${isDone ? "done" : ""}`} />
                )}
              </div>
              <div className="tx-step-right">
                <span className={`tx-step-label ${isActive ? "active" : isDone ? "done" : ""}`}>
                  {step.label}
                </span>
                <span className="tx-step-desc">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
      {status === "confirmed" && txHash && (
        <div className="tx-hash-box">
          <span className="tx-hash-label">TX Hash</span>
          <span className="tx-hash-val">{txHash.slice(0, 18)}...{txHash.slice(-6)}</span>
        </div>
      )}
    </div>
  );
}