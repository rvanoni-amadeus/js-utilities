var AccountingAIElement = (function() {
    /**
     * Represents AccountingAIElement.
     *
     * @constructs AccountingAIElement
     * @property {number} ElementNo Elemenent Number
     * @property {string} Text Cryptic Text line of AI element
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function AccountingAIElement() {
        this.ElementNo;
        this.Text;
        this.Associations;
    }

    return AccountingAIElement;
})();

var AccountingAIElementBuilder = (function() {
    /**
     * Represents AccountingAIElementBuilder.
     *
     * @constructs AccountingAIElementBuilder
     */
    function AccountingAIElementBuilder() {}
    /**
     * Parse PNR response to get AccountingAIElements
     *
     * @memberof AccountingAIElementBuilder
     * @instance
     * @param {Object} data PNR Response
     * @returns {Array.<AccountingAIElement>} Array of AccountingAIElement objects
     */
    AccountingAIElementBuilder.prototype.parseAccountingAIElements = function(data) {
        var strData = JSON.parse(data);
        var allElements = [];
        var accountingAIElems = [];
        var index = 0;
        var objAIElement;

        if (strData.response.model.output.response.dataElementsMaster) {
            var dataElementsIndiv = strData.response.model.output.response.dataElementsMaster.dataElementsIndiv || null;
            var iMax = strData.response.model.output.response.dataElementsMaster.dataElementsIndiv.length;
        }
        if (Array.isArray(dataElementsIndiv)) {
            allElements = dataElementsIndiv;
        } else {
            allElements.push(dataElementsIndiv);
        }
        //loop through each dataElementsIndiv
        for (index; index < iMax; index++) {
            // Check if there are AccountingAIElements within the PNR
            if (allElements[index].elementManagementData.segmentName === 'AI') {
                objAIElement = new AccountingAIElement();
                objAIElement.ElementNo = parseInt(allElements[index].elementManagementData.lineNumber);
                objAIElement.Text = allElements[index];
                objAIElement.Associations = (allElements[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElements[index].referenceForDataElement.reference) : null;
                accountingAIElems.push(objAIElement);
            }
        }
        return accountingAIElems;
    };
    return AccountingAIElementBuilder;
})();