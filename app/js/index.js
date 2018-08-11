import EmbarkJS from 'Embark/EmbarkJS';
import Region from 'Embark/contracts/Region';
// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

var data = [
    {"latitude1":10, "longitude1":20, "latitude2":30, "longitude2":40},
    {"latitude1":30, "longitude1":40, "latitude2":50, "longitude2":55},
    {"latitude1":50, "longitude1":55, "latitude2":60, "longitude2":65},
];

// for now, we'll be assuming that our world is split into 9 regions
var startLatitude = 12.897835;
var startLongitude = 77.576369;

var latitudeDiff = -0.004531999999999907;
var longitudeDiff = 0.01386200000000315;

function getData(regionId) {
    // var regionId = getRegionId(latitude, longitude);
    // var hash = Region.getRegion(regionId);
    // //
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
    console.log(json);
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
        setInterval(function() {
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
                pushDataToIPFS(dataAggregate);
                dataAggregate = [];
                count = 0;
            }
        }, 5000);
    // CONTRIBUTOR CODE ENDS HERE
}
