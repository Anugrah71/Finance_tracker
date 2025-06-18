const Transaction = require('../models/Transaction');

const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;

    const transaction = new Transaction({
      userId: req.user.id, // comes from auth middleware
      type,
      amount,
      category,
      description,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


// ✅ Already correct
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction
};
