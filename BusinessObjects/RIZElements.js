var RizElement = (function () {
    /**
     * Represents RizElement.
     *
     * @constructs RizElement
     * @property {string} ElementNo Element number
     * @property {string} elementId Element ID
     * @property {string} freeFlow freeFlow text associated with this segment
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function RizElement() {
        this.elementNo;
        this.elementId;
        this.freeFlow;
        this.Text;
        this.Associations;
    }
    return RizElement;
})();

var RizElementBuilder = (function () {
    /**
     * Represents RizElementBuilder.
     *
     * @constructs RizElementBuilder
     */
    function RizElementBuilder() { }

    /**
     * Parsing RemarkElement.
     *
     * @memberof RizElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<RizElement>} Array of RizElement objects
     */
    RizElementBuilder.prototype.parseRizElements = function (dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('RIZ');
        var rizElems = [];
        if (allElems != null) {
            var index = 0;
            var objRiz;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objRiz = new RizElement();
                objRiz.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objRiz.ElementID = allElems[index].elementManagementData.segmentName;
                objRiz.FreeFlow = allElems[index].extendedRemark.structuredRemark.freetext;
                objRiz.Text = allElems[index];
                objRiz.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                rizElems.push(objRiz);
            }
        }
        return rizElems;
    };

    return RizElementBuilder;
})();

