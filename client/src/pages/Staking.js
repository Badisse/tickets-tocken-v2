import React, { useState } from "react"
import "../styles/Hero.css";
import Select from "../components/base/Select"
import Header from "../components/Header"

import StakingForm from "../components/staking/StakingForm"

const Staking = () => {

    const [lockUp, setLockUp] = useState()

    const poolIdHandler = (lockup) => {
        setLockUp(lockup)
    }

    return (
        <div>
            <Header />
            <div id="hero">
                <h5 id="header-subtext"> Stake your tokens </h5>
                <h5 id="header-subtext"> You can stake your tokens for variables APR depending
                    of the lockup time you will chose.</h5>
                <h5 id="header-subtext" > Please select a pool </h5>
                <Select
                    items={["No lock-up", "1 month lock-up", "3 months lock-up", " 6 months lock-up"]}
                    onChange={poolIdHandler}
                    name="Select lock-up period">
                </Select>
                {lockUp && <StakingForm lockUp={lockUp} ></StakingForm>}
            </div>
        </div>
    )

}

export default Staking