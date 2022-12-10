import Web3 from "web3";
import { actions } from "./state";
import eventArtifact from "../../contracts/Event.json"
import tokenArtifact from "../../contracts/TicketToken.json"
import icoArtifact from "../../contracts/ICO.json"
import singleStakingArtifact from "../../contracts/SingleStaking.json"

const connectWallet = async (dispatch) => {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        let eventAddress, eventContract;
        let tokenAddress, tokenContract;
        let icoAddress, icoContract;
        let singleStakingAddress, singleStakingContract;
        try {
          eventAddress = eventArtifact.networks[networkID].address;
          eventContract = new web3.eth.Contract(eventArtifact.abi, eventAddress);
          tokenAddress = tokenArtifact.networks[networkID].address;
          tokenContract = new web3.eth.Contract(tokenArtifact.abi, tokenAddress);
          icoAddress = icoArtifact.networks[networkID].address ;
          icoContract = new web3.eth.Contract(icoArtifact.abi, icoAddress);
          singleStakingAddress = singleStakingArtifact.networks[networkID].address ;
          singleStakingContract = new web3.eth.Contract(singleStakingArtifact.abi, singleStakingAddress) ;
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { eventArtifact, web3, accounts, networkID, eventContract, tokenContract, icoContract, singleStakingContract }
        });
  
};

export default connectWallet;