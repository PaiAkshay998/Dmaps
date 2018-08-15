const ethers = require('ethers');
const Wallet = ethers.Wallet;
const Contract = ethers.Contract;
const utils = ethers.utils;
const providers = ethers.providers;

var wallet = {
    address: "0x52E338656b5409ECf2a45D4d349Fa7226fCF20ec",
    privateKey: "0x66fba1cf820478e61494570a71c24547c9ff943932c9fd08776b2b5982ec5439",
    network: "",
    etherscanProvider: "",
    provide: ""
};

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

/* function addHandout(ipfsHash) {
    web3.eth.getAccounts((err, accounts) => {
        console.log("reached here");
        MyContract.methods.addHandout(String(ipfsHash)).send({
            from: accounts[0]
        }, function (err, result) {
            console.log(err, result);
        });
    });
} */

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

/* async function updateNumberOfHandouts() {
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
} */

/* async function updateNumberOfContribs() {
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
} */

/* function loadBalance() {
    web3.eth.getAccounts().then((accounts, err) => {
        web3.eth.getBalance(accounts[0]).then((result, err) => {
            let ether = web3.utils.fromWei(result, 'ether');
            document.getElementById("user_balance").innerHTML = ether;
            document.getElementById("user_address").innerHTML = accounts[0];
        });
    });
} */

function getRegionId(latitude, longitude) {
    var lati = Math.abs(Math.floor((latitude - startLatitude) / latitudeDiff));
    var longi = Math.abs(Math.floor((longitude - startLongitude) / longitudeDiff));
    var regionId = lati * 3 + longi;
    return 0;
}

function calculateRegion(lat, lon) {
    if(!((lat <= 90) && (lat >= -90))) {
        console.log("Invalid Latitude");
        return -1;
    }
    if (!((lon <= 180) && (lat >= -180))) {
        console.log("Invalid Longitude");
        return -1;
    }
    if(lon == 180) lon = -180;
    if(lat == -90) lat = -89; 
    lat = (90 - lat + 1);
    lon = (lon >= 0) ? (lon+1) : (361 + lon);
    return (lat*1000 + lon);
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
        }, function(error) {
            if (error.code == error.PERMISSION_DENIED) {
                alert("Turn On GeoLocation API");
                reject(Error("Turn On GeoLocation API"));
            }
        });
    });
}

/**
 * getRegion - Used to get Region Id of given coordinates
 *  Params - Latitude, Longitude
 *  Returns Promise
 */
async function getRegion(lat, lon) {
    return new Promise((resolve, reject) => {
        let regionId = calculateRegion(Math.ceil(lat), Math.floor(lon));
        
        if(regionId == -1) {
            reject(Error("Check if your GPS Device is working properly..."));
        }
        else {
            resolve(regionId);
        }
    });
}

/**
 * renderUserLocationRegion - Renders Region in which User is.
 */
async function renderUserLocationRegion() {
    const getGPSPromise = getGPSLocation();
    let coords = await getGPSPromise;

    const getRegionPromise = getRegion(coords[0],coords[1]);
    let regionId = await getRegionPromise;

    console.log(regionId);
}

/**
 * initializeWallet - Initializes Global Wallet with provider and network
 */
function intializeWallet() {
    wallet.network = providers.networks.kovan;
    wallet.etherscanProvider = new providers.EtherscanProvider(wallet.network);
    wallet.provider = providers.getDefaultProvider(wallet.network);
}

window.onload = function() {
    intializeWallet();
}