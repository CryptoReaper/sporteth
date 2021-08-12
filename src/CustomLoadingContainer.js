import { drizzleConnect } from "@drizzle/react-plugin";
import React, { Children, Component } from "react";
import PropTypes from "prop-types";
import Betting from "./contracts/solidityjson/Betting.json";
import Oracle from './contracts/solidityjson/Oracle.json';
import Token from './contracts/solidityjson/Token.json';

/*
 * Create component.
 */

class CustomLoader extends Component {
  constructor(props, context) {
    super(props);
  }

  async main()  {
    console.log(this.context);
    const drizz = this.context.drizzle;
    var FOOT0Config = {
      contractName: "BettingMain",
      web3Contract: new drizz.web3.eth.Contract(
        Betting.abi,
        "0x131c66DC2C2a7D1b614aF9A778931F701C4945a1"
      )
    };
    var FOOT1Config = {
      contractName: "OracleMain",
      web3Contract: new drizz.web3.eth.Contract(
        Oracle.abi,
        "0xF2a86D7F05d017e0A82F06Ee59b4098FE8B07826"
      )
    };

    var FOOT2Config = {
      contractName: "TokenMain",
      web3Contract: new drizz.web3.eth.Contract(
        Token.abi,
        "0x60Fe97890599d0C9707EA4f8De46887Ce6c908bc"
      )
    };

    this.context.drizzle.addContract(FOOT0Config);
    this.context.drizzle.addContract(FOOT1Config);
    //this.context.drizzle.addContract(FOOT2Config);
  }

  componentDidMount() {
    this.main();
  }

  render() {
    if (this.props.web3.status === "failed") {
      if (this.props.errorComp) {
        return this.props.errorComp;
      }

      return (
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>⚠️</h1>
              <p>
                This browser has no connection to the Ethereum network. Please
                use the Chrome/FireFox extension MetaMask, or dedicated Ethereum
                browsers Mist or Parity.
              </p>
            </div>
          </div>
        </main>
      );
    }

    if (
      this.props.web3.status === "initialized" &&
      Object.keys(this.props.accounts).length === 0
    ) {
      return (
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>🦊</h1>
              <p>
                <strong>{"We can't find any Ethereum accounts!"}</strong> Please
                check and make sure Metamask or your browser are pointed at the
                correct network and your account is unlocked.
              </p>
            </div>
          </div>
        </main>
      );
    }

    if (
      this.props.drizzleStatus.initialized &&
      Object.keys(this.context.drizzle.contracts).length === 3
    ) {
      return Children.only(this.props.children);
    }

    if (this.props.loadingComp) {
      return this.props.loadingComp;
    }

    return (
      <main className="container loading-screen">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>⚙️</h1>
            <p>Loading dapp...</p>
          </div>
        </div>
      </main>
    );
  }
}

CustomLoader.contextTypes = {
  drizzle: PropTypes.object
};

CustomLoader.propTypes = {
  children: PropTypes.node,
  accounts: PropTypes.object.isRequired,
  drizzleStatus: PropTypes.object.isRequired,
  web3: PropTypes.object.isRequired,
  loadingComp: PropTypes.node,
  errorComp: PropTypes.node
};

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3
  };
};

export default drizzleConnect(CustomLoader, mapStateToProps);