# ⛓ PayChain — Decentralized Payment Platform

> A full-stack blockchain DApp that enables peer-to-peer ETH transfers with immutable on-chain receipts, built with Solidity, Hardhat, React, and ethers.js.

---

## 🚀 Live Features

| Feature | Description |
|---|---|
| 🔗 Wallet Connect | MetaMask integration with auto-reconnect on refresh |
| 💸 Send Payment | On-chain ETH transfers with message and category tags |
| 📊 Analytics Dashboard | Real-time stats — total sent, received, net flow, category breakdown |
| 🔍 Search & Filter | Filter transactions by keyword, address, message, sent/received |
| 🧾 PDF Receipt Export | Download professional blockchain receipts for every transaction |
| 🔗 Payment Request Links | Generate shareable payment links (like UPI payment links) |
| ⚡ Live TX Status Tracker | Real-time transaction pipeline — Signing → Broadcasting → Confirmed |
| 🌓 Dark / Light Mode | Full theme toggle with persistent UI |
| 👛 Multi-Account Support | Seamless MetaMask account switching with auto UI updates |

---

## 🛠 Tech Stack

**Blockchain**
- Solidity `^0.8.0` — Smart contract development
- Hardhat — Local blockchain, compilation, deployment
- ethers.js v5 — Blockchain interaction from frontend

**Frontend**
- React 18 + Vite — Fast modern frontend
- jsPDF — PDF receipt generation
- MetaMask — Wallet & transaction signing

---

## 📁 Project Structure

```
paychain/
├── contracts/
│   └── PayChain.sol          # Main smart contract
├── scripts/
│   └── deploy.js             # Deployment script
├── artifacts/                # Compiled contract ABIs
├── hardhat.config.js         # Hardhat configuration
└── frontend/
    └── src/
        ├── App.jsx                        # Root component
        ├── index.css                      # Global styles
        ├── artifacts/PayChain.json        # Contract ABI
        └── components/
            ├── ConnectWallet.jsx          # Wallet connection + theme toggle
            ├── SendPayment.jsx            # Payment form + TX status tracker
            ├── TransactionHistory.jsx     # History with search, filter, PDF export
            ├── Analytics.jsx             # Stats dashboard + keyword chart
            ├── RequestPayment.jsx         # Payment link generator
            └── TxStatus.jsx              # Live transaction status tracker
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js installed
- MetaMask browser extension installed

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/paychain.git
cd paychain
```

### 2. Install dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### 3. Start local blockchain
```bash
# Terminal 1 — keep this running
npx hardhat node
```

### 4. Deploy smart contract
```bash
# Terminal 2
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address and update `CONTRACT_ADDRESS` in `frontend/src/App.jsx`.

### 5. Start the frontend
```bash
# Terminal 3
cd frontend
npm run dev
```

Open `http://localhost:5173` in Chrome with MetaMask installed.

### 6. Configure MetaMask
Add Hardhat Local Network to MetaMask:
| Field | Value |
|---|---|
| Network Name | Hardhat Local |
| RPC URL | http://127.0.0.1:8545 |
| Chain ID | 31337 |
| Currency Symbol | ETH |

Import a test account using any private key printed by `npx hardhat node`.

---

## 📝 Smart Contract

**`PayChain.sol`** stores every transaction on-chain with full details:

```solidity
struct Transaction {
    address sender;
    address receiver;
    uint256 amount;
    string message;
    uint256 timestamp;
    string keyword;
}
```

**Key functions:**
- `sendPayment(address receiver, string message, string keyword)` — Send ETH with metadata
- `getAllTransactions()` — Fetch complete transaction history
- `getTransactionCount()` — Get total transaction count

**Security features:**
- Reverts if amount is 0
- Reverts if sending to yourself
- Reverts if receiver address is invalid
- All transactions permanently recorded — tamper-proof

---

## 💡 How PayChain Relates to Paytm

| Paytm Feature | PayChain Equivalent |
|---|---|
| UPI Payment Links | Request Payment → shareable URL |
| Transaction History | On-chain immutable transaction log |
| Payment Categories | Keyword tagging on every transaction |
| Transaction Receipt | PDF receipt download per transaction |
| Wallet Balance | Live ETH balance in navbar |
| Zero Platform Fee | Smart contract — no intermediary |

---

## 🔮 Future Scope

- [ ] Deploy to Sepolia public testnet
- [ ] QR code generation for payment requests  
- [ ] Push notifications for incoming payments
- [ ] Multi-token support (ERC-20 tokens)
- [ ] ENS (Ethereum Name Service) support
- [ ] Transaction dispute resolution via smart contract

---

## 👩‍💻 Author

Built as a blockchain DApp project demonstrating real-world Web3 payment infrastructure.

---

## 📄 License

MIT License