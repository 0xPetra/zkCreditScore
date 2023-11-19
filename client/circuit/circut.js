
let totalBalance = constant(0);
let firstActiveBlock = constant(0);
let isActive = false;
const periods = div(sub(endBlock, startBlock), blockInterval);

// Iterate over blocks to calculate average balance and find account age
for (let i = constant(0); i < periods; i = add(i, constant(1))) {
    const blockNumber = sub(endBlock, mul(i, blockInterval));
    let account = getAccount(blockNumber, userAddress);

    // Calculate total balance
    totalBalance = add(totalBalance, account.balance().toCircuitValue());

    // Check for the first active block
    if (!isActive && account.nonce().toCircuitValue() > constant(0)) {
        firstActiveBlock = blockNumber;
        isActive = true;
    }
}

// Calculate average balance
let averageBalance = div(totalBalance, periods);

// Add results to the callback
addToCallback(userAddress);
addToCallback(averageBalance);
addToCallback(firstActiveBlock);

/* test input
{
    "userAddress": "0x897dDbe14c9C7736EbfDC58461355697FbF70048",
    "startBlock": 9173677,
    "endBlock": 9730000,
    "blockInterval": 1000
}

*/