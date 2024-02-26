const express = require('express');
const router = express.Router();
const collateralController = require('../controllers/collateralController');

router.post('/', collateralController.createCollateral);

router.get('/', collateralController.getAllCollaterals);

router.get('/:id', collateralController.getCollateralById);

router.put('/:id', collateralController.updateCollateralById);

router.delete('/:id', collateralController.deleteCollateralById);

module.exports = router;
