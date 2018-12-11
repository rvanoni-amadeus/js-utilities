/**
 *parseEncDecCommand
 */
function parseEncDecCommand() {
    this.codes = {
        "decode": {
            "airport": "DAN",
            "city": "DAC",
            "nationality": "DC",
            "state": "DNS",
            "airline": "DNA",
            "boardingPoint": "DB",
            "aircraftType": "DNE",
            "hotelChain": "DNH",
            "carCompany": "DNC",
            "hotelRate": "DNN",
            "tourOrRail": "DNP",
            "statesOrProvinces": "DNS",
            "connectPoint": "DXS",
            "specialCarEquip": "CE"
        },
        "encode": {
            "state": "DNS",
            "airline": "DNA",
            "airCraft": "DNE",
            "hotel": "DNH",
            "car": "DNC",
            "hotelRate": "DNN",
            "tourOrRail": "DNP"
        }
    };

};

/**
 *sendEncodeDecode
 *@param {String} encryption or decryption type.
 *@param {String} Searvalue.
 *@param {String} City.
 */
parseEncDecCommand.prototype.sendEncodeDecode = function(encDecType, searchValue, city) {
    var self = this;
    var cmd = self.codes[encDecType][city] + ' ' + searchValue;
    return new Promise(function(fulfill, reject) {
        self.fulfill = fulfill;
        self.reject = reject;
        smartScriptSession.send(cmd)
            .then(function(data) {
            self.fulfill(data);
        });
    });
};