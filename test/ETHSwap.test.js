const { assert } = require('chai');

const Token = artifacts.require("Token");
const ETHSwap = artifacts.require("ETHSwap");

require('chai')
  .use(require('chai-as-promised'))
  .should()

// Convert the values into wei
// Wei is the smallest value of ether
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
    let token;
    let ethSwap;

    before(async () => {
        token = await Token.new();
        ethSwap = await ETHSwap.new(token.address);

        await token.transfer(ethSwap.address, tokens('100000'));
    })

    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name();
            assert.equal(name, 'DApp Token');
        })
    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name();
            assert.equal(name, 'EthSwap');
        })

        it('contract has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance.toString(), tokens('100000'));
        })
    })

    describe('buyTokens()', async () => {
        let result;
        before(async () => {
            // Purchase tokens
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')});
        })

        it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('100'));

            // Check ethSwap balance after purchase
            let ethSwapBalance;
            ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), tokens('99900'));

            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'));

            // Check logs to ensure event was emitted with correct data
            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100').toString());
            assert.equal(event.rate.toString(), '100');
        })
    })

    describe('sellTokens()', async () => {
        let result;
    
        before(async () => {
          // Investor must approve tokens before the purchase
          await token.approve(ethSwap.address, tokens('100'), { from: investor });
          
          // Investor sells tokens
          result = await ethSwap.sellTokens(tokens('100'), { from: investor });
        })

        it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('0'));

            // Check ethSwap balance after purchase
            let ethSwapBalance;
            ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), tokens('100000'));

            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'));

            // Check logs to ensure event was emitted with correct data
            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100').toString());
            assert.equal(event.rate.toString(), '100');

            // Failure: investor cannot sell more tokens then they have
            await ethSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
        })
    })    
})