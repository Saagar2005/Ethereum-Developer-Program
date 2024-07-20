const { expect } = require("chai");
const { network, ethers } = require("hardhat");

async function moveBlocks(number) {
    console.log("Moving blocks...")
    for (let index = 0; index < number; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
    }
    console.log(`Moved ${number} blocks`)
}

async function moveTime(number) {
    console.log("Moving blocks...")
    await network.provider.send("evm_increaseTime", [number])

    console.log(`Moved forward in time ${number} seconds`)
}

describe("DAO contract", function () {
    it("Testing the flow in the contract", async function () {
        const [deployer] = await ethers.getSigners();

        const GovToken = await ethers.deployContract("GovToken", [deployer]);

        const balance = await GovToken.balanceOf(deployer.address);
        console.log(`Deployer's balance: ${balance}`);

        let votes = await GovToken.getVotes(deployer.address);
        console.log(`Votes for deployer: ${votes}`);      // 0 because voting rights not yet delegated

        const TimeLock = await ethers.deployContract("TimeLock", [36,
            [deployer.address],
            [deployer.address],
            deployer.address]);

        //Timelock.target = address of the deployed timelock contract
        console.log(`TimeLock address: ${TimeLock.target}`);

        // We must deploy Timelock contract before Use case contract and Governor contract; and also DAO-Token contract before Governor contract
        const Award = await ethers.deployContract("RecognitionAward", [[TimeLock.target]]);  //deployContract takes an array of arguments; One of our argument is array (to be passed to constructor of our use case contract), hence double bracket

        const MyGovernor = await ethers.deployContract("MyGovernor", [GovToken.target, TimeLock.target]);

        await moveBlocks(10 + 1);

        const transactionResponse = await GovToken.delegate(deployer);
        await transactionResponse.wait(1);      // 1 block needs to be mined (i.e waiting for confirmation)

        votes = await GovToken.getVotes(deployer.address);
        console.log(`Votes for deployer: ${votes}`);

        console.log("Timelock contract address:", TimeLock.target);
        console.log("RecognitionAward contract address:", Award.target);
        console.log("MyGovernor contract address:", MyGovernor.target);
        console.log("DAO_Token(GovToken) contract address:", GovToken.target);

        const Awardobj = await ethers.getContractAt("RecognitionAward", Award.target); //Another way of creating contract instance

        const transferCalldata = Awardobj.interface.encodeFunctionData("issue", [1024, "Saagar K V", "Academic Excellence Award", "Impressive performance in academics", "14-07-2024"]);

        let proposeTx = await MyGovernor.propose(
            [Award.target],
            [0],
            [transferCalldata],
            "Proposal #1: Issue Academic Excellence Award to Saagar K V"
        );
        await proposeTx.wait();
        const filter = MyGovernor.filters.ProposalCreated();

        const events = await MyGovernor.queryFilter(filter, proposeTx.blockNumber, proposeTx.blockNumber); //'from' block number to 'to' block number

        let proposalId = events[0].args.proposalId;

        console.log(`Proposal ID Generated: ${proposalId}`);

        let proposalState = await MyGovernor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

        await moveBlocks(100 + 1);  // Mine 100 blocks so that voting period begins

        proposalState = await MyGovernor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

        let voteTx = await MyGovernor.castVoteWithReason(proposalId, 1, "Approved");
        await voteTx.wait(1);

        const proposalVotes = await MyGovernor.proposalVotes(proposalId);
        console.log("Against Votes:", proposalVotes.againstVotes.toString());
        console.log("For Votes:", proposalVotes.forVotes.toString());
        console.log("Abstain Votes:", proposalVotes.abstainVotes.toString());

        proposalState = await MyGovernor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

        await moveBlocks(100 + 1);  //End voting period

        proposalState = await MyGovernor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

         // Get the role identifiers
         const PROPOSER_ROLE = await TimeLock.PROPOSER_ROLE();
         const EXECUTOR_ROLE = await TimeLock.EXECUTOR_ROLE();
 
         // Grant roles (assuming the deployer has the TIMELOCK_ADMIN_ROLE); Grant role to MyGovernor contract (Openzeppelin standard works this way; no need to do if we create our own contract)
         await TimeLock.connect(deployer).grantRole(PROPOSER_ROLE, MyGovernor.target);
         await TimeLock.connect(deployer).grantRole(EXECUTOR_ROLE, MyGovernor.target); 

        const descriptionHash = ethers.id("Proposal #1: Issue Academic Excellence Award to Saagar K V");
        console.log("Proposal description hash:", descriptionHash);

        const queueTx = await MyGovernor.connect(deployer).queue([Award.target], [0], [transferCalldata], descriptionHash); //Here it takes descriptionHash instead of description (unlike in propose)
        await queueTx.wait(1);
        await moveTime(36 + 1); //To move by timestamp //minDelay time //+1 used just to be sure

        let filter1 = MyGovernor.filters.ProposalCreated();

        let events1 = await MyGovernor.queryFilter(filter1, 0, queueTx.blockNumber);

        let proposalId1 = events1[0].args.proposalId;
        let proposalDes = events1[0].args.description;
        
        console.log("Proposal ID check again:", proposalId1);
        console.log("Proposal description:", proposalDes);

        proposalState = await MyGovernor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

        const executeTx = await MyGovernor.connect(deployer).execute([Award.target], [0], [transferCalldata], descriptionHash);
        await executeTx.wait(1);

        proposalState = await MyGovernor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

        console.log(await Awardobj.Awards(1024));
    });
});