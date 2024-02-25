const mongoose = require('mongoose');
const Loan = require("../models/Loan");
const User = require("../models/User");

exports.createLoan = async (req, res) => {
    try {
        const lender = await User.findById(req.body.lenderId);
        const { amount, collateral, interestRate, status } = req.body;
        const loan = new Loan({
            lender,
            status,
            interestRate,
            collateral,
            amount
        });

        await loan.save()

        res.status(201).json({ message: "Loan created successfully" });


    } catch (err) {
        res.status(500).json({ message: err.message });
        console.error(err)
    }
}

exports.getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find();

        res.status(200).json(loans);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


exports.getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        res.status(200).json(loan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateLoanById = async (req, res) => {
    try {
        const findLoan = await Loan.findById(req.params.id);

        if (!findLoan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (String(findLoan.lender) !== req.user._id) {
            return res.status(403).json({ message: 'You are not authorized to update this loan' });
        }

        const updatedloan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(201).json(updatedloan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteLoanById = async (req, res) => {
    try {
        const findLoan = await Loan.findById(req.params.id);

        if (!findLoan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (String(findLoan.lender) !== req.user._id) {
            return res.status(403).json({ message: 'You are not authorized to delete this loan' });
        }

        const deletedLoan = await Loan.findByIdAndDelete(req.params.id);

        res.json({ message: 'Loan deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
