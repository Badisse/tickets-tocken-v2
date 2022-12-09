import { useEth } from "../../contexts/EthContext";
import React, { useState } from "react"

import "../../styles/Hero.css"
import Input from "../base/TextInput"
import Button from "../base/Button"

function StakingInterface() {

    const { state: {tokenContract, web3, accounts} } = useEth()

    const [address, setAddress] = useState ()
    const [balance, setBalance] = useState ()
    const [recipient, setRecipient] = useState ()
    const [amount, setAmount] = useState ()

    const addressHandler = (e) => {
        setAddress(e.target.value)
    }

    const recipientHandler = (e) => {
        setRecipient(e.target.value)
    }

    const amountHandler = (e) => {
        setAmount(e.target.value)
    }

    const checkBalance = async (e) => {
        e.preventDefault()
        if (!web3.utils.isAddress(address)){
            alert ("please enter a valid address")
            return ; 
        }
        const userBalance = await tokenContract.methods.balanceOf(address).call()
        const ethValue = web3.utils.fromWei(userBalance.toString(), "ether")
        setBalance (ethValue)
    }

    const sendTokens = async (e) => {
        e.preventDefault()
        if (!web3.utils.isAddress(recipient)){
            alert ("please enter a valid address")
            return ; 
        }
        const weiValue = await web3.utils.toWei(amount.toString(), "ether")
        const transfer = await tokenContract.methods.transfer(recipient, weiValue).send({from : accounts[0]})
        if (!transfer.status) {
            alert("amount not transferred")
        }
        alert ("amount transferred")
    }

    return (
        <React.Fragment>
            <h5 id="header-subtext"> Check addresses balances </h5>
            <form onSubmit = {checkBalance}>
                <Input 
                width="250px"
                height="30px"
                placeholder = "address" 
                onChange = {addressHandler}/> 
                <Button
                width="200px" 
                height="30px" 
                textContent= "Check balance"/>
            </form>
            <h5 id="header-subtext"> {`${address} has ${balance} tokens`}</h5>
            <h5 id="header-subtext"> Send tokens </h5>
            <form onSubmit = {sendTokens}>
                <Input 
                width="250px"
                height="30px"
                placeholder = "recipient" 
                onChange = {recipientHandler} /> 
                <Input 
                width="250px"
                height="30px"
                placeholder = "amount" 
                onChange = {amountHandler} /> 
                <Button
                width="200px" 
                height="30px" 
                textContent= "Send tokens"/>
            </form>
        </React.Fragment>
    )

}

export default StakingInterface