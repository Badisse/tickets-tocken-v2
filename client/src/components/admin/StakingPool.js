import { useEth } from "../../contexts/EthContext";
import React, { useEffect, useState } from "react"

import "../../styles/Hero.css"

import Input from "../base/TextInput"
import Button from "../base/Button"

function StakingPool(props) {

    const { state: { accounts, singleStakingContract, web3 } } = useEth()

    const [rewardRate, setRewardRate] = useState()
    const [timelock, setTimelock] = useState()
    const [currentRR, setCurrentRR] = useState()
    const [APR, setAPR] = useState ()
    const [poolId, setPoolId] = useState()

    const setUpPool = async (e) => {
        e.preventDefault()
        if (rewardRate <= 0) {
            alert("please input a positiv reward rate")
        }
        const weiValue = await web3.utils.toWei(rewardRate.toString(), "ether")
        const poolSet = await singleStakingContract.methods.setPool(
            poolId,
            weiValue,
            timelock
        ).send({ from: accounts[0] })
        if (!poolSet.status) {
            alert("reward rate unchanged")
        }
        alert("reward rate changed successfully")
    }

    const rewardRateHandler = (e) => {
        setRewardRate(e.target.value)
    }

    const timeLockHandler = (e) => {
        setTimelock(e.target.value)
    }

    const updatePoolId = async () => {
        switch (props.lockUp) {
            case "No lock-up":
                setPoolId(1)
                break
            case "1 month lock-up":
                setPoolId(2)
                break
            case "3 months lock-up":
                setPoolId(3)
                break
            case "6 months lock-up":
                setPoolId(4)
                break
        }
    }

    useEffect(() => {
        updatePoolId()
    }, [props])

    useEffect(() => {
        setTimeout(async () => {
            const thisPool = await singleStakingContract.methods.getPoolInfos(1).call()
            const rate = thisPool.rewardRate
            if (thisPool.totalStaked !== 0) {
                let APY = ((365 * 24 * 60 * 60 * (rate
                / thisPool.totalStaked)) * 100)
                setAPR(APY)
            }
            setCurrentRR(web3.utils.fromWei(rate, "ether"))
        }, 100)
    }, [props, setUpPool])

    return (
        <React.Fragment>
            <form onSubmit={setUpPool}>
                <Input
                    onChange={rewardRateHandler}
                    width="250px"
                    height="30px"
                    placeholder="rewardRate (tokens/second)" />
                <Input
                    onChange={timeLockHandler}
                    width="250px"
                    height="30px"
                    placeholder="lock-up time (seconds)" />
                <Button
                    width="200px"
                    height="30px"
                    textContent="setPool" />
            </form>
            <h5 id="header-subtext"> {`current reward rate = ${currentRR} tokens / second`}</h5>
            <h5 id="header-subtext"> {`current APR = ${APR} %`}</h5>
        </React.Fragment>
    )

}


export default StakingPool 