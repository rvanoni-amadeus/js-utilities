var ServiceFeeRemark = (function() {
    /**
     * Represents ServiceFeeRemark.
     *
     * @constructs ServiceFeeRemark
     * @property {number} ElementNo Elemenent Number
     * @property {string} Text Cryptic Text line of RIS element
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function ServiceFeeRemark() {
        this.ElementNo;
        this.Text;
        this.Associations;
    }
    return ServiceFeeRemark;
})();

var ServiceFeeRemarkBuilder = (function() {
    /**
     * Represents ServiceFeeRemarkBuilder.
     *
     * @constructs ServiceFeeRemarkBuilder
     */
    function ServiceFeeRemarkBuilder() {}
    /**
     * Parse PNR response to get ServiceFeeRemarks
     *
     * @memberof ServiceFeeRemarkBuilder
     * @instance
     * @param {Object} dataElementsIndivMap
     * @returns {Array.<ServiceFeeRemark>} Array of ServiceFeeRemark objects
     */
    ServiceFeeRemarkBuilder.prototype.parseServiceFeeRemarks = function(dataElementsIndivMap) {
        var allElems = dataElementsIndivMap.get('RIS');
        var serviceFeeRemarkElems = [];
        if (allElems != null) {
            var index = 0;
            var objServiceFeeRemark;
            var iMax = allElems.length;
            //loop through each dataElementsIndiv
            for (index; index < iMax; index++) {
                objServiceFeeRemark = new ServiceFeeRemark();
                objServiceFeeRemark.ElementNo = parseInt(allElems[index].elementManagementData.lineNumber);
                objServiceFeeRemark.Text = allElems[index];
                objServiceFeeRemark.Associations = (allElems[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForDataElement.reference) : null;
                serviceFeeRemarkElems.push(objServiceFeeRemark);
            }
        }
        return serviceFeeRemarkElems;
    };
    return ServiceFeeRemarkBuilder;
})();