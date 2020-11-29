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

contract('EthSwap', (accounts) => {
    let token;
    let ethSwap;

    before(async () => {
        token = await Token.new();
        ethSwap = await ETHSwap.new();

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
})