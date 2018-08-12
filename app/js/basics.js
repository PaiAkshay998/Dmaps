import Web3 from 'web3';

if (typeof web3 !== 'undefined') {
    console.log("Using Metamask");
    web3 = new Web3(window.web3.currentProvider);
} else {
    console.log("Something Went Wrong... Install Metamask");
    // set the provider you want from Web3.providers
    // var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

function loadBalance() {
    web3.eth.getAccounts().then((accounts,err) => {
        web3.eth.getBalance(accounts[0]).then((result, err) => {
            let ether = web3.utils.fromWei(result,'ether');
            document.getElementById("user_balance").innerHTML = ether;
            document.getElementById("user_address").innerHTML = accounts[0];
        });
    });
}

window.onload = function () {
    console.log("IN Basics");
    loadBalance();
}
