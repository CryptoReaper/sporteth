import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import web3 from "web3-utils";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import { G, H } from "../basics/Colors";
import LabeledText from "../basics/LabeledText";
import { autoBind } from "react-extras";
import Form from "../basics/Form.js";
import ButtonEthScan from "../basics/ButtonEthScan.js";
import WarningSign from "../basics/WarningSign";
import Button from "../basics/Button.js";
import Token1 from "../../contracts/solidityjson/Token.json";
import TruncatedAddress from "../basics/TruncatedAddress.js";
import VBackgroundCom from "../basics/VBackgroundCom";
var moment = require("moment");
var tokenBal = "";

class BookiePagejs extends Component {
  constructor(props, context) {
    super(props);
    autoBind(this);

    this.contracts = context.drizzle.contracts;

    this.state = {
      fundAmount: "",
      shareAmount: "",
      sharesToSell: "",
      contractTokens: "",
      currentWeek: "",
      showDecimalOdds: false,
      teamPick: "",
    };
  }

  componentDidMount() {
    document.title = "Bookie Page";
    setTimeout(() => {
      this.findValues();
    }, 1000);
  }

  handletakeBookTeam(value) {
    this.setState({ teamPick: value });
  }

  fundRadio() {
    const currentState = this.state.wantTokens;
    this.setState({ wantTokens: !currentState });
  }

  handlefundBook(value) {
    this.setState({
      fundAmount: value,
    });
  }


  openEtherscan(txhash) {
    const url = "https://rinkeby.etherscan.io/tx/" + txhash;
    window.open(url, "_blank");
  }

  handleBookieSell(value) {
    this.setState({
      sharesToSell: value,
    });
  }

  wdShares() {
    const stackId = this.contracts["BettingMain"].methods.withdrawBook.cacheSend({
      from: this.props.accounts[0],
    });
  }

  wdBook() {
    //const { sharesToSell } = this.state.sharesToSell
    const stackId = this.contracts["BettingMain"].methods.withdrawBook.cacheSend(
      web3.toWei(this.state.sharesToSell.toString(), "finney"),
      {
        from: this.props.accounts[0],
      }
    );
  }

  fundBook() {
    this.contracts["BettingMain"].methods.fundBook.cacheSend(
      {
        from: this.props.accounts[0],
        value: web3.toWei(this.state.fundAmount, "finney"),
      }
    );
  }

  inactivateBook() {
    const stackId = this.contracts["BettingMain"].methods.inactiveBook.cacheSend();
  }
/*
  getTokenBalance() {
    const web3 = this.context.drizzle.web3;
    const contractweb3 = new web3.eth.Contract(Token1.abi, Token1.address);
    const tokenBal0 = contractweb3.methods.balanceOf("0x01381ac2D1c45B21e449669E832574a40C391bcf");
    return tokenBal0;
  }*/



  findValues() {


    this.unusedKey = this.contracts["BettingMain"].methods.margin.cacheCall(0);
/*
    this.tokenKey = this.contracts["TokenMain"].methods.balanceOf.cacheCall("0x01381ac2D1c45B21e449669E832574a40C391bcf");*/

    this.usedKey = this.contracts["BettingMain"].methods.margin.cacheCall(1);

    this.betCapitalKey = this.contracts["BettingMain"].methods.margin.cacheCall(2);

    this.totalSharesKey = this.contracts[
      "BettingMain"
    ].methods.totalShares.cacheCall();

    this.weekKey = this.contracts["BettingMain"].methods.betEpoch.cacheCall();

    this.betsHomeKey = this.contracts["BettingMain"].methods.showLongs.cacheCall(0);

    this.payoffsHomeKey = this.contracts[
      "BettingMain"
    ].methods.showPayout.cacheCall(0);

    this.betsAwayKey = this.contracts["BettingMain"].methods.showLongs.cacheCall(1);

    this.payoffsAwayKey = this.contracts[
      "BettingMain"
    ].methods.showPayout.cacheCall(1);

    this.oddsFaveKey = this.contracts[
      "BettingMain"
    ].methods.showDecimalOdds.cacheCall();

    this.scheduleStringKey = this.contracts[
      "BettingMain"
    ].methods.showSchedString.cacheCall();

    this.startTimeKey = this.contracts[
      "BettingMain"
    ].methods.showStartTime.cacheCall();

    this.sharesKey = this.contracts["BettingMain"].methods.lpStruct.cacheCall(
      this.props.accounts[0]
    );
  }

