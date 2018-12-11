var RemarkElement = (function() {
    /**
     * Represents RemarkElement.
     *
     * @constructs RemarkElement
     * @property {string} ElementNo Element number
     * @property {string} elementId Element ID
     * @property {string} freeFlow freeFlow text associated with this segment
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function RemarkElement() {
        this.elementNo;
        this.elementId;
        this.freeFlow;
        this.Text;
        this.Associations;
    }
    return RemarkElement;
})();

var RemarkElementBuilder = (function() {
    /**
     * Represents RemarkElementBuilder.
     *
     * @constructs RemarkElementBuilder
     */
    function RemarkElementBuilder() {}

    /**
     * Parsing RemarkElement.
     *
     * @memberof RemarkElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<RemarkElement>} Array of RemarkElement objects
     */
    RemarkElementBuilder.prototype.parseRemarkElements = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('RM');
        var remarkElems = [];
        if(allElems !=null)
        {
             var index = 0;
            var objRemark;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objRemark = new RemarkElement();
                objRemark.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objRemark.ElementID = allElems[index].elementManagementData.segmentName;
                objRemark.FreeFlow = allElems[index].extendedRemark.structuredRemark.freetext;
                objRemark.Text = allElems[index];
                objRemark.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                remarkElems.push(objRemark);
            }
        }
        return remarkElems;
    };

    return RemarkElementBuilder;
})();