var GroupNameElement = (function() {
    /**
     * Represents GroupNameElement.
     *
     * @constructs GroupNameElement
     * @property {number} ElementNo Element number
     * @property {number} NbrNamesMissing No. of names misssing
     * @property {number} NbrOfAssignedNames No. of assigned names
     * @property {string} GroupName Traveller's surname
     * @property {Object} Text Traveller info
     */
    function GroupNameElement() {
        this.ElementNo;
        this.NbrNamesMissing;
        this.NbrOfAssignedNames;
        this.GroupName;
        this.Text;
    }

    return GroupNameElement;
})();

var GroupNameElementBuilder = (function() {
    /**
     * Represents GroupNameElementBuilder.
     *
     * @constructs GroupNameElementBuilder
     */
    function GroupNameElementBuilder() {}

    /**
     * Parses PNR response to get GroupNameElements
     *
     * @memberof GroupNameElementBuilder
     * @instance
     * @param {Object} PNR response.
     * @returns {Array.<GroupNameElement>} Array of GroupNameElement objects.
     */
    GroupNameElementBuilder.prototype.parseGroupNameElements = function(data) {
        var strGroupPNR = JSON.parse(data);
        var travellerInfoData = [];
        var groupNameElems = [];
        if (strGroupPNR.response.model.output.response.travellerInfo) {
            var travellerInfo = strGroupPNR.response.model.output.response.travellerInfo || null;
        }
        if (travellerInfo) {
            if (Array.isArray(travellerInfo)) {
                travellerInfoData = travellerInfo;
            } else {
                travellerInfoData.push(travellerInfo);
            }
            var groupElementIndex = 0;
            if (travellerInfoData[groupElementIndex].elementManagementPassenger.segmentName === 'NG') {
                var objGroupElement = new GroupNameElement();
                objGroupElement.ElementNo = parseInt(travellerInfoData[groupElementIndex].elementManagementPassenger.lineNumber);
                objGroupElement.GroupName = travellerInfoData[groupElementIndex].passengerData.travellerInformation.traveller.surname;
                var noOfTravellersInGroup = travellerInfoData[groupElementIndex].passengerData.travellerInformation.traveller.quantity;
                objGroupElement.Text = travellerInfoData[groupElementIndex];
                objGroupElement.NbrOfAssignedNames = travellerInfoData.length - 1;
                objGroupElement.NbrNamesMissing = noOfTravellersInGroup - objGroupElement.NbrOfAssignedNames;
                groupNameElems.push(objGroupElement);
            }
        }
        return groupNameElems;
    };

    return GroupNameElementBuilder;
})();