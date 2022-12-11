import { useEth } from "../../contexts/EthContext";
import {useState, useEffect} from "react"

import "../../styles/Hero.css"

const DuringIco = () => {

    const { state: { icoContract, web3 } } = useEth()
    
    const [amountRaised, setAmountRaised] = useState ()

    const getAmountRaised = async () => {
        const amount = await web3.eth.getBalance(icoContract._address)
        const ethValue = await web3.utils.fromWei(amount.toString(), "ether")
        setAmountRaised (ethValue)
    }

    useEffect (() => {
        getAmountRaised()
    }, [getAmountRaised])

    return (
        <h5 id="header-subtext"> {`Amount raised : ${amountRaised} ETH`} </h5>
    )
}

export default DuringIco