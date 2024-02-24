const mongoose=require("mongoose");

const LoanSchema=new mongoose.Schema({
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      collateral: {
        type: String,
        required: true
      },
      interestRate: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'active', 'closed'],
        default: 'pending'
      }
})

const Loan=mongoose.model('Loan',LoanSchema);
module.exports = Loan; 