/**
 * Represents a HelperCryptic.
 * @constructor
 */
function helperCryptic() {
    this.cmdResponse;
}
/**
 * GetCrypticResponse.
 * @param {Object} PNR Response.
 **/

helperCryptic.prototype.GetCrypticResponse = function(justData) {
    var self = this;
    self.cmdResponse = justData.toString();
    return new Promise(function(fulfill, reject) {
        self.fulfill = fulfill;
        self.reject = reject;
        //Removing extra spaces in the end for panel Mode
        self.cmdResponse = self.cmdResponse.replace(/\s+$/, "");
        if (self.cmdResponse.slice(-2) === ")>") {
            self.GetMultiPageResponse(self.cmdResponse);
        } else {
            self.fulfill(self.cmdResponse);
        }
    });
};

/**
 * GetMultiPageResponse.
 * @param {Text} CrypticData.
 **/

helperCryptic.prototype.GetMultiPageResponse = function(crypyData) {
    var self = this;
    self.cmdResponse = crypyData;
    var SendObj = new sendCrypticCommand();
    var responsePromise = SendObj.SendCrypticWS("mdr");
    responsePromise.then(function(mdData) {
        //Removing extra spaces in the end for panel Mode
        self.cmdResponse = self.cmdResponse.replace(/\s+$/, "");
        self.cmdResponse = self.cmdResponse.substr(0, self.cmdResponse.length - 2) + mdData.longTextString.textStringDetails.toString().replace(/\s+$/, "");
        if (self.cmdResponse.toString().slice(-2) === ")>") {
            self.GetMultiPageResponse(self.cmdResponse);
        } else {
            self.fulfill(self.cmdResponse);
        }
    });
};