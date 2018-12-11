var FareOriginalIssueElement = (function() {
    /**
     * Represents FareOriginalIssueElement.
     *
     * @constructs FareOriginalIssueElement
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     * @property {number} ElementNo Element number
     * @property {string} Text text associated with this segment
     */
    function FareOriginalIssueElement() {
        this.Associations;
        this.ElementNo;
        this.Text;
    }
    return FareOriginalIssueElement;
})();

var FareOriginalIssueElementBuilder = (function() {
    /**
     * Represents FareOriginalIssueElementBuilder.
     *
     * @constructs FareOriginalIssueElementBuilder
     */
    function FareOriginalIssueElementBuilder() {}

    /**
     * Parses PNR response to get FareOriginalIssueElements
     *
     * @memberof FareOriginalIssueElementBuilder
     * @instance
     * @param {data} PNR Response
     * @returns {Array.<FareOriginalIssueElement>} Array of FareOriginalIssueElement objects
     */
    FareOriginalIssueElementBuilder.prototype.parseFareOriginalIssueElements = function(dataElementsIndivMap) {
        var FareOriginalIssueElements = [];
        var allElems = dataElementsIndivMap.has(Constants.FareOriginalIssueElementCode) ? dataElementsIndivMap.get(Constants.FareOriginalIssueElementCode) : [];
        //loop through Fare OriginalIssue Element
        for (var index = 0; index < allElems.length; index++) {
            if (allElems[index]) {
                var objFareOriginalIssueElement = new FareOriginalIssueElement();
                objFareOriginalIssueElement.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                objFareOriginalIssueElement.ElementNo = allElems[index].elementManagementData.lineNumber ? parseInt(allElems[index].elementManagementData.lineNumber) : objFareOriginalIssueElement.ElementNo;
                objFareOriginalIssueElement.Text = allElems[index];
                FareOriginalIssueElements.push(objFareOriginalIssueElement);
            }
        }
        return FareOriginalIssueElements;
    };
    return FareOriginalIssueElementBuilder;
})();