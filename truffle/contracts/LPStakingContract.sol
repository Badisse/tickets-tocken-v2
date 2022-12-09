// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol" ;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol" ; 

contract LPStakingContract is Ownable {

    /// stakingToken : lp token TTK - ETH (or TTK - MATIC) or whatever pair we will create 
    IERC20 public stakingToken ;
    /// rewardToken : TTK
    IERC20 public rewardToken ;

    uint public updatedAt;
    uint public rewardRate ;
    uint public rewardPerTokenStored;
    uint public totalSupply;

    uint totalRewarded ; 
    uint totalToBeRewarded ;

    mapping(address => uint) public balanceOf;
    mapping(address => uint) public userRewardPerTokenPaid;
    mapping(address => uint) public rewards;

    constructor(address _ttkToken, address _stakingToken, uint initialRewardRate) {
        stakingToken = IERC20(_stakingToken) ;
        rewardToken = IERC20(_ttkToken) ; 
        rewardRate = initialRewardRate ; 
    }

    modifier updateReward(address _account) {
        rewardPerTokenStored = rewardPerToken();
        updatedAt = block.timestamp;
        if (_account != address(0)) {
            rewards[_account] = earned(_account);
            userRewardPerTokenPaid[_account] = rewardPerTokenStored;
        }
        _;
    }


    /** manually set the rewardRate
    * rewardRate = tokens rewarded per second
    */
    function setRewardRate (uint _rewardRate) external onlyOwner updateReward(address(0)){
        rewardRate = _rewardRate ; 
    }


                /// ::: POOLS INITIAL SETUP ::: ///
    
    /// TO BE RAN BEFORE ANY OTHER FUNCTION AND BEFORE ANY OTHER USER DEPOSITED FUNDS : 
    /// Issue : if a user deposits funds there before us, it's not working
    function setTotalRewards() external onlyOwner {
        totalToBeRewarded += stakingToken.balanceOf(address(this)) ; 
    }

    function rewardPerToken() public view returns (uint) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored +
            (rewardRate * (block.timestamp - updatedAt) * 1e18) / totalSupply;
    }

    function stake(uint _amount) external updateReward(msg.sender) {
        require(_amount > 0, "amount = 0");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
        totalSupply += _amount;
    }

    function withdraw(uint _amount) external updateReward(msg.sender) {
        require(_amount > 0, "amount = 0");
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }

    function earned(address _account) public view returns (uint) {
        return
            ((balanceOf[_account] *
                (rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18) +
            rewards[_account];
    }

    function getReward() external updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.transfer(msg.sender, reward);
        }
    }


                /// ::: SPECIAL ADMIN FUNCTION ::: ///
    
    /// This function is to be used ONLY for emergency purpose
    /// By executing it, the contract owner (the team) is able to withdraw 
    /// all staking rewards from this contract

    function emergencyWithdrawal () external onlyOwner {
        /// that way we don't withdraw users from the contract, only the remaining rewards
        uint remainingRewards = totalToBeRewarded - totalRewarded ; 
        rewardToken.transfer(msg.sender, remainingRewards) ; 
    }

}