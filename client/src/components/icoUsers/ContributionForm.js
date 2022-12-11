import { useEth } from "../../contexts/EthContext";
import React, { useState, useEffect } from "react"

import "../../styles/Hero.css"

import Input from "../base/TextInput"
import Button from "../base/Button"

function AddWhitelist (){

    const { state: { accounts, icoContract, web3 } } = useEth()
    const [contribution, setContribution] = useState()
    const [amount, setAmount] = useState()

    const buyTokens = async (e) => {
        e.preventDefault()
        if (!(amount > 0)) {
            alert("please enter a positiv amount")
            return;
        }
        const weiValue = await web3.utils.toWei(amount.toString(), "ether")
        await icoContract.methods.buyTokens().send({from: accounts[0], value : weiValue})
        alert(`you just contributed ${amount} ETH`)
        getContribution()
    }

    const amountHandler = (e) => {
        setAmount(e.target.value)
    }

    const getContribution = async () => {
        const weiContribution = (await icoContract.methods.UserInfo(accounts[0]).call()).amountBought
        const exchangeRate = await icoContract.methods.exchangeRate.call().call()
        const ethValue = await web3.utils.fromWei((weiContribution / exchangeRate).toString(), "ether")
        setContribution(ethValue)
    }

    useEffect (() => {
        getContribution()
    }, [])

    return (
        <React.Fragment>
              <h5 id="header-subtext"> {`ANY TOKENS SENT DIRECTLY TO THE ICO CONTRACT ADDRESS WILL BE LOST`} </h5>
            <h5 id="header-subtext"> {`You can buy up to 100000 tokens for 10 ETH. Your contribution so far : ${contribution} ETH`} </h5>
            <h5 id="header-subtext"> Contribute below </h5>
            <form onSubmit={buyTokens}>
                <Input
                    onChange={amountHandler}
                    width="250px"
                    height="30px"
                    placeholder="Amount in ETH" />
                <Button
                    width="200px"
                    height="30px"
                    textContent="Contribute" />
            </form>
        </React.Fragment>
    )
}

export default AddWhitelist