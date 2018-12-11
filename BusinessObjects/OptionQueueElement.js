var OptionQueueElement = (function() {
    /**
     * Represents OptionQueueElement.
     *
     * @constructs OptionQueueElement
     * @property {string} ElementNo Element number
     * @property {string} OfficeId Element
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function OptionQueueElement() {
        this.elementNo;
        this.Text;
        this.Associations;
    }
    return OptionQueueElement;
})();

var OptionQueueElementBuilder = (function() {
    /**
     * Represents OptionQueueElementBuilder.
     *
     * @constructs OptionQueueElementBuilder
     */
    function OptionQueueElementBuilder() {}

    /**
     * Parsing OptionQueueElement.
     *
     * @memberof OptionQueueElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<OptionQueueElement>} Array of OptionQueueElement objects
     */
    OptionQueueElementBuilder.prototype.parseOptionQueueElements = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('OP');
        var optionQueueElems = [];
        if (allElems != null) {
            var index = 0;
            var objOptionQueueElem;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objOptionQueueElem = new OptionQueueElement();
                objOptionQueueElem.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objOptionQueueElem.Text = allElems[index];
                objOptionQueueElem.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                optionQueueElems.push(objOptionQueueElem);
            }
        }
        return optionQueueElems;
    };
    return OptionQueueElementBuilder;
})();