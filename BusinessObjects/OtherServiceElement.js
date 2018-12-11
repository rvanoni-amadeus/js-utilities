var OtherServiceElement = (function() {
    /**
     * Represents OtherServiceElement.
     *
     * @constructs OtherServiceElement
     * @property {number} ElementNo Element number
     * @property {string} Text text associated with this segment
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function OtherServiceElement() {
        this.elementNo;
        this.Text;
        this.Associations;
    }
    return OtherServiceElement;
})();

var OtherServiceElementBuilder = (function() {
    /**
     * Represents OtherServiceElementBuilder.
     *
     * @constructs OtherServiceElementBuilder
     */
    function OtherServiceElementBuilder() {}

    /**
     * Parsing OtherServiceElement.
     *
     * @memberof OtherServiceElementBuilder
     * @instance
     * @param {Object} data PNR Response
     * @returns {Array.<OtherServiceElement>} Array of OtherServiceElement objects
     */
    OtherServiceElementBuilder.prototype.parseOtherServiceElements = function(dataElementsIndivMap) {
        var otherServiceElems = [];
        var allElems = dataElementsIndivMap.has(Constants.OtherServiceElementCode) ? dataElementsIndivMap.get(Constants.OtherServiceElementCode) : [];
        //loop through each dataElementsIndiv
        for (var index = 0; index < allElems.length; index++) {
            if (allElems[index]) {
                var objOtherServiceElem = new OtherServiceElement();
                objOtherServiceElem.ElementNo = allElems[index].elementManagementData.lineNumber ? parseInt(allElems[index].elementManagementData.lineNumber) : objOtherServiceElem.ElementNo;
                objOtherServiceElem.Text = allElems[index];
                objOtherServiceElem.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                otherServiceElems.push(objOtherServiceElem);
            }
        }
        return otherServiceElems;
    };

    return OtherServiceElementBuilder;
})();