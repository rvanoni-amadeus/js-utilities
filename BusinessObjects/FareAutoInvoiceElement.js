var FareAutoInvoiceElement = (function() {
    /**
     * Represents FareAutoInvoiceElement.
     *
     * @constructs FareAutoInvoiceElement
     * @property {string} ElementNo Element number
     * @property {string} Text
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function FareAutoInvoiceElement() {
        this.elementNo;
        this.Text;
        this.Associations;
    }
    return FareAutoInvoiceElement;
})();

var FareAutoInvoiceElementBuilder = (function() {
    /**
     * Represents FareAutoInvoiceElementBuilder.
     *
     * @constructs FareAutoInvoiceElementBuilder
     */
    function FareAutoInvoiceElementBuilder() {}

    /**
     * Parsing FareAutoInvoiceElement.
     *
     * @memberof FareAutoInvoiceElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<FareAutoInvoiceElement>} Array of FareAutoInvoiceElement objects
     */
    FareAutoInvoiceElementBuilder.prototype.parseFareAutoInvoiceElements = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('FI');
        var fareAutoInvoiceElems = [];
        if (allElems != null) {
            var index = 0;
            var objFareAutoInvoiceElem;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objFareAutoInvoiceElem = new FareAutoInvoiceElement();
                objFareAutoInvoiceElem.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objFareAutoInvoiceElem.Text = allElems[index];
                objFareAutoInvoiceElem.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                fareAutoInvoiceElems.push(objFareAutoInvoiceElem);
            }
        }
        return fareAutoInvoiceElems;
    };
    return FareAutoInvoiceElementBuilder;
})();