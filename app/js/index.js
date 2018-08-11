import Web3 from 'web3';

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
} else {
// set the provider you want from Web3.providers
    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

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
	}
]);
    MyContract.options.address = "0xca8455adb750c829078b7759617c624a68bb8bb9";

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
    });
    return hash;
}

window.onload = function() {
    var currentLatitude=0, currentLongitude=0;
    var currentRegion = -1;
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext("2d");

    ctx.strokeStyle="#FF0000";
    ctx.fillStyle = "blue";

    setInterval(function(){
        var regionId = getRegionId(currentLatitude, currentLongitude);

        if (regionId != currentRegion) {
            navigator.geolocation.getCurrentPosition(function showPosition(position) {
                currentLatitude = position.coords.latitude;
                currentLongitude = position.coords.longitude;
            });
            currentRegion = regionId;
            data = getData(currentRegion);
        } else {
            navigator.geolocation.getCurrentPosition(function showPosition(position) {
                currentLatitude = position.coords.latitude;
                currentLongitude = position.coords.longitude;
            });
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap(ctx, data, currentLatitude, currentLongitude, currentRegion);
    }, 3000);

    // CONTRIBUTOR CODE STARTS HERE
        var contribStartPosLatitude, contribStartPosLongitude;
        navigator.geolocation.getCurrentPosition(function showPosition(position) {
            contribStartPosLatitude = position.coords.latitude;
            contribStartPosLongitude = position.coords.longitude;
        });
        var dataAggregate = []; 
        var count = 0;
        setInterval(async function() {
            var contribEndPosLatitude, contribEndPosLongitude;
            navigator.geolocation.getCurrentPosition(function showPosition(position) {
                contribEndPosLatitude = position.coords.latitude;
                contribEndPosLongitude = position.coords.longitude;
            });
            // if he has changed his location
            if (! (contribEndPosLatitude == contribStartPosLatitude && contribEndPosLongitude == contribStartPosLongitude)) {
                // if he travels two regions, then he gets contribution to both regions
                var startRegion = getRegionId(contribStartPosLatitude, contribStartPosLongitude);
                dataAggregate.push([startRegion, contribStartPosLatitude, contribStartPosLongitude, contribEndPosLatitude, contribEndPosLongitude]);
            }
            count += 5;
            console.log(count);
            // after aggregating for five minutes, push to ipfs
            if (count >= 20) {
                let accounts = await web3.eth.getAccounts();
                var hash = pushDataToIPFS(dataAggregate);
                MyContract.addHandout(hash, {
                    from: accounts[0],
                    gas: await MyContract.methods.addHandout.estimateGas(hash, {from: web3.eth.accounts[0]}) + 1000, 
                    gasPrice: 5
                });
                dataAggregate = [];
                count = 0;
            }
        }, 5000);
    // CONTRIBUTOR CODE ENDS HERE
}
