var FareDiscountElement = (function() {
    /**
     * Represents FareDiscountElement.
     *
     * @constructs FareDiscountElement
     * @property {number} ElementNo Element number
     * @property {string} DiscountCode Discount code
     * @property {string} PassengerType
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     * @property {string} Data Long free text of segment
     * @property {Object} Text Cryptic Text line of FD element
     * @property {Object} RawText json node of segment
     */
    function FareDiscountElement() {
        this.ElementID;
        this.DiscountCode;
        this.Data;
        this.ElementNo;
        this.PassengerType;
        this.Associations;
        this.Text;
        this.RawText;
    }
    return FareDiscountElement;
})();

var FareDiscountElementBuilder = (function() {
    /**
     * Represents FareDiscountElementBuilder.
     *
     * @constructs FareDiscountElementBuilder
     */
    function FareDiscountElementBuilder() {}

    /**
     * Parses PNR response to get FareDiscountElements
     *
     * @memberof FareDiscountElementBuilder
     * @instance
     * @param {data} PNR response
     * @returns {Array.<FareDiscountElement>} Array of FareDiscountElement objects
     */
    FareDiscountElementBuilder.prototype.parseFDElements = function(data) {
        var strData = JSON.parse(data);
        var dataElementsIndiv = null;
        var dataElementsArray = [];
        var fdElems = [];
        if (strData.response.model.output.response.dataElementsMaster) {
            dataElementsIndiv = strData.response.model.output.response.dataElementsMaster.dataElementsIndiv;
        }
        if (dataElementsIndiv) {
            // Check if there are some data elements within the PNR
            if (Array.isArray(dataElementsIndiv)) {
                dataElementsArray = dataElementsIndiv;
            } else {
                dataElementsArray.push(dataElementsIndiv);
            }
            getFDElementID(dataElementsArray, fdElems);
        }
        return fdElems;
    };

    /**
     * Parsing getFDElementID.
     *
     * @memberOf FareDiscountElementBuilder
     * @inner
     * @param {Array.<Object>} Array containing raw FD elements info from PNR repsonse
     * @param {Array.<FareDiscountElement>} fdElems Array of FareDiscountElement objects
     */
    function getFDElementID(dataElementsArray, fdElems) {
        var objFDElement = new FareDiscountElement();
        var i = 0;
        var fdElemCount = 0;
        // Loop all elements and find if any FD element
        for (i; i < dataElementsArray.length; i += 1) {
            if ((dataElementsArray[i].elementManagementData) && dataElementsArray[i].elementManagementData.segmentName === "FD") {
                objFDElement.ElementID = dataElementsArray[i].elementManagementData.segmentName;
                objFDElement.ElementNo = dataElementsArray[i].elementManagementData.lineNumber;
                var longFreetext = dataElementsArray[i].otherDataFreetext.longFreetext;
                if (longFreetext.substr(0, 3) === "INF") {
                    objFDElement.PassengerType = "INF";
                } else if (longFreetext.substr(0, 3) === "PAX") {
                    objFDElement.PassengerType = "PAX";
                }
                objFDElement.Data = (longFreetext.indexOf(" ") > -1) ? longFreetext.split(" ")[1] : longFreetext;
                objFDElement.RawText = dataElementsArray[i];
                getDiscountCode(longFreetext, objFDElement);
                objFDElement.Associations = (dataElementsArray[i].referenceForDataElement != null) ? new AssociationBuilder().getAssociations(dataElementsArray[i].referenceForDataElement.reference) : null;
                fdElems[fdElemCount] = objFDElement;
                fdElemCount++;
                objFDElement = new FareDiscountElement();
            }
        }
    }

    /**
     * Parsing getDiscountCode.
     *
     * @memberOf FareDiscountElementBuilder
     * @inner
     * @param {longFreetext} text containing discount code
     * @param {objFDElement} fdElement Object.
     */
    function getDiscountCode(longFreetext, objFDElement) {
        var discountCodeStr;
        if (longFreetext.match(/PAX/i)) {
            discountCodeStr = longFreetext.split("PAX")[1].split("/");
            var discountCode = discountCodeStr[0];
            if (discountCode.match(/\d/)) {
                var firstDigit = discountCode.match(/\d/);
                discountCode = discountCode.substring(0, firstDigit.index);
            }
            objFDElement.DiscountCode = discountCode.trimLeft();
        } else if (longFreetext.match(/INF/i)) {
            objFDElement.DiscountCode = longFreetext.split("INF")[1].substring(1, 3);
        } else if (longFreetext.match(/CH/i)) {
            objFDElement.DiscountCode = longFreetext;
        } else if (longFreetext.match(/SATAID/i)) {
            objFDElement.DiscountCode = "SATA";
        } else {
            objFDElement.DiscountCode = longFreetext.trimLeft().substring(0, 2);
        }
    }

    return FareDiscountElementBuilder;
})();