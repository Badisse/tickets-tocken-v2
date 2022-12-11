import { useEth } from "../../contexts/EthContext";
import React, { useEffect, useState } from "react"

import "../../styles/Hero.css"

import ContributionForm from "./ContributionForm"
// import ClaimingPage from "./ClaimingPage"

const UsersICOInterface = () => {

    const { state: { icoContract } } = useEth()
    const [event, setEvent] = useState ()
    const [content, setContent] = useState ()

    const setWF = async () => {
        const WFstatusID = await icoContract.methods.workflowStatus.call().call()
        switch (WFstatusID) {
            case "0":
                setContent(<h5> Please wait for the ICO to start </h5>)
                break
            case "1":
                setContent(<ContributionForm/>)
                break
            case "2":
                setContent(<h5> Wait for the distribution to start </h5>)
                break
            case "3":
                // setContent(<ClaimingPage/>)
                break
        }
    }

    useEffect(() => {
        setWF()
    }, [])

    const captureEvent = async () => {
        const capturedEvent = await icoContract.events.WorkflowStatusChange({fromBlock : "earliest"})
        capturedEvent.on("data", e => {
            setEvent(e)
        })
    }

    useEffect(() => {
        captureEvent()
    }, [])

    return (
        <React.Fragment>
            {content}
        </React.Fragment>
    )
}

export default UsersICOInterface