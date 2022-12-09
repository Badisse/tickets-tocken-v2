import Web3 from "web3";
import { actions } from "./state";
import eventArtifact from "../../contracts/Event.json"

const connectWallet = async (dispatch) => {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        let eventAddress, eventContract;
        try {
          eventAddress = eventArtifact.networks[networkID].address;
          eventContract = new web3.eth.Contract(eventArtifact.abi, eventAddress);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { eventArtifact, web3, accounts, networkID, eventContract }
        });
  
};

export default connectWallet;