
import React, { useState } from "react"
import Select from "../base/Select"

import StakingPool from "./StakingPool"

import "../../styles/Hero.css"

function StakingInterface() {

    const [lockUp, setLockUp] = useState()

    const poolIdHandler = (lockup) => {
        setLockUp(lockup)
    }

    return (
        <div id="hero">
            <h5 id="header-subtext"> Pools set-up </h5>
            <h5 id="header-subtext"> As the admin, you need to set up the staking pools </h5>
            <h5 id="header-subtext" > Please chose a time lock-up for each and a reward rate </h5>
            <Select
                items={["No lock-up", "1 month lock-up", "3 months lock-up", " 6 months lock-up"]}
                onChange={poolIdHandler}
                name="Select lock-up period">
            </Select>
            {lockUp && <StakingPool lockUp={lockUp} ></StakingPool>}
        </div>)


}

export default StakingInterface