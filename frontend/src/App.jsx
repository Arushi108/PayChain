import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ConnectWallet from "./components/ConnectWallet";
import SendPayment from "./components/SendPayment";
import TransactionHistory from "./components/TransactionHistory";
import PayChainABI from "./artifacts/PayChain.json";
import RequestPayment from "./components/RequestPayment";
import Analytics from "./components/Analytics";
import "./index.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txCount, setTxCount] = useState(0);
  const [balance, setBalance] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const getProviderAndSigner = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, {
      chainId: 31337,
      name: "hardhat"
    });
    const signer = provider.getSigner();
    return { provider, signer };
  };

  const setupContract = async (address) => {
    const { provider, signer } = getProviderAndSigner();
    const paychainContract = new ethers.Contract(CONTRACT_ADDRESS, PayChainABI.abi, signer);
    const bal = await provider.getBalance(address);
    setBalance(parseFloat(ethers.utils.formatEther(bal)).toFixed(4));
    setAccount(address);
    setContract(paychainContract);
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask!");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      await setupContract(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const autoConnect = async () => {
      if (!window.ethereum) return;
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        await setupContract(accounts[0]);
      }
    };
    autoConnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    const amt = params.get("amount");
    const msg = params.get("message");
    const kw = params.get("keyword");
    if (to || amt || msg || kw) {
      window._prefill = {
        receiver: to || "",
        amount: amt || "",
        message: msg || "",
        keyword: kw || "",
      };
    }
  }, []);

  const fetchTransactions = async () => {
    if (!contract) return;
    try {
      const { provider } = getProviderAndSigner();
      const readContract = new ethers.Contract(CONTRACT_ADDRESS, PayChainABI.abi, provider);
      const txs = await readContract.getAllTransactions();
      const count = await readContract.getTransactionCount();
      const formatted = txs.map((tx) => ({
        sender: tx.sender,
        receiver: tx.receiver,
        amount: ethers.utils.formatEther(tx.amount),
        message: tx.message,
        keyword: tx.keyword,
        timestamp: new Date(tx.timestamp.toNumber() * 1000).toLocaleString(),
      }));
      setTransactions(formatted.reverse());
      setTxCount(count.toNumber());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!contract) return;
    const load = async () => { await fetchTransactions(); };
    load();
  }, [contract]);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountChange = (accounts) => {
      setTimeout(() => setupContract(accounts[0]), 0);
    };
    window.ethereum.on("accountsChanged", handleAccountChange);
    return () => window.ethereum.removeListener("accountsChanged", handleAccountChange);
  }, []);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">⛓</span>
          <span className="brand-name">Pay<span className="brand-accent">Chain</span></span>
        </div>
        <ConnectWallet
          account={account}
          balance={balance}
          connectWallet={connectWallet}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </nav>

      <header className="hero">
        <div className="hero-content">
          <p className="hero-tag">Powered by Ethereum</p>
          <h1 className="hero-title">Payments on the<br /><span className="gradient-text">Blockchain</span></h1>
          <p className="hero-sub">Send ETH instantly with immutable on-chain receipts.<br />Transparent. Trustless. Yours.</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">{txCount}</span>
              <span className="stat-label">Transactions</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">{balance ?? "—"}</span>
              <span className="stat-label">Your ETH</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">0%</span>
              <span className="stat-label">Platform Fee</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
          <div className="chain-ring" />
        </div>
      </header>

      <main className="main">
        {account ? (
          <>
            <Analytics transactions={transactions} account={account} />
            <RequestPayment account={account} />
            <SendPayment
              contract={contract}
              account={account}
              loading={loading}
              setLoading={setLoading}
              onSuccess={() => { fetchTransactions(); setupContract(account); }}
            />
            <TransactionHistory transactions={transactions} account={account} />
          </>
        ) : (
          <div className="unlock-prompt">
            <div className="unlock-icon">🔐</div>
            <h2>Connect your wallet to get started</h2>
            <p>Use MetaMask to send payments and view your transaction history</p>
            <button className="btn-primary large" onClick={connectWallet}>Connect MetaMask</button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>PayChain • Built on Ethereum • Smart Contract: <span className="contract-addr">{CONTRACT_ADDRESS.slice(0,6)}...{CONTRACT_ADDRESS.slice(-4)}</span></p>
      </footer>
    </div>
  );
}