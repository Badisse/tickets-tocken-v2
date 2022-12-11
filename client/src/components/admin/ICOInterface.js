import { useEth } from "../../contexts/EthContext";
import React, { useEffect, useState } from "react"

import "../../styles/Hero.css"

import Button from "../base/Button"
import AddWhitelist from "./AddWhitelist";
import DuringIco from "./DuringIco"
import TokenDistribution from "./TokenDistribution"

const ICOInterface = () => {

    const { state: { accounts, icoContract, web3 } } = useEth()
    const [wfstatus, setNextWFStatus] = useState()
    const [event, setEvent] = useState ()

    const setWF = async () => {
        const WFstatusID = await icoContract.methods.workflowStatus.call().call()
        switch (WFstatusID) {
            case "0":
                setNextWFStatus("startICO")
                break
            case "1":
                setNextWFStatus("endICO")
                break
            case "2":
                setNextWFStatus("startTokenDistribution")
                break
        }
    }

    useEffect(() => {
        setWF()
    }, [setWF, event])

    const goToNextStep = async () => {
        switch (wfstatus) {
            case "startICO":
                await icoContract.methods.startIco().send({from : accounts[0]})
                break
            case "endICO":
                await icoContract.methods.endIco().send({from : accounts[0]})
                break
            case "startTokenDistribution":
                await icoContract.methods.startTokenDistribution().send({from : accounts[0]})
                break
        }
        setWF()
    }

    const captureEvent = async () => {
        const capturedEvent = await icoContract.events.WorkflowStatusChange({fromBlock : "earliest"})
        capturedEvent.on("data", e => {
            setEvent(e)
        })
    }

    useEffect(() => {
        captureEvent()
    }, [captureEvent])

    let content;

    if (wfstatus === "startICO") {
        content = <AddWhitelist/> 
    }

    if (wfstatus === "endICO") {
        content = <DuringIco/>
    }

    if (wfstatus === "startTokenDistribution"){
        content = <TokenDistribution/>
    }

    return (
        <React.Fragment>
            {content}
            <h5 id="header-subtext"> Go to next step </h5>
            <Button 
            width ="150px"
            height = "30px"
            onClick={goToNextStep}
            textContent = {wfstatus}> </Button>
        </React.Fragment>
    )
}

export default ICOInterface