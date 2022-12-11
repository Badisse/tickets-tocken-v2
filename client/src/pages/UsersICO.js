import Header from "../components/Header"
import "../styles/Hero.css";

import { useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext";

import UsersICOInterface from "../components/icoUsers/UsersICOInterface"

function UsersICO() {

    const { state: { accounts, icoContract} } = useEth()
    const [isWhitelisted, setIsWhitelisted] = useState()

    const checkUserAddress = async () => {
        if (!accounts && !icoContract) {
            return;
        }
        const userInfos = (await icoContract.methods.UserInfo(accounts[0]).call()).whitelisted
        setIsWhitelisted(userInfos)
    }

    useEffect(() => {
        checkUserAddress()
    }, [checkUserAddress, accounts])

    let content = (
        <div>
            <Header />
            <div id="hero">
                <h5 id="header-subtext"> You are not whitelisted for the ICO ser</h5>
            </div>
        </div>
    )

    if (isWhitelisted) {
        content =
            <div id = "hero">
                <Header></Header>
                <h5 id="header-subtext"> Welcome ser, you are whitelisted </h5>
                <UsersICOInterface/>
            </div>
    }

    return (
        content
    )

}

export default UsersICO