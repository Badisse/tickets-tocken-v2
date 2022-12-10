
import { useEth } from "../../contexts/EthContext";
import React, { useEffect, useState } from "react"

import "../../styles/Hero.css"

import Input from "../base/TextInput"
import Button from "../base/Button"

const StakingDetails = (props) => {

    const { state: { accounts, singleStakingContract, web3 } } = useEth()

    const [stakedAmount, setStakedAmount] = useState()
    const [amountUnstaking, setAmountUnstaking] = useState ()
    const [rewards, setRewards] = useState ()
    const [remainingTime, setRemainingTime] = useState ()

    const amountHandler = (e) => {
        setAmountUnstaking(e.target.value)
    }

    const withdrawHandler = async (e) => {
        e.preventDefault()
        const weiValue = await web3.utils.toWei(amountUnstaking.toString(), "ether")
        const withdrawal = await singleStakingContract.methods.withdraw(props.poolId, weiValue).send({from : accounts[0]})
        if (!withdrawal.status){
            alert ("withdrawal unsuccessful, please try again")
            return ;
        }
        alert ("withdrawal successful")
        getStakedAmount()
    }

    const claimHandler = async () => {
        const claiming = await singleStakingContract.methods.claimRewards(props.poolId).send({from : accounts[0]})
        if (!claiming.status){
            alert ("claiming unsuccessful")
            return
        }
        alert ("you claimed your rewards successfully")
        const rewards = await singleStakingContract.methods.earned(accounts[0], props.poolId).send({from : accounts[0]})
        getClaimable ()
    }

    const getStakedAmount = async () => {
        if (!props.poolId){
            return ;
        }
        const user = await singleStakingContract.methods.getUserInfo(props.poolId, accounts[0]).call({from : accounts[0]})
        setStakedAmount(await web3.utils.fromWei(user.balance.toString(), "ether"))
    }

    const getClaimable = async () => {
        if (!props.poolId){
            return 
        }
        const earned = await singleStakingContract.methods.earned(accounts[0], props.poolId).call({from : accounts[0]})
        setRewards (await web3.utils.fromWei(earned.toString(), "ether"))
    }

    useEffect(() => {
        getStakedAmount()
        getClaimable()
    }, [getStakedAmount])

    return (

        <React.Fragment>
            <h5 id="header-subtext"> Claim your rewards or unstake your tokens </h5>
            <h5 id="header-subtext"> {`your position : ${stakedAmount} TTK`} </h5>
            <form onSubmit={withdrawHandler}>
                <Input
                    onChange={amountHandler}
                    disabled={!(stakedAmount > 0)}
                    width="250px"
                    height="30px"
                    placeholder={`${stakedAmount} TTK`} />
                <Button
                    width="200px"
                    height="30px"
                    textContent='Unstake'
                    disabled={!(stakedAmount > 0)}/>
            </form>
            <h5 id="header-subtext"> {`Rewards to be claimed : ${rewards}`} </h5>
            <Button onClick = {claimHandler} 
                    textContent = "Claim"
                    disabled={!(rewards > 0)}/>
        </React.Fragment>
    )
}

export default StakingDetails