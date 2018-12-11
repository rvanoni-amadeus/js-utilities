var ConfidentialRemarkElement = (function() {
    /**
     * Represents ConfidentialRemarkElement.
     *
     * @constructs ConfidentialRemarkElement
     * @property {string} ElementNo Element number
     * @property {string} OfficeId Element ID
     * @property {string} freeFlow freeFlow text associated with this segment
     * @property {boolean} Restricted variable
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function ConfidentialRemarkElement() {
        this.elementNo;
        this.OfficeId;
        this.freeFlow;
        this.Text;
        this.Associations;
        this.Restricted;
    }
    return ConfidentialRemarkElement;
})();

var ConfidentialRemarkElementBuilder = (function() {
    /**
     * Represents ConfidentialRemarkElementBuilder.
     *;
     * @constructs ConfidentialRemarkElementBuilder
     */
    function ConfidentialRemarkElementBuilder() {}

    /**
     * Parsing ConfidentialRemarkElement.
     *
     * @memberof ConfidentialRemarkElementBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<ConfidentialRemarkElement>} Array of ConfidentialRemarkElement objects
     */
    ConfidentialRemarkElementBuilder.prototype.parseConfidentialRemarkElements = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get(Constants.ConfidentialRemarkElementCode);
        var confidentialremarkElems = [];
        var index = 0;
        var objConfidentialRemarkElem;
        var iMax = allElems.length;
        //loop through each dataElementsIndiv
        for (index; index < iMax; index++) {
            objConfidentialRemarkElem = new ConfidentialRemarkElement();
            objConfidentialRemarkElem.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
            objConfidentialRemarkElem.Text = allElems[index];
            objConfidentialRemarkElem.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
            if(allElems[index].miscellaneousRemarks!=null)
            {
                objConfidentialRemarkElem = getFreeFlowAndOfficeID(allElems[index].miscellaneousRemarks, objConfidentialRemarkElem);
            }
            confidentialremarkElems.push(objConfidentialRemarkElem);
        }
        return confidentialremarkElems;
    };

    /**
     * Parsing getDiscountCode.
     *
     * @memberOf FareDiscountElementBuilder
     * @inner
     * @param {Object} json object containing OfficeID, FreeFlow and Restricted properties
     * @param {objConfidentialRemarkElem} ConfidentialRemarkElement object
     */
    function getFreeFlowAndOfficeID(miscellaneousRemarks, objConfidentialRemarkElem) {
        if (miscellaneousRemarks.individualSecurity != null) {
            var individualSecurity = miscellaneousRemarks.individualSecurity;
            objConfidentialRemarkElem = setOfficeId(objConfidentialRemarkElem, individualSecurity);
            if (miscellaneousRemarks.remarks.freetext != null) {
                objConfidentialRemarkElem.FreeFlow = miscellaneousRemarks.remarks.freetext;
            }
            objConfidentialRemarkElem.Restricted = false;
        } else {
            objConfidentialRemarkElem.Restricted = true;
        }
        return objConfidentialRemarkElem;
    }
    /**
     * Sets Office Id of the corresponding Confidential RemarkElement
     * @param  {ConfidentialRemarkElem} objConfidentialRemarkElem
     * @param  {Object} individualSecurity
     */
    function setOfficeId(objConfidentialRemarkElem, individualSecurity) {
        if (Array.isArray(individualSecurity)) {
            var officeIDList = [];
            for (var i = 0; i < individualSecurity.length ; i++) {
                if (individualSecurity[i].office != null && officeIDList.indexOf(individualSecurity[i].office) === -1) {
                    officeIDList.push(individualSecurity[i].office);
                }
            }
            objConfidentialRemarkElem.OfficeId = officeIDList.join();
        } else {
            if (individualSecurity.office != null) {
                objConfidentialRemarkElem.OfficeId = individualSecurity.office;
            }
        }
        return objConfidentialRemarkElem;
    }
    return ConfidentialRemarkElementBuilder;
})();