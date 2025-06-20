import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Chart from "../components/Chart";


import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const handleAdd = (newTransaction) => {
  setTransactions([newTransaction, ...transactions]);
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

    const handleDeleteList = async (id) => {
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
        <TransactionForm onAdd={handleAdd} />
        <TransactionList transactions={transactions} onDelete={handleDeleteList} />
        <Chart income={income} expense={expense} />
      </div>
    </>
  );
}

export default Dashboard;
