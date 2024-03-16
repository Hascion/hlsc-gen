// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Halscion is ERC20("Halscion", "HLSC"){
    mapping(address => uint256) _stakeTimestamp;
    mapping(address => uint256) _totalStake;
    uint256 _rewardRate = 1;
    
    constructor (uint256 amount) {
        _mint(msg.sender, amount);
    }

    function stake(uint256 amount) public {
        // Checks: staked amount, balance of staker
        require(amount > 0, "Cannot stake 0.");
        require(balanceOf(msg.sender) >= amount, "Insufficient Balance");

        // Transfer from the staker to this contract
        _transfer(msg.sender, address(this), amount);
        _totalStake[msg.sender] += amount;

        // Only set stake timestamp if none before
        if (_stakeTimestamp[msg.sender] == 0) {
            _stakeTimestamp[msg.sender] = block.timestamp;
        }
    }

    function getCurrentReward(address staker) public view returns (uint256) {
        // Returns the current amount of reward based on time elapsed
        require(_totalStake[staker] > 0, "No stakes for this sender");
        uint256 reward = (block.timestamp - _stakeTimestamp[staker]) * _rewardRate;
        return reward;
    }

    function withdraw() public {
        // Withdraw rewards and return stake
        
        // Mint reward tokens
        _mint(msg.sender, getCurrentReward(msg.sender));

        // Return stake to owner and reset stake amount
        _transfer(address(this), msg.sender, _totalStake[msg.sender]);
        _totalStake[msg.sender] = 0;
    }

}