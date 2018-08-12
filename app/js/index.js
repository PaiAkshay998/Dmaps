import Web3 from 'web3';

if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
} else {
// set the provider you want from Web3.providers
    // var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

console.log(web3);

var startLatitude = 12.897835;
var startLongitude = 77.576369;

var latitudeDiff = -0.004531999999999907;
var longitudeDiff = 0.01386200000000315;

var data = [
    {"latitude1":10, "longitude1":20, "latitude2":30, "longitude2":40},
    {"latitude1":30, "longitude1":40, "latitude2":50, "longitude2":55},
    {"latitude1":50, "longitude1":55, "latitude2":60, "longitude2":65},
];

var MyContract = new web3.eth.Contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "addHandout",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "createRegion",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "getHandout",
		"outputs": [
			{
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
		"constant": false,
		"inputs": [
			{
				"name": "_regionId",
				"type": "uint256"
			}
		],
		"name": "getRegion",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": true,
		"stateMutability": "payable",
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
		"constant": false,
		"inputs": [
			{
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
		"constant": true,
		"inputs": [],
		"name": "checkDeposit",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "deposits",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "a",
				"type": "uint256"
			},
			{
				"name": "b",
				"type": "uint256"
			},
			{
				"name": "c",
				"type": "uint256"
			}
		],
		"name": "getDivision",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getMyHandout",
		"outputs": [
			{
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
		"inputs": [
			{
				"name": "_regionId",
				"type": "uint256"
			}
		],
		"name": "getRegionCost",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "handouts",
		"outputs": [
			{
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
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "regions",
		"outputs": [
			{
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
	}
]);
    MyContract.options.address = "0x359fc9b09cca62bb25386944bc5d6c06860d36b0";

function getData(regionId) {
    // var regionId = getRegionId(latitude, longitude);
    // var hash = Region.getRegion(regionId);
    return data;
}

function drawMap(ctx, data, currentLatitude, currentLongitude, currentRegion) {

    for (var i=0; i<data.length; i++) {
        ctx.moveTo(data[i]['latitude1'], data[i]['longitude1']);
        ctx.lineTo(data[i]['latitude2'], data[i]['longitude2']);
        ctx.stroke();
    }
    var latitude = currentRegion/3;
    var longitude = currentRegion%3;

    var x = (startLatitude + latitude*latitudeDiff) - currentLatitude;
    var y = currentLongitude - (startLongitude + longitude*longitudeDiff);
    x = Math.floor(x*Math.abs(500/latitudeDiff));
    y = Math.floor(y*Math.abs(500/longitudeDiff));
    ctx.fillRect(x, y, 1, 1);
}

function getRegionId(latitude, longitude) {
    var lati = Math.abs(Math.floor((latitude - startLatitude)/latitudeDiff));
    var longi = Math.abs(Math.floor((longitude- startLongitude)/longitudeDiff));
    var regionId = lati*3 + longi;
    return regionId;
}

function pushDataToIPFS(dataAggregate) {
    const ipfs = IpfsApi('localhost', 5001);
    let json = { "data": [] };
    for (var i=0; i<dataAggregate.length; i++) {
        let data = {
            startRegion: dataAggregate[i][0],
            contribStartPosLatitude: dataAggregate[i][1],
            contribStartPosLongitude: dataAggregate[i][2],
            contribEndPosLatitude: dataAggregate[i][3],
            contribEndPosLongitude: dataAggregate[i][4],
        };
        json['data'].push(data);
    }
    let hash = '';
    ipfs.files.add(Buffer.from(JSON.stringify(json)), (err, result) => {
        if(err) {
          console.error(err)
          return
        }
        hash = result[0].hash;
		console.log(hash, result[0].hash);
		addHandout(hash);
	});
}

window.onload = function() {
    var currentLatitude=0, currentLongitude=0;
    var currentRegion = -1;
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext("2d");

    ctx.strokeStyle="#FF0000";
	ctx.fillStyle = "blue";
	verifier();
    // setInterval(function(){
    //     var regionId = getRegionId(currentLatitude, currentLongitude);

    //     if (regionId != currentRegion) {
    //         navigator.geolocation.getCurrentPosition(function showPosition(position) {
    //             currentLatitude = position.coords.latitude;
    //             currentLongitude = position.coords.longitude;
    //         });
    //         currentRegion = regionId;
    //         data = getData(currentRegion);
    //     } else {
    //         navigator.geolocation.getCurrentPosition(function showPosition(position) {
    //             currentLatitude = position.coords.latitude;
    //             currentLongitude = position.coords.longitude;
    //         });
    //     }
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     drawMap(ctx, data, currentLatitude, currentLongitude, currentRegion);
    // }, 3000);

    // CONTRIBUTOR CODE STARTS HERE
        var contribStartPosLatitude, contribStartPosLongitude;
        navigator.geolocation.getCurrentPosition(function showPosition(position) {
            contribStartPosLatitude = position.coords.latitude;
            contribStartPosLongitude = position.coords.longitude;
        });
        var dataAggregate = []; 
        var count = 0;
        // setInterval(async function() {
        //     var contribEndPosLatitude, contribEndPosLongitude;
        //     navigator.geolocation.getCurrentPosition(function showPosition(position) {
        //         contribEndPosLatitude = position.coords.latitude;
        //         contribEndPosLongitude = position.coords.longitude;
        //     });
        //     // if he has changed his location
        //     if (! (contribEndPosLatitude == contribStartPosLatitude && contribEndPosLongitude == contribStartPosLongitude)) {
        //         // if he travels two regions, then he gets contribution to both regions
        //         var startRegion = getRegionId(contribStartPosLatitude, contribStartPosLongitude);
        //         dataAggregate.push([startRegion, contribStartPosLatitude, contribStartPosLongitude, contribEndPosLatitude, contribEndPosLongitude]);
        //     }
        //     count += 5;
        //     console.log(count);
        //     // after aggregating for five minutes, push to ipfs
        //     if (count >= 20) {
        //         let accounts = await web3.eth.getAccounts();
        //         pushDataToIPFS(dataAggregate);                
        //         dataAggregate = [];
        //         count = 0;
        //     }
		// }, 5000);
		/* let cost = getRegionCost(0);
		cost.then((res,err) => {
			console.log(res);
		}); */
		// getRegion(0);
}

function addHandout(ipfsHash) {
	web3.eth.getAccounts((err, accounts) => {
		console.log("reached here");
		MyContract.methods.addHandout(String(ipfsHash)).send({
			from: accounts[0],
			gasPrice: 5,
		}, function(err,result) {
			console.log(err,result);
		});
	});
}

async function getRegionCost(regionId) {
	let cost;
	await MyContract.methods.getRegionCost(regionId).call(function(err,result) {
		cost = result;
	});
	return cost;
}

async function getRegion(regionId) {
	let accounts = await web3.eth.getAccounts();
	await MyContract.methods.getRegion(regionId).send({
		from : accounts[0],
		value : 10000
	}, function(err,result) {
		console.log(err, result);
	});
}

async function createRegion(numberOfRegions) {
	let accounts = await web3.eth.getAccounts();
	for (var i=0; i<numberOfRegions; i++) {
		MyContract.methods.createRegion("0x"+ String(i)).send({
			from: accounts[0],
			gasPrice: 5
		})
	}
}

async function getHandout() {
	let accounts = await web3.eth.getAccounts();
	MyContract.methods.getHandout().send({
		from: accounts[0],
		gasPrice: 5
	}, function(err,result) {
		console.log(err,result);
	});
}

async function getMyHandout() {
	let accounts = await web3.eth.getAccounts();
	let data;
	await MyContract.methods.getMyHandout().call({
		from: accounts[0],
		gasPrice: 5
	}, function(err,result) {
		if (result) {
			data = result;
		}
	});
	return data;
}

async function verifier() {
	let accounts = await web3.eth.getAccounts();
	getHandout();
	let data = await getMyHandout();
	let ipfsHash = data['ipfsHash'];	
	console.log(typeof ipfsHash);
	verifyHandout(1, ipfsHash);
	console.log(data);
	return;
	const ipfs = IpfsApi('localhost', 5001);
	
	// read the hash from the handout
	ipfs.files.get(ipfsHash, function (err, file) {
		if (err) {
			console.log(err);
			return;
		}
		console.log(file);
		console.log(file.content);
		newData = readableToJson(file);
		var regionId = json['data'][0]['startRegion']
		var regionIdHash = (async function() {
			return await getRegion(parseInt(json['data'][0]['startRegion']));
		});
		
		// once you have the new data, get the old data of the region
		ipfs.files.get(regionIdHash, function(err, file) {
			oldData = readableToJson(file);
		
			// add the new data to the old data. formal verification goes here
			for (var i=0; i<newData['data'].length; i++) {			
				oldData['data'].push(newData['data'][i]);
			}
			let hash;

			// push the old data to the ipfs server and get the hash
			ipfs.files.add(Buffer.from(JSON.stringify(oldData)), (err, result) => {
				if(err) {
				  console.error(err)
				  return
				}
				hash = result[0].hash;
				console.log(hash, result[0].hash);
			});

			verifyHandout(regionId, hash);
		});
	});
}

async function verifyHandout(regionId, hash) {
	console.log(regionId, hash);
	let accounts = await web3.eth.getAccounts();
	MyContract.methods.verifyHandout(regionId, hash).send({
		from: accounts[0],
		gasPrice: 5
	}, function(err,result) {
		console.log(err,result);
	});
}