  getSpreadText(spreadnumber) {
    let outspread = spreadnumber / 10;
    if (outspread > 0) {
      outspread = "+" + outspread;
    }
    return outspread;
  }


  render() {
    let unusedCapital = "0";
    if (this.unusedKey in this.props.contracts["BettingMain"].margin) {
      unusedCapital = web3.fromWei(
        this.props.contracts["BettingMain"].margin[this.unusedKey].value.toString(),
        "finney"
      );
    }
/*
    let baltok="0";
    if (this.tokenKey in this.props.contracts["TokenMain"].balanceOf) {
      baltok = web3.fromWei(
        this.props.contracts["TokenMain"].balanceOf[this.tokenKey].value.toString(),
        "finney"
      );
    }*/
/*
    if (this.tokenKey in this.props.contracts["TokenMain"].balanceOf) {
      this.tokenBal = this.props.contracts["TokenMain"].balanceOf[
        this.tokenKey
      ].value;
    }*/

 // let tokenBal1 = this.getTokenBalance();
      console.log("contract tokens", this.tokenKey);



    let usedCapital = "0";
    if (this.usedKey in this.props.contracts["BettingMain"].margin) {
      usedCapital = web3.fromWei(
        this.props.contracts["BettingMain"].margin[this.usedKey].value.toString(),
        "finney"
      );
    }

    let betCapital = "0";
    if (this.betCapitalKey in this.props.contracts["BettingMain"].margin) {
      betCapital = web3.fromWei(
        this.props.contracts["BettingMain"].margin[
          this.betCapitalKey
        ].value.toString(),
        "finney"
      );
    }

    if (this.weekKey in this.props.contracts["BettingMain"].betEpoch) {
      this.currentWeek = this.props.contracts["BettingMain"].betEpoch[
        this.weekKey
      ].value;
    }

    let bookieStruct = {
      0: "0",
      1: "0",
      shares: "0",
      outEpoch: "0",
    };
    let bookieShares = "0";
    let bookieEpoch = "0";
    if (this.sharesKey in this.props.contracts["BettingMain"].lpStruct) {
      bookieStruct = this.props.contracts["BettingMain"].lpStruct[this.sharesKey]
        .value;
      bookieShares = web3.fromWei(bookieStruct.shares.toString(), "finney");
      bookieEpoch = bookieStruct.outEpoch.toString();
    }

    let totalShares = "0";
    if (this.totalSharesKey in this.props.contracts["BettingMain"].totalShares) {
      totalShares = web3.fromWei(
        this.props.contracts["BettingMain"].totalShares[
          this.totalSharesKey
        ].value.toString(),
        "finney"
      );
    }

    let ethBookie =
      (Number(bookieShares) * (Number(unusedCapital) + Number(usedCapital))) /
      Number(totalShares);

    let startTimeColumn = [];
    if (this.startTimeKey in this.props.contracts["BettingMain"].showStartTime) {
      startTimeColumn = this.props.contracts["BettingMain"].showStartTime[
        this.startTimeKey
      ].value;
    }

    let oddsFave0 = [];
    if (this.oddsFaveKey in this.props.contracts["BettingMain"].showDecimalOdds) {
      oddsFave0 = this.props.contracts["BettingMain"].showDecimalOdds[
        this.oddsFaveKey
      ].value;
    }

    let betsHome = [];
    if (this.betsHomeKey in this.props.contracts["BettingMain"].showLongs) {
      betsHome = this.props.contracts["BettingMain"].showLongs[this.betsHomeKey]
        .value;
    }

    let betsAway = [];
    if (this.betsAwayKey in this.props.contracts["BettingMain"].showLongs) {
      betsAway = this.props.contracts["BettingMain"].showLongs[this.betsAwayKey]
        .value;
    }

    let payoffAway = [];
    if (this.payoffsAwayKey in this.props.contracts["BettingMain"].showPayout) {
      payoffAway = this.props.contracts["BettingMain"].showPayout[
        this.payoffsAwayKey
      ].value;
    }

    let payoffHome = [];
    if (this.payoffsHomeKey in this.props.contracts["BettingMain"].showPayout) {
      payoffHome = this.props.contracts["BettingMain"].showPayout[
        this.payoffsHomeKey
      ].value;
    }

    let scheduleString = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    if (
      this.scheduleStringKey in this.props.contracts["BettingMain"].showSchedString
    ) {
      scheduleString = this.props.contracts["BettingMain"].showSchedString[
        this.scheduleStringKey
      ].value;
    }

    let oddsFave = [];
    let oddsUnder = [];
    for (let ii = 0; ii < 32; ii++) {
      oddsFave[ii] = Number(oddsFave0[ii]);
      oddsUnder[ii] = 1000000 / (Number(oddsFave[ii]) + 90) - 90;
    }

    let teamSplit = [];

    for (let i = 0; i < 32; i++) {
      teamSplit[i] = scheduleString[i].split(":");
    }

    let allMatches = [];

    for (let i = 0; i < 32; i++) {
      allMatches.push(
        <tr key={i} style={{ width: "25%", textAlign: "center" }}>
          <td>{teamSplit[i][0]}</td>
          <td>{teamSplit[i][1]}</td>
          <td>{teamSplit[i][2]}</td>
          <td>{(betsHome[i] / 1e15).toFixed(3)}</td>
          <td>{(betsAway[i] / 1e15).toFixed(3)}</td>
          <td>{(payoffHome[i] / 1e15 - betsAway[i] / 1e15).toFixed(1)}</td>
          <td>{(payoffAway[i] / 1e15 - betsHome[i] / 1e15).toFixed(1)}</td>
        </tr>
      );
    }

    return (
      <div>
        <VBackgroundCom />
        <Split
          page={"bookie"}
          side={
            <Box mt="30px" ml="25px" mr="35px">
              <Logo />
              <Flex mt="15px"></Flex>
              <Box
                mt="20px"
                pt="10px"
                style={{ borderTop: `thin solid ${G}` }}
              ></Box>

              <Box>
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="marginLeft"
                >
                  <Text size="20px">
                    <a
                      className="nav-header"
                      style={{
                        // textDecoration: "none",
                        cursor: "pointer",
                      }}
                      href="/betpage"
                      target="_blank"
                    >
                      Betting Page
                    </a>
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="marginLeft"
                >
                  <Text size="20px">
                    <a
                      className="nav-header"
                      style={{
                        cursor: "pointer",
                      }}
                      href="/"
                    >
                      Home Page
                    </a>
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Flex mt="10px" pt="10px"></Flex>
              </Box>
              <Box mb="10px" mt="10px">
                <TruncatedAddress
                  label="Your Address"
                  addr={this.props.accounts[0]}
                  start="8"
                  end="6"
                  transform="uppercase"
                  spacing="1px"
                />
              </Box>

              <Box>
                <Flex
                  mt="10px"
                  pt="10px"
                  alignItems="center"
                  style={{ borderTop: `thin solid ${G}` }}
                ></Flex>
              </Box>

              {this.props.transactionStack.length > 0 &&
              this.props.transactionStack[0].length === 66 ? (
                <Flex alignItems="center">
                  <ButtonEthScan
                    onClick={() =>
                      this.openEtherscan(this.props.transactionStack[0])
                    }
                    style={{ height: "30px" }}
                  >
                    See Transaction Detail on Ethscan
                  </ButtonEthScan>
                </Flex>
              ) : null}

              <Box>
                <Form
                  onChange={this.handlefundBook}
                  value={this.state.fundAmount}
                  onSubmit={this.fundBook}
                  mb="20px"
                  justifyContent="flex-start"
                  buttonWidth="95px"
                  inputWidth="100px"
                  placeholder="ether"
                  buttonLabel="fund"
                />
              </Box>

              <Box>
                {" "}
                <Text size="14px">
                  {"Tokens available for match funding: " +
                    Number(this.state.contractTokens).toFixed(2) +
                    " finney"}
                </Text>
              </Box>


              <Box>
                <Flex>
                  <Flex width="100%" flexDirection="column">
                    <Flex
                      mt="10px"
                      pt="10px"
                      alignItems="center"
                      style={{
                        borderTop: `thin solid ${G}`,
                      }}
                    >
                      <Text
                        size="16px"
                        weight="400"
                        style={{ marginLeft: "1%" }}
                      >
                        Margin
                      </Text>
                    </Flex>
                    <Flex pt="10px" justifyContent="space-around">
                      <Box>
                        <LabeledText
                          big
                          label="Unpledged Capital"
                          size="14px"
                          text={Number(unusedCapital).toFixed(3)}
                          spacing="4px"
                        />
                      </Box>

                      <Box>
                        <LabeledText
                          big
                          label="Pledged Capital"
                          text={Number(usedCapital).toFixed(3)}
                          spacing="1px"
                        />
                      </Box>
                      <Box>
                        <LabeledText
                          big
                          label="Current Gross Bets"
                          text={Number(betCapital).toFixed(3)}
                          spacing="1px"
                        />
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>

              <Box>
                <Flex
                  mt="10px"
                  pt="10px"
                  style={{ borderTop: `thin solid ${G}` }}
                ></Flex>
              </Box>

              <Box>
                {" "}
                <Text size="14px">
                  {"You own: " +
                    Number(bookieShares).toFixed(2) +
                    "  out of " +
                    Number(totalShares).toFixed(2) +
                    " total shares"}
                </Text>
              </Box>
              <Box>
                {" "}
                <Text size="14px">
                  {"value of your shares is " +
                    Number(ethBookie).toFixed(2) +
                    " in Eth "}
                </Text>
                <Box>
                  {" "}
                  <Text size="15px">Current Epoch: {this.currentWeek} </Text>
                  <br></br>
                  <Text size="15px">
                    you can withdraw after epoch {bookieEpoch}
                  </Text>
                </Box>
              </Box>
              <Box>
                {Number(bookieShares) > 0 ? (
                  <Form
                    onChange={this.handleBookieSell}
                    value={this.state.sharesToSell}
                    onSubmit={this.wdBook}
                    mb="20px"
                    justifyContent="flex-start"
                    buttonWidth="95px"
                    inputWidth="210px"
                    placeholder="Shares to Sell (Ether, ie 1e18)"
                    buttonLabel="withdraw"
                  />
                ) : null}
              </Box>

              <Box>
                <Flex
                  mt="20px"
                  pt="10px"
                  style={{ borderTop: `thin solid ${G}` }}
                ></Flex>
              </Box>
            </Box>
          }
        >
          <div className="bookie-page-wrapper" style={{ width: "100%" }}>
            <Flex justifyContent="center">
              <Text size="25px">Bookie Page</Text>
            </Flex>

            <Box mt="15px" mx="30px">
              <Flex width="100%" justifyContent="marginLeft">
                <Text size="14px" weight="300">
                  {" "}
                  This page helps LPs understand their netLiab exposure to this
                  week's events. The NetLiability is the amount paid out by the
                  contract if the Home or Away Team wins. If negative this means
                  the LPs are credited eth. LPs can fund and withdraw using the
                  left-hand fields.
                </Text>
              </Flex>
            </Box>

            <Box>
              <Flex>
                <Flex width="100%" flexDirection="column">
                  <Flex pt="10px" justifyContent="space-between"></Flex>
                </Flex>
              </Flex>
            </Box>

            <Box>
              <Flex>
                <Flex width="100%" flexDirection="column">
                  <Flex
                    mt="10px"
                    pt="10px"
                    alignItems="center"
                    style={{
                      borderTop: `thin solid ${G}`,
                    }}
                  ></Flex>

                  <table
                    style={{
                      width: "100%",
                      borderRight: "1px solid",
                      float: "left",
                    }}
                  >
                    <tbody>
                      <tr style={{ width: "50%", textAlign: "center" }}>
                        <th>sport</th>
                        <th>Home Team</th>
                        <th>Away Team</th>
                        <th>HomeBets</th>
                        <th>AwayBets</th>
                        <th>NetLiabHome</th>
                        <th>NetLiabAway</th>
                      </tr>
                      {allMatches}
                    </tbody>
                  </table>
                </Flex>
              </Flex>
            </Box>
          </div>
        </Split>
      </div>
    );
  }
}

BookiePagejs.contextTypes = {
  drizzle: PropTypes.object,
};

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    contracts: state.contracts,
    drizzleStatus: state.drizzleStatus,
    transactions: state.transactions,
    transactionStack: state.transactionStack,
  };
};

export default drizzleConnect(BookiePagejs, mapStateToProps);
