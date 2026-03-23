// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PayChain {
    
    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    Transaction[] private transactions;
    uint256 private transactionCount;

    event TransactionAdded(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    function sendPayment(
        address payable receiver,
        string memory message,
        string memory keyword
    ) public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(receiver != address(0), "Invalid receiver address");
        require(receiver != msg.sender, "Cannot send to yourself");

        transactionCount++;

        transactions.push(Transaction(
            msg.sender,
            receiver,
            msg.value,
            message,
            block.timestamp,
            keyword
        ));

        (bool success, ) = receiver.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit TransactionAdded(
            msg.sender,
            receiver,
            msg.value,
            message,
            block.timestamp,
            keyword
        );
    }

    function getAllTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}