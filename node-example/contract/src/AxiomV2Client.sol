// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IAxiomV2Client.sol";

abstract contract ZkLending is IAxiomV2Client {
    struct CreditScoreInfo {
        uint256 score;
        uint256 lastUpdated;
        uint256 accountAge;
        uint256 averageBalance;
    }

    struct LoanInfo {
        uint256 amount;
        uint256 interestRate;
        uint256 dueDate;
        bool isApproved;
    }

    uint256 constant private BASE_INTEREST_RATE = 5;
    uint256 constant private INTEREST_RATE_FACTOR = 2;
    uint256 constant private LOAN_DURATION = 30 days;

    mapping(address => CreditScoreInfo) public creditScores;
    mapping(address => LoanInfo) public loans;

    event CreditScoreUpdated(address indexed user, uint256 newScore, uint256 accountAge, uint256 averageBalance);
    event LoanRequested(address indexed user, uint256 amount);
    event LoanApproved(address indexed user, uint256 amount);
    event LoanRejected(address indexed user, uint256 amount);
    event LoanRepaid(address indexed user, uint256 amount);
    event LoanDefaulted(address indexed user, uint256 amount);

    address public axiomV2QueryAddress;

    constructor(address _axiomV2QueryAddress) {
        axiomV2QueryAddress = _axiomV2QueryAddress;
    }

    function axiomV2Callback(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema,
        uint256 queryId,
        bytes32[] calldata axiomResults,
        bytes calldata callbackExtraData
    ) external override {
        require(msg.sender == axiomV2QueryAddress, "Caller is not AxiomV2Query");
        require(axiomResults.length >= 2, "Insufficient data returned");

        uint256 newAccountAge = uint256(axiomResults[0]);
        uint256 newAverageBalance = uint256(axiomResults[1]);

        CreditScoreInfo storage scoreInfo = creditScores[callerAddr];
        scoreInfo.accountAge = newAccountAge;
        scoreInfo.averageBalance = newAverageBalance;

        scoreInfo.score = calculateCreditScore(newAccountAge, newAverageBalance);
        scoreInfo.lastUpdated = block.timestamp;

        emit CreditScoreUpdated(callerAddr, scoreInfo.score, newAccountAge, newAverageBalance);
    }

    function requestLoan(uint256 amount) public {
        emit LoanRequested(msg.sender, amount);
        CreditScoreInfo memory scoreInfo = creditScores[msg.sender];

        require(scoreInfo.lastUpdated != 0, "Credit score not available");

        if (scoreInfo.score > 600) {
            uint256 interestRate = BASE_INTEREST_RATE + (700 - scoreInfo.score) / INTEREST_RATE_FACTOR;
            loans[msg.sender] = LoanInfo(amount, interestRate, block.timestamp + LOAN_DURATION, true);
            emit LoanApproved(msg.sender, amount);
        } else {
            emit LoanRejected(msg.sender, amount);
        }
    }

    function calculateCreditScore(uint256 accountAge, uint256 averageBalance) internal pure returns (uint256) {
        return (averageBalance / 1 ether) * 2 + (accountAge / 365 days) * 3;
    }

    // Additional functions and logic as necessary...
}