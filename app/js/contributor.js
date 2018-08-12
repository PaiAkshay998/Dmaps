import Region from 'Embark/contracts/Region';

function getCost(regionId) {
    Region.methods.getRegionCost(regionId).call()
    .then((result) => {
        console.log(result);
    });
}

getCost(0);