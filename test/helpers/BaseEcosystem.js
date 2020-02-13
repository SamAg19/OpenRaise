const {CurveLogicType, TokenType, DeployMode} = require('../helpers/CurveEcosystemConfig');
const {bn, str} = require('./utils');
const {constants} = require('openzeppelin-test-helpers');
const {ZERO_ADDRESS} = constants;
const deploy = require('../../index.js');

class BaseEcosystem {
  constructor(accounts, config) {
    this.config = config;
    this.accounts = accounts;
    this.contracts = {};
  }

  async getBals(address) {
    const {bondedToken} = this.contracts;
    const bals = {};

    bals.ether = bn(await web3.eth.getBalance(address));
    bals.bondedToken = bn(await bondedToken.balanceOf(address));

    if (this.config.collateralType === TokenType.ERC20) {
      const {paymentToken} = this.contracts;
      bals.paymentToken = bn(await paymentToken.balanceOf(address));
    }

    return bals;
  }

  async getBalances(accounts) {
    const {bondingCurve} = this.contracts;
    const bals = {};
    for (const account of accounts) {
      bals[account] = await this.getBals(account);
    }

    bals.bondingCurve = await this.getBals(bondingCurve);

    return bals;
  }

  async bulkMint(token, minter, accounts, amount) {
    for (const account of accounts) {
      await token.mint(account, amount, {from: minter});
    }
  }

  async bulkApprove(token, recipient, accounts, amount) {
    for (const account of accounts) {
      await token.approve(recipient, amount, {from: account});
    }
  }
}

module.exports = {
  BaseEcosystem
};
