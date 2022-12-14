import Header from "../components/Header"
import Button from "../components/base/Button"
import "../styles/Hero.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext";

import TokenInterface from "../components/admin/TokenInterface"
import StakingInterface from "../components/admin/StakingInterface";

function Admin() {

    let navigate = useNavigate ()

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
                <h5 id="header-subtext"> Welcome admin, you can manage ICO from the link below </h5>
                <Button onClick = {() => navigate("/admin/ICO")} textContent = "ICO"> </Button>
                <TokenInterface/>
                <StakingInterface/>
            </div>
    }

    return (
        content
    )
}

export default Admin