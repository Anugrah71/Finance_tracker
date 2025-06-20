import React from "react";

const TransactionList = ({ transactions }) => {
  return (
    <div className="mt-3">
      <h4>Transaction History</h4>
      <ul className="list-group">
        {transactions.map((txn) => (
          <li
            key={txn._id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              txn.type === "income"
                ? "list-group-item-success"
                : "list-group-item-danger"
            }`}
          >
            <div>
              <strong>{txn.category}</strong> - {txn.description}
            </div>
            <span>{txn.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
