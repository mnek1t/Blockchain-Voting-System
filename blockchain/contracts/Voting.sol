// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    struct Candidate {
        uint id;
        string name;
    }
    // need to store
    // 1. list of candidates
    Candidate[] private candidates; 
    // 2. duration of voting
    uint private startTime;
    uint private endTime;

    bool private isVotingFinished;

    mapping(address => bool) private hasVoted;
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
    //initialize all candidates and duration of voting
    constructor(string[] memory _candidatesNames, uint _duration) {
        for(uint i = 0; i < _candidatesNames.length; i++) {
            candidates.push(Candidate(i, _candidatesNames[i]));
        }
        startTime = block.timestamp;
        endTime =  startTime + _duration;
    }

    function vote(bytes32 _voteHash) external onlyDuringElectionTime {
        require(!hasVoted[msg.sender], "You have already voted");

        votesHashes[msg.sender] = _voteHash;
        hasVoted[msg.sender] = true;
        emit VoteCommitted(msg.sender);
    }

    function endElection() external onlyAfterElectionTime {
        require(!isVotingFinished, "Voting si already finished");
        isVotingFinished = true;
        emit VoteEnded();
    }
}