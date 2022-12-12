import { useEth } from "../../contexts/EthContext";
import React, { useEffect, useState } from "react"

import Button from "../base/Button"

const ClaimingPage = () => {

    const { state: { accounts, icoContract, web3 } } = useEth()
    const [contribution, setContribution] = useState()
    const [claimable, setClaimable] = useState()
    const [vestingPeriod, setVestingPeriod] = useState()
    const [remainingTime, setRemainingTime] = useState()

    const getAmounts = async () => {
        const weiContribution = (await icoContract.methods.UserInfo(accounts[0]).call()).amountBought
        const ethContribution = await web3.utils.fromWei((weiContribution).toString(), "ether")
        setContribution(ethContribution)

        const weiClaimable = await icoContract.methods.claimableAmount(accounts[0]).call()
        const ethClaimable = await web3.utils.fromWei((weiClaimable).toString(), "ether")
        setClaimable(ethClaimable)
    }

    useEffect(() => {
        getAmounts()
    }, [getAmounts])

    const getPeriods = async () => {
        const time0 = await icoContract.methods.vestingStartingTime.call().call()
        const vestingTime = await icoContract.methods.vestingDuration.call().call()
        setVestingPeriod(vestingTime / 60)
        const stepDuration = await icoContract.methods.stepDuration.call().call()
        console.log(time0)
        console.log(stepDuration)
        const now = (Math.floor(Date.now()/1000))
        const nextStep = Math.ceil((now - time0) / stepDuration)
        console.log(nextStep)
        setRemainingTime(((time0 + nextStep * stepDuration) - now) / 60)
        console.log((time0 + (nextStep * stepDuration)))
        console.log(now)
    }

    useEffect(() => {
        getPeriods()
    }, [])

    const claimTokens = async () => {
        const tx = await icoContract.methods.claimTokens().send({from : accounts[0]})
        if (!tx.status){
            alert ("cannot claim now")
            return ;
        }
        alert (`successfully claimed ${claimable}`)
    }

    return (
        <React.Fragment>
            <h5 id="header-subtext"> {`You purchased ${contribution} TTK, vested over ${vestingPeriod} minutes`} </h5>
            <h5 id="header-subtext"> {claimable === 0 ? `Need to wait an other ${remainingTime} minutes` : 
                `Claimable amount : ${claimable} TTK`} </h5>
            <h5 id="header-subtext"> {`Need to wait an other ${remainingTime} minutes`} </h5>

            <Button
                width="200px"
                height="30px"
                onClick = {claimTokens}
                textContent="Claim tokens" />
        </React.Fragment>
    )
}

export default ClaimingPage