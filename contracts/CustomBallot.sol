// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;



/// @notice Allows you to get the past votes for a specific candidate.
interface IERC20Votes {
    // function getVotes(address) external returns (uint256);
    function getPastVotes(address, uint256) external returns (uint256);
}

/// @title A ballot contract
/// @author TechieTeee#1534
/// @notice Custom Ballot contract for the voting system.
/// @dev All functions are for the voting system.
/// @custom:experimental This is an experiemental custom ballot contract: HW
contract CustomBallot {
    /// @notice Called when a vote is cast.
    event Voted(
        address indexed voter,
        uint256 indexed proposal,
        uint256 weight,
        uint256 proposalVotes
    );

    address public voter;

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    mapping(address => uint256) public spentVotePower;

    Proposal[] public proposals;
    IERC20Votes public voteToken;
    uint256 public referenceBlock;

    constructor(bytes32[] memory proposalNames, address _voteToken) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
        voteToken = IERC20Votes(_voteToken);
        referenceBlock = block.number;
    }

    /// @notice function to cast a vote.
    /// @dev This function is called by the voter (if they have voting power) and emits their vote.
    function vote(uint256 proposal, uint256 amount) external {
        uint256 votingPowerAvailable = votingPower();
        require(votingPowerAvailable >= amount, "Has not enough voting power");
        spentVotePower[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
        emit Voted(msg.sender, proposal, amount, proposals[proposal].voteCount);
    }

    /// @notice function that returns the winning proposal.
    /// @dev returns a uint256 that is the index of the proposal with the most votes (winningProposal).
    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /// @notice function that returns the winning proposal name
    /// @dev returns a bytes32 that is the name of the proposal with the most votes (winningProposalName).
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    /// @notice function that returns the voting power of the voter at the current block.
    /// @dev returns a uint256 that is the voting power of the voter at the current block.
    function votingPower() public returns (uint256 _votingPower) {
        _votingPower = voteToken.getPastVotes(msg.sender, referenceBlock);
        _votingPower = _votingPower - spentVotePower[msg.sender];
    }
}