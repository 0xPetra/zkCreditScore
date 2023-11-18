// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin-contracts/token/ERC20/ERC20.sol";
import "./UselessNFT.sol";
import { AxiomV2Client } from './AxiomV2Client.sol';

contract UselessGovernanceToken is ERC20, AxiomV2Client {
    event ParametersUpdated(
        address indexed callerAddr,
        uint256 indexed tokenId,
        uint256 queryId,
        uint256 newTaxRate,
        uint256 newRewardRate,
        uint256 totalVotes
    );

    bytes32 public axiomCallbackQuerySchema;
    uint256 public taxRate;
    uint256 public rewardRate;
    uint256 public totalVotes;
    mapping(bytes32 => bool) public didVote;
    UselessNFT public uselessNFT;

    constructor(
        address _nftContract,
        address _axiomV2QueryAddress,
        bytes32 _axiomCallbackQuerySchema,
        uint256 _defaultTaxRate,
        uint256 _defaultRewardRate
    )
        ERC20("Useless Governance Token", "UGT")
        AxiomV2Client(_axiomV2QueryAddress)
    {
        axiomCallbackQuerySchema = _axiomCallbackQuerySchema;
        taxRate = _defaultTaxRate;
        rewardRate = _defaultRewardRate;
        uselessNFT = UselessNFT(_nftContract);
    }

    function didUserVote(address user, uint256 tokenId) external view returns (bool) {
        bytes32 holderTokenIdHash = keccak256(abi.encodePacked(user, tokenId));
        return didVote[holderTokenIdHash];
    }

    function _axiomV2Callback(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema,
        uint256 queryId,
        bytes32[] calldata axiomResults,
        bytes calldata callbackExtraData
    ) internal virtual override {
        // Parse results array
        address nftHolder = address(uint160(uint256(axiomResults[0])));
        uint256 tokenId = uint256(axiomResults[1]);
        uint256 vote = uint256(axiomResults[2]);

        // Get current owner of `tokenId`
        address currentNftOwner = uselessNFT.ownerOf(tokenId);

        // Hash the holder and tokenId to get an identifier for holder + tokenId 
        bytes32 holderTokenIdHash = keccak256(abi.encodePacked(nftHolder, tokenId));

        // Validation checks
        require(!didVote[holderTokenIdHash], "UselessGovernanceToken: nftHolder already voted with this tokenId");
        require(nftHolder == callerAddr, "UselessGovernanceToken: nftHolder must be caller");
        require(nftHolder == currentNftOwner, "UselessGovernanceToken: nftHolder must be current owner");

        // Update state based on user's vote
        if (vote == 1) {
            // Increase the tax and reward rates by 0.1%;
            taxRate += 1;
            rewardRate += 1;
            totalVotes += 1;
        } else if (vote == 2) {
            // Decrease the tax and reward rates by 0.1%;
            taxRate -= 1;
            rewardRate -= 1;
            totalVotes += 1;
        } else {
            revert("UselessGovernanceToken: invalid vote");
        }

        // Mark user as having voted
        didVote[holderTokenIdHash] = true;

        // Emit events
        emit ParametersUpdated(callerAddr, tokenId, queryId, taxRate, rewardRate, totalVotes);
    }

    function _validateAxiomV2Call(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema
    ) internal virtual override {
        require(uint256(sourceChainId) == block.chainid, "AxiomV2: sourceChainId must be current chainId");
        require(querySchema == axiomCallbackQuerySchema, "AxiomV2: query schema mismatch");
    }
}