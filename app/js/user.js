import Web3 from 'web3';

if (typeof web3 !== 'undefined') {
    console.log("Using Metamask");
    web3 = new Web3(window.web3.currentProvider);
}

var startLatitude = 12.892855;
var startLongitude = 77.584114;
var latitudeDiff = -0.00451800000000091;
var longitudeDiff = 0.00439899999999227;
var currentLatitude, currentLongitude, canvas, ctx, currentRegion = 0;

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

var startLatitude = 12.892855;
var startLongitude = 77.584114;
var latitudeDiff = -0.00451800000000091;
var longitudeDiff = 0.00439899999999227;

function loadBalance() {
    web3.eth.getAccounts().then((accounts, err) => {
        web3.eth.getBalance(accounts[0]).then((result, err) => {
            let ether = web3.utils.fromWei(result, 'ether');
            document.getElementById("user_balance").innerHTML = ether;
            document.getElementById("user_address").innerHTML = accounts[0];
        });
    });
}

function drawMap(data, currentLatitude, currentLongitude) {
    console.log("DATA", data);
    console.log(currentLatitude, currentLongitude);
    for (var i = 0; i < data.length; i++) {
        let lat1 = data[i]['contribStartPosLatitude'];
        let lat2 = data[i]['contribEndPosLatitude'];
        let lon1 = data[i]['contribStartPosLongitude'];
        let lon2 = data[i]['contribEndPosLongitude'];
        if(lon2 == undefined || lon1 == undefined || lat2 == undefined || lat1 ==undefined ) continue;
        console.log(data[i]);
        let x1, y1, x2, y2;
        x1 = (lat1 - currentLatitude) * 1000 / latitudeDiff + 250;
        x2 = (lat2 - currentLatitude) * 1000 / latitudeDiff + 250;
        y1 = (currentLongitude - lon1) * 1000 / longitudeDiff + 400;
        y2 = (currentLongitude - lon2) * 1000 / longitudeDiff + 400;
        console.log(x1,y1,x2,y2);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    var latitude = currentRegion / 3;
    var longitude = currentRegion % 3;

    console.log(latitude, longitude);

    var x = (startLatitude + latitude * latitudeDiff) - currentLatitude;
    var y = currentLongitude - (startLongitude + longitude * longitudeDiff);
    console.log(x, y);
    x = Math.floor(x * Math.abs(500 / latitudeDiff));
    y = Math.floor(y * Math.abs(500 / longitudeDiff));
    console.log(x, y);
    ctx.fillRect(x, y, 3, 3);
}

async function enduser() {
    var regionId = getRegionId(startLatitude, startLongitude);
    console.log(regionId);
    getRegion(regionId).then((res, err) => {
        const ipfs = IpfsApi('localhost', 5001);
        if (err) {
            console.log(err, "in get region");
            return;
        }
        console.log("1");
        getMyRegion().then((res, err) => {
            if (err) {
                console.log(err, "getmyregion");
                return;
            }
            console.log(res, 2);
            ipfs.files.get(res, function (err, file) {
                if (err) {
                    console.log("trying to get ipfs");
                    console.log(err);
                    return;
                };
                console.log(file);
                file.on('data', function (chunk) {
                    var data = JSON.parse(chunk.content._readableState.buffer);
                    data = data['data'];
                    navigator.geolocation.getCurrentPosition(function showPosition(position) {
                        currentLatitude = position.coords.latitude;
                        currentLongitude = position.coords.longitude;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        drawMap(data, currentLatitude, currentLongitude);
                    });

                });
            });
        });
    });
}

function getRegionId(latitude, longitude) {
    var lati = Math.abs(Math.floor((latitude - startLatitude) / latitudeDiff));
    var longi = Math.abs(Math.floor((longitude - startLongitude) / longitudeDiff));
    var regionId = lati * 3 + longi;
    return 0;
}

async function getRegion(regionId) {
    console.log('its fucked here', regionId);
    let accounts = await web3.eth.getAccounts();
    return MyContract.methods.getRegion(regionId).send({
        from: accounts[0],
        value: 10000
    });
}

async function getMyRegion() {
    let accounts = await web3.eth.getAccounts();
    return MyContract.methods.getMyRegionHash().call({
        from: accounts[0],
    });
}

window.onload = async function () {
    loadBalance();
    var currentLatitude = 0, currentLongitude = 0;
    var currentRegion = 0;
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext("2d");
    console.log(canvas, ctx);
    ctx.strokeStyle = "#FF0000";
    ctx.fillStyle = "blue";
    await enduser();
}

/**
 * getGPSLocation - Uses Chrome GeoLocation API to fetch GPS Coordinates
 * Returns Promise
 *  Resolve - [latitude, longitude]
 *  Reject - Error
 */
async function getGPSLocation() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(function (position) {
            resolve([position.coords.latitude, position.coords.longitude]);
        }, function (error) {
            if (error.code == error.PERMISSION_DENIED) {
                alert("Turn On GeoLocation API");
                reject(Error("Turn On GeoLocation API"));
            }
        });
    });
}

/**
 * getRegionId - Used to get Region Id of given coordinates
 *  Params - Latitude, Longitude
 *  Returns Promise
 */
async function getRegionId(lat, lon) {
    return new Promise((resolve, reject) => {
        if (!((lat <= 90) && (lat >= -90))) {
            console.log("Invalid Latitude");
            reject(Error("Invalid Latitude"));
        }
        if (!((lon <= 180) && (lat >= -180))) {
            console.log("Invalid Longitude");
            reject(Error("Invalid Longitude"));
        }
        if (lon == 180) lon = -180;
        if (lat == -90) lat = -89;
        lat = (90 - lat + 1);
        lon = (lon >= 0) ? (lon + 1) : (361 + lon);

        let regionId = lat * 1000 + lon;
        resolve(regionId);
    });
}

/**
 * renderUserLocationRegion - Renders Region in which User is.
 */
async function renderUserLocationRegion() {
    const getGPSPromise = getGPSLocation();
    let coords = await getGPSPromise;

    const getRegionIdPromise = getRegionId(coords[0], coords[1]);
    let regionId = await getRegionIdPromise;

    console.log(regionId);
}
