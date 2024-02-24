const mongoose = require('mongoose');

const collateralSchema = new mongoose.Schema({
  assetType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  valuation: {
    type: Number,
    required: true
  }
});

const Collateral = mongoose.model('Collateral', collateralSchema);

module.exports = Collateral;
