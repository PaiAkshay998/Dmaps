import Web3 from 'web3';

if (typeof web3 !== 'undefined') {
    console.log("Using Metamask");
    web3 = new Web3(window.web3.currentProvider);
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

var startLatitude = 12.897835;
var startLongitude = 77.576369;
var latitudeDiff = -0.004531999999999907;
var longitudeDiff = 0.01386200000000315;
var contribEndPosLatitude, contribEndPosLongitude;

let isTracking = false;
var tracker;

function startTracking() {
    console.log("In Here");
    var contribStartPosLatitude, contribStartPosLongitude, startRegion = 0;
    var startLat, endLat, startLon, endLon;
    navigator.geolocation.getCurrentPosition(function showPosition(position) {
        endLat = position.coords.latitude;
        endLon = position.coords.longitude;
    });
    var dataAggregate = [];
    var timeElapsed = 0;
    tracker = window.setInterval(async function () {
        navigator.geolocation.getCurrentPosition(function showPosition(position) {
            startLat = endLat;
            startLon = endLon;
            endLat = position.coords.latitude;
            endLon = position.coords.longitude;
        });
        dataAggregate.push([startRegion, startLat, startLon, endLat, endLon]);
        document.getElementById("points_aggregate").innerHTML = dataAggregate.length;
        console.log(String(dataAggregate));
        timeElapsed++;
        console.log(dataAggregate.length);
        // after aggregating for five minutes, push to ipfs
        if (timeElapsed == 7) {
            dataAggregate.shift();
            dataAggregate.shift();
            dataAggregate.shift();
            console.log(dataAggregate);
            pushDataToIPFS(dataAggregate);
            dataAggregate = [];
            timeElapsed = 0;
            handleTrackingClick();
        }
    }, 1000);
}

function stopTracking() {
    window.clearInterval(tracker);
}

function pushDataToIPFS(dataAggregate) {
    const ipfs = IpfsApi('localhost', 5001);
    let json = {
        "data": []
    };
    for (var i = 0; i < dataAggregate.length; i++) {
        let data = {
            startRegion: dataAggregate[i][0],
            contribStartPosLatitude: dataAggregate[i][1],
            contribStartPosLongitude: dataAggregate[i][2],
            contribEndPosLatitude: dataAggregate[i][3],
            contribEndPosLongitude: dataAggregate[i][4],
        };
        json['data'].push(data);
    }
    console.log(json);
    let hash = '';
    ipfs.files.add(Buffer.from(JSON.stringify(json)), (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        hash = result[0].hash;
        console.log(hash, result[0].hash);
        addHandout(hash);
    });
}

function addHandout(ipfsHash) {
    web3.eth.getAccounts((err, accounts) => {
        console.log("reached here");
        MyContract.methods.addHandout(String(ipfsHash)).send({
            from: accounts[0]
        }, function (err, result) {
            console.log(err, result);
        });
    });
}

function handleTrackingClick() {
    if (isTracking) {
        isTracking = false;
        document.getElementById("control_tracking").innerHTML = "Start Tracking";
        stopTracking();
    } else {
        isTracking = true;
        document.getElementById("control_tracking").innerHTML = "Stop Tracking";
        startTracking();
    }
}

window.handleTrackingClick = handleTrackingClick;

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

async function updateNumberOfContribs() {
    let accounts = await web3.eth.getAccounts();
    await MyContract.methods.getNumberOfContribs().call({
        from: accounts[0]
    }, function (err, result) {
        if (result) {
            document.getElementById("number_contribs").innerHTML = result;
        } else {
            alert("Transaction Failed");
        }
    });
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

function getRegionId(latitude, longitude) {
    var lati = Math.abs(Math.floor((latitude - startLatitude) / latitudeDiff));
    var longi = Math.abs(Math.floor((longitude - startLongitude) / longitudeDiff));
    var regionId = lati * 3 + longi;
    return 0;
}

window.onload = function() {
    loadBalance();
    updateNumberOfContribs();
    updateNumberOfHandouts();
}