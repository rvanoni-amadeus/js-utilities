var AirARNKSegment = (function() {
    /**
     * Represents ARNKSegment.
     *
     * @constructs ARNKSegment
     * @property {number} ElementNo Element Number
     * @property {string} SegmentName Segment Name
     */
    function AirARNKSegment() {
        this.ElementNo = '';
        this.SegmentName = '';
        this.Associations = null;
        this.Text = null;
        this.DepartureDate = null;
    }

    return AirARNKSegment;
})();

var AirARNKSegmentBuilder = (function() {
    /**
     * Represents AirARNKSegmentBuilder.
     *
     * @constructs AirARNKSegmentBuilder
     */
    function AirARNKSegmentBuilder() {}

    /**
     * Parses PNR response to get AirARNKSegments
     *
     * @memberof AirARNKSegmentBuilder
     * @instance
     * @param {Object} data PNR response
     * @returns {Array.<AirARNKSegment>} Array of AirARNKSegment objects
     */
    AirARNKSegmentBuilder.prototype.parseAirARNKSegments = function(data) {
        var objAir = new AirARNKSegment();
        var iAirARNKCount = 0;
        var itnrCount = 0;
        var identificationCode = null;
        var strAir = JSON.parse(data);
        var itineraryInfoData = [];
        var airARNKElems = [];
        if (strAir.response.model.output.response.originDestinationDetails) {
            var itineraryData = strAir.response.model.output.response.originDestinationDetails.itineraryInfo || null;
        }
        if (itineraryData) {
            // Check if there is some Air segments within the PNR
            if (Array.isArray(itineraryData)) {
                itineraryInfoData = itineraryData;
            } else {
                itineraryInfoData.push(itineraryData);
            }
            // Loop for Itinerary Element to be added with AirARNKSegments
            for (itnrCount; itnrCount < itineraryInfoData.length; itnrCount += 1) {
                identificationCode = itineraryInfoData[itnrCount].travelProduct.productDetails || null;
                if ((itineraryInfoData[itnrCount].elementManagementItinerary.segmentName === 'AIR') && (identificationCode.identification === 'ARNK')) {
                    objAir.ElementNo = parseInt(itineraryInfoData[itnrCount].elementManagementItinerary.lineNumber);
                    objAir.SegmentName = itineraryInfoData[itnrCount].elementManagementItinerary.segmentName;
                    if (itineraryInfoData[itnrCount].travelProduct.product !== undefined) {
                        objAir.DepartureDate = itineraryInfoData[itnrCount].travelProduct.product.depDate;
                    }
                    objAir.Text = itineraryInfoData[itnrCount];
                    objAir.Associations = itineraryInfoData[itnrCount] ? new AssociationBuilder().getAssociations(itineraryInfoData[itnrCount]["elementManagementItinerary"]["reference"]) : null;
                    // We add the Active air Segment to the collection
                    airARNKElems[iAirARNKCount] = objAir;
                    iAirARNKCount += 1;
                    objAir = new AirARNKSegment();
                }
            }
        }
        return airARNKElems;
    };

    return AirARNKSegmentBuilder;
})();