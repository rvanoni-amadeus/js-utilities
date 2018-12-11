var TicketingAirlineElement = (function() {
    /**
     * Represents TicketingAirlineElement.
     *
     * @constructs TicketingAirlineElement
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     * @property {number} ElementNo Element number
     * @property {string} Text text associated with this segment
     */
    function TicketingAirlineElement() {
        this.Associations;
        this.ElementNo;
        this.Text;
    }

    return TicketingAirlineElement;
})();

var TicketingAirlineElementBuilder = (function() {
    /**
     * Represents TicketingAirlineElementBuilder.
     *
     * @constructs TicketingAirlineElementBuilder
     */
    function TicketingAirlineElementBuilder() {}

    /**
     * Parses PNR response to get TicketingAirlineElements
     *
     * @memberof TicketingAirlineElementBuilder
     * @instance
     * @param {data} PNR Response
     * @returns {Array.<TicketingAirlineElement>} Array of TicketingAirlineElement objects
     */
    TicketingAirlineElementBuilder.prototype.parseTicketingAirlineElements = function(dataElementsIndivMap) {
        var TicketingAirlineElements = [];
        var allElems = dataElementsIndivMap.has(Constants.TicketingAirlineElementCode) ? dataElementsIndivMap.get(Constants.TicketingAirlineElementCode) : [];
        //loop through Ticketing Airline Element
        for (var index = 0; index < allElems.length; index++) {
            if (allElems[index]) {
                var objTicketingAirlineElement = new TicketingAirlineElement();
                objTicketingAirlineElement.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                objTicketingAirlineElement.ElementNo = allElems[index].elementManagementData.lineNumber ? parseInt(allElems[index].elementManagementData.lineNumber) : objTicketingAirlineElement.ElementNo;
                objTicketingAirlineElement.Text = allElems[index];
                TicketingAirlineElements.push(objTicketingAirlineElement);
            }
        }

        return TicketingAirlineElements;
    };

    return TicketingAirlineElementBuilder;
})();