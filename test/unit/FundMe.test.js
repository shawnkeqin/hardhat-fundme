const { deployments, ethers, getNamedAccounts } = require("hardhat"); 
const { assert, expect } = require("chai")

describe("FundMe", async function() {

    let fundMe

    let deployer 

    let mockV3Aggregator

    const sendValue = ethers.utils.parseEther("1"); 

    beforeEach(async function() {

        // const accounts = ethers.getSigners();
        // const accountZero = accounts[0];
        // const { deployer } = await getNamedAccounts() 
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", async function() {
        it("sets the aggregator address correctly", async function (){
            const response = await fundMe.priceFeed(); 
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function() {
        it("Fails if you dont send enough ETH", async function() {
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
        })
        it("updated the amount funded data structure", async function() {
            await fundMe.fund({ value: sendValue})
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async function() {
            await fundMe.fund({value: sendValue})
            const funder = await fundMe.funders(0)
            assert.equal(funder, deployer); 
        })
    })

    describe("withdraw", async function (){
        beforeEach(async function() {
            await fundMe.fund({value: sendValue})
        })

        it("withdraw ETH from a single founder", async function () {
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice);

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

            assert.equal(endingFundMeBalance, 0); 
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString()); 
        })
    })
})