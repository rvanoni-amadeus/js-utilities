var AirItineraryInfo = (function() {
    /**
     * Represents AirItineraryInfo.
     *
     * @constructs AirItineraryInfo
     * @property {string} DestinationAirport Destination Airport code
     * @property {string} DepartureDate Departure Date in format 130816
     * @property {string} ArrivalDate Arrival Date in format 150816
     */
    function AirItineraryInfo() {
        this.DestinationAirport;
        this.DepartureDate;
        this.ArrivalDate;
    }

    return AirItineraryInfo;
})();

var AirItineraryInfoBuilder = (function() {
    /**
     * Represents AirItineraryInfoBuilder.
     *
     * @constructs AirItineraryInfoBuilder
     */
    function AirItineraryInfoBuilder() {}

    /**
     * Parsing AirItineraryInfo.
     *
     * @memberof AirItineraryInfoBuilder
     * @instance
     * @param {Object} mainData PNR response.
     * @param {Object} crypticData PNR cryptic reponse.
     * @param {Object} self PNR object.
     * @param {string} status PNR type whether its GroupPNR or SinglePNR.
     * @param {Object} ObjectData Object containing air and arnkSegments.
     * @returns {Object} Promise with fulfilled response containing an object
     */
    AirItineraryInfoBuilder.prototype.createAirItinerary = function(mainData, crypticData, self, status, ObjectData) {
        /*Map the segments after cryptic response is successful*/
        var itinerayObj = {};
        var airSegments = ObjectData["airSegment"];
        var arnkSegments = ObjectData["arnkSegment"];
        var retObj;
        var retVal;
        itinerayObj["DestinationAirport"] = null;
        itinerayObj["ArrivalDate"] = null;
        /** Previous logic was changed to have only one return statement */
        if (airSegments.length === 2 && arnkSegments.length === 0) {
            var DepartureCityCode = airSegments[1]["DepartureCityCode"];
            if(DepartureCityCode)
            {
                var SendcrypObj = new sendCrypticCommand();
                var departurePromise = SendcrypObj.SendCryptic("DB" + DepartureCityCode);
                retVal = departurePromise.then(function(departureData) {
                    var DepartureCityCode = ' ' + airSegments[1]["DepartureCityCode"] + ' ';
                    if (departureData.Response.indexOf(DepartureCityCode) > -1) {
                        itinerayObj["DestinationAirport"] = airSegments[0]["OffPoint"];
                        itinerayObj["ArrivalDate"] = airSegments[1]["ArrivalDate"];
                    } else {
                        itinerayObj["DestinationAirport"] = airSegments[1]["OffPoint"];
                        itinerayObj["ArrivalDate"] = airSegments[1]["ArrivalDate"];
                    }
                    retObj = {
                        mainData: mainData,
                        crypticData: crypticData,
                        self: self,
                        status: status,
                        itinerayObj: itinerayObj
                    };
                    return Promise.resolve(retObj);
                });
            }
            else{
                    retObj = {
                        mainData: mainData,
                        crypticData: crypticData,
                        self: self,
                        status: status,
                        itinerayObj: itinerayObj
                    };
                    retVal = Promise.resolve(retObj);
            }
        } else {
            if (airSegments.length === 1 && arnkSegments.length === 0) {
                itinerayObj["DestinationAirport"] = airSegments[0]["OffPoint"];
                itinerayObj["ArrivalDate"] = airSegments[0]["ArrivalDate"];
            } else {
                if (airSegments.length > 0) {
                    itinerayObj["ArrivalDate"] = airSegments[airSegments.length - 1]["ArrivalDate"];
                } else {
                    itinerayObj["ArrivalDate"] = "";
                }
            }
            retObj = {
                mainData: mainData,
                crypticData: crypticData,
                self: self,
                status: status,
                itinerayObj: itinerayObj
            };
            retVal = Promise.resolve(retObj);
        }
        return retVal;
    };

    /**
     * Parsing AirItineraryInfo.
     *
     * @memberof AirItineraryInfoBuilder
     * @instance
     * @param {Array.<AirSegment>} airSegmentArray Array of airSegment objects.
     * @returns {Array.<AirItineraryInfo>} Array of AirItineraryInfo objects.
     */
    AirItineraryInfoBuilder.prototype.parseAirItineraryInfo = function(airSegmentArray) {
        var airItineraryArr = [];
        // Check if there is some Air segments within the PNR
        if (airSegmentArray.length > 0) {
            var airItineraryObj = new AirItineraryInfo();
            airItineraryObj["DepartureDate"] = airSegmentArray[0]["DepartureDate"];
            airItineraryArr.push(airItineraryObj);
        }
        return airItineraryArr;
    };


    return AirItineraryInfoBuilder;
})();