var Ypp = function() {};

Ypp.NavGo = function(path) {
  location.href = path;
};

Ypp.ExtGo = function(url) {
  window.open(url, '_blank');
};

Ypp.ExtQr = function(addr) {
  var url = 'https://blockchain.info/address/' + addr;
  window.open(url, '_blank');
};

Ypp.ExtBroadcast = function() {
   Ypp.ExtGo('https://helloblock.io/propagate');
};

Ypp.ExtHelloAddr = function(addr) {
  var url = 'https://helloblock.io/addresses/' + addr;
  window.open(url, '_blank');
};
Ypp.ExtGoogleMaps = function(latlon) {
    var url = 'https://maps.google.com/maps?q='+latlon+'&t=k';
    window.open(url, '_blank');
};

Ypp.ExtHelloTx = function(tx) {
  var url = 'https://helloblock.io/transactions/' + tx;
  window.open(url, '_blank');
};

Ypp.ExtBcInfoTx = function(tx) {
    var url = 'https://blockchain.info/tx/' + tx;
    window.open(url, '_blank');
};
