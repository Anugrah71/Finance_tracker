import React, { useState } from "react";
import api from "../utils/api";

const TransactionForm = ({ onAdd }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");

  const handleAddForm = async (e) => {
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
    onAdd(res.data); // ✅ send new transaction to Dashboard
    // clear form
    setAmount("");
    setDescription("");
    setType("income");
    setCategory("");
  } catch (err) {
    console.error("Error adding transaction:", err);
    alert("Failed to add transaction.");
  }
};


  return (
    <>
      {/* Add Transaction Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="mb-3">Add Transaction</h4>
          <form onSubmit={handleAddForm} className="row g-3">
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
    </>
  );
};

export default TransactionForm;
