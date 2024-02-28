// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanApp {
    struct Loan {
        address borrower;
        address lender;
        uint256 amount;
        uint256 collateralAmount;
        uint256 interestRate;
        uint256 duration; // Duration in days
        uint256 endTime; // End time of loan duration
        bool active;
        bool approved;
    }

    struct LoanInfo {
        uint256 loanId;
        address borrower;
        address lender;
        uint256 amount;
        uint256 collateralAmount;
        uint256 interestRate;
        uint256 duration;
        uint256 endTime;
        bool active;
        bool approved;
    }

    mapping(uint256 => Loan) public loans;
    LoanInfo[] public loansInfo;
    uint256 public loanCount;

    // Events
    event LoanCreated(
        uint256 loanId,
        address indexed borrower,
        uint256 amount,
        uint256 collateralAmount,
        uint256 endTime
    );
    event LoanApproved(uint256 loanId, address indexed lender);
    event LoanRepaid(
        uint256 loanId,
        address indexed borrower,
        address indexed lender,
        uint256 amount
    );
    event LoanDefaulted(uint256 loanId, address indexed borrower);

    // Create a new loan
    function createLoan(
        uint256 _amount,
        uint256 _interestRate,
        uint256 _duration
    ) external payable {
        require(_amount > 0, "Amount must be greater than zero");
        require(
            msg.value >= 0.005 ether,
            "Collateral amount must be at least 0.005 ether"
        );
        require(_interestRate > 0, "Interest rate must be greater than zero");
        require(_duration > 0, "Duration must be greater than zero");

        loanCount++;
        loans[loanCount] = Loan({
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            collateralAmount: msg.value,
            interestRate: _interestRate,
            duration: _duration,
            endTime: 0, // Initialize end time to 0
            active: true,
            approved: false
        });

        loansInfo.push(
            LoanInfo({
                loanId: loanCount,
                borrower: msg.sender,
                lender: address(0),
                amount: _amount,
                collateralAmount: msg.value,
                interestRate: _interestRate,
                duration: _duration,
                endTime: 0, // Initialize end time to 0
                active: true,
                approved: false
            })
        );

        emit LoanCreated(loanCount, msg.sender, _amount, msg.value, 0);
    }

    // Approve a loan
    function approveLoan(uint256 _loanId) external {
        require(loans[_loanId].active, "Loan does not exist or already closed");
        require(
            loans[_loanId].lender == address(0),
            "Loan already approved by a lender"
        );

        loans[_loanId].lender = msg.sender;
        loans[_loanId].approved = true;

        for (uint256 i = 0; i < loansInfo.length; i++) {
            if (loansInfo[i].loanId == _loanId) {
                loansInfo[i].lender = msg.sender;
                loansInfo[i].approved = true;
                loansInfo[i].endTime =
                    block.timestamp +
                    loansInfo[i].duration *
                    1 days +
                    1; // Update end time
                break;
            }
        }

        // Transfer funds from lender to borrower
        payable(loans[_loanId].borrower).transfer(loans[_loanId].amount);

        emit LoanApproved(_loanId, msg.sender);
    }

    // Repay a loan
    function repayLoan(uint256 _loanId) external payable {
        require(loans[_loanId].active, "Loan does not exist or already closed");
        require(
            msg.value >= loans[_loanId].amount + calculateInterest(_loanId),
            "Insufficient funds"
        );

        loans[_loanId].active = false;
        payable(loans[_loanId].lender).transfer(msg.value);

        emit LoanRepaid(
            _loanId,
            loans[_loanId].borrower,
            loans[_loanId].lender,
            msg.value
        );
    }

    // Function to calculate interest amount
    function calculateInterest(uint256 _loanId)
        internal
        view
        returns (uint256)
    {
        uint256 loanAmount = loans[_loanId].amount;
        uint256 interestRate = loans[_loanId].interestRate;
        uint256 duration = loans[_loanId].duration;

        // Calculate interest amount
        uint256 interestAmount = (loanAmount * interestRate * duration) /
            (100 * 365);

        return interestAmount;
    }

    // Default on a loan (liquidate collateral)
    function defaultLoan(uint256 _loanId) external {
        require(loans[_loanId].active, "Loan does not exist or already closed");
        require(
            block.timestamp >= loans[_loanId].endTime,
            "Loan not yet due for repayment"
        );

        loans[_loanId].active = false;

        // Refund 75% of collateral if loan not repaid in time
        uint256 refundAmount = (loans[_loanId].collateralAmount * 75) / 100;
        payable(loans[_loanId].borrower).transfer(refundAmount);

        emit LoanDefaulted(_loanId, loans[_loanId].borrower);
    }

    function getLoans() public view returns (LoanInfo[] memory) {
        return loansInfo;
    }
}
