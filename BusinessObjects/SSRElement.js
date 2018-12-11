var SSRElem = (function() {

    /**
     * Represents SSRElem.
     *
     * @constructs SSRElem
     * @property {SeatElements} Array of SeatElement objects
     * @property {FOIDElements} Array of FOID Elements objects
     * @property {FQTRElements} Array of FQTR Element objects
     * @property {FQTSElements} Array of FQTS Element objects
     * @property {FQTVElements} Array of FQTV Element objects
     * @property {FQTUElements} Array of FQTU Element objects
     */

    function SSRElem() {
        this.SeatElements = [];
        this.FOIDElements = [];
        this.FQTRElements = [];
        this.FQTVElements = [];
        this.FQTSElements = [];
        this.FQTUElements = [];
        this.otherSSRElementsArray = [];
        this.orderedSSRArr = [];
    }

    return SSRElem;
})();

var SSRElemBuilder = (function() {
    /**
     * Represents SSRElemBuilder.
     *
     * @constructs SSRElemBuilder
     */
    function SSRElemBuilder() {

    }
    /**
     * Parses PNR response to get SSRElem elements
     *
     * @memberof SSRElemBuilder
     * @instance
     * @param {data} PNR response
     * @returns {Array.<SSRElem>} Array of SSRElem elements
     */
    SSRElemBuilder.prototype.parseSSRElement = function(data) {
        var strData = JSON.parse(data);
        var ssrInfoData = [];
        var ssrElem = new SSRElem();
        if (strData.response.model.output.response.dataElementsMaster) {
            var dataElementsIndiv = strData.response.model.output.response.dataElementsMaster.dataElementsIndiv;
        }
        if (dataElementsIndiv) {
            // Check if there are some data elements within the PNR
            if (Array.isArray(dataElementsIndiv)) {
                ssrInfoData = dataElementsIndiv;
            } else {
                ssrInfoData.push(dataElementsIndiv);
            }
            mapSSRElements(ssrInfoData, ssrElem);
        }
        var ssrElementsObject = createSSRElementArray(ssrElem);
        return ssrElementsObject;
    };

    /**
     * Mapping SSRElements.
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {Array} ssrInfoData Array of SSR info data.
     * @param {Array} ssrElem Object of SSRElem.
     */
    function mapSSRElements(ssrInfoData, ssrElem) {
        // Loop all elements and find if anyone has service request node
        for (var index = 0; index < ssrInfoData.length; index++) {
            if ((ssrInfoData[index].elementManagementData.segmentName === Constants.SSRElementCodes.segmentName)) {
                var ssrObj = ssrInfoData[index];
                var serviceType = ssrObj.serviceRequest.ssr.type;
                if (Constants.SSRElementCodes.seatElementCodes.indexOf(serviceType) > -1) {
                    assignSeatElementProperties(ssrObj, ssrElem);
                } else {
                    checkForServiceType(serviceType, ssrObj, ssrElem);
                }

            }
        }
    };
    /**
     * checkForServiceType.
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {Object} serviceType value of SSR service type.
     * @param {Object} ssrObj Object containing SSR info.
     * @param {Object} ssrElem Object of SSRElem.
     */

    function checkForServiceType(serviceType, ssrObj, ssrElem) {
        switch (serviceType) {
            case Constants.SSRElementCodes.foid:
                assignFOIDProperties(ssrObj, ssrElem);
                break;
            case Constants.SSRElementCodes.fqtr:
                assignFQTRProperties(ssrObj, ssrElem);
                break;
            case Constants.SSRElementCodes.fqts:
                assignFQTSProperties(ssrObj, ssrElem);
                break;
            case Constants.SSRElementCodes.fqtv:
                assignFQTVProperties(ssrObj, ssrElem);
                break;
            case Constants.SSRElementCodes.fqtu:
                assignFQTUProperties(ssrObj, ssrElem);
                break;
            default:
                assignOtherSSRElemProperties(ssrObj, ssrElem);
        }
    };


    /**
     * assignSeatElementProperties.
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {Object} ssrObj Object containing SSR info.
     * @param {Object} ssrElem Object of SSRElem.
     */
    function assignSeatElementProperties(ssrObj, ssrElem) {
        var ssrSeatObj = function() {
            self = this;
            self.ElementNo = null;
            self.Text = '';
            self.Associations = null;
            self.FreeFlow = null;
        };

        var objSeatElem = new ssrSeatObj();
        objSeatElem.ElementNo = parseInt(ssrObj.elementManagementData.lineNumber);
        objSeatElem.Text = ssrObj;
        var referenceForDataElement = ssrObj.referenceForDataElement;
        objSeatElem.Associations = referenceForDataElement ? new AssociationBuilder().getAssociations(referenceForDataElement.reference) : objSeatElem.Associations;
        objSeatElem.FreeFlow = ssrObj.serviceRequest.ssr.freeText ? ssrObj.serviceRequest.ssr.freeText : null;
        ssrElem.SeatElements[ssrElem.SeatElements.length] = objSeatElem;
    };

    /**
     * assignFOIDProperties.
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {Object} ssrObj Object containing SSR info.
     * @param {Object} ssrElem Object of SSRElem.
     */
    function assignFOIDProperties(ssrObj, ssrElem) {
        var ssrFoidObj = function() {
            self = this;
            self.ElementNo = '';
            self.Text = '';
            self.IdCodesAndNumbers = '';
            self.Associations = '';
            self.FreeFlow = null;
        };

        var objFoidElem = new ssrFoidObj();
        objFoidElem.ElementNo = parseInt(ssrObj.elementManagementData.lineNumber);
        objFoidElem.Text = ssrObj;
        var referenceForDataElement = ssrObj.referenceForDataElement;
        objFoidElem.Associations = referenceForDataElement ? new AssociationBuilder().getAssociations(referenceForDataElement.reference) : objFoidElem.Associations;
        objFoidElem.IdCodesAndNumbers = ssrObj.serviceRequest.ssr.freeText;
        objFoidElem.FreeFlow = ssrObj.serviceRequest.ssr.freeText ? ssrObj.serviceRequest.ssr.freeText : null;
        ssrElem.FOIDElements[ssrElem.FOIDElements.length] = objFoidElem;

    };

    /**
     * assignFQTRProperties.
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {Object} ssrObj Object containing SSR info.
     * @param {Object} ssrElem Object of SSRElem.
     */
    function assignFQTRProperties(ssrObj, ssrElem) {
        var ssrFQTRObj = function() {
            self = this;
            self.ElementNo = '';
            self.Text = '';
            self.Associations = '';
            self.FreeFlow = null;
        };
        var objFQTRTElem = new ssrFQTRObj();
        objFQTRTElem.ElementNo = parseInt(ssrObj.elementManagementData.lineNumber);
        objFQTRTElem.Text = ssrObj;
        var referenceForDataElement = ssrObj.referenceForDataElement;
        objFQTRTElem.Associations = referenceForDataElement ? new AssociationBuilder().getAssociations(referenceForDataElement.reference) : objFQTRTElem.Associations;
        objFQTRTElem.FreeFlow = ssrObj.serviceRequest.ssr.freeText ? ssrObj.serviceRequest.ssr.freeText : null;
        ssrElem.FQTRElements[ssrElem.FQTRElements.length] = objFQTRTElem;
    };
    /**
     * assignFQTSProperties.
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {Object} ssrObj Object containing SSR info.
     * @param {Object} ssrElem Object of SSRElem.
     */
    function assignFQTSProperties(ssrObj, ssrElem) {
        var ssrFQTRObj = function() {
            self = this;
            self.ElementNo = '';
            self.Text = '';
            self.Associations = '';
            self.FreeFlow = null;
        };
        var objFQTRTElem = new ssrFQTRObj();
        objFQTRTElem.ElementNo = parseInt(ssrObj.elementManagementData.lineNumber);
        objFQTRTElem.Text = ssrObj;
        var referenceForDataElement = ssrObj.referenceForDataElement;
        objFQTRTElem.Associations = referenceForDataElement ? new AssociationBuilder().getAssociations(referenceForDataElement.reference) : objFQTRTElem.Associations;
        objFQTRTElem.FreeFlow = ssrObj.serviceRequest.ssr.freeText ? ssrObj.serviceRequest.ssr.freeText : null;
        ssrElem.FQTSElements[ssrElem.FQTSElements.length] = objFQTRTElem;
    };
    /**
     * assignFQTVProperties.
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {Object} ssrObj Object containing SSR info.
     * @param {Object} ssrElem Object of SSRElem.
     */
    function assignFQTVProperties(ssrObj, ssrElem) {
        var ssrFQTVObj = function() {
            self = this;
            self.ElementNo = '';
            self.Text = '';
            self.Associations = '';
            self.FreeFlow = null;;
        };
        var objFQTVTElem = new ssrFQTVObj();
        objFQTVTElem.ElementNo = parseInt(ssrObj.elementManagementData.lineNumber);
        objFQTVTElem.Text = ssrObj;
        var referenceForDataElement = ssrObj.referenceForDataElement;
        objFQTVTElem.Associations = referenceForDataElement ? new AssociationBuilder().getAssociations(referenceForDataElement.reference) : objFQTVTElem.Associations;
        objFQTVTElem.FreeFlow = ssrObj.serviceRequest.ssr.freeText ? ssrObj.serviceRequest.ssr.freeText : null;
        ssrElem.FQTVElements[ssrElem.FQTVElements.length] = objFQTVTElem;
    };
    /**
     * assignFQTUProperties.
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {Object} ssrObj Object containing SSR info.
     * @param {Object} ssrElem Object of SSRElem.
     */
    function assignFQTUProperties(ssrObj, ssrElem) {
        var ssrFQTUObj = function() {
            self = this;
            self.ElementNo = '';
            self.Text = '';
            self.Associations = '';
            self.FreeFlow = null;
        };
        var objFQTUTElem = new ssrFQTUObj();
        objFQTUTElem.ElementNo = parseInt(ssrObj.elementManagementData.lineNumber);
        objFQTUTElem.Text = ssrObj;
        var referenceForDataElement = ssrObj.referenceForDataElement;
        objFQTUTElem.Associations = referenceForDataElement ? new AssociationBuilder().getAssociations(referenceForDataElement.reference) : objFQTUTElem.Associations;
        objFQTUTElem.FreeFlow = ssrObj.serviceRequest.ssr.freeText ? ssrObj.serviceRequest.ssr.freeText : null;
        ssrElem.FQTUElements[ssrElem.FQTUElements.length] = objFQTUTElem;
    };

    /**
     * Assigning Other SSR Element properties.
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {Object} ssrObj Object containing SSR info.
     * @param {Object} ssrElem Object of SSRElem.
     */
    function assignOtherSSRElemProperties(ssrObj, ssrElem) {
        var ssrOtherObj = function() {
            self = this;
            self.ElementNo = '';
            self.Text = '';
            self.Associations = '';
            self.FreeFlow = null;
        };
        var objOtherElem = new ssrOtherObj();
        objOtherElem.ElementNo = parseInt(ssrObj.elementManagementData.lineNumber);
        objOtherElem.Text = ssrObj;
        objOtherElem.FreeFlow = ssrObj.serviceRequest.ssr.freeText ? ssrObj.serviceRequest.ssr.freeText : null;
        var referenceForDataElement = ssrObj.referenceForDataElement;
        objOtherElem.Associations = referenceForDataElement ? new AssociationBuilder().getAssociations(referenceForDataElement.reference) : objOtherElem.Associations;
        ssrElem.otherSSRElementsArray[ssrElem.otherSSRElementsArray.length] = objOtherElem;
    };
    /**
     * create complete SSRElem array
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {ssrObj} Object of SSR element
     */
    function createSSRElementArray(ssrObj) {
        var SSRArr = [];
        SSRArr = ssrObj.SeatElements.concat();
        SSRArr.push.apply(SSRArr, ssrObj.FOIDElements);
        SSRArr.push.apply(SSRArr, ssrObj.FQTRElements);
        SSRArr.push.apply(SSRArr, ssrObj.FQTSElements);
        SSRArr.push.apply(SSRArr, ssrObj.FQTVElements);
        SSRArr.push.apply(SSRArr, ssrObj.FQTUElements);
        SSRArr.push.apply(SSRArr, ssrObj.otherSSRElementsArray);
        SSRArr.sort(compare);
        ssrObj.orderedSSRArr = SSRArr.concat();
        return ssrObj;
    }
    /**
     * sort two object according to elementNo
     *
     * @memberOf SSRElemBuilder
     * @inner
     * @param {firstObj} First Object of array
     * @param {secondObj} Second Object of array
     */
    function compare(firstObj, secondObj) {
        if (firstObj.ElementNo < secondObj.ElementNo) {
            return -1;
        }
        if (firstObj.ElementNo > secondObj.ElementNo) {
            return 1;
        }
        return 0;
    }

    return SSRElemBuilder;
})();