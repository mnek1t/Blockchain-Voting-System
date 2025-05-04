import { getContract } from "./ethers";
import { keccak256, AbiCoder, parseEther } from "ethers";

const vote = async (contractAddress: string, candidateId: string, salt: string) => {
    const contract = await getContract(contractAddress);
    const encoded = AbiCoder.defaultAbiCoder().encode(["string", "string"], [candidateId, salt]);
    const voteHash = keccak256(encoded);
    const tx = await contract.vote(voteHash, {
        value: parseEther("0.01"),
    });
    await tx.wait();
};

const endElection = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    const tx = await contract.endElection();
    await tx.wait();
};

const revealVote = async (contractAddress: string, candidateId: string, salt: string) => {
    const contract = await getContract(contractAddress);
    const tx = await contract.revealVote(candidateId, salt);
    await tx.wait();
};

const getResults = async (contractAddress: string) => {
    const contract = await getContract(contractAddress);
    return await contract.getResults();
};

export { vote, endElection, revealVote, getResults };
