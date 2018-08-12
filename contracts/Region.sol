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

    struct Stat {
        uint numberOfContribs;
        uint numberOfHandouts;
    }
    
    Reg[] public regions;
    Handout[] public handouts;
    
    mapping(address => Handout) private fetched;
    mapping(address => uint) public deposits;
    mapping(address => Stat) public contribStats;
    mapping(address => string) public myHash;
    
    uint initialAccessCost = 10000;
    uint globalHandoutId = 1;

    function getRegionCost(uint _regionId) public view returns (uint) {
        return regions[_regionId].accessCost;
    }

    function getRegion(uint _regionId) public payable {
        require(_regionId >= 0, "Invalid Region");
        require(_regionId < regions.length, "Invalid Region Id");
        require(regions.length > 0, "No Regions Avaialble");
        //require(regions[_regionId].contributors.length > 0, "No Contributions in this area");
        //require(regions[_regionId].contributors.length <= 100, "Exceeding Contributions Limit");
        require(uint(msg.value) == regions[_regionId].accessCost, "Not right access cost");
        
        Reg memory region = regions[_regionId];
        for(uint i = 0; i < region.contributors.length; i++) {
            uint amount = region.accessCost * region.contributors[i].numberOfContribs / region.accessCost;
            region.contributors[i].userAddress.transfer(amount);
        }
        
        myHash[msg.sender] = region.ipfsHash;
    }
    
    function getMyRegionHash() public view returns(string) {
        return myHash[msg.sender];
    }
    
    function getNumberOfHandouts() public view returns (uint) {
        return contribStats[msg.sender].numberOfHandouts;
    }
    
    function getNumberOfContribs() public view returns (uint) {
        return contribStats[msg.sender].numberOfContribs;
    }
    
    function payAmount() public payable {
        deposits[msg.sender] += msg.value;
    }
    
    function checkDeposit() public view returns(uint) {
        return deposits[msg.sender];
    }
    
    function createRegion(string _ipfsHash) public returns (uint) {
        regions.length++;
        regions[regions.length-1].ipfsHash = _ipfsHash;
        regions[regions.length-1].accessCost = initialAccessCost;
        regions[regions.length-1].totalContributions = 0;
        return regions.length;
    }

    function _updateRegion(address _contributor, uint _regionId, string _ipfsHash) private {
        require(_regionId < regions.length, "Invalid Region");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS Hash");
        
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
        handouts.push(Handout(globalHandoutId, msg.sender, _ipfsHash));
        globalHandoutId++;
        contribStats[msg.sender].numberOfHandouts++;
    }

    function getHandout() public returns (uint handoutId, address contributor, string ipfsHash) {
        require(fetched[msg.sender].handoutId == 0, "Already Fetched Contribution");
        require(handouts.length > 0, "No availavle handouts");
        
        handoutId = handouts[handouts.length - 1].handoutId;
        contributor = handouts[handouts.length - 1].owner;
        ipfsHash = handouts[handouts.length - 1].ipfsHash;
        
        fetched[msg.sender] = handouts[handouts.length - 1];
        handouts.length--;
    }

    function getMyHandout() public view returns (uint handoutId, address contributor, string ipfsHash) {
        require(fetched[msg.sender].handoutId != 0, "Did not fetch any conversation");
        handoutId = fetched[msg.sender].handoutId;
        contributor = fetched[msg.sender].owner;
        ipfsHash = fetched[msg.sender].ipfsHash;
    }

    function verifyHandout(uint _regionId, string ipfsHash) public {
        require(fetched[msg.sender].handoutId != 0, "Fetched no contribution");
        _updateRegion(fetched[msg.sender].owner, _regionId, ipfsHash);
        fetched[msg.sender].handoutId = 0;
        contribStats[fetched[msg.sender].owner].numberOfContribs++;
    }
}