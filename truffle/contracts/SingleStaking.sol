// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol" ;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol" ; 

        // ::: STAKING CONTRACT :: //

/// The staking contract below will cover 4 lockup possibilities. 
/// they can be defined after contract deployment
/// Pool 0 has by definition no token lockup period

contract SingleStaking is Ownable {

    IERC20 stakingToken ; 

    uint totalRewarded ; 
    uint totalRewards ;


    struct userInfo {
        /// user staked balance
        uint balance ; 
        /// user rewards 
        uint rewards ; 
        /// when the user started to stake
        uint startingTime ; 
        /// needed to calculate and update the rewards correctly
        uint prevRewardPerToken ; 
    }

    struct poolInfo {
        /// pool's total tokens staked inside
        uint totalStaked ; 
        /// pool's number of tokens rewarded per second 
        uint rewardRate ; 
        /// accumulation of the reward rates 
        uint rewardPerTokenStaked ; 
        /// change time marker
        uint lastUpdate ; 
        /// locukup period of the pool 
        uint lockUpPeriod ; 
    }

    /// PoolInfo contains the different pool infos of each pool
    poolInfo[4] public PoolInfo ; 

    /// We keep users infos for each pool. Uint : pool idx
    mapping (uint => mapping (address => userInfo)) public UserInfo;

    constructor (address _ttkAddress){
        stakingToken = IERC20 (_ttkAddress) ; 
    }

        /// ::: REWARDS TRACKING AND UPDATES ::: ///

    modifier updateRewards (uint pIdx, address _address) {
        PoolInfo[pIdx].rewardPerTokenStaked = rewardPerTokenStaked(pIdx) ;
        PoolInfo[pIdx].lastUpdate = block.timestamp ; 
        if (_address != address(0)){
            UserInfo[pIdx][_address].rewards = earned (_address, pIdx) ; 
            UserInfo[pIdx][_address].prevRewardPerToken = PoolInfo[pIdx].rewardPerTokenStaked ; 
        }
        _;
    }

    function rewardPerTokenStaked (uint pIdx) public view returns (uint) {
        if (PoolInfo[pIdx].totalStaked == 0){
            return PoolInfo[pIdx].rewardPerTokenStaked ; 
        }
        uint _lastUpdate = PoolInfo[pIdx].lastUpdate ;
        uint _rewardRate = PoolInfo[pIdx].rewardRate ;
        uint _rewardPerTokenStaked = PoolInfo[pIdx].rewardPerTokenStaked ;
        uint _totalStaked = PoolInfo[pIdx].totalStaked ; 
        return (_rewardPerTokenStaked + (block.timestamp - _lastUpdate) * _rewardRate * 10**18
        / _totalStaked) ; 
    }

    function earned (address _address, uint pIdx) public view returns (uint){
        uint _balance = UserInfo[pIdx][_address].balance ; 
        uint _prevRewardPerToken = UserInfo[pIdx][_address].prevRewardPerToken ; 
        uint _rewards = UserInfo[pIdx][_address].rewards ; 
        return _rewards + (_balance * (rewardPerTokenStaked(pIdx) - _prevRewardPerToken) / 10**18) ;
    }

            /// ::: POOLS INITIAL SETUP ::: ///
    
    /// TO BE RAN BEFORE ANY OTHER FUNCTION AND BEFORE ANY OTHER USER DEPOSITED FUNDS : 
    /// Issue : if a user deposits funds there before us, it's not working
    function setTotalRewards() external onlyOwner {
        totalRewards += stakingToken.balanceOf(address(this)) ; 
    }

    /// this is a function for the owner to create the staking pools
    /// the pools must be initiated in the following order : 
    /// 1) no lock-up 2) 1 month lock-up 3) 3 months lock-up 4) 6 months lock-up 5) LP staking pool
    function setPool (uint pIdx, uint _rewardRate, uint _lockUpPeriod) external onlyOwner {
        poolInfo memory poolinfo ; 
        poolinfo.rewardRate = _rewardRate ; 
        poolinfo.lockUpPeriod = _lockUpPeriod ; 
        PoolInfo[pIdx] = poolinfo ; 
    }


            /// ::: POOLS UPDATES ::: ///

    function updatePoolReward (uint pIdx, uint _rewardRate) external onlyOwner updateRewards(pIdx, address(0)) {
        require (PoolInfo[pIdx].rewardRate != _rewardRate, "same RewardRate than before") ;
        PoolInfo[pIdx].rewardRate = _rewardRate ; 
        PoolInfo[pIdx].lastUpdate = block.timestamp ; 
        
    }


            /// ::: USERS FUNCTIONS FOR SINGLE STAKING ::: ///

    function resetUserTimer (uint pIdx) private {
        UserInfo[pIdx][msg.sender].startingTime = block.timestamp ; 
    }

    function stake(uint pIdx, uint _amount) external updateRewards (pIdx, msg.sender) {
        require(_amount > 0, "amount = 0");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        resetUserTimer (pIdx) ; 
        UserInfo[pIdx][msg.sender].balance += _amount ; 
        PoolInfo[pIdx].totalStaked += _amount ; 
    }

    function withdraw(uint pIdx, uint _amount) external updateRewards (pIdx, msg.sender) {
        require(_amount > 0, "amount = 0");
        uint _startingTime = UserInfo[pIdx][msg.sender].startingTime ;
        uint _lockUpPeriod = PoolInfo[pIdx].lockUpPeriod;
        require (block.timestamp >= _startingTime + _lockUpPeriod, "can't unstake now, wait until your lock-up is finished") ; 
        UserInfo[pIdx][msg.sender].balance -= _amount ; 
        PoolInfo[pIdx].totalStaked -= _amount ; 
        stakingToken.transfer(msg.sender, _amount) ;
    }

    function claimRewards (uint pIdx) external updateRewards(pIdx, msg.sender){
        uint reward = UserInfo[pIdx][msg.sender].rewards ;
        uint _startingTime = UserInfo[pIdx][msg.sender].startingTime ;
        uint _lockUpPeriod = PoolInfo[pIdx].lockUpPeriod;
        require (block.timestamp >= _startingTime + _lockUpPeriod, "can't unstake now, wait until your lock-up is finished") ; 
        if (reward > 0){
            UserInfo[pIdx][msg.sender].rewards = 0 ; 
            stakingToken.transfer(msg.sender, reward) ; 
            totalRewarded += reward ; 
        }
    }

            /// ::: SPECIAL ADMIN FUNCTION ::: ///
    
    /// This function is to be used ONLY for emergency purpose
    /// By executing it, the contract owner (the team) is able to withdraw 
    /// all staking rewards from this contract

    function emergencyWithdrawal () external onlyOwner {
        /// that way we don't withdraw users from the contract, only the remaining rewards
        uint remaining = totalRewards - totalRewarded ;
        stakingToken.transfer(msg.sender, remaining) ; 
    }
}