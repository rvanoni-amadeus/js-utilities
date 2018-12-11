/*!
 * @file Loads all required JS scripts and constructs PNR Object
 * @license
 * Copyright 2014 - Amadeus Development Company S.A.
 * Copyright of this program is the property of AMADEUS,
 * without whose written permission reproduction in whole
 * or in part is prohibited. All rights reserved.
 * Amadeus S.A. B.P. 69 06902 SOPHIA ANTIPOLIS CEDEX
 * http://www.amadeus.com
 *
/**
 * @function
 * @name loadScripts
 * @description Self invoking function which will load JS scripts dynamically
 */
var loadScripts = (function() {

    /**
     * Calling the addScript method to add scripts dynamically.
     */
    addScript();

    /**
     * Initializes all required script names and calls 'loadArrayOfScripts' function to load JS scripts
     *
     * @memberOf loadScripts
     * @function
     */
    function addScript() {
        //Array containing all the script to be added dynamically.
        var scriptURLArr = ["AccountingAIElement", "AirActiveSegment", "AirARNKSegment", "AirFlownSegment", "AirItineraryInfo", "AirOpenSegment", "AirSegment", "AllAirSegments", "Associations", "AuxCarSegment", "AuxHotelSegment", "BillingAddressElement", "CarSegment", "ConfidentialRemarkElement", "Constants", "FareAutoInvoiceElement", "FareAutoTicketElement", "FareCommissionElement", "FareDiscountElement", "FareEndoElement", "FareFormOfPaymentElement", "FareTourCodeElement", "FreeflowInvRemarkElement", "GroupNameElement", "HeaderSegment", "HotelSegment", "MailingAddressElement", "MemoSegment", "NameElement", "OptionQueueElement", "OtherServiceElement", "PhoneElement", "PNRHelper", "PNR_AddMultiple", "PNRHelper", "PNRObjBuildHelper", "RIElements", "RemarkElement", "ServiceFeeRemark", "SSRElement", "TicketElement", "TravelAssistanceSegment", "FareMiscTktInfoElement", "FareManualTktElement", "FareOriginalIssueElement", "TicketingAirlineElement","RIZElements","FSElement"];
        //Array containing all the script to be added dynamically from SmartScript_Utils project.
        var scriptURLArrFromUtils = ['HelperCryptic', 'SendCryptic', 'GcdEncodeDecode', 'IEHacks', 'SellConnectUser'];

        // webSdkPlatform must be already defined when the web application is hosted in a different server than the webSDK.
        // If it is not defined, we assume that the web application is hosted on the same server as webSDK.
        var webSdkPlatform = window.webSdkPlatform;
        if (typeof webSdkPlatform === 'undefined') {
            webSdkPlatform = "/";
        }
        loadArrayOfScripts(scriptURLArr, webSdkPlatform + "Scripts/src/app/assets/js/BusinessObjects/");
        loadArrayOfScripts(scriptURLArrFromUtils, webSdkPlatform + "Scripts/src/app/assets/js/Util/");
    }

    /**
     * Dynamically appends script tags to HTML document to load js files.
     *
     * @memberOf loadScripts
     * @function
     * @param {string[]} arrayOfScripts - array of script names which should be loaded.
     * @param {string} scriptPath - script lookup path
     */
    function loadArrayOfScripts(arrayOfScripts, scriptPath) {
        for (var urlIndex = 0; urlIndex < arrayOfScripts.length; urlIndex++) {
            var scriptURL = document.createElement('script');
            scriptURL.src = scriptPath + arrayOfScripts[urlIndex] + ".js";
            document.getElementsByTagName('head')[0].appendChild(scriptURL);
        }
    }
})();

