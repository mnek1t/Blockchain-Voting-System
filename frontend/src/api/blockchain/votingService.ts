import { getContract } from "./ethers";
import { parseEther, solidityPackedKeccak256  } from "ethers";
const vote = async (contractAddress: string, candidateId: string, salt: string) => {
    const contract = await getContract(contractAddress);
    const voteHash = solidityPackedKeccak256(["string", "string"], [candidateId, salt]);

    await contract.vote.staticCall(voteHash, {
        value: parseEther("0.01"),
    });
    
    const tx = await contract.vote(voteHash, {
        value: parseEther("0.01"),
    });
    await tx.wait();
};

const endElection = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    await contract.endElection.staticCall();
    const tx = await contract.endElection();
    
    await tx.wait();
};

const revealVote = async (contractAddress: string, candidateId: string, salt: string) => {
    const contract = await getContract(contractAddress);
    await contract.revealVote.staticCall(candidateId, salt);
    const tx = await contract.revealVote(candidateId, salt);
    await tx.wait();
};

const withdrawToGovernmentBudget = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    await contract.withdrawToGovernmentBudget.staticCall();
    await contract.withdrawToGovernmentBudget();
};

const getResults = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    await contract.getResults.staticCall();
    return await contract.getResults();
};

const getVotingTimestamps = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    return await contract.getVotingTimestamps();
};

const getIsVotingFinished = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    return await contract.getIsVotingFinished();
};

const getDepositAmount = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    return await contract.getDepositAmount();
};

const getOwner = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    return await contract.getOwner();
};

const getGovernmentAddress = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    return await contract.getOwner();
};
const hasAddressVoted = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    return await contract.hasAddressVoted('0x4323CB3C55b6f6B5290251FBfF128d476bB6122c');
};
const hasAddressRevealed = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    return await contract.hasAddressRevealed('0x4323CB3C55b6f6B5290251FBfF128d476bB6122c');
};

export { vote, endElection, revealVote, withdrawToGovernmentBudget, getResults,
    getVotingTimestamps,getIsVotingFinished, getDepositAmount, getGovernmentAddress, getOwner, hasAddressRevealed, hasAddressVoted
 };
