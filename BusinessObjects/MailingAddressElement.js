var MailingAddressElement = (function() {
    /**
     * Represents MailingAddressElement.
     *
     * @constructs MailingAddressElement
     * @property {string} ElementNo Element number
     * @property {string} OfficeId Element ID
     * @property {string} freeFlow freeFlow text associated with this segment
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function MailingAddressElement() {
        this.elementNo;
        this.Text;
        this.Associations;
    }
    return MailingAddressElement;
})();

var MailingAddressElementBuilder = (function() {
    /**
     * Represents MailingAddressElementBuilder.
     *
     * @constructs MailingAddressElementBuilder
     */
    function MailingAddressElementBuilder() {}

    /**
     * Parsing MailingAddressElement.
     *
     * @memberof MailingAddressElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<MailingAddressElement>} Array of MailingAddressElement objects
     */
    MailingAddressElementBuilder.prototype.parseMailingAddressElements = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('AM');
        var MailingAddressElems = [];
        if (allElems != null) {
            var index = 0;
            var objMailingAddressElem;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objMailingAddressElem = new MailingAddressElement();
                objMailingAddressElem.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objMailingAddressElem.Text = allElems[index];
                objMailingAddressElem.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                objMailingAddressElem = getAddressData(objMailingAddressElem, allElems[index]);
                var numberOfcommas = (objMailingAddressElem.AddressData.match(/,/g) || []).length;
                objMailingAddressElem.NbrOfLines = numberOfcommas + 1;
                MailingAddressElems.push(objMailingAddressElem);
            }
        }
        return MailingAddressElems;
    };

    /**
     * Gets AddressData
     * @internal function
     * @param  {Object} objMailingAddressElem
     * @param  {Object} elementJSONObject
     */
    function getAddressData(objMailingAddressElem, elementJSONObject) {
        if(elementJSONObject.structuredAddress && elementJSONObject.structuredAddress.address)
        {
            var address = elementJSONObject.structuredAddress.address;
            if (Array.isArray(address)) {
                var addressIDList = [];
                for (var i = 0; i < address.length; i++) {
                    addressIDList.push(address[i].option + "-" + address[i].optionText);
                }
                objMailingAddressElem.AddressData = addressIDList.join("/");
            } else {
                objMailingAddressElem.AddressData = address.option + "-" + address.optionText;
            }
        }
        var otherDataFreetext = elementJSONObject.otherDataFreetext;
        if (otherDataFreetext != null) {
            var longFreetext = otherDataFreetext.longFreetext;
            if (longFreetext != null) {
                objMailingAddressElem.AddressData = longFreetext;
            }
        }
        return objMailingAddressElem;
    }
    return MailingAddressElementBuilder;
})();