// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IAxiomV2Client.sol";
import "./interfaces/IAxiomV2HeaderVerifier.sol";
import "./interfaces/IAxiomV2Query.sol";
import "./interfaces/IAxiomV2Verifier.sol";

contract ZkLending is IAxiomV2Client {
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

    uint256 constant private BASE_INTEREST_RATE = 5; // Base interest rate of 5%
    uint256 constant private INTEREST_RATE_FACTOR = 2; // Interest rate factor for score calculation
    uint256 constant private LOAN_DURATION = 30 days; // Duration of the loan

    mapping(address => CreditScoreInfo) public creditScores;
    mapping(address => LoanInfo) public loans;

    //  events
    event CreditScoreUpdated(address indexed user, uint256 newScore, uint256 accountAge, uint256 averageBalance);
    event LoanRequested(address indexed user, uint256 amount);
    event LoanApproved(address indexed user, uint256 amount);
    event LoanRejected(address indexed user, uint256 amount);
    event LoanRepaid(address indexed user, uint256 amount);
    event LoanDefaulted(address indexed user, uint256 amount);


    IAxiomV2HeaderVerifier public axiomHeaderVerifier;
    IAxiomV2Query public axiomQuery;
    IAxiomV2Verifier public axiomVerifier;

    constructor(address _axiomHeaderVerifier, address _axiomQuery, address _axiomVerifier) {
        axiomHeaderVerifier = IAxiomV2HeaderVerifier(_axiomHeaderVerifier);
        axiomQuery = IAxiomV2Query(_axiomQuery);
        axiomVerifier = IAxiomV2Verifier(_axiomVerifier);
    }

    function axiomV2Callback(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema,
        uint256 queryId,
        bytes32[] calldata axiomResults,
        bytes calldata callbackExtraData
    ) external override {
        require(axiomResults.length >= 2, "Insufficient data returned");

        uint256 newAccountAge = uint256(axiomResults[0]);
        uint256 newAverageBalance = uint256(axiomResults[1]);

        CreditScoreInfo storage scoreInfo = creditScores[callerAddr];
        scoreInfo.accountAge = newAccountAge;
        scoreInfo.averageBalance = newAverageBalance;

        // credit score logic based on account age and average balance
        scoreInfo.score = calculateCreditScore(newAccountAge, newAverageBalance);
        scoreInfo.lastUpdated = block.timestamp;

        emit CreditScoreUpdated(callerAddr, scoreInfo.score, newAccountAge, newAverageBalance);
    }

   // Public function to request a loan
    function requestLoan(uint256 amount) public {
        emit LoanRequested(msg.sender, amount);
        CreditScoreInfo memory scoreInfo = creditScores[msg.sender];

        // Check if enough credit score data is available
        require(scoreInfo.lastUpdated != 0, "Credit score not available");

        // Check credit score and decide on loan approval
        if (scoreInfo.score > 600) { // Assuming 600 as a threshold for loan approval
            uint256 interestRate = BASE_INTEREST_RATE + (700 - scoreInfo.score) / INTEREST_RATE_FACTOR;
            loans[msg.sender] = LoanInfo(amount, interestRate, block.timestamp + LOAN_DURATION, true);
            emit LoanApproved(msg.sender, amount);
        } else {
            emit LoanRejected(msg.sender, amount);
        }
    }

  // Function to calculate credit score
    function calculateCreditScore(uint256 accountAge, uint256 averageBalance) internal pure returns (uint256) {
        // Example credit score calculation
        return (averageBalance / 1 ether) + (accountAge / 365 days); // basic scoring logic
    }

    // Other functions...
}