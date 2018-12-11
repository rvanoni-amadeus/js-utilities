var FSElement = (function () {
    /**
     * Represents RizElement.
     *
     * @constructs RizElement
     * @property {string} ElementNo Element number
     * @property {string} elementId Element ID
     * @property {string} freeFlow freeFlow text associated with this segment
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function FSElement() {
        this.elementNo;
        this.elementId;
        this.freeFlow;
        this.Text;
        this.Associations;
    }
    return FSElement;
})();

var FSElementBuilder = (function () {
    /**
     * Represents FSElementBuilder.
     *
     * @constructs FSElementBuilder
     */
    function FSElementBuilder() { }

    /**
     * Parsing RemarkElement.
     *
     * @memberof FSElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<FSElement>} Array of FSElement objects
     */
    FSElementBuilder.prototype.parseFSElements = function (dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('FS');
        var fsElems = [];
        if (allElems != null) {
            var index = 0;
            var objRiz;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objFS = new FSElement();
                objFS.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objFS.ElementID = allElems[index].elementManagementData.segmentName;
                objFS.FreeFlow = allElems[index].otherDataFreetext.longFreetext;
                objFS.Text = allElems[index];
                objFS.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                fsElems.push(objFS);
            }
        }
        return fsElems;
    };

    return FSElementBuilder;
})();

