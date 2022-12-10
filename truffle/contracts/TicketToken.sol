// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol" ;

contract TicketToken is ERC20{

    /// Total supply = 550 000 000
    /// All minted at token creation

    constructor (address multiSigWallet, uint totalSupply) ERC20 ("TicketToken", "TTK"){
        _mint (multiSigWallet, totalSupply*10**18) ;
    } 

}