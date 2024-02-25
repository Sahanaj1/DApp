const express=require('express');
const router=express.Router();
const loanController=require('../controllers/loanController');


router.post('/create-loan',loanController.createLoan);

router.get('/get-loans',loanController.getAllLoans);

router.get('/get-loan/:id',loanController.getLoanById);

router.put('/update-loan/:id',loanController.updateLoanById);

router.delete('/delete-loan/:id',loanController.deleteLoanById)

module.exports=router;