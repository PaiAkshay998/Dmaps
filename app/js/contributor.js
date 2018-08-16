import { abi, contractAddress } from '../contractInfo';
const ethers = require('ethers');
const zlib = require('zlib');
const Wallet = ethers.Wallet;
const Contract = ethers.Contract;
const utils = ethers.utils;
const providers = ethers.providers;

let wallet,
    contract,
    handout = [],
    timer,
    isTracking = false;

function intializeWallet() {
    var wallet = {
        address: "0x52E338656b5409ECf2a45D4d349Fa7226fCF20ec",
        privateKey: "0x66fba1cf820478e61494570a71c24547c9ff943932c9fd08776b2b5982ec5439",
    };

    wallet.network = providers.networks.kovan;
    wallet.etherscanProvider = new providers.EtherscanProvider(wallet.network);
    wallet.provider = providers.getDefaultProvider(wallet.network);
    wallet.user = new Wallet(wallet.privateKey, wallet.provider);

    return wallet;
}

function initializeContract() {
    return new Contract(contractAddress, abi, wallet.user);
}

function getNumberOfHandouts() {
    contract.functions.getNumberOfHandouts().then((result) => {
        if (result) {
            document.getElementById("number_handouts").innerHTML = result;
        } else {
            alert("Unable to fetch details from Contract");
        }
    });
}

function getNumberOfContributions() {
    contract.functions.getNumberOfContribs().then((result) => {
        if (result) {
            document.getElementById("number_contribs").innerHTML = result;
        } else {
            alert("Unable to fetch details from Contract... Check your internet connection.");
        }
    });
}

function loadUserBalance() {
    document.getElementById("user_address").innerHTML = wallet.address;
    wallet.provider.getBalance(wallet.address).then((balance) => {
        let ether = utils.formatEther(balance);
        document.getElementById("user_balance").innerHTML = ether;
    });
}

function loadUserDetails() {
    getNumberOfContributions();
    getNumberOfHandouts();
    loadUserBalance();
}

function setStatus(status) {
    document.getElementById("app_status").innerHTML = status;
}

function trackCurrentPoint() {
    navigator.geolocation.getCurrentPosition(function (position) {
        handout.push([position.coords.latitude, position.coords.longitude]);
        document.getElementById("points_aggregate").innerHTML = handout.length;
    }, function (error) {
        if (error.code == error.PERMISSION_DENIED) {
            reject(Error("Turn On GeoLocation API"));
        }
    });
}

async function compressHandout(handout) {
    var buffer = new Buffer(handout, 'utf8');
    return new Promise((resolve, reject) => {
        zlib.deflate(buffer, function (err, data) {
            resolve(data);
        });
    });
}

async function uploadToIPFS(compressedHandout) {
    const ipfs = IpfsApi('localhost', 5001);
    return new Promise((resolve, reject) => {
        ipfs.files.add(Buffer.from(compressedHandout), (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                let hash = result[0].hash;
                resolve(hash);
            }
        });
    });
}

function addHandout(ipfsHash) {
    return new Promise((resolve, reject) => {
        let addHandoutCallback = contract.functions.addHandout(ipfsHash);
        addHandoutCallback.then((transaction) => {
            wallet.provider.waitForTransaction(transaction.hash).then(transaction => {
                resolve(transaction);
            }).catch(err => {
                reject(err);
            });
        });
    });
}

async function processHandout(handout) {
    let compressedHandout = await compressHandout(handout);
    setStatus("Compressed File....");
    let ipfsHash = await uploadToIPFS(compressedHandout);
    setStatus("Uploaded to IPFS at " + ipfsHash + "... Transaction being made with contract");
    let transactionHash = await addHandout(ipfsHash);
    setStatus("Transaction Mined at Hash : " + transactionHash.hash +
        "\nBlock Number: " + transactionHash.blockNumber +
        "\nBlock Hash: " + transactionHash.blockHash);
}

function startTracking() {
    timer = setInterval(trackCurrentPoint, 1000);
}

function stopTracking() {
    clearInterval(timer);
    let json = JSON.stringify(handout);
    processHandout(json);
    handout.length = 0;
}

function handleTrackingClick() {
    if (isTracking) {
        document.getElementById("control_tracking").innerHTML = "Start Tracking";
        stopTracking();
    } else {
        document.getElementById("control_tracking").innerHTML = "Stop Tracking";
        setStatus("Tracking...");
        startTracking();
    }
    isTracking = !isTracking;
}
window.handleTrackingClick = handleTrackingClick;

window.onload = function() {
    wallet = intializeWallet();
    contract = initializeContract();
    loadUserDetails();
}