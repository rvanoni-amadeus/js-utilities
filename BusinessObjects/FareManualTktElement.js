var FareManualTktElement = (function() {
    /**
     * Represents FareManualTktElement.
     *
     * @constructs FareManualTktElement
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     * @property {number} ElementNo Element number
     * @property {string} Text text associated with this segment
     */
    function FareManualTktElement() {
        this.Associations;
        this.ElementNo;
        this.Text;
    }

    return FareManualTktElement;
})();

var FareManualTktElementBuilder = (function() {
    /**
     * Represents FareManualTktElementBuilder.
     *
     * @constructs FareManualTktElementBuilder
     */
    function FareManualTktElementBuilder() {}

    /**
     * Parses PNR response to get FareManualTktElements
     *
     * @memberof FareManualTktElementBuilder
     * @instance
     * @param {data} PNR Response
     * @returns {Array.<FareManualTktElement>} Array of FareManualTktElement objects
     */
    FareManualTktElementBuilder.prototype.parseFareManualTktElements = function(dataElementsIndivMap) {
        var FareManualTktElements = [];
        var allElems = dataElementsIndivMap.has(Constants.FareManualTktElementCode) ? dataElementsIndivMap.get(Constants.FareManualTktElementCode) : [];
        //loop through Fare ManualTkt Element Element
        for (var index = 0; index < allElems.length; index++) {
            if (allElems[index]) {
                var objFareManualTktElement = new FareManualTktElement();
                objFareManualTktElement.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                objFareManualTktElement.ElementNo = allElems[index].elementManagementData.lineNumber ? parseInt(allElems[index].elementManagementData.lineNumber) : objFareManualTktElement.ElementNo;
                objFareManualTktElement.Text = allElems[index];
                FareManualTktElements.push(objFareManualTktElement);
            }
        }

        return FareManualTktElements;
    };

    return FareManualTktElementBuilder;
})();