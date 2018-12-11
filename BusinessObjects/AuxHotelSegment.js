var AuxHotelSegment = (function() {
    /**
     * Represents AuxHotelSegment.
     *
     * @constructs AuxHotelSegment
     * @property {number} ElementNo Element number
     * @property {string} SegmentID Segment name
     * @property {string} City City name
     * @property {string} FreeFlow FreeFlow
     * @property {string} Text text associated with this segment
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function AuxHotelSegment() {
        this.ElementNo;
        this.SegmentID;
        this.Associations;
        this.City;
        this.FreeFlow;
        this.Text;
    }
    return AuxHotelSegment;
})();

var AuxHotelSegmentBuilder = (function() {
    /**
     * Represents AuxHotelSegmentBuilder.
     *
     * @constructs AuxHotelSegmentBuilder
     */
    function AuxHotelSegmentBuilder() {}

    /**
     * Parsing AuxHotelSegment.
     *
     * @memberof AuxHotelSegmentBuilder
     * @instance
     * @param {data} PNR response
     * @returns {Array.<AuxHotelSegment>} Array of AuxHotelSegment objects
     */
    AuxHotelSegmentBuilder.prototype.parseAuxHotelSegments = function(dataElementsIndivMap) {
        var auxHotelElems = [];
        var allElems = dataElementsIndivMap.has(Constants.AuxHotelSegmentCode) ? dataElementsIndivMap.get(Constants.AuxHotelSegmentCode) : [];
        for (var i = 0; i < allElems.length; i++) {
            // Check if there is some  AUX Hotel segments within the PNR
            if (allElems[i]) {
                objHotel = new AuxHotelSegment();
                objHotel.ElementNo = allElems[i].elementManagementItinerary.lineNumber ? parseInt(allElems[i].elementManagementItinerary.lineNumber) : objHotel.ElementNo;
                objHotel.SegmentID = allElems[i].elementManagementItinerary.segmentName;
                objHotel.FreeFlow = (allElems[i].itineraryFreetext) ? allElems[i].itineraryFreetext.longFreetext : objHotel.FreeFlow;
                objHotel.City = allElems[i].travelProduct.boardpointDetail.cityCode;
                objHotel.Text = allElems[i];
                objHotel.Associations = (allElems[i].referenceForSegment != null) ? getAssociations(allElems[i].referenceForSegment.reference) : null;
                auxHotelElems.push(objHotel);
            }
        }
        return auxHotelElems;
    };

    /**
     * Get Associations
     *
     * @memberOf AuxHotelSegmentBuilder
     * @inner
     * @param {Array} references AuxHotelSegment's references in PNR response
     * @returns {Array.<Association>} Array of Association objects
     */
    function getAssociations(references) {
        var associations = [];
        var referencesArray = [];
        if (Array.isArray(references)) {
            referencesArray = references;
        } else {
            referencesArray.push(references);
        }
        var refLength = referencesArray.length;
        for (var refCount = 0; refCount < refLength; refCount++) {
            var association = new Association();
            association.TatooNumber = referencesArray[refCount].number;
            association.Qualifier = referencesArray[refCount].qualifier;
            associations[refCount] = association;
        }
        return associations;
    }

    return AuxHotelSegmentBuilder;
})();