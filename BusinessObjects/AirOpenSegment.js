var AirOpenSegment = (function() {
    /**
     * Represents AirOpenSegment.
     *
     * @constructs AirOpenSegment
     * @property {number} ElementNo Element number
     * @property {string} SegmentName Segment name
     */
    function AirOpenSegment() {
        this.ElementNo;
        this.SegmentName;
        this.DepartureDate;
        this.BoardPoint;
        this.OffPoint;
        this.Text;
        this.Associations;
    }
    return AirOpenSegment;
})();

var AirOpenSegmentBuilder = (function() {
    /**
     * Represents AirOpenSegmentBuilder.
     *
     * @constructs AirOpenSegmentBuilder
     */
    function AirOpenSegmentBuilder() {}

    /**
     * Parsing AirOpenSegment.
     *
     * @memberof AirOpenSegmentBuilder
     * @instance
     * @param {data} PNR response
     * @returns {Array.<AirOpenSegment>} Array of AirOpenSegment objects
     */
    AirOpenSegmentBuilder.prototype.parseAirOpenSegments = function(data) {
        var objAir = new AirOpenSegment();
        var iAirOpenCount = 0;
        var itnrCount = 0;
        var identificationCode = null;
        var strAir = JSON.parse(data);
        var itineraryInfoData = [];
        var airOpenElems = [];
        if (strAir.response.model.output.response.originDestinationDetails) {
            var itineraryData = strAir.response.model.output.response.originDestinationDetails.itineraryInfo || null;
            if (itineraryData) {
                if (Array.isArray(itineraryData)) {
                    itineraryInfoData = itineraryData;
                } else {
                    itineraryInfoData.push(itineraryData);
                }
                // Loop for Itinerary Element to be added with AirOpenSegments
                for (itnrCount; itnrCount < itineraryInfoData.length; itnrCount += 1) {
                    // if segment is Open
                    identificationCode = itineraryInfoData[itnrCount].travelProduct.productDetails || null;
                    if ((itineraryInfoData[itnrCount].elementManagementItinerary.segmentName === 'AIR') && (identificationCode.identification === 'OPEN')) {
                        objAir.ElementNo = parseInt(itineraryInfoData[itnrCount].elementManagementItinerary.lineNumber);
                        objAir.SegmentName = itineraryInfoData[itnrCount].elementManagementItinerary.segmentName;
                        objAir.DepartureDate = (itineraryInfoData[itnrCount].travelProduct.product) ? itineraryInfoData[itnrCount].travelProduct.product.depDate : '1899-12-30T00:00:00';
                        objAir.BoardPoint = itineraryInfoData[itnrCount].travelProduct.boardpointDetail ? itineraryInfoData[itnrCount].travelProduct.boardpointDetail.cityCode : '';
                        objAir.OffPoint = itineraryInfoData[itnrCount].travelProduct.offpointDetail ? itineraryInfoData[itnrCount].travelProduct.offpointDetail.cityCode : '';
                        objAir.Associations = itineraryInfoData[itnrCount].referenceForSegment ? new AssociationBuilder().getAssociations(itineraryInfoData[itnrCount].referenceForSegment.reference) : null;
                        objAir.Text = itineraryInfoData[itnrCount];
                        // We add the Open air Segment to the collection
                        airOpenElems[iAirOpenCount] = objAir;
                        iAirOpenCount += 1;
                        objAir = new AirOpenSegment();
                    }
                }
            }
        }
        return airOpenElems;
    };

    return AirOpenSegmentBuilder;
})();