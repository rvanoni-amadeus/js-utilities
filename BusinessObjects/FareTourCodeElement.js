var FareTourCodeElement = (function() {
    /**
     * Represents FareTourCodeElement.
     *
     * @constructs FareTourCodeElement
     * @property {string} ElementNo Element number
     * @property {string} OfficeId Element ID
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function FareTourCodeElement() {
        this.elementNo;
        this.Text;
        this.Associations;
    }
    return FareTourCodeElement;
})();

var FareTourCodeElementBuilder = (function() {
    /**
     * Represents FareTourCodeElementBuilder.
     *
     * @constructs FareTourCodeElementBuilder
     */
    function FareTourCodeElementBuilder() {}

    /**
     * Parsing FareTourCodeElement.
     *
     * @memberof FareTourCodeElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<FareTourCodeElement>} Array of FareTourCodeElement objects
     */
    FareTourCodeElementBuilder.prototype.parseFareTourCodeElements = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('FT');
        var fareTourCodeElems = [];
        if (allElems) {
            var index = 0;
            var objFareTourCodeElem;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objFareTourCodeElem = new FareTourCodeElement();
                objFareTourCodeElem.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objFareTourCodeElem.Text = allElems[index];
                objFareTourCodeElem.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                fareTourCodeElems.push(objFareTourCodeElem);
            }
        }
        return fareTourCodeElems;
    };
    return FareTourCodeElementBuilder;
})();