const Voting = artifacts.require("Voting");

// Ganache provides local free 10 accounts with 100 ETH each. Select the second account as the government account
module.exports = async function(deployer, _, accounts) {
    const candidates = [
        { id: "82d0518d-5ccf-4646-a00c-9422d518cb98", name: "Alice", party: "Green", voteCount: 0 },
        { id: "47d5c0db-8665-4b6c-bc7e-99fef84f1fde", name: "Bob", party: "Blue", voteCount: 0 }
      ];
    const duration = 1000
    const governmentAccount = accounts[1]; 
    await deployer.deploy(Voting, candidates, duration, governmentAccount);
}