var PNR = (function() {

    var pnrObjBuildHelper;

    /**
     * Represents a PNR.
     *
     * @constructs PNR
     * @property {object[]} AccountingAIElements
     * @property {object[]} AirActiveSegments
     * @property {object[]} AirARNKSegments
     * @property {object[]} AirFlownSegments
     * @property {object[]} AirItineraryInfos
     * @property {object[]} AirOpenSegments
     * @property {object[]} AirSegments
     * @property {object[]} AllAirSegments
     * @property {object[]} AuxCarSegments
     * @property {object[]} AuxHotelSegments
     * @property {object[]} BillingAddressElements
     * @property {object[]} CarSegments
     * @property {object[]} ConfidentialRemarkElements
     * @property {string} crypticData cryptic response
     * @property {string} Error error text
     * @property {object[]} FareAutoInvoiceElements
     * @property {object[]} FareAutoTicktElem
     * @property {object[]} FareCommissionElements
     * @property {object[]} FDElement
     * @property {object[]} FareEndoElements
     * @property {object[]} FareFormOfPaymentElements
     * @property {object[]} FareTourCodeElements
     * @property {object[]} FreeflowInvRemarkElements
     * @property {object[]} GroupNameElements
     * @property {object[]} Header
     * @property {object[]} HotelSegments
     * @property {object[]} MailingAddressElements
     * @property {object[]} MemoSegments
     * @property {object[]} NameElements
     * @property {object[]} NameTextArr
     * @property {object[]} OptionQueueElements
     * @property {object[]} PhoneElements
     * @property {string} PNRCrypticData
     * @property {object[]} RemarkElements
     * @property {object[]} SSRFOIDElements
     * @property {object[]} SSRFQTRElements
     * @property {object[]} SSRFQTSElements
     * @property {object[]} SSRFQTUElements
     * @property {object[]} SSRFQTVElements
     * @property {object[]} SSRSEATElements
     * @property {object[]} ServiceFeeAirRemarkElements
     * @property {string} Text PNR webservice response
     * @property {object[]} TicketElements
     * @property {object[]} TravelAssistanceElements
     * @property {object[]} OtherServiceElements
     * @property {object[]} AdjRmkInvoiceElements #RIA
     * @property {object[]} AgencyBillingDateElements #RIB
     * @property {object[]} PrintAgencyDueDateElements #RIC
     * @property {object[]} AgencyDueDateElements #RID
     * @property {object[]} FreeflowInvRemarkElements #RIF
     * @property {object[]} InvItineraryRmkElements #RII
     * @property {object[]} ProfileItineraryRmkElements #RIM
     * @property {object[]} ItineraryInvRmkElements #RIO
     * @property {object[]} InvoiceRemarkElements #RIP
     * @property {object[]} ItineraryRemarkElements #RIR
     * @property {object[]} OverrideInvTotalElements #RIT
     * @property {object[]} FareMiscTktInfoElements
     * @property {object[]} FareOriginalIssueElements
     * @property {object[]} FareManualTktElements
     * @property {object[]} TicketingAirlineElements
     * @property {number} RetrieveCurrent value denotes whether there is a active PNR or not
     */
    function PNR() {
        this.AccountingAIElements = [];
        this.AirActiveSegments = [];
        this.AirARNKSegments = [];
        this.AirFlownSegments = [];
        this.AirItineraryInfos = [];
        this.AirOpenSegments = [];
        this.AirSegments = [];
        this.AllAirSegments = [];
        this.AuxCarSegments = [];
        this.AuxHotelSegments = [];
        this.BillingAddressElements = [];
        this.CarSegments = [];
        this.ConfidentialRemarkElements = [];
        this.crypticData = '';
        this.Error = '';
        this.FareAutoInvoiceElements = [];
        this.FareAutoTicktElem = [];
        this.FareCommissionElements = [];
        this.FDElement = [];
        this.FareEndoElements = [];
        this.FareFormOfPaymentElements = [];
        this.FareTourCodeElements = [];
        this.FreeflowInvRemarkElements = [];
        this.GroupNameElements = [];
        this.Header = [];
        this.HotelSegments = [];
        this.MailingAddressElements = [];
        this.MemoSegments = [];
        this.NameElements = [];
        this.NameTextArr = [];
        this.OptionQueueElements = [];
        this.OtherServiceElements = [];
        this.PhoneElements = [];
        this.PNRCrypticData = "";
        this.RemarkElements = [];
        this.RizElements = [];
        this.SSRElement;
        this.SSRFoid = [];
        this.SSRfqtrElement = [];
        this.SSRfqtsElement = [];
        this.SSRfqtuElement = [];
        this.SSRfqtvElement = [];
        this.SSRSeatElement = [];
        this.Text = '';
        this.TicketElements = [];
        this.TravelAssistanceElements = [];
        this.ServiceFeeRemarks = [];
        this.AdjRmkInvoiceElements = [];
        this.AgencyBillingDateElements = [];
        this.PrintAgencyDueDateElements = [];
        this.AgencyDueDateElements = [];
        this.FreeflowInvRemarkElements = [];
        this.InvItineraryRmkElements = [];
        this.ProfileItineraryRmkElements = [];
        this.ItineraryInvRmkElements = [];
        this.InvoiceRemarkElements = [];
        this.ItineraryRemarkElements = [];
        this.OverrideInvTotalElements = [];
        this.FareMiscTktInfoElements = [];
        this.FareOriginalIssueElements = [];
        this.FareManualTktElements = [];
        this.TicketingAirlineElements = [];
        this.FSElements = [];
        this.RetrieveCurrent;
        /**@private */
        this.webResponse = '';
    }

    /**
     * Retrieve RetrieveCurrent property.
     *
     * @memberof PNR
     * @instance
     * @returns {long} value denoting whether there is a active PNR or not
     */
    PNR.prototype.RetrieveCurrent = function() {
        return this.RetrieveCurrent;
    };

    /**
     * Parses PNR webservice response.
     *
     * @param {string} status PNR promise status.
     * @memberOf PNR
     * @inner
     */
    var parsePNRRespone = function(status) {
        var data = this.webResponse;
        var result = JSON.stringify(data, null, 2);
        this.Text = result;
        var self = this;
        var res = CheckError.call(self);
        var error = "ERROR";
        // Check if this is a PNR - No Error, if so, no parsing
        if (!res) {
            // We can move on
            var SendObj = new sendCrypticCommand();
            var promiseVar = SendObj.SendCrypticWS("RT");
            promiseVar.then(function(crypticRespData) {
                var checkGroupResponse = crypticRespData.longTextString.textStringDetails.split(/\n/);
                var checkGroupRespCheck = checkGroupResp(checkGroupResponse);
                if (checkGroupRespCheck) {
                    sendCrypticForPNR(self, result, status, "groupPNR", crypticRespData);
                } else {
                    sendCrypticForPNR(self, result, status, "singlePNR", crypticRespData);
                }
            });

        } else {
            if (data.response.model.output.response) {
                error = data.response.model.output.response.MessagesOnly_Reply.CAPI_Messages.Text;
            } else if (data.response.model.serverEvent) {
                error = data.response.model.serverEvent;
            }
            this.RetrieveCurrent = Constants.HST_ERR_TIMEOUT;
            this.reject(error);
        }

    };

    /**
     * Retrieve all PNR properties.
     *
     * @memberof PNR
     * @instance
     * @param {string} recloc - record locator
     * @returns {Promise} Promise will set all properties of PNR object on fulfillment
     */
    PNR.prototype.OpenPNR = function(recloc) {
        var self = this;
        var txtRetrieve;
        if (recloc == null || recloc.length == 0) {
            txtRetrieve = '{"retrievalFacts": {"retrieve": {"type": 1}}}';
        } else {
            txtRetrieve = '{"retrievalFacts":{"retrieve":{"type":2},"reservationOrProfileIdentifier":{"reservation":{"controlNumber":"' + recloc + '"}}}}';
        }
        var input = JSON.parse(txtRetrieve);
        return new Promise(function(fulfill, reject) {
            self.fulfill = fulfill;
            self.reject = reject;
            smartScriptSession.sendWS("ws.retrievePNR_v14.1", input)
                .then(function (data) {
                    clearPNR(self);
                    self.webResponse = data;
                    parsePNRRespone.call(self, "fulfill");
                }, function (data) {
                    clearPNR(self);
                    self.reject("INVALID_RESPONSE");
                });
        });
    };
    /**
     * Checks for Error in PNR web service response.
     *
     * @memberOf PNR
     * @inner
     * @returns {Boolean} boolean value 'true' if response has error or 'false' if there is no error
     */
    function CheckError() {
        var data = this.webResponse;
        var objPNR = this;
        //var strToParse = JSON.parse(data);
        var strToParse = data;
        var errorKey = true;
        try {
            if (strToParse.response.model && strToParse.response.model.output.response) {
                if (strToParse.response.model.output.response.MessagesOnly_Reply.CAPI_Messages.Text.length > 0) {
                    objPNR.Error = strToParse.response.model.output.response.MessagesOnly_Reply.CAPI_Messages.Text;
                    return errorKey;
                }
            } else {
                return errorKey;
            }
        } catch (e) {
            return false;
        };
    };

    /**
     * Checks if PNR cryptic response is group PNR response or not.
     *
     * @memberOf PNR
     * @inner
     * @param {Text} checkGroupResponse PNR cryptic lines
     * @returns {Boolean} boolean value 'true' if reponse is group type or 'false' if not
     */
    function checkGroupResp(checkGroupResponse) {
        var checkGropRes = false;
        for (var groupItem = 0; groupItem < checkGroupResponse.length; groupItem++) {
            if (checkGroupResponse[groupItem].startsWith('0.')) {
                checkGropRes = true;
                break;
            }
        }
        return checkGropRes;
    }
    /**
     * sendCrypticForPNR
     *
     * @memberOf PNR
     * @inner
     * @param {Object} self PNR Object.
     * @param {Object} mainData PNR Response.
     * @param {string} status Promise status.
     * @param {string} pnrType PNR type whether groupPNR or singlePNR.
     * @param {Object} crypticData PNR Cryptic response.
     */
    function sendCrypticForPNR(self, mainData, status, pnrType, crypticData) {
        /*get AirSegments & ARNK to create AirItineraryInfo Segments*/
        var ObjectData = {};
        //form a map of segment names with corresponding data
        var serverResponse = JSON.parse(mainData);
        var noACtivePNR = serverResponse.response.model.output.response.MessagesOnly_Reply;
        if (noACtivePNR === null || noACtivePNR === undefined) {
            var jsonElementsMap = new PNRHelperBuilder().getJsonElementsMap(mainData).jsonElementsMap;
            pnrObjBuildHelper = new PNRObjBuildHelper(mainData, self, jsonElementsMap);
            self.AirSegments = pnrObjBuildHelper.getAirSegments();
            self.AirARNKSegments = pnrObjBuildHelper.getAirARNKSegments();
            ObjectData["airSegment"] = self.AirSegments;
            ObjectData["arnkSegment"] = self.AirARNKSegments;
            var airItineraryInfoBuilder = new AirItineraryInfoBuilder();
            if (pnrType === "groupPNR") {
                var SendObjSec = new sendCrypticCommand();
                var promiseVarSec = SendObjSec.SendCrypticWS("rtn");
                promiseVarSec.then(function(crypticGroupRespData) {
                    if (crypticGroupRespData.longTextString.textStringDetails.slice(-2) === ")>") {
                        var HelperCrypticObjGroup = new helperCryptic();
                        var varPromiseGrp = HelperCrypticObjGroup.GetCrypticResponse(crypticGroupRespData.Response);
                        varPromiseGrp.then(function(mainCrypticRespDataGrp) {
                            airItineraryInfoBuilder.createAirItinerary(mainData, mainCrypticRespDataGrp, self, status, ObjectData).then(function(retObj) {
                                mapProperties(retObj);
                            });
                        });
                    } else {
                        airItineraryInfoBuilder.createAirItinerary(mainData, crypticGroupRespData, self, status, ObjectData).then(function(retObj) {
                            mapProperties(retObj);
                        });
                    }
                });
            } else {
                if (crypticData.longTextString.textStringDetails.slice(-2) === ")>") {
                    var HelperCrypticObj = new helperCryptic();
                    var varPromise = HelperCrypticObj.GetCrypticResponse(crypticData.longTextString.textStringDetails);
                    varPromise.then(function(mainCrypticRespData) {
                        airItineraryInfoBuilder.createAirItinerary(mainData, mainCrypticRespData, self, status, ObjectData).then(function(retObj) {
                            mapProperties(retObj);
                        });
                    });
                } else {
                    airItineraryInfoBuilder.createAirItinerary(mainData, crypticData, self, status, ObjectData).then(function(retObj) {
                        mapProperties(retObj);
                    });
                }
            }
            this.RetrieveCurrent = Constants.RETRIEVED_INTEND_RESPONSE;
        } else {
            this.RetrieveCurrent = Constants.CANNOT_RETRIEVE_INTEND_RESPONSE;
        }
    }

    /**
     * mapProperties
     *
     * @memberOf PNR
     * @inner
     * @param {Object} retObj Object containing PNR response, PNR object, PNR cryptic response and PNR itineray info.
     */
    function mapProperties(retObj) {
        retObj.self.PNRCrypticData = retObj.crypticData;
        setDataToSegments(retObj.mainData, retObj.self);
        assignTextProperty(retObj.crypticData, retObj.self, retObj.itinerayObj);
        fulfillMainObj(retObj.status, retObj.self, retObj.mainData);
    }

    /**
     * SetDataToSegments.
     *
     * @memberOf PNR
     * @inner
     * @param {Object} data PNR Response.
     * @param {Object} self PNR Object.
     */
    function setDataToSegments(data, self) {
        self.NameElements = pnrObjBuildHelper.getNameElements();
        self.RemarkElements = pnrObjBuildHelper.getRemarkElements();
        self.HotelSegments = pnrObjBuildHelper.getHotelSegments();
        self.AuxHotelSegments = pnrObjBuildHelper.getAuxHotelSegments();
        self.CarSegments = pnrObjBuildHelper.getCarSegments();
        self.AuxCarSegments = pnrObjBuildHelper.getAuxCarSegments();
        self.AirActiveSegments = pnrObjBuildHelper.getAirActiveSegments();
        self.AirFlownSegments = pnrObjBuildHelper.getAirFlownSegments();
        self.AirOpenSegments = pnrObjBuildHelper.getAirOpenSegments();
        self.MemoSegments = pnrObjBuildHelper.getMemoSegments();
        self.TravelAssistanceElements = pnrObjBuildHelper.getTravelAssistanceElements();
        self.AllAirSegments = pnrObjBuildHelper.getAllAirSegments();
        self.Header = pnrObjBuildHelper.getHeaderSegments();
        self.FareAutoTicktElem = pnrObjBuildHelper.getFareAutoTicketElements();
        self.FDElement = pnrObjBuildHelper.getFareDiscountElements();
        self.AirItineraryInfos = pnrObjBuildHelper.getAirItineraryInfo();
        self.PhoneElements = pnrObjBuildHelper.getPhoneElements();
        self.FreeflowInvRemarkElements = pnrObjBuildHelper.getFreeflowInvRemarkElements();
        self.GroupNameElements = pnrObjBuildHelper.getGroupNameElements();
        var objSSRElement = pnrObjBuildHelper.getSSRElement();
        self.SSRfqtrElement = objSSRElement.FQTRElements.concat();
        self.SSRfqtsElement = objSSRElement.FQTSElements.concat();
        self.SSRfqtuElement = objSSRElement.FQTUElements.concat();
        self.SSRfqtvElement = objSSRElement.FQTVElements.concat();
        self.SSRSeatElement = objSSRElement.SeatElements.concat();
        self.SSRFoid = objSSRElement.FOIDElements.concat();
        self.SSRElement = objSSRElement.orderedSSRArr.concat();
        self.AccountingAIElements = pnrObjBuildHelper.getAccountingAIElements();
        self.ServiceFeeRemarks = pnrObjBuildHelper.getServiceFeeRemarks();
        self.OtherServiceElements = pnrObjBuildHelper.getOtherServiceElements();
        self.FareFormOfPaymentElements = pnrObjBuildHelper.getFareFormOfPaymentElement();
        self.ConfidentialRemarkElements = pnrObjBuildHelper.getConfidentialRemarkElements();
        self.OptionQueueElements = pnrObjBuildHelper.getOptionQueueElements();
        self.FareAutoInvoiceElements = pnrObjBuildHelper.getFareAutoInvoiceElements();
        self.FareEndoElements = pnrObjBuildHelper.getFareEndoElements();
        self.FareTourCodeElements = pnrObjBuildHelper.getFareTourCodeElements();
        self.FareCommissionElements = pnrObjBuildHelper.getFareCommissionElements();
        self.MailingAddressElements = pnrObjBuildHelper.getMailingAddressElements();
        self.BillingAddressElements = pnrObjBuildHelper.getBillingAddressElements();
        self.TicketElements = pnrObjBuildHelper.getTicketElements();
        self.OtherServiceElements = pnrObjBuildHelper.getOtherServiceElements();
        var RIElements = pnrObjBuildHelper.getRIElements();
        self.AdjRmkInvoiceElements = RIElements.AdjRmkInvoiceElements;
        self.AgencyBillingDateElements = RIElements.AgencyBillingDateElements;
        self.PrintAgencyDueDateElements = RIElements.PrintAgencyDueDateElements;
        self.AgencyDueDateElements = RIElements.AgencyDueDateElements;
        self.FreeflowInvRemarkElements = RIElements.FreeflowInvRemarkElements;
        self.InvItineraryRmkElements = RIElements.InvItineraryRmkElements;
        self.InvoiceRemarkElements = RIElements.InvoiceRemarkElements;
        self.ItineraryInvRmkElements = RIElements.ItineraryInvRmkElements;
        self.ItineraryRemarkElements = RIElements.ItineraryRemarkElements;
        self.OverrideInvTotalElements = RIElements.OverrideInvTotalElements;
        self.ProfileItineraryRmkElements = RIElements.ProfileItineraryRmkElements;
        self.FareOriginalIssueElements = pnrObjBuildHelper.getFareOriginalIssueElements();
        self.TicketingAirlineElements = pnrObjBuildHelper.getTicketingAirlineElements();
        self.FareMiscTktInfoElements = pnrObjBuildHelper.getFareMiscTktInfoElements();
        self.FareManualTktElements = pnrObjBuildHelper.getFareManualTktElements();
        self.RizElements = pnrObjBuildHelper.getRizElements();
        self.FSElements = pnrObjBuildHelper.getFSElements();
        
    };

    /**
     * assignTextProperty.
     *
     * @memberOf PNR
     * @inner
     * @param {Object} crypticCmdResponse PNR cryptic response.
     * @param {Object} self PNR object.
     * @param {object} itinerayObj PNR itineray info.
     */
    function assignTextProperty(crypticCmdResponse, self, itinerayObj) {
        var crypticResponse;
        crypticResponse = crypticCmdResponse.longTextString ? crypticCmdResponse.longTextString.textStringDetails.split(/\n/) : crypticCmdResponse.split(/\n/);
        crypticResponse = crypticResponse.filter(function(n) {
            return (/\S/.test(n));
        });
        for (var lineIndex = 0; lineIndex < crypticResponse.length; lineIndex++) {
            crypticResponse[lineIndex] = crypticResponse[lineIndex].trimRight();
        }

        if (crypticResponse[0].indexOf('TST') > -1 || crypticResponse[0].indexOf('RLR') > -1) {
            if (self.Header.length > 0) {
                self.Header[0]["Text"] = crypticResponse[1];
            }
        } else {
            if (self.Header.length > 0) {
                self.Header[0]["Text"] = crypticResponse[0];
            }
        }
        assignFDElementText(self, crypticResponse);
        assignNameElementText(self, crypticResponse);
        assignDestinationAirport(self, itinerayObj);
    };

    /**
     * fulfillMainObj
     *
     * @memberOf PNR
     * @inner
     * @param {Text} status Promise status.
     * @param {Object} pnrObj PNR Object.
     * @param {Object} mainData PNR response.
     */
    function fulfillMainObj(status, pnrObj, mainData) {
        if (status === "fulfill") {
            pnrObj.fulfill(mainData);
        }
    }

    /**
     * assignFDElementText.
     *
     * @memberOf PNR
     * @inner
     * @param {Object} self PNR Object.
     * @param {Array} crypticResponse Array of PNR cryptic response lines.
     */
    function assignFDElementText(self, crypticResponse) {
        var FDArr = [];
        for (var lineNumItem = 0; lineNumItem < crypticResponse.length; lineNumItem++) {
            if (crypticResponse[lineNumItem].indexOf(' FD ') > -1) {
                FDArr.push(crypticResponse[lineNumItem]);
            }
        }
        if (FDArr.length > 0) {
            for (var fdElemIndex = 0; fdElemIndex < FDArr.length; fdElemIndex++) {
                self.FDElement[fdElemIndex]["Text"] = FDArr[fdElemIndex].trimLeft();
            }
        }
    };

    /**
     * AssignNameElementText.
     *
     * @memberOf PNR
     * @inner
     * @param {Object} self PNR object.
     * @param {string} crypticLines PNR cryptic response lines.
     */
    function assignNameElementText(self, crypticLines) {
        if (self.NameElements) {
            for (var nameItem = 0; nameItem < self.NameElements.length; nameItem++) {
                if (self.NameElements[nameItem] !== undefined) {
                    var elemNo = self.NameElements[nameItem]["ElementNo"];
                    findNameLines(elemNo, crypticLines, self);
                }
            }
        }
        if (self.NameTextArr) {
            for (var textItem = 0; textItem < self.NameTextArr.length; textItem++) {
                if (self.NameTextArr[textItem] !== undefined) {
                    self.NameElements[textItem]["Text"] = self.NameTextArr[textItem];
                }
            }
        }
    };

    /**
     * FindNameLines.
     *
     * @memberOf PNR
     * @inner
     * @param {String} elementNo.
     * @param {Text} crypticLines.
     * @param {Object} self PNR Object.
     */
    function findNameLines(elementNo, crypticLines, self) {
        var lineNumber = elementNo + '.';
        for (var lines = 0; lines < crypticLines.length; lines++) {
            var lineStr = crypticLines[lines].trimLeft();
            if (lineStr.startsWith(lineNumber)) {
                pushToNameElementArr(lineStr, self);
                break;
            }
        }

    };

    /**
     * pushToNameElementArr.
     *
     * @memberOf PNR
     * @inner
     * @param {string} lineItem.
     * @param {Object} self PNR Object.
     */
    function pushToNameElementArr(lineItem, self) {
        var spaces = '  ';
        if (lineItem.indexOf(spaces) > -1) {
            var splitStr = lineItem.split(spaces);
            for (var index = 0; index < splitStr.length; index++) {
                self.NameTextArr.push(splitStr[index].trimLeft());
            }
        } else {
            self.NameTextArr.push(lineItem);
        }
    };
    /**
     * assignDestinationAirport.
     *
     * @memberOf PNR
     * @inner
     * @param {Object} self PNR Object.
     * @param {Object} itinerayObj itineray info object.
     */
    function assignDestinationAirport(self, itinerayObj) {
        if (itinerayObj !== undefined && self.AirItineraryInfos.length > 0) {
            self.AirItineraryInfos[0]["DestinationAirport"] = itinerayObj["DestinationAirport"];
            self.AirItineraryInfos[0]["ArrivalDate"] = itinerayObj["ArrivalDate"];
        }
    };

    /**
    * Clears PNR properties.
    *
    * @memberOf PNR
    * @inner
    * @param {Object} self PNR Object.
    */
    function clearPNR(self) {
        self.AccountingAIElements = [];
        self.AirActiveSegments = [];
        self.AirARNKSegments = [];
        self.AirFlownSegments = [];
        self.AirItineraryInfos = [];
        self.AirOpenSegments = [];
        self.AirSegments = [];
        self.AllAirSegments = [];
        self.AuxCarSegments = [];
        self.AuxHotelSegments = [];
        self.BillingAddressElements = [];
        self.CarSegments = [];
        self.ConfidentialRemarkElements = [];
        self.crypticData = '';
        self.Error = '';
        self.FareAutoInvoiceElements = [];
        self.FareAutoTicktElem = [];
        self.FareCommissionElements = [];
        self.FDElement = [];
        self.FareEndoElements = [];
        self.FareFormOfPaymentElements = [];
        self.FareTourCodeElements = [];
        self.FreeflowInvRemarkElements = [];
        self.GroupNameElements = [];
        self.Header = [];
        self.HotelSegments = [];
        self.MailingAddressElements = [];
        self.MemoSegments = [];
        self.NameElements = [];
        self.NameTextArr = [];
        self.OptionQueueElements = [];
        self.OtherServiceElements = [];
        self.PhoneElements = [];
        self.PNRCrypticData = "";
        self.RemarkElements = [];
        self.SSRElement = [];
        self.SSRFoid = [];
        self.SSRfqtrElement = [];
        self.SSRfqtsElement = [];
        self.SSRfqtuElement = [];
        self.SSRfqtvElement = [];
        self.SSRSeatElement = [];
        self.Text = '';
        self.TicketElements = [];
        self.TravelAssistanceElements = [];
        self.ServiceFeeRemarks = [];
        self.AdjRmkInvoiceElements = [];
        self.AgencyBillingDateElements = [];
        self.PrintAgencyDueDateElements = [];
        self.AgencyDueDateElements = [];
        self.FreeflowInvRemarkElements = [];
        self.InvItineraryRmkElements = [];
        self.ProfileItineraryRmkElements = [];
        self.ItineraryInvRmkElements = [];
        self.InvoiceRemarkElements = [];
        self.ItineraryRemarkElements = [];
        self.OverrideInvTotalElements = [];
        self.FareMiscTktInfoElements = [];
        self.FareOriginalIssueElements = [];
        self.FareManualTktElements = [];
        self.TicketingAirlineElements = [];
        self.RetrieveCurrent;
        self.webResponse = '';

    };
    return PNR;
})();