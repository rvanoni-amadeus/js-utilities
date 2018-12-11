var FareEndoElement = (function() {
    /**
     * Represents FareEndoElement.
     *
     * @constructs FareEndoElement
     * @property {string} ElementNo Element number
     * @property {string} OfficeId Element ID
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function FareEndoElement() {
        this.elementNo;
        this.Text;
        this.Associations;
    }
    return FareEndoElement;
})();

var FareEndoElementBuilder = (function() {
    /**
     * Represents FareEndoElementBuilder.
     *
     * @constructs FareEndoElementBuilder
     */
    function FareEndoElementBuilder() {}

    /**
     * Parsing FareEndoElement.
     *
     * @memberof FareEndoElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<FareEndoElement>} Array of FareEndoElement objects
     */
    FareEndoElementBuilder.prototype.parseFareEndoElements = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('FE');
        var FareEndoElems = [];
        if (allElems != null) {
            var index = 0;
            var objFareEndoElem;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objFareEndoElem = new FareEndoElement();
                objFareEndoElem.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objFareEndoElem.Text = allElems[index];
                objFareEndoElem.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                FareEndoElems.push(objFareEndoElem);
            }
        }
        return FareEndoElems;
    };
    return FareEndoElementBuilder;
})();