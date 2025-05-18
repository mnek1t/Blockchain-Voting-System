// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Voting {
    struct Candidate {
        string id;
        string name;
        uint voteCount;
    }
    // need to store
    // 1. list of candidates
    Candidate[] private candidates; 
    // 2. duration of voting
    uint private startTime;
    uint private endTime;
    uint private revealEndTime;
    uint private revealDuration;

    bool private isVotingFinished;

    uint private depositAmount = 0.01 ether; // deposit is taken after commiting a vote. It must be returned after revealing the vote.
    address payable private governmentAddressBudget; // this address will receive the deposit amount. Should be accessable by only the owner of the contract.
    address private owner;

    mapping(address => bool) private hasVoted;
    mapping(address => bool) private hasRevealed;
    mapping(address => bytes32) private votesHashes;

    event VoteCommitted(address voter);
    event VoteRevealed(address voter, string candidateId);
    event VoteEnded();

    modifier onlyDuringElectionTime() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Voting is not allowed anymore! Time is up!");
        _;
    }

    modifier onlyDuringRevealPhase() {
        require(isVotingFinished, "Reveal stage has not started yet!");
        require(block.timestamp <= revealEndTime, "Reveal phase is over!");
        _;
    }
    
    modifier onlyAfterElectionTime() {
        require(block.timestamp > endTime, "Voting has not finished yet!");
         _;
    }

    modifier onlyAfterRevealPhase() {
        require(block.timestamp > revealEndTime, "Revealing has not finished yet!");
        require(block.timestamp > endTime, "Voting has not finished yet!");
         _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function!");
        _;
    }

    modifier onlyVoter() {
        require(msg.sender != governmentAddressBudget, "Government Account cannot participate in voting!");
        _;
    }

    // initialize all candidates and duration of voting. MUST be available only for the owner of the contract - adming - government.
    constructor(Candidate[] memory _candidates, uint _duration, address payable _governmentAddressBudget, uint _revealDuration) {
        require(_candidates.length > 0, "Candidates are required!");
        owner = msg.sender;
        require(owner != _governmentAddressBudget, "Cannot deploy from government account!");
        
        governmentAddressBudget = _governmentAddressBudget;
        for (uint i = 0; i < _candidates.length; i++) {
            candidates.push(
                Candidate({
                    id: _candidates[i].id,
                    name: _candidates[i].name,
                    voteCount: _candidates[i].voteCount
                })
            );
        }
        startTime = block.timestamp;
        endTime =  startTime + _duration;
        revealDuration = _revealDuration;
    }

    function vote(bytes32 _voteHash) external payable onlyDuringElectionTime onlyVoter{
        require(!hasVoted[msg.sender], "You have already voted!");
        require(msg.value == depositAmount, "Deposit amount is not correct!");

        votesHashes[msg.sender] = _voteHash;
        hasVoted[msg.sender] = true;
        emit VoteCommitted(msg.sender);
    }

    function endElection() external onlyAfterElectionTime {
        require(!isVotingFinished, "Voting is already finished!");
        isVotingFinished = true;
        revealEndTime = block.timestamp + revealDuration;
        emit VoteEnded();
    }

    function revealVote(string memory _candidateId, string memory _salt) external onlyDuringRevealPhase {
        require(hasVoted[msg.sender], "You have not voted earlier, you cannot reveal any vote!");
        require(!hasRevealed[msg.sender], "Vote already revealed!");
        require(
            keccak256(abi.encodePacked(_candidateId, _salt)) == votesHashes[msg.sender],
            "Vote hash is not correct"
        );

        bool found = false;
        for(uint i = 0; i < candidates.length; i++) {
            if(keccak256(abi.encodePacked(candidates[i].id)) == keccak256(abi.encodePacked(_candidateId))) {
                found = true;
                candidates[i].voteCount++;
                break;
            }
        }
        require(found == true, 'Candidate does not exist with this id!');
        hasRevealed[msg.sender] = true;
        payable(msg.sender).transfer(depositAmount);

        emit VoteRevealed(msg.sender, _candidateId);
    }

    function withdrawToGovernmentBudget() external onlyOwner onlyAfterRevealPhase {
        require(isVotingFinished, "Voting is not finished yet!");
        require(block.timestamp > revealEndTime, "Reveal phase is not finished yet!");
        governmentAddressBudget.transfer(address(this).balance);
    }

    function getResults() external view onlyAfterRevealPhase returns(Candidate[] memory) {
        return candidates;
    }

    // TODO: Delete
    function getVotingTimestamps() external view returns (uint _startTime, uint _endTime, uint _revealEndTime) {
        return (startTime, endTime, revealEndTime);
    }

    function getIsVotingFinished() external view returns (bool) {
        return isVotingFinished;
    }

    function getDepositAmount() external view returns (uint) {
        return depositAmount;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function getGovernmentAddress() external view returns (address) {
        return governmentAddressBudget;
    }
    
    function hasAddressVoted(address _addr) external view returns (bool) {
        return hasVoted[_addr];
    }

    function hasAddressRevealed(address _addr) external view returns (bool) {
        return hasRevealed[_addr];
    }
}