const Voting = artifacts.require("Voting");

// Ganache provides local free 10 accounts with 100 ETH each. Select the second account as the government account
module.exports = async function(deployer, _, accounts) {
    const candidates = ["Mykita", "Ruslan", "Mariana"];
    const duration = 60
    const governmentAccount = accounts[1]; 
    await deployer.deploy(Voting, candidates, duration, governmentAccount);
}