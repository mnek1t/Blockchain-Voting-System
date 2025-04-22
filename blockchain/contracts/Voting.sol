// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    // need to store
    // 1. list of candidates
    Candidate[] private candidates; 
    // 2. duration of voting
    uint private startTime;
    uint private endTime;

    bool private isVotingFinished;

    uint private depositAmount = 0.01 ether; // deposit is taken after commiting a vote. It must be returned after revealing the vote.
    address payable private governmentAddressBudget; // this address will receive the deposit amount. Should be accessable by only the owner of the contract.
    address private owner;

    mapping(address => bool) private hasVoted;
    mapping(address => bool) private hasRevealed;
    mapping(address => bytes32) private votesHashes;

    event VoteCommitted(address voter);
    event VoteRevealed(address voter, uint candidateId);
    event VoteEnded();

    modifier onlyDuringElectionTime() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Voting is not allowed now");
        _;
    }

    modifier onlyDuringRevealPhase() {
        require(isVotingFinished, "Reveal stage is not started yet");
        _;
    }
    
    modifier onlyAfterElectionTime() {
        require(block.timestamp > endTime, "Voting is not finished yet");
         _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    // initialize all candidates and duration of voting. MUST be available only for the owner of the contract - adming - government.
    constructor(string[] memory _candidatesNames, uint _duration, address payable _governmentAddressBudget) {
        owner = msg.sender;
        governmentAddressBudget = _governmentAddressBudget;
        for(uint i = 0; i < _candidatesNames.length; i++) {
            candidates.push(Candidate(i, _candidatesNames[i], 0));
        }
        startTime = block.timestamp;
        endTime =  startTime + _duration;
    }

    function vote(bytes32 _voteHash) external payable onlyDuringElectionTime {
        require(!hasVoted[msg.sender], "You have already voted");
        require(msg.value == depositAmount, "Deposit amount is not correct");

        votesHashes[msg.sender] = _voteHash;
        hasVoted[msg.sender] = true;
        emit VoteCommitted(msg.sender);
    }

    function endElection() external onlyAfterElectionTime {
        require(!isVotingFinished, "Voting si already finished");
        isVotingFinished = true;
        emit VoteEnded();
    }

    function revealVote(uint _candidateId, string memory _salt) external onlyDuringRevealPhase {
        require(hasVoted[msg.sender], "You have not voted yet");
        require(!hasRevealed[msg.sender], "Vote already revealed");
        require(keccak256(abi.encodePacked(_candidateId, _salt)) == votesHashes[msg.sender], "Vote hash is not correct");

        candidates[_candidateId].voteCount++;
        hasRevealed[msg.sender] = true;
        payable(msg.sender).transfer(depositAmount);

        emit VoteRevealed(msg.sender, _candidateId);
    }

    function withdrawToGovernmentBudget() external onlyOwner onlyAfterElectionTime {
        require(isVotingFinished, "Voting is not finished yet");
        governmentAddressBudget.transfer(address(this).balance);
    }

    function getResults() external view onlyAfterElectionTime returns(Candidate[] memory) {
        return candidates;
    }
}