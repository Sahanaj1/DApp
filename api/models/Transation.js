const mongoose=require("mongoose");

const transationLoan=new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        enum: ['loan_repayment', 'collateral_liquidation'],
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
})

const Transaction= mongoose.model('Transaction',transationLoan);

exports.module=Transaction;