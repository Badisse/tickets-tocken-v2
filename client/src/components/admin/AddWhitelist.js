import { useEth } from "../../contexts/EthContext";
import React, { useState } from "react"

import "../../styles/Hero.css"

import Input from "../base/TextInput"
import Button from "../base/Button"


function AddWhitelist (){

    const { state: { accounts, icoContract, web3 } } = useEth()
    const [address, setAddress] = useState()
    const addressZero = "0x0000000000000000000000000000000000000000"

    const whitelistAddress = async (e) => {
        e.preventDefault()
        if (!web3.utils.isAddress(address) || address === addressZero) {
            alert("please enter a valid address")
            return;
        }
        await icoContract.methods.whitelistAddress(address).send({ from: accounts[0] })
        alert(`${address} whitelisted with success`)
    }

    const addressHandler = (e) => {
        setAddress(e.target.value)
    }

    return (
        <React.Fragment>
            <h5 id="header-subtext"> Time to whitelist some addresses before the ICO start</h5>
            <form onSubmit={whitelistAddress}>
                <Input
                    onChange={addressHandler}
                    width="250px"
                    height="30px"
                    placeholder="address" />
                <Button
                    width="200px"
                    height="30px"
                    textContent="whitelist address" />
            </form>
        </React.Fragment>
    )
}

export default AddWhitelist