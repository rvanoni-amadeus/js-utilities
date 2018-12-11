function Helper() { 
};
//Gets Parameter from URL
Helper.prototype.getParamFromUrl = function(parameter) {  
	var siteCode = "";
    if (location.search.length > 0 && location.search.match('&') !== -1) {
	    var arr = location.search.split('&');
	    for (i = 0; i < arr.length; i++) {
		     if (arr[i].indexOf(parameter) !== -1) {
		         siteCode = arr[i].split("=")[1];
		     }				 
	    }   
	}
 return siteCode
};
//Gets Parameter from Wait Until Object is available
Helper.prototype.$waitUntil = function(onComplete, delay, timeout, onAbort) {
  var counter = 1;
  var intervalId = setInterval(function() {		   
        if (counter === timeout) {
			onAbort();
			clearInterval(intervalId);
        } else if (typeof catalog !== "undefined") {
            onComplete();
			clearInterval(intervalId);
		}
		counter++;
       }, delay);
};
// Connection timed method if doesn't connect to catalogue
Helper.prototype.onAbort = function () {
   console.log('Catalog intial connection as timed out');   
};