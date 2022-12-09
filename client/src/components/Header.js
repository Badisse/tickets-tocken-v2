import { Link } from "react-router-dom";
import { useEth } from "../contexts/EthContext";
import connectWallet from "../contexts/EthContext/connectWallet";

const Header = () => {

    const {
      state: { accounts },
      dispatch,
    } = useEth();

    const handleWallet = () => {
      try {
        connectWallet(dispatch)
      } catch (err) {
        console.error(err);
      }

    }

    return (
      <div id="header">
        <Link to='/' id='logo'>Tickets Token</Link>

        <div id="link-containers">
          <Link to='/explore'>Explore</Link>
          <Link to='/create'>Create</Link>
          <Link to='/dashboard'>Dashboard</Link>

          <button id="connect-wallet" onClick={handleWallet} >{!accounts ? 'Connect Wallet' : `${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length-4)}`}</button>
        </div>
      </div>
    );
}

export default Header;