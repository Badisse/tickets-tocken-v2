// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol" ;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol" ; 

contract ICO is Ownable {

    IERC20 ttk ;
    
            // ::: ICO state variables :: // 

    uint decimals ; 
    uint public exchangeRate ; 
    uint public maxAmount ;
    uint public minAmount ; 
    uint public maxCap ; 
    uint public totalContribution ; 
    /// will be needed in case of a withdrawal of the TTK tokens is needed
    uint amountForSale ; 

            // ::: VESTING state variables ::: // 

    uint vestingStartingTime ; 
    uint vestingDuration ; 
    /// duration of a vesting step in seconds. 1 month here aka 4 weeks = 2419200 seconds
    uint stepDuration ; 

    address multiSigAddr ; 

    struct userInfo {
        bool whitelisted ; 
        /// amountBought also corresponds to the total amount of tokens to be vested
        uint amountBought ; 
        uint totalClaimed ; 
    }

    enum WorkflowStatus {
        RegisteringAddresses,
        IcoIsStarted,
        IcoIsEnded, 
        StartDistribution
    }

    WorkflowStatus public workflowStatus ;

    mapping (address => userInfo) public  UserInfo ; 

    constructor (
            address ttkAddress, 
            address _multiSigAddr,
            uint _decimals, 
            uint _minAmount,
            uint _maxAmount,
            uint _exchangeRate,
            uint _maxCap,
            uint _vestingDuration,
            uint _stepDuration
        ) {
        ttk = IERC20 (ttkAddress) ;
        decimals = _decimals ;
        minAmount = toWei(_minAmount) ; 
        maxAmount = toWei(_maxAmount) ;
        exchangeRate = _exchangeRate ; 
        maxCap = toWei(_maxCap) ; 
        multiSigAddr = _multiSigAddr ; 
        vestingDuration = _vestingDuration ;
        stepDuration = _stepDuration ;
    }
    
    event TokenPurchase (
        address purchaser,
        uint value
    ) ;

    event Claimed (
        address claimer,
        uint value
    ) ;

    event WorkflowStatusChange (
        address emitter
    ) ;

    receive() external payable {}

    modifier onlyWhitelisted () {
        require (UserInfo[msg.sender].whitelisted, "not whitelisted") ;
    _;
    }

        // ::: from Eth to Wei ::: // 

    function toWei (uint amount) private view returns (uint) {
        return amount*10**decimals ;
    }

        // ::: WHITELIST ADDRESSESS ::: //

    function whitelistAddress (address _address) external onlyOwner {
        require (workflowStatus == WorkflowStatus.RegisteringAddresses, "Can't list more addresses") ; 
        UserInfo[_address].whitelisted = true ; 
    }

    function removeFromWhitelist (address _address) external onlyOwner {
        require (workflowStatus == WorkflowStatus.RegisteringAddresses, "Can't unwhilist address");
        UserInfo[_address].whitelisted = false ; 
    }

        // ::: BUY TOKENS ::: //

    /// send tokens to the smart contract USING this function ///
    /// there will be an input field for it on the front ///
    function buyTokens () external payable onlyWhitelisted {
        require (workflowStatus == WorkflowStatus.IcoIsStarted, "ICO hasn't started yet or is finished") ;
        require (msg.value >= minAmount, "Not enough contribution") ;
        uint contributed = UserInfo[msg.sender].amountBought / exchangeRate ; 
        require (msg.value + contributed <= maxAmount, "you reached max cap") ;
        require (msg.value + totalContribution <= maxCap, "maxCap is reached or almost reached") ; 
        totalContribution += msg.value ; 
        UserInfo[msg.sender].amountBought += msg.value * exchangeRate ; 
        emit Claimed (msg.sender, msg.value) ;
    }

        // ::: CLAIM TOKENS ::: // 


    function claimTokens () external onlyWhitelisted {
        require (workflowStatus == WorkflowStatus.StartDistribution, "You can't claim your tokens yet") ;
        require (UserInfo[msg.sender].amountBought > 0, "No presale participation") ; 
        uint claimable = claimableAmount(msg.sender) ;
        UserInfo[msg.sender].totalClaimed += claimable ; 
        ttk.transfer(msg.sender, claimable) ; 
        emit Claimed(msg.sender, claimable);
    }

    function claimableAmount (address _address) public view returns (uint){
        if (block.timestamp >= vestingStartingTime + vestingDuration){
            return (UserInfo[_address].amountBought - 
            UserInfo[_address].totalClaimed) ;
        }
        else {
            uint timeLength = block.timestamp - vestingStartingTime ;
            uint vestedSteps = timeLength / stepDuration ; 
            uint vestedPeriod = vestedSteps * stepDuration ; 
            uint totalVestedAmount = UserInfo[_address].amountBought * vestedPeriod / vestingDuration ; 
            return totalVestedAmount - UserInfo[_address].totalClaimed ;
        }
    }


        // ::: ADMIN FUNCTION ::: // 
        // ::: WITHDRAW THE REMAINING TOKENS (ICO NOT SOLD OUT) + ETH ::: // 

    /** 
    * this is use in a very urgent situation like : we need to withdraw the tokens inside the contract
    * to migrate to an other ICO contract but we haven't properly labelled all the variables during deployment
    * then we need to manually set amountForSale to withdraw the right amount from the contract
    * 
    * OR it can be used if we want to withdraw the remaining tokens from the ICO 
    */ 
    function setAmountForSale (uint amount) external onlyOwner {
        amountForSale = toWei(amount) ; 
    }

    function withdrawRemaining () external onlyOwner {
        uint amountBought = totalContribution * exchangeRate ;
        uint remaining = amountForSale - amountBought ; 
        ttk.transfer(multiSigAddr, remaining) ; 
    }

    /// Collect the ETH raised 

    function withdrawEth () external onlyOwner {
        uint contractBalance = address(this).balance ; 
        (bool sent, ) = payable(msg.sender).call{value : contractBalance }("") ;
        require (sent, "ETH : transfer failed") ; 
    }

        // ::: STATE ::: //

    function startIco () external onlyOwner {
        require (workflowStatus == WorkflowStatus.RegisteringAddresses, "Ico can't start now");
        workflowStatus = WorkflowStatus.IcoIsStarted ; 
    }

    function endIco () external onlyOwner {
        require (workflowStatus == WorkflowStatus.IcoIsStarted, "Ico can't end now");
        workflowStatus = WorkflowStatus.IcoIsEnded ; 
    }

    function startTokenDistribution () external onlyOwner {
        require (workflowStatus == WorkflowStatus.IcoIsEnded, "Distribution cant start");
        vestingStartingTime = block.timestamp ; 
        workflowStatus = WorkflowStatus.StartDistribution ; 
    }

}