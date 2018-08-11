pragma solidity ^0.4.22;

contract Region {

    struct Reg {
        string ipfsHash;
        Contributor[] contributors;
        uint accessCost;
        uint totalContributions;
    }

    struct Contributor {
        address userAddress;
        uint numberOfContribs;
    }

    struct Handout {
        uint handoutId;
        address owner;
        string ipfsHash;
    }

    Reg[] public regions;
    Handout[] public handouts;
    
    mapping(address => Handout) private fetched;

    uint initialAccessCost = 10000;
    uint globalHandoutId = 0;

    function getRegionCost(uint _regionId) public view returns (uint) {
        return regions[_regionId].accessCost;
    }

    function getRegion(uint _regionId) public payable returns (string) {
        require(_regionId >= regions.length, "Invalid Region Id");
        require(uint(msg.value) != regions[_regionId].accessCost, "Not right access cost");
        
        Reg memory region = regions[_regionId];
        for(uint i = 0; i < region.contributors.length; i++) {
            uint amount = (region.accessCost*region.contributors[i].numberOfContribs)/region.totalContributions;
            region.contributors[i].userAddress.transfer(amount);
        }

        return region.ipfsHash;
    }

    function createRegion(string _ipfsHash) public returns (uint) {
        regions.length++;
        regions[regions.length - 1].ipfsHash = _ipfsHash;
        regions[regions.length - 1].accessCost = initialAccessCost;
        regions[regions.length - 1].totalContributions = 0;
        return regions.length;
    }

    function _updateRegion(address _contributor, uint _regionId, string _ipfsHash) private {
        require(_regionId < regions.length, "Invalid Region");

        bool flag = false;
        regions[_regionId].totalContributions++;
        regions[_regionId].ipfsHash = _ipfsHash;
        for(uint i = 0; i < regions[_regionId].contributors.length; i++) {
            if(regions[_regionId].contributors[i].userAddress == _contributor) {
                regions[_regionId].contributors[i].numberOfContribs++;
                flag = true;
                break;
            }
        }
        
        if(!flag) {
            regions[_regionId].contributors.push(Contributor(_contributor, 1));
        }
    }

    function addHandout(string _ipfsHash) public {
        require(bytes(_ipfsHash).length != 0, "Invalid IPFS Hash");
        handouts.push(Handout(handouts.length + 1, msg.sender, _ipfsHash));
    }

    function getHandout() public returns (uint handoutId, address contributor, string ipfsHash) {
        require(fetched[msg.sender].handoutId != 0, "Already Fetched Contribution");
        
        handoutId = handouts[handouts.length - 1].handoutId;
        contributor = handouts[handouts.length - 1].owner;
        ipfsHash = handouts[handouts.length - 1].ipfsHash;
        
        fetched[msg.sender] = handouts[handouts.length - 1];
        handouts.length--;
    }

    function verifyHandout(uint _regionId, string ipfsHash) private {
        require(fetched[msg.sender].handoutId != 0, "Fetched no contribution");
        _updateRegion(fetched[msg.sender].owner, _regionId, ipfsHash);
    }
}