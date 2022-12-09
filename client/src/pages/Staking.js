import React, {useState} from "react"
import "../styles/Hero.css";
import Select from "../components/base/Select"

// import StakingForm from "./StakingForm"
// import StakingDetails from "./StakingDetails"

/*
{poolId && <StakingForm poolId = {poolId} ></StakingForm>}
{poolId && <StakingDetails poolId = {poolId} ></StakingDetails>}
*/

const Staking = () => {

    const [poolId, setPoolId] = useState()

    const poolIdHandler = (lockup) => {
        
        switch (lockup){
            case "No lock-up" :
                setPoolId("1")
                break
            case "1 month" : 
                setPoolId("2") 
                break
            case "3 months" :
                setPoolId("3")
                break
            case "6 months" : 
                setPoolId("4")
                break
        }
        setPoolId(lockup)
    }

    return (
        <div id = "hero">
            <h5 id = "header-subtext"> Stake your tokens </h5>
            <h5 id = "header-subtext"> You can stake your tokens for variables APR depending
                of the lockup time you will chose.</h5>
            <h5 id = "header-subtext" > Please select a pool </h5>
            <Select 
            items = {["No lock-up","1 month","3 months"," 6 months"]} 
            onChange = {poolIdHandler} 
            name = "Select lock-up period">
            </Select>
        </div>
    )

}

export default Staking