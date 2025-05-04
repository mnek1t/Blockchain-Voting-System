const Voting = artifacts.require("Voting");
const { time } = require('@openzeppelin/test-helpers');

contract("Voting", accounts => {
    let votingContractInstance;
    const candidates = [
        { id: "82d0518d-5ccf-4646-a00c-9422d518cb98", name: "Alice", party: "Green", voteCount: 0 },
        { id: "47d5c0db-8665-4b6c-bc7e-99fef84f1fde", name: "Bob", party: "Blue", voteCount: 0 }
    ];
    const deposit = web3.utils.toWei("0.01", "ether")
    let owner = accounts[0]
    let governmentAcc = accounts[1]
    let voter1 = accounts[2]
    const duration = 1000;
    beforeEach(async () => {
        votingContractInstance = await Voting.new(candidates, duration, governmentAcc, {from: owner});
    });

    it("should deploy with candidates", async () => {
        await time.increase(duration + 1);
        await votingContractInstance.endElection();
        const results = await votingContractInstance.getResults.call({ from: owner });
        assert.equal(results.length, 2);
        assert.equal(results[0].name, "Alice");
    });

    it("should allow user commit a vote with deposit withdrawal", async () => {
        var candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98"; // selected candidate immmitation
        const salt = 'secret'
        const voteHash = web3.utils.soliditySha3(candidateId, salt)

        const tx = await votingContractInstance.vote(voteHash, {from: voter1, value: deposit})
        assert(tx.logs.some(log => log.event === 'VoteCommitted'), 'VoteCommitted should emit');
    })

    it("should not allow user commit a vote twice", async () => {
        var candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98";
        const salt = 'secret'
        const voteHash  = web3.utils.soliditySha3(candidateId, salt)
        await votingContractInstance.vote(voteHash, {from: voter1, value: deposit})

        try {
            await votingContractInstance.vote(voteHash, {from: voter1, value: deposit})
            assert.fail("Duplicate voting should be prevented")
        } catch(err) {
            assert(err.message.includes("You have already voted"));
        }
    })

    it("should not allow user commit a vote without proper deposit", async () => {
        var candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98";
        const salt = 'secret'
        const voteHash = web3.utils.soliditySha3(candidateId, salt)
        let invalidDeposit = web3.utils.toWei("0.02", "ether")

        try {
            await votingContractInstance.vote(voteHash, {from: voter1, value: invalidDeposit})
            assert.fail("Deposit is invalid")
        } catch(err) {
            assert(err.message.includes("Deposit amount is not correct"));
        }

        invalidDeposit = web3.utils.toWei("0.001", "ether")

        try {
            await votingContractInstance.vote(voteHash, {from: voter1, value: invalidDeposit})
            assert.fail("Deposit is invalid")
        } catch(err) {
            assert(err.message.includes("Deposit amount is not correct"));
        }
    });

    it('should not allow government account to participate in voting', async() => {
        var candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98"; // selected candidate immmitation
        const salt = 'secret';
        const voteHash = web3.utils.soliditySha3(candidateId, salt);
        try {
            await votingContractInstance.vote(voteHash, {from: governmentAcc, value: deposit})
        } catch(err) {
            assert(err.message.includes("Government Account cannot participate in voting!"));
        }
    })

    it('should end election', async() => {
        await time.increase(duration + 1);
        const tx = await votingContractInstance.endElection();
        assert(tx.logs.some(log => log.event === 'VoteEnded'), 'VoteEnded should emit');
    })

    it('should not end election twice', async() => {
        await time.increase(duration + 1);
        await votingContractInstance.endElection();
        try {
            await votingContractInstance.endElection();
            assert.fail("Election is finished")
        } catch(err) {
            assert(err.message.includes("Voting is already finished"));
        }
    })

    it('should reveal a vote only after election end', async () => {
        const candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98";
        const salt = 'secret';
        const voteHash = web3.utils.soliditySha3(candidateId, salt);

        await votingContractInstance.vote(voteHash, {from: voter1, value: deposit})
        await time.increase(duration + 1);
        await votingContractInstance.endElection();

        const beforeBalance = web3.utils.toBN(await web3.eth.getBalance(voter1));
        const tx = await votingContractInstance.revealVote(candidateId, salt, {from: voter1});
        const afterBalance = web3.utils.toBN(await web3.eth.getBalance(voter1));

        assert(beforeBalance != afterBalance, 'Balance should increase')
        assert(tx.logs.some(log => log.event === 'VoteRevealed'), 'VoteRevealed should emit');
        // assert(await votingContractInstance.hasRevealed(voter1), 'Voter should be marked as revealed');
    })

    it('should not reveal vote without voting', async () => {
        const candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98";
        const salt = 'secret';
        await time.increase(duration + 1);
        await votingContractInstance.endElection();

        try {
            await votingContractInstance.revealVote(candidateId, salt, {from: voter1});
            assert.fail('Reveal vote without voting is impossible');
        } catch (err) {
            assert(err.message.includes('You have not voted yet'));
        }
    })

    it('should not allow revealing before election ends', async () => {
        const candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98";
        const salt = 'secret';
        const voteHash = web3.utils.soliditySha3(candidateId, salt);
    
        await votingContractInstance.vote(voteHash, {from: voter1, value: deposit});
    
        try {
            await votingContractInstance.revealVote(candidateId, salt, {from: voter1});
            assert.fail('Reveal should not be allowed during voting');
        } catch (err) {
            assert(err.message.includes('Reveal stage is not started yet'));
        }
    });

    it('should not reveal vote twice', async () => {
        const candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98";
        const salt = 'secret';
        const voteHash = web3.utils.soliditySha3(candidateId, salt);
        await votingContractInstance.vote(voteHash, {from: voter1, value: deposit})
        await time.increase(duration + 1);
        await votingContractInstance.endElection();

        await votingContractInstance.revealVote(candidateId, salt, {from: voter1});
        try {
            await votingContractInstance.revealVote(candidateId, salt, {from: voter1});
            assert.fail('Reveal should be done only once');
        } catch (err) {
            assert(err.message.includes('Vote already revealed'));
        }
    })

    it('should not reveal vote if salt or candidateId is wrong', async () => {
        const candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98";
        const salt = 'secret';
        const voteHash = web3.utils.soliditySha3(candidateId, salt);

        await votingContractInstance.vote(voteHash, {from: voter1, value: deposit})
        await time.increase(duration + 1);
        await votingContractInstance.endElection();

        const wrongCandidateId = 1;

        try {
            await votingContractInstance.revealVote(wrongCandidateId, salt, {from: voter1});
            assert.fail('Reveal should fail with incorrect candidateId');
        } catch (err) {
            assert(err.message.includes('Vote hash is not correct'));
        }

        const wrongSalt = 'terces'
        try {
            await votingContractInstance.revealVote(candidateId, wrongSalt, {from: voter1});
            assert.fail('Reveal should fail with incorrect salt');
        } catch (err) {
            assert(err.message.includes('Vote hash is not correct'));
        }
    })

    it('owner can withdraw remaining funds to government budget', async () => {
        const candidateId = "82d0518d-5ccf-4646-a00c-9422d518cb98";
        const salt = 'secret';
        const voteHash = web3.utils.soliditySha3(candidateId, salt);
    
        await votingContractInstance.vote(voteHash, {from: voter1, value: deposit});
        await time.increase(duration + 1);
        await votingContractInstance.endElection();
        // await votingContractInstance.revealVote(candidateId, salt, {from: voter1});

        await time.increase(86400 + 1);

        const initialBalance = web3.utils.toBN(await web3.eth.getBalance(governmentAcc));
        await votingContractInstance.withdrawToGovernmentBudget({from: owner});
        const finalBalance = web3.utils.toBN(await web3.eth.getBalance(governmentAcc));
        assert(finalBalance.gt(initialBalance), "Government should receive remaining funds");
    });

    it('non owner cannot withdraw remaining funds to government budget', async () => {
        await time.increase(duration + 1);
        await votingContractInstance.endElection();
        try {
            await votingContractInstance.withdrawToGovernmentBudget({from: voter1});
            assert.fail('Only owner should be allowed to withdraw');
        } catch (err) {
            assert(err.message.includes('Only owner can call this function'));
        }
    });

    it('owner cannot withdraw remaining funds to government budget before reveal phase ends', async () => {
        await time.increase(duration + 1);
        await votingContractInstance.endElection();
        try {
            await votingContractInstance.withdrawToGovernmentBudget({from: owner});
            assert.fail('Reveal phase is in progress');
        } catch (err) {
            assert(err.message.includes('Reveal phase is not finished yet'));
        }
    });
});