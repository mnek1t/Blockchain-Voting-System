
import {ethers} from 'ethers'
import VotingAbi from '../../abi/VotingAbi.json'
import VotingBytecode from '../../abi/VotingBytecode.json'

declare global {
    interface Window {
        ethereum?: any;
    }
}

const createElection = async(
    candidates: string[], 
    durationInSeconds: number, 
    governmentBudgetAddress: string = '0xE9DD3570aEd496fde77EE174D7DF636e334F17FE'
) : Promise<string> => {
    if(!window.ethereum) throw new Error("Metamask not found");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await  provider.getSigner();

    const factory = new ethers.ContractFactory(
        VotingAbi.abi,
        VotingBytecode.bytecode,
        signer
    )
    const contract = await factory.deploy(candidates, durationInSeconds, governmentBudgetAddress);
    await contract.waitForDeployment();

    const deployedAddress = await contract.getAddress();
    return deployedAddress;
}

const connectWallet = async (): Promise<string | undefined> => {
    if (window.ethereum) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            return signer.address;
        } catch (err) {
            console.log('User rejected the request', err);
        }
    } else {
        alert("MetaMask is not installed");
    }
};

let getContract = async (address: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(address, VotingAbi.abi, signer);
}

export { createElection, connectWallet, getContract };