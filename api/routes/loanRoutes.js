const express=require('express');
const router=express.Router();
const loanController=require('../controllers/loanController');


router.post('/',loanController.createLoan);

router.get('/',loanController.getAllLoans);

router.get('/:id',loanController.getLoanById);

router.put('/update-loan/:id',loanController.updateLoanById);

router.delete('/delete-loan/:id',loanController.deleteLoanById)

module.exports=router;