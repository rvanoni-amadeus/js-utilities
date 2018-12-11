var FareFormOfPaymentElement = (function(){
    /**
    * Represents FormOfPayment.
    * @constructs FareFormOfPaymentElement
    * @property {number} ElementNo Elemenent Number
    * @property {Array.<Association>} Associations Passenger and Segment Associations
    */
    function FareFormOfPaymentElement() {
        this.ElementNo;
        this.Text;
        this.Associations;
    }
    return FareFormOfPaymentElement;
})();

var FareFormOfPaymentElementBuilder = (function(){
    /**
     * Represents FareFormOfPaymentElementBuilder.
     *
     * @constructs FareFormOfPaymentElementBuilder
     */
    function FareFormOfPaymentElementBuilder() {}
    /**
     * Parse PNR response to get fareFormOfPaymentElems
     *
     * @memberof FareFormOfPaymentElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap Mapper
     * @returns {Array<FareFormOfPaymentElement>} Array of FareFormOfPaymentElement objects
     */
    FareFormOfPaymentElementBuilder.prototype.parseFareFormOfPaymentElement = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.has('FP') ? dataElementsIndivMap.get('FP') : [];
        var fareFormOfPaymentElems = [];
        if(allElems != null)
        {
            var index = 0;
            var objFareFormOfPaymentElement;
            var iMax = allElems.length;
            for (index; index < iMax; index++) {
                objFareFormOfPaymentElement = new FareFormOfPaymentElement();
                objFareFormOfPaymentElement.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objFareFormOfPaymentElement.Text = allElems[index];
                objFareFormOfPaymentElement.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                fareFormOfPaymentElems.push(objFareFormOfPaymentElement);
            }
        }
        return fareFormOfPaymentElems;
    };
    return FareFormOfPaymentElementBuilder;
})();