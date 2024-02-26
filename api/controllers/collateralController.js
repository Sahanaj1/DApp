const Collateral = require("../models/Collateral")

exports.createCollateral = async (req, res) => {
    try {
        const { assetType, amount, valuation } = req.body;
        const collateral = new Collateral({
            assetType,
            amount,
            valuation
        });
        await collateral.save();
        res.status(201).json({ message: "Collateral created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllCollaterals = async (req, res) => {
    try {
        const collaterals = await Collateral.find();
        res.status(200).json(collaterals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCollateralById = async (req, res) => {
    try {
        const collateral = await Collateral.findById(req.params.id);
        if (!collateral) {
            return res.status(404).json({ message: 'Collateral not found' });
        }
        res.status(200).json(collateral);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCollateralById = async (req, res) => {
    try {
        const updatedCollateral = await Collateral.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCollateral) {
            return res.status(404).json({ message: 'Collateral not found' });
        }
        res.status(200).json(updatedCollateral);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCollateralById = async (req, res) => {
    try {
        const deletedCollateral = await Collateral.findByIdAndDelete(req.params.id);
        if (!deletedCollateral) {
            return res.status(404).json({ message: 'Collateral not found' });
        }
        res.status(200).json({ message: 'Collateral deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
