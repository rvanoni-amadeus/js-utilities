var AuxCarSegment = (function() {
    /**
     * Represents AuxCarSegment.
     *
     * @constructs AuxCarSegment
     * @property {number} ElementNo Element number
     * @property {string} SegmentID Segment name
     * @property {string} PickupDate pick up date
     * @property {string} ReturnDate return date
     * @property {Array.<Association>} Associations Passenger Associations
     * @property {string} City City
     * @property {string} Text text associated with this segment
     */
    function AuxCarSegment() {
        this.ElementNo;
        this.SegmentID;
        this.PickupDate;
        this.ReturnDate;
        this.Associations;
        this.City;
        this.Text;
    }

    return AuxCarSegment;
})();

var AuxCarSegmentBuilder = (function() {
    /**
     * Represents AuxCarSegmentBuilder.
     *
     * @constructs AuxCarSegmentBuilder
     */
    function AuxCarSegmentBuilder() {}

    /**
     * Parses PNR response and gets AuxCarSegments
     *
     * @memberof AuxCarSegmentBuilder
     * @instance
     * @param {data} PNR response
     * @returns {Array.<AuxCarSegment>} Array of AuxCarSegment objects
     */
    AuxCarSegmentBuilder.prototype.parseAuxCarSegments = function(data) {
        var auxCarElems = [];
        var auxCarSegmentData = JSON.parse(data);
        if (auxCarSegmentData.response.model.output.response.originDestinationDetails) {
            var itinerayInfoVar = auxCarSegmentData.response.model.output.response.originDestinationDetails.itineraryInfo || null;
        }
        if (itinerayInfoVar) {
            addAuxCarSegment(itinerayInfoVar, auxCarElems);
        }
        return auxCarElems;
    };

    /**
     * Filters AuxCarSegments from PNR response, builds AuxCarSegment object and adds them into an Array
     *
     * @memberOf AuxCarSegmentBuilder
     * @inner
     * @param {Object} PNR Response.
     * @param {Array} auxCarElems Array of aux car elements.
     */
    function addAuxCarSegment(itinerayInfoVar, auxCarElems) {
        var itineraryData = [];
        if (Array.isArray(itinerayInfoVar)) {
            itineraryData = itinerayInfoVar;
        } else {
            itineraryData.push(itinerayInfoVar);
        }
        for (var itineryCount = 0; itineryCount < itineraryData.length; itineryCount++) {
            if (itineraryData[itineryCount].elementManagementItinerary.segmentName === "CU") {
                var objAuxCarSegment = new AuxCarSegment();
                objAuxCarSegment.ElementNo = (itineraryData[itineryCount].elementManagementItinerary.lineNumber) ? parseInt(itineraryData[itineryCount].elementManagementItinerary.lineNumber) : objCarSegment.ElementNo;
                objAuxCarSegment.SegmentID = itineraryData[itineryCount].elementManagementItinerary.segmentName;
                objAuxCarSegment.PickupDate = itineraryData[itineryCount].travelProduct.product.depDate;
                objAuxCarSegment.ReturnDate = itineraryData[itineryCount].travelProduct.product.arrDate;
                objAuxCarSegment.Associations = (itineraryData[itineryCount].referenceForSegment != null) ? new AssociationBuilder().getAssociations(itineraryData[itineryCount].referenceForSegment.reference) : null;
                objAuxCarSegment.City = itineraryData[itineryCount].travelProduct.boardpointDetail.cityCode;
                objAuxCarSegment.Text = itineraryData[itineryCount];
                auxCarElems.push(objAuxCarSegment);
            }
        }
    }

    return AuxCarSegmentBuilder;
})();