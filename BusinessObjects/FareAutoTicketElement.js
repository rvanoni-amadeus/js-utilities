var FareAutoTicketElement = (function() {
    /**
     * Represents FareAutoTicketElement.
     *
     * @constructs FareAutoTicketElement
     * @property {number} TicketNo Ticket Number
     * @property {number} Amount Ticket fare
     * @property {string} Text Cryptic Text line of FA element
     * @property {number} ElementID Element ID
     * @property {string} PassengerType
     * @property {string} NumericAirlineCode
     * @property {string} Currency
     */
    function FareAutoTicketElement() {
        this.TicketNo;
        this.Amount;
        this.Text;
        this.ElementID;
        this.PassengerType;
        this.NumericAirlineCode;
        this.Currency;
        this.ElementNo;
        this.Associations;
    }

    return FareAutoTicketElement;
})();

var FareAutoTicketElementBuilder = (function() {
    /**
     * Represents FareAutoTicketElementBuilder.
     *
     * @constructs FareAutoTicketElementBuilder
     */
    function FareAutoTicketElementBuilder() {

    }

    /**
     * Parses PNR response to get FareAutoTicketElements
     *
     * @memberof FareAutoTicketElementBuilder
     * @instance
     * @param {Object} PNR response
     * @returns {Array.<FareAutoTicketElement>} Array of FareAutoTicketElement objects
     */
    FareAutoTicketElementBuilder.prototype.parseFareAutoTicketElements = function(data) {
        var faArr = [];
        var strData = JSON.parse(data);
        var fareAutoTktElems = [];
        if (strData.response.model.output.response.dataElementsMaster) {
            var dataElementsIndiv = strData.response.model.output.response.dataElementsMaster.dataElementsIndiv;
        }
        if (dataElementsIndiv) {
            // Check if there are some data elements within the PNR
            if (Array.isArray(dataElementsIndiv)) {
                faArr = dataElementsIndiv;
            } else {
                faArr.push(dataElementsIndiv);
            }
        }
        addFAElements(faArr, fareAutoTktElems);
        return fareAutoTktElems;
    };

    /**
     * Builds and Adds FareAutoTicketElement objects into an array.
     *
     * @memberof FareAutoTicketElementBuilder
     * @inner
     * @param {faObjArr} Array of FA element text
     * @param {Array.<FareAutoTicketElement>} fareAutoTktElems array of FA elements.
     */
    function addFAElements(faObjArr, fareAutoTktElems) {
        var fareAutoTicktElemCount = 0;
        var longFreeText = null;
        var amount = null;
        var objFareAutoTktElem = new FareAutoTicketElement();
        var ticketPattern = /[0-9]{10}/;
        var amountPattern = /([A-Z]{3})([0-9]+([.][0-9]+)?)/;
        //var faFreeFlowText = /(\w{3})?(\s)?((\d{3})(-)?(\d{10}))(\/)((\w+)-(\w+))?(\/)?(\w+)(\/)((\w{3})(\d*\.\d*))?/;
        var faFreeFlowText = /(\w{3})?(\s)?((\d{3})(-)?(\d{10})(-\d{2})?)(\/)((\w+)-(\w+))?(\/)?(\w+)(\/)((\w{3})(\d*\.\d*))?/;
        for (var index = 0; index < faObjArr.length; index++) {
            if (faObjArr[index].elementManagementData.segmentName === "FA") {
                longFreeText = faObjArr[index].otherDataFreetext.longFreetext;
                objFareAutoTktElem.Text = faObjArr[index];
                objFareAutoTktElem.ElementID = faObjArr[index].elementManagementData.segmentName;
                objFareAutoTktElem.ElementNo = faObjArr[index].elementManagementData.lineNumber;
                objFareAutoTktElem.TicketNo = parseInt(ticketPattern.exec(longFreeText));
                amount = amountPattern.exec(longFreeText)[2];
                objFareAutoTktElem.Amount = parseFloat(amount);
                objFareAutoTktElem.PassengerType = faFreeFlowText.exec(longFreeText)[1];
                objFareAutoTktElem.NumericAirlineCode = faFreeFlowText.exec(longFreeText)[4];
                objFareAutoTktElem.Currency = amountPattern.exec(longFreeText)[1];
                objFareAutoTktElem.Associations = (faObjArr[index].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(faObjArr[index].referenceForDataElement.reference) : null;
                fareAutoTktElems[fareAutoTicktElemCount] = objFareAutoTktElem;
                fareAutoTicktElemCount++;
                objFareAutoTktElem = new FareAutoTicketElement();
            }
        }
    }

    return FareAutoTicketElementBuilder;

})();