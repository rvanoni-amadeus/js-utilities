var BillingAddressElement = (function() {
    /**
     * Represents BillingAddressElement.
     *
     * @constructs BillingAddressElement
     * @property {string} ElementNo Element number
     * @property {string} OfficeId Element ID
     * @property {string} freeFlow freeFlow text associated with this segment
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function BillingAddressElement() {
        this.elementNo;
        this.Text;
        this.NbrOfLines;
        this.AddressData;
        this.Associations;
    }
    return BillingAddressElement;
})();

var BillingAddressElementBuilder = (function() {
    /**
     * Represents BillingAddressElementBuilder.
     *
     * @constructs BillingAddressElementBuilder
     */
    function BillingAddressElementBuilder() {}

    /**
     * Parsing BillingAddressElement.
     *
     * @memberof BillingAddressElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<BillingAddressElement>} Array of BillingAddressElement objects
     */
    BillingAddressElementBuilder.prototype.parseBillingAddressElements = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('AB');
        var BillingAddressElems = [];
        if (allElems != null) {
            var index = 0;
            var objBillingAddressElem;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objBillingAddressElem = new BillingAddressElement();
                objBillingAddressElem.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objBillingAddressElem.Text = allElems[index];
                objBillingAddressElem.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                objBillingAddressElem = getAddressData(objBillingAddressElem, allElems[index]);
                var numberOfcommas = (objBillingAddressElem.AddressData.match(/,/g) || []).length;
                objBillingAddressElem.NbrOfLines = numberOfcommas + 1;
                BillingAddressElems.push(objBillingAddressElem);
            }
        }
        return BillingAddressElems;
    };
    /**
     * Gets AddressData
     * @internal function
     * @param  {Object} objBillingAddressElem
     * @param  {Object} JSONObject elementJSONObject
     */
    function getAddressData(objBillingAddressElem, elementJSONObject) {
        if(elementJSONObject.structuredAddress && elementJSONObject.structuredAddress.address)
        {
            var address = elementJSONObject.structuredAddress.address;
            if (Array.isArray(address)) {
                var addressIDList = [];
                for (var i = 0; i < address.length; i++) {
                    addressIDList.push(address[i].option + "-" + address[i].optionText);
                }
                objBillingAddressElem.AddressData = addressIDList.join("/");
            } else {
                objBillingAddressElem.AddressData = address.option + "-" + address.optionText;
            }
        }
        var otherDataFreetext = elementJSONObject.otherDataFreetext;
        if (otherDataFreetext != null) {
            var longFreetext = otherDataFreetext.longFreetext;
            if (longFreetext != null) {
                objBillingAddressElem.AddressData = longFreetext;
            }
        }
        return objBillingAddressElem;
    }
    return BillingAddressElementBuilder;
})();