var FareMiscTktInfoElement = (function() {
    /**
     * Represents FareMiscTktInfoElement.
     *
     * @constructs FareMiscTktInfoElement
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     * @property {number} ElementNo Element number
     * @property {string} Text text associated with this segment
     */
    function FareMiscTktInfoElement() {
        this.Associations;
        this.ElementNo;
        this.Text;
    }

    return FareMiscTktInfoElement;
})();

var FareMiscTktInfoElementBuilder = (function() {
    /**
     * Represents FareMiscTktInfoElementBuilder.
     *
     * @constructs FareMiscTktInfoElementBuilder
     */
    function FareMiscTktInfoElementBuilder() {}

    /**
     * Parses PNR response to get FareMiscTktInfoElements
     *
     * @memberof FareMiscTktInfoElementBuilder
     * @instance
     * @param {data} PNR Response
     * @returns {Array.<FareMiscTktInfoElement>} Array of FareMiscTktInfoElement objects
     */
    FareMiscTktInfoElementBuilder.prototype.parseFareMiscTktInfoElements = function(dataElementsIndivMap) {
        var FareMiscTktInfoElements = [];
        var allElems = dataElementsIndivMap.has(Constants.FareMiscTktInfoElementCode) ? dataElementsIndivMap.get(Constants.FareMiscTktInfoElementCode) : [];
        //loop through Fare MiscTktInfo Element
        for (var index = 0; index < allElems.length; index++) {
            if (allElems[index]) {
                var objFareMiscTktInfoElement = new FareMiscTktInfoElement();
                objFareMiscTktInfoElement.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                objFareMiscTktInfoElement.ElementNo = allElems[index].elementManagementData.lineNumber ? parseInt(allElems[index].elementManagementData.lineNumber) : objFareMiscTktInfoElement.ElementNo;
                objFareMiscTktInfoElement.Text = allElems[index];
                FareMiscTktInfoElements.push(objFareMiscTktInfoElement);
            }
        }

        return FareMiscTktInfoElements;
    };

    return FareMiscTktInfoElementBuilder;
})();