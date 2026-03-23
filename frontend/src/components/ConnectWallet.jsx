export default function ConnectWallet({ account, balance, connectWallet, darkMode, setDarkMode }) {
  const copyAddress = () => {
    navigator.clipboard.writeText(account);
  };

  return (
    <div className="wallet-area">
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        title="Toggle theme"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
      {account ? (
        <div className="wallet-connected" onClick={copyAddress} title="Click to copy address">
          <span className="wallet-dot" />
          <span className="wallet-balance">{balance} ETH</span>
          <span className="wallet-divider">|</span>
          <span className="wallet-addr">{account.slice(0, 6)}...{account.slice(-4)}</span>
          <span className="wallet-copy">⎘</span>
        </div>
      ) : (
        <button className="btn-connect" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}