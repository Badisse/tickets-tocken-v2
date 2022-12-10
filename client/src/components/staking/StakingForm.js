
import { useEth } from "../../contexts/EthContext";
import React, { useEffect, useState } from "react"

import "../../styles/Hero.css"

import StakingDetails from "./StakingDetails"
import Input from "../base/TextInput"
import Button from "../base/Button"

const StakingForm = (props) => {

    const { state: { accounts, tokenContract, singleStakingContract, web3 } } = useEth()

    const [poolId, setPoolId] = useState()
    const [APR, setAPR] = useState()
    const [hasApproved, setHasApproved] = useState()
    const [amount, setAmount] = useState()
    const [balance, setBalance] = useState("your balance")
    const [event, setEvent] = useState()

    const isItApproved = async () => {
        let allowance = await tokenContract.methods.allowance(accounts[0], singleStakingContract._address).call()
        setHasApproved(allowance > 0 ? true : false)
    }

    useEffect(() => {
        isItApproved()
    }, [])

    const onApprove = async (e) => {
        e.preventDefault()
        const infinity = await web3.utils.toWei("500000000", "ether")
        const approval = await tokenContract.methods.approve(singleStakingContract._address, infinity).send({from : accounts[0]})
        if (!approval.status) {
            alert("not approved")
        }
        alert("approval done, you can stake your tokens now")
        isItApproved ()
    }

    const amountHandler = (e) => {
        setAmount(e.target.value)
    }

    const onStake = async (e) => {
        e.preventDefault()
        if (amount <= 0) {
            alert("please input a positiv amount")
        }
        const weiValue = await web3.utils.toWei(amount.toString(), "ether")
        const stakingTx = await singleStakingContract.methods.stake(
            poolId,
            weiValue
        ).send({ from: accounts[0] })
        if (!stakingTx.status) {
            alert("amount not staked")
        }
        alert(`successfully staked ${weiValue}`)
        getBalance()
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

    const getBalance = async () => {
        const userBalance = await tokenContract.methods.balanceOf(accounts[0]).call()
        const ethValue = web3.utils.fromWei(userBalance.toString(), "ether")
        setBalance (ethValue)
    }

    const captureBalanceUpdate= async() => {
        const balanceUpdate = await tokenContract.events.Transfer(
            {fromBlock : "earliest", from : accounts[0], to : accounts[0]}
        )
        balanceUpdate.on("data", e => {
            setEvent(e)
        })
    }

    useEffect(() => {
        getBalance()
        captureBalanceUpdate()
    },[event])

    useEffect(() => {
        setTimeout(async () => {
            if (!poolId){
                return ;
            }
            const thisPool = await singleStakingContract.methods.getPoolInfos(poolId).call()
            const rate = thisPool.rewardRate
            if (thisPool.totalStaked !== 0) {
                let APY = ((365 * 24 * 60 * 60 * (rate
                    / thisPool.totalStaked)) * 100)
                setAPR(APY)
            }
        }, 100)
    }, [poolId])


    return (
        <React.Fragment>
            <h5 id="header-subtext"> {`current APR = ${APR} %`}</h5>
            <h5 id="header-subtext"> 
            {hasApproved ? "enter below the amount you will stake" : "you must approve first"} </h5>
            <form onSubmit={hasApproved ? onStake : onApprove}>
                <Input
                    onChange={amountHandler}
                    disabled={!hasApproved}
                    width="250px"
                    height="30px"
                    placeholder={`${balance} TTK`} />
                <Button
                    width="200px"
                    height="30px"
                    textContent={hasApproved ? "Stake" : "Approve"}
                    disabled={amount > balance} />
            </form>
            <StakingDetails poolId={poolId} ></StakingDetails>
        </React.Fragment>
    )
}

export default StakingForm