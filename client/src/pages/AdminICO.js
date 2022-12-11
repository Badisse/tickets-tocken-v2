import Header from "../components/Header"
import "../styles/Hero.css";

import { useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext";

import ICOInterface from "../components/admin/ICOInterface"

function AdminICO() {

    const { state: { accounts, icoContract} } = useEth()
    const [isOwner, setIsOwner] = useState()

    const checkOwnerAddress = async () => {
        if (!accounts && !icoContract) {
            return;
        }
        const ownerAddy = await icoContract.methods.owner().call()
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
                <ICOInterface/>
            </div>
    }

    return (
        content
    )

}

export default AdminICO