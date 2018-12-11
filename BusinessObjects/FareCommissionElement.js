var FareCommissionElement = (function() {
    /**
     * Represents FareCommissionElement.
     *
     * @constructs FareCommissionElement
     * @property {string} ElementNo Element number
     * @property {object} Text
     * @property {string} Percent
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function FareCommissionElement() {
        this.ElementNo;
        this.Text;
        this.Percent;
        this.Associations;
    }
    return FareCommissionElement;
})();

var FareCommissionElementBuilder = (function() {
    /**
     * Represents FareCommissionElementBuilder.
     *
     * @constructs FareCommissionElementBuilder
     */
    function FareCommissionElementBuilder() {}

    /**
     * Parsing FareCommissionElement.
     *
     * @memberof FareCommissionElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<FareCommissionElement>} Array of FareCommissionElement objects
     */
    FareCommissionElementBuilder.prototype.parseFareCommissionElements = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('FM');
        var fareCommissionElems = [];
        if (allElems != null) {
            var index = 0;
            var objFareCommissionElem;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objFareCommissionElem = new FareCommissionElement();
                objFareCommissionElem.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objFareCommissionElem.Text = allElems[index];
                objFareCommissionElem.Percent = allElems[index].otherDataFreetext.longFreetext;
                objFareCommissionElem.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                fareCommissionElems.push(objFareCommissionElem);
            }
        }
        return fareCommissionElems;
    };
    return FareCommissionElementBuilder;
})();