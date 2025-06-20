
import { useState } from "react";
const TransactionList = ({ transactions ,onDelete  }) => {
   const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const uniqueCategories = [
    ...new Set(transactions.map((t) => t.category.toLowerCase())),
  ];
  return <>
        {/* Transaction History */}
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="filter" className="form-label">
                Filter by Type:
              </label>
              <select
                id="filter"
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="categoryFilter" className="form-label">
                Filter by Category
              </label>
              <select
                id="categoryFilter"
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <h4 className="mb-3">Transaction History</h4>
            <ul className="list-group">
              {transactions
                .filter((t) => filterType === "all" || t.type === filterType)
                .filter(
                  (t) =>
                    filterCategory === "all" ||
                    t.category.toLowerCase() === filterCategory
                )
                .map((t) => (
                  <li
                    key={t._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{t.description}</strong> - ₹{t.amount}{" "}
                      <span className="text-muted">({t.category})</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className={`badge ${
                          t.type === "income" ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {t.type}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(t._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
  
  </>;
};

export default TransactionList;
