/**
 * Represents a sendCrypticCommand.
 * @constructor
 */
function sendCrypticCommand() {}

/**
 * SendCryptic.
 * @memberOf sendCrypticCommand
 * @param {string} cmd cryptic command.
 */
sendCrypticCommand.prototype.SendCryptic = function(cmd) {
    var self = this;
	return new Promise(function(fulfill, reject) {
		self.fulfill = fulfill;
		self.reject = reject;
		smartScriptSession.send(cmd)
            .then(function(crypticData) {
                self.CrypticCallBack(crypticData);
            });
	});
};

/**
 * SendCrypticWS, send a cryptic command using the webservice
 * @memberOf sendCrypticCommand
 * @param {string} cmd cryptic command.
 */
sendCrypticCommand.prototype.SendCrypticWS = function (cmd) {
    var self = this;
    return new Promise(function (fullfill, reject) {
        self.fulfill = fullfill;
        self.reject = reject;
        var input = JSON.parse('{"messageAction": {"messageFunctionDetails":{"messageFunction":"M"}},"longTextString":{ "textStringDetails":"' + cmd + '"}}');
        smartScriptSession.sendWS("ws.commandCryptic_v7.3.1A", input)
            .then(function (crypticData) {
                //console.log(crypticData);
                self.CrypticWSCallBack(crypticData);
            }, function (failure) {
                console.log("SendCrypticWS failure: "+failure);
            });
    });
};

/**
 * CrypticCallBack.
 * @memberOf sendCrypticCommand
 * @inner
 * @param {Object} crypticData cryptic response data object
 */
sendCrypticCommand.prototype.CrypticCallBack = function(crypticData) {
    var self = this;
    //Removing extra spaces in the end for panel Mode
    crypticData.Response = crypticData.Response.toString().replace(/\s+$/, "");
    self.fulfill(crypticData);
};

/**
 * Callback function for Cryptic Command webservice call
 * @memberOf sendCrypticCommand
 * @inner
 * @param {Object} crypticWSData response of cryptic command webservice
 */
sendCrypticCommand.prototype.CrypticWSCallBack = function(crypticWSData) {
    var self = this;
    try {
        //Removing extra spaces at the end of response in panel Mode
        crypticWSData.longTextString.textStringDetails = crypticWSData.longTextString.textStringDetails.toString().replace(/\s+$/, "");
        self.fulfill(crypticWSData);
    } catch(e){
        self.reject(e.message);
    }
};
