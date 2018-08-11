const Region = require('Embark/contracts/Region');

const { getRegionCost, getRegion, createRegion, addHandout, getHandout, verifyHandout, regions } = Region.methods;

config({
    contracts: {
        Region: {}
    }
}, (err, theAccounts) => {
    accounts = theAccounts;
});

const ipfsHash = "0X12ASSDFCA";

contract("Region", function() {
    this.timeout(0);

    it("should add to regions", async function() {
        const result = await createRegion(ipfsHash).send();
        assert.equal(result.status, true);
    });

    it("should have atleast one", async function() {
        const reg = await regions(0).call();
        assert.equal(reg.ipfsHash, "0X12ASSDFCA");
    });

    it("should access default", async function() {
        const cost = await getRegionCost(0).call();
        assert.equal(cost, '10000');
    });
});
