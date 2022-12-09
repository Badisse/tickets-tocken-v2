import Header from "../components/Header"
import "../styles/Hero.css";

import { useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext";

import TokenInterface from "../components/admin/TokenInterface"
import StakingInterface from "../components/admin/StakingInterface";

function Admin() {

    const { state: { accounts, singleStakingContract } } = useEth()
    const [isOwner, setIsOwner] = useState()

    const checkOwnerAddress = async () => {
        if (!accounts && !singleStakingContract) {
            return;
        }
        const ownerAddy = await singleStakingContract.methods.owner().call()
        setIsOwner(ownerAddy === accounts[0])
    }

    useEffect(() => {
        checkOwnerAddress()
    }, [checkOwnerAddress])

    let content = (
        <div>
            <Header />
            <div id="hero">
                <h5 id="header-subtext"> You are not admin ser, please go back to homepage</h5>
            </div>
        </div>
    )

    if (isOwner) {
        content =
            <div id = "hero">
                <Header></Header>
                <h5 id="header-subtext"> Welcome admin</h5>
                <TokenInterface/>
                <StakingInterface/>
            </div>
    }

    return (
        content
    )
}

export default Admin