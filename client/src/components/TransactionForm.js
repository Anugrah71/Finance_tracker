import React, { useState } from 'react';
import axios from '../utils/api';

const TransactionForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('/transactions/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onAdd(res.data); // pass the new transaction back to parent
      setFormData({ type: 'income', amount: '', category: '', description: '' });
    } catch (err) {
      console.error('Error adding transaction:', err);
      alert('Failed to add transaction.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded shadow-sm bg-light">
      <div className="mb-2">
        <select name="type" value={formData.type} onChange={handleChange} className="form-select">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="mb-2">
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" className="form-control" required />
      </div>
      <div className="mb-2">
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="form-control" required />
      </div>
      <div className="mb-2">
        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="form-control" />
      </div>
      <button type="submit" className="btn btn-primary">Add Transaction</button>
    </form>
  );
};

export default TransactionForm;
