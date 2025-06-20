import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const uniqueCategories = [
    ...new Set(transactions.map((t) => t.category.toLowerCase())),
  ];
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
      alert("Failed to delete");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "transactions/add",
        { amount, description, type, category },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTransactions([res.data, ...transactions]);
      
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Dashboard</h2>

        {/* Balance Summary */}
        <div className="row text-center mb-4">
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5>Total Income</h5>
                <h3>₹{income}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-danger text-white">
              <div className="card-body">
                <h5>Total Expenses</h5>
                <h3>₹{expense}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5>Balance</h5>
                <h3>₹{balance}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="mb-3">Add Transaction</h4>
            <form onSubmit={handleAdd} className="row g-3">
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>

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
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
