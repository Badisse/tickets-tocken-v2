
import { useEth } from "../../contexts/EthContext";
import Button from "../base/Button"
import "../../styles/Hero.css"
import React from "react";

const TokenDistribution = () => {

    const { state: { accounts, icoContract, web3 } } = useEth()

    const claimHandler = async () => {
        const tx = await icoContract.methods.withdrawEth().send({from : accounts[0]})
        if (!tx.status){
            alert ("transfer unsuccessful")
        }
        alert ("transfer successful")
    }

    return (
        <React.Fragment>
            <h5 id="header-subtext"> Claim the moula you raised </h5>
            <Button 
            width ="150px"
            height = "30px"
            onClick = {claimHandler} 
            textContent = "Get the ETHs"> </Button>
        </React.Fragment>

    )
}

export default TokenDistribution