var TravelAssistanceElement = (function() {
    /**
     * Represents TravelAssistanceElement.
     *
     * @constructs TravelAssistanceElement
     * @property {number} ElementNo Element Number
     * @property {number} SegmentID Segment ID
     * @property {Object} Text TravelAssistanceElement info
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function TravelAssistanceElement() {
        this.ElementNo = '';
        this.SegmentID = '';
        this.Text;
        this.Associations;
    }

    return TravelAssistanceElement;
})();

var TravelAssistanceElementBuilder = (function() {
    /**
     * Represents TravelAssistanceElementBuilder.
     *
     * @constructs TravelAssistanceElementBuilder
     */
    function TravelAssistanceElementBuilder() {

    }

    /**
     * Parses PNR response to get TravelSegmentElements.
     *
     * @memberof TravelAssistanceElementBuilder
     * @instance
     * @param {Object} data PNR Response.
     * @returns {Array.<TravelAssistanceElement>} Array of TravelAssistanceElement objects
     */
    TravelAssistanceElementBuilder.prototype.parseTravelSegmentElements = function(data) {
        var travelAssistanceElements = [];
        var tarvelSegmentData = JSON.parse(data);
        if (tarvelSegmentData.response.model.output.response.originDestinationDetails) {
            var itinerayInfoVar = tarvelSegmentData.response.model.output.response.originDestinationDetails.itineraryInfo || null;
        }
        if (itinerayInfoVar) {
            addTravelSegment(itinerayInfoVar, travelAssistanceElements);
        }
        return travelAssistanceElements;
    };
    /**
     * Builds TravelAssistance Element object and adds it into an array.
     *
     * @memberof TravelAssistanceElementBuilder
     * @inner
     * @param {Object} itinerayInfoVar itinerary Object.
     * @param {Array.<TravelAssistanceElement>} travelAssistanceElements array of travel assistance elements.
     */
    function addTravelSegment(itinerayInfoVar, travelAssistanceElements) {
        var itineraryData  = [];
        if (Array.isArray(itinerayInfoVar)) {
            itineraryData = itinerayInfoVar;
        } else {
            itineraryData.push(itinerayInfoVar);
        }
        for (var i = 0; i < itineraryData.length; i++) {
            if (itineraryData[i].elementManagementItinerary.segmentName === "INS") {
                var objTravelSegment = new TravelAssistanceElement();
                objTravelSegment.ElementNo = parseInt(itineraryData[i].elementManagementItinerary.lineNumber);
                objTravelSegment.SegmentID = itineraryData[i].elementManagementItinerary.segmentName;
                objTravelSegment.Text = itineraryData[i];
                objTravelSegment.Associations = (itineraryData[i].referenceForSegment != null) ? new AssociationBuilder().getAssociations(itineraryData[i].referenceForSegment.reference) : null;
                travelAssistanceElements.push(objTravelSegment);
            }
        }
    }

    return TravelAssistanceElementBuilder;

})();