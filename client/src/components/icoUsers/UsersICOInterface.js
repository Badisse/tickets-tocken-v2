import { useEth } from "../../contexts/EthContext";
import React, { useEffect, useState } from "react"

import "../../styles/Hero.css"

const UsersICOInterface = () => {

    const { state: { icoContract } } = useEth()
    const [event, setEvent] = useState ()

    let content

    const setWF = async () => {
        const WFstatusID = await icoContract.methods.workflowStatus.call().call()
        switch (WFstatusID) {
            case "0":
                content = <h5> Please wait for the ICO to start </h5>
                break
            case "1":
                //content = <ContributionForm/>
                break
            case "2":
                content = <h5> Wait for the distribution to start </h5>
                break
            case "3":
                //content = <ClaimingPage/>
                break
        }
    }

    useEffect(() => {
        setWF()
    }, [setWF, event])

    const captureEvent = async () => {
        const capturedEvent = await icoContract.events.WorkflowStatusChange({fromBlock : "earliest"})
        capturedEvent.on("data", e => {
            setEvent(e)
        })
    }

    useEffect(() => {
        captureEvent()
    }, [captureEvent])

    return (
        content
    )
}

export default UsersICOInterface