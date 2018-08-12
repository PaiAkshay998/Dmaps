import Web3 from 'web3';
let processing = false;

if (typeof web3 !== 'undefined') {
    console.log("Using Metamask");
    web3 = new Web3(window.web3.currentProvider);
}

function loadBalance() {
    web3.eth.getAccounts().then((accounts, err) => {
        web3.eth.getBalance(accounts[0]).then((result, err) => {
            let ether = web3.utils.fromWei(result, 'ether');
            document.getElementById("user_balance").innerHTML = ether;
            document.getElementById("user_address").innerHTML = accounts[0];
        });
    });
}

var MyContract = new web3.eth.Contract([{
        "constant": true,
        "inputs": [],
        "name": "getNumberOfHandouts",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "uint256"
        }],
        "name": "regions",
        "outputs": [{
                "name": "ipfsHash",
                "type": "string"
            },
            {
                "name": "accessCost",
                "type": "uint256"
            },
            {
                "name": "totalContributions",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "uint256"
        }],
        "name": "handouts",
        "outputs": [{
                "name": "handoutId",
                "type": "uint256"
            },
            {
                "name": "owner",
                "type": "address"
            },
            {
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_ipfsHash",
            "type": "string"
        }],
        "name": "addHandout",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_regionId",
            "type": "uint256"
        }],
        "name": "getRegion",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getMyRegionHash",
        "outputs": [{
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "checkDeposit",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getNumberOfContribs",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "_regionId",
                "type": "uint256"
            },
            {
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "verifyHandout",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "getHandout",
        "outputs": [{
                "name": "handoutId",
                "type": "uint256"
            },
            {
                "name": "contributor",
                "type": "address"
            },
            {
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "address"
        }],
        "name": "myHash",
        "outputs": [{
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "payAmount",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "address"
        }],
        "name": "contribStats",
        "outputs": [{
                "name": "numberOfContribs",
                "type": "uint256"
            },
            {
                "name": "numberOfHandouts",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_ipfsHash",
            "type": "string"
        }],
        "name": "createRegion",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "_regionId",
            "type": "uint256"
        }],
        "name": "getRegionCost",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getMyHandout",
        "outputs": [{
                "name": "handoutId",
                "type": "uint256"
            },
            {
                "name": "contributor",
                "type": "address"
            },
            {
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "address"
        }],
        "name": "deposits",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]);
MyContract.options.address = "0x25f5e3dfe238054b4235aed7c24967137128438f";

async function verifier() {
    processing = true;
    let accounts = await web3.eth.getAccounts();
    document.getElementById("handout_status").innerHTML = "Registering to a handout";
    getHandout().then((res, err) => {
        console.log("in handouts");
        if (err) {
            document.getElementById("handout_status").innerHTML = "Already registered to a handout";
        }
        document.getElementById("handout_status").innerHTML = "Fetching Handout Address...";
        getMyHandout().then((data, err) => {
            console.log(data);
            document.getElementById("handout_current").innerHTML = data['handoutId'];
            document.getElementById("handout_owner").innerHTML = data['contributor'];
            document.getElementById("handout_ipfs").innerHTML = data['ipfsHash'];
            let ipfsHash = data['ipfsHash'];
            const ipfs = IpfsApi('localhost', 5001);
            document.getElementById("handout_status").innerHTML = "Fetching the Handout from IPFS...";            
            ipfs.files.get(ipfsHash, function (err, file) {
                if (err) {
                    console.log("trying to get ipfs");
                    console.log(err);
                    return;
                };
                console.log(file);
                document.getElementById("handout_status").innerHTML = "Processing Handout...";
                file.on('data', function (chunk) {
                    var newData = JSON.parse(chunk.content._readableState.buffer);
                    var regionId = newData['data'][0]['startRegion']
                    console.log(ipfsHash);
                    document.getElementById("handout_region").innerHTML = regionId;
                    document.getElementById("handout_status").innerHTML = "Fetching Region File...";
                    getRegion(parseInt(newData['data'][0]['startRegion'])).then((res, err) => {
                        if (err) {
                            console.log(err, "in get region");
                            return;
                        }
                        console.log("crossed get region");
                        getMyRegion().then((res, err) => {
                            if (err) {
                                console.log(err, "getmyregion");
                                return;
                            }
                            console.log(res, err);
                            let regionIdHash = res;
                            ipfs.files.get(regionIdHash, function (err, file) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                console.log("second ipfs!");
                                document.getElementById("handout_status").innerHTML = "Writing Updated File to IPFS...";
                                file.on('data', function (chunk) {
                                    var oldData = JSON.parse(chunk.content._readableState.buffer);
                                    for (var i = 0; i < newData['data'].length; i++) {
                                        oldData['data'].push(newData['data'][i]);
                                    }
                                    let hash;
                                    console.log("HERERHERHER");
                                    console.log("third ipfs!!!");
                                    ipfs.files.add(Buffer.from(JSON.stringify(oldData)), (err, result) => {
                                        if (err) {
                                            console.error(err)
                                            return
                                        }
                                        console.log("HIT!");
                                        hash = result[0].hash;
                                        console.log(hash, result[0].hash);
                                        document.getElementById("handout_status").innerHTML = "Verifying Handout";
                                        verifyHandout(regionId, hash);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

async function getHandout() {
    console.log("lol lol");
    let accounts = await web3.eth.getAccounts();
    console.log(accounts);
    return MyContract.methods.getHandout().send({
        from: accounts[0],
    }, function (err, result) {
        console.log(err, result, "lala");
    });
}

async function getMyHandout() {
    let accounts = await web3.eth.getAccounts();
    let data;
    return MyContract.methods.getMyHandout().call({
        from: accounts[0],
    });
}

async function verifyHandout(regionId, hash) {
    console.log(regionId, hash);
    let accounts = await web3.eth.getAccounts();
    MyContract.methods.verifyHandout(regionId, hash).send({
        from: accounts[0],
    }, function (err, result) {
        console.log(err, result);
        document.getElementById("handout_status").innerHTML = "Done";
        processing = false;
    });
}

async function getMyRegion() {
    let accounts = await web3.eth.getAccounts();
    return MyContract.methods.getMyRegionHash().call({
        from: accounts[0],
    });
}
async function updateNumberOfHandouts() {
    let accounts = await web3.eth.getAccounts();
    await MyContract.methods.getNumberOfHandouts().call({
        from: accounts[0]
    }, function (err, result) {
        if (result) {
            document.getElementById("number_handouts").innerHTML = result;
        } else {
            alert("Transaction Failed");
        }
    });
}

async function getRegion(regionId) {
    let accounts = await web3.eth.getAccounts();
    return MyContract.methods.getRegion(regionId).send({
        from: accounts[0],
        value: 10000
    });
}

window.onload = function() {
    loadBalance();
}

function handleVerifyClick() {
    if(!processing) {
        verifier();
    }
}

window.handleVerifyClick = handleVerifyClick;