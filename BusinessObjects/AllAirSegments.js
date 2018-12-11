var AllAirSegmentsBuilder = (function() {
    /**
     * Represents AllAirSegmentsBuilder.
     *
     * @constructs AllAirSegmentsBuilder
     */
    function AllAirSegmentsBuilder() {}

    /**
     * Parses through AirSegments, AirFlownSegments, AirOpenSegments and adds them into an Array
     *
     * @memberof AllAirSegmentsBuilder
     * @instance
     * @param {Object} objPNR PNR Object
     * @returns {Array.<AirSegment>} Array of AirSegment objects
     */
    AllAirSegmentsBuilder.prototype.parseAllAirSegments = function(objPNR) {
        var counter = 0;
        var allAirElems = [];
        if (objPNR.AirSegments.length > 0) {
            allAirElems[counter] = objPNR.AirSegments;
            counter++;
        }
        if (objPNR.AirFlownSegments.length > 0) {
            allAirElems[counter] = objPNR.AirFlownSegments;
            counter++;
        }
        if (objPNR.AirOpenSegments.length > 0) {
            allAirElems[counter] = objPNR.AirOpenSegments;
        }

        return allAirElems;
    };

    return AllAirSegmentsBuilder;
})();