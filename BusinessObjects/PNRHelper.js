var PNRHelper = (function() {

    /**
     * Represents PNRHelper which contains map of all PNR Elements and Segments
     *
     * @constructs PNRHelper
     * @property {map<segment name, [segmentdata]>} jsonElementsMap with key as segmanet name and value as array of segment data
     */
    function PNRHelper() {
        this.jsonElementsMap = new Map();

    }

    return PNRHelper;
})();

var PNRHelperBuilder = (function() {
    /**
     * Represents PNRHelperBuilder.
     *
     * @constructs PNRHelperBuilder
     */
    function PNRHelperBuilder() {
       
    }

    var pnrHelperObj;

    var allItineraryElements = [],
        alldataIndivElements = [],
        remarkElems = [],
        confidentialRemarkElems = [],
        optionQueueElems = [],
        fareAutoInvoiceElems = [],
        serviceFeeRemarkElems = [],
        fareTourCodeElems = [],
        fareCommissionElems = [],
        fareEndoElems = [],
        fsElements = [],
        mailingAddressElems = [],
        billingAddressElems = [],
        ticketElems = [],
        otherServiceElems = [],
        RIAElements = [],
        RIBElements = [],
        RICElements = [],
        RIDElements = [],
        RIFElements = [],
        RIIElements = [],
        RIMElements = [],
        RIOElements = [],
        RIPElements = [],
        RIRElements = [],
        RITElements = [],
        SKElements = [],
        RIZElements = [],
        carSegments = [],
        hotelSegments = [],
        auxHotelSegments = [],
        fareOriginalIssueElements = [],
        ticketingAirlineElements = [],
        fareMiscTktInfoElements = [],
        fareManualTktElements = [],
        fareFormOfPaymentElems = [],
        IUElements = [];
    /**
     * extracts segments from
     * webservice response and loads
     * then into array
     */
    var loadDataElementsArray = function(dataElementsIndiv) {
        if (Array.isArray(dataElementsIndiv)) {
            alldataIndivElements = dataElementsIndiv;
        } else {
            alldataIndivElements.push(dataElementsIndiv);
        }
        return alldataIndivElements;
    };

    /**
     * extracts segments from
     * webservice response and loads
     * then into array
     */
    var loadItineraryElementsArray = function(dataElementsIndiv) {
        if (Array.isArray(dataElementsIndiv)) {
            allItineraryElements = dataElementsIndiv;
        } else {
            allItineraryElements.push(dataElementsIndiv);
        }
        return allItineraryElements;
    };

    var loadItineraryInfo = function (strData) {
        carSegments = [];
        hotelSegments = [];
        auxHotelSegments = [];
        IUElements = [];
        if (strData.response.model.output.response.originDestinationDetails) {           
            var itineraryInfo = strData.response.model.output.response.originDestinationDetails.itineraryInfo || null;
            var iMax = itineraryInfo.length;
            allItineraryElements = loadItineraryElementsArray(itineraryInfo);
            if (typeof (iMax) == 'undefined') {
                iMax = allItineraryElements.length;
            }
            for (var index = 0; index < iMax; index++) {
                switch (allItineraryElements[index].elementManagementItinerary.segmentName) {
                    case Constants.CarSegmentCode:
                        carSegments.push(allItineraryElements[index]);
                        break;
                    case Constants.ManualAuxiliaryServiceSegmentCode:
                        IUElements.push(allItineraryElements[index]);
                        break;
                    case Constants.HotelSegmentCode:
                        hotelSegments.push(allItineraryElements[index]);
                        break;
                    case Constants.AuxHotelSegmentCode:
                        auxHotelSegments.push(allItineraryElements[index]);
                        break;
                    default:
                        break;
                }
            }
        }
    };
    var loadDataElementsIndivElementsStartingwithR = function(segmentName, index) {
        switch (segmentName) {
            case "RC":
                confidentialRemarkElems.push(alldataIndivElements[index]);
                break;
            case "RM":
                remarkElems.push(alldataIndivElements[index]);
                break;
            case "RIA":
                RIAElements.push(alldataIndivElements[index]);
                break;
            case "RIB":
                RIBElements.push(alldataIndivElements[index]);
                break;
            case "RIC":
                RICElements.push(alldataIndivElements[index]);
                break;
            case "RID":
                RIDElements.push(alldataIndivElements[index]);
                break;
            case "RIF":
                RIFElements.push(alldataIndivElements[index]);
                break;
            case "RII":
                RIIElements.push(alldataIndivElements[index]);
                break;
            case "RIM":
                RIMElements.push(alldataIndivElements[index]);
                break;
            case "RIO":
                RIOElements.push(alldataIndivElements[index]);
                break;
            case "RIP":
                RIPElements.push(alldataIndivElements[index]);
                break;
            case "RIR":
                RIRElements.push(alldataIndivElements[index]);
                break;
            case "RIS":
                serviceFeeRemarkElems.push(alldataIndivElements[index]);
                break;
            case "RIZ":
                RIZElements.push(alldataIndivElements[index]);
                break;
            case "RIT":
                RITElements.push(alldataIndivElements[index]);
                break;
            case "FS":
                fsElements.push(alldataIndivElements[index]);
                break;
            case "CCR":
                carSegments.push(alldataIndivElements[index]);
                break;
            default:
                break;
        }
    };
    var loadDataElementsIndivElementsStartingwithF = function(segmentName, index) {
        switch (segmentName) {
            case "FI":
                fareAutoInvoiceElems.push(alldataIndivElements[index]);
                break;
            case "FT":
                fareTourCodeElems.push(alldataIndivElements[index]);
                break;
            case "FM":
                fareCommissionElems.push(alldataIndivElements[index]);
                break;
            case "FE":
                fareEndoElems.push(alldataIndivElements[index]);
                break;
            case "FP":
                fareFormOfPaymentElems.push(alldataIndivElements[index]);
                break;
            case Constants.FareOriginalIssueElementCode:
                fareOriginalIssueElements.push(alldataIndivElements[index]);
                break;
            case Constants.FareMiscTktInfoElementCode:
                fareMiscTktInfoElements.push(alldataIndivElements[index]);
                break;
            case Constants.FareManualTktElementCode:
                fareManualTktElements.push(alldataIndivElements[index]);
                break;
            case Constants.TicketingAirlineElementCode:
                ticketingAirlineElements.push(alldataIndivElements[index]);
                break;
            default:
                break;
        }
    };
    var loadDataElementsIndivElementsStartingwithOtherCharacters = function(segmentName, index) {
        switch (segmentName) {
            case "AM":
                mailingAddressElems.push(alldataIndivElements[index]);
                break;
            case "AM/":
                mailingAddressElems.push(alldataIndivElements[index]);
                break;
            case "AB":
                billingAddressElems.push(alldataIndivElements[index]);
                break;
            case "AB/":
                billingAddressElems.push(alldataIndivElements[index]);
                break;
            case "TK":
                ticketElems.push(alldataIndivElements[index]);
                break;
            case Constants.OtherServiceElementCode:
                otherServiceElems.push(alldataIndivElements[index]);
                break;
            case "SK":
                SKElements.push(alldataIndivElements[index]);
                break;
            default:
             if(segmentName.startsWith("OP"))
                {
                    optionQueueElems.push(alldataIndivElements[index]);
                }
                break;
        }
    };
    var loadDataElementsIndivElements = function (strData) {
        allItineraryElements = [];
        alldataIndivElements = [];
        confidentialRemarkElems = [];
        optionQueueElems = [];
        fareAutoInvoiceElems = [];
        serviceFeeRemarkElems = [];
        fareTourCodeElems = [];
        fareCommissionElems = [];
        fareEndoElems = [];
        fsElements = [];
        mailingAddressElems = [];
        billingAddressElems = [];
        ticketElems = [];
        otherServiceElems = [];
        RIAElements = [];
        RIBElements = [];
        RICElements = [];
        RIDElements = [];
        RIFElements = [];
        RIIElements = [];
        RIMElements = [];
        RIOElements = [];
        RIPElements = [];
        RIRElements = [];
        RITElements = [];
        SKElements = [];
        RIZElements = [];
        fareOriginalIssueElements = [];
        ticketingAirlineElements = [];
        fareMiscTktInfoElements = [];
        fareManualTktElements = [];
        fareFormOfPaymentElems = [];
        remarkElems = [];
        if (strData.response.model.output.response.dataElementsMaster) {           
            var dataElementsIndiv = strData.response.model.output.response.dataElementsMaster.dataElementsIndiv || null;
            var iMax = dataElementsIndiv.length;
            if(!iMax)
            {
                //dataElementsIndiv is not an Array
                iMax = 1;
            }
            alldataIndivElements = loadDataElementsArray(dataElementsIndiv);
            for (var index = 0; index < iMax; index++) {
                var segmentName = alldataIndivElements[index].elementManagementData.segmentName;
                if (segmentName) {
                    var firstCharacter = segmentName[0];
                    switch (firstCharacter) {
                        case 'R':
                            loadDataElementsIndivElementsStartingwithR(segmentName, index);
                            break;
                        case 'F':
                            loadDataElementsIndivElementsStartingwithF(segmentName ,index);
                            break;
                        default:
                            loadDataElementsIndivElementsStartingwithOtherCharacters(segmentName ,index);
                            break;
                    }
                }
            }
        }
    };
    var setElementsinMap = function() {
        pnrHelperObj.jsonElementsMap.set('RM', remarkElems);
        pnrHelperObj.jsonElementsMap.set('RIS', serviceFeeRemarkElems);
        pnrHelperObj.jsonElementsMap.set('RIZ', RIZElements);
        pnrHelperObj.jsonElementsMap.set('RC', confidentialRemarkElems);
        pnrHelperObj.jsonElementsMap.set('OP', optionQueueElems);
        pnrHelperObj.jsonElementsMap.set('FI', fareAutoInvoiceElems);
        pnrHelperObj.jsonElementsMap.set('FT', fareTourCodeElems);
        pnrHelperObj.jsonElementsMap.set('FM', fareCommissionElems);
        pnrHelperObj.jsonElementsMap.set('FE', fareEndoElems);
        pnrHelperObj.jsonElementsMap.set('FP', fareFormOfPaymentElems);
        pnrHelperObj.jsonElementsMap.set('AM', mailingAddressElems);
        pnrHelperObj.jsonElementsMap.set('AB', billingAddressElems);
        pnrHelperObj.jsonElementsMap.set('TK', ticketElems);
        pnrHelperObj.jsonElementsMap.set('RIA', RIAElements);
        pnrHelperObj.jsonElementsMap.set('RIB', RIBElements);
        pnrHelperObj.jsonElementsMap.set('RIC', RICElements);
        pnrHelperObj.jsonElementsMap.set('RID', RIDElements);
        pnrHelperObj.jsonElementsMap.set('RIF', RIFElements);
        pnrHelperObj.jsonElementsMap.set('RII', RIIElements);
        pnrHelperObj.jsonElementsMap.set('RIM', RIMElements);
        pnrHelperObj.jsonElementsMap.set('RIO', RIOElements);
        pnrHelperObj.jsonElementsMap.set('RIP', RIPElements);
        pnrHelperObj.jsonElementsMap.set('RIR', RIRElements);
        pnrHelperObj.jsonElementsMap.set('RIT', RITElements);
        pnrHelperObj.jsonElementsMap.set(Constants.OtherServiceElementCode, otherServiceElems);
        pnrHelperObj.jsonElementsMap.set('SK', SKElements);
        pnrHelperObj.jsonElementsMap.set(Constants.CarSegmentCode, carSegments);
        pnrHelperObj.jsonElementsMap.set(Constants.ManualAuxiliaryServiceSegmentCode, IUElements);
        pnrHelperObj.jsonElementsMap.set(Constants.FareOriginalIssueElementCode, fareOriginalIssueElements);
        pnrHelperObj.jsonElementsMap.set(Constants.TicketingAirlineElementCode, ticketingAirlineElements);
        pnrHelperObj.jsonElementsMap.set(Constants.FareMiscTktInfoElementCode, fareMiscTktInfoElements);
        pnrHelperObj.jsonElementsMap.set(Constants.FareManualTktElementCode, fareManualTktElements);
        pnrHelperObj.jsonElementsMap.set(Constants.AuxHotelSegmentCode, auxHotelSegments);
        pnrHelperObj.jsonElementsMap.set(Constants.HotelSegmentCode, hotelSegments);
        pnrHelperObj.jsonElementsMap.set(Constants.CarSegmentCode, carSegments);
    };

    var clearArray = function () {
      var allItineraryElements = [],
       alldataIndivElements = [],
       remarkElems = [],
       confidentialRemarkElems = [],
       optionQueueElems = [],
       fareAutoInvoiceElems = [],
       serviceFeeRemarkElems = [],
       fareTourCodeElems = [],
       fareCommissionElems = [],
       fareEndoElems = [],
       fsElements = [],
       mailingAddressElems = [],
       billingAddressElems = [],
       ticketElems = [],
       otherServiceElems = [],
       RIAElements = [],
       RIBElements = [],
       RICElements = [],
       RIDElements = [],
       RIFElements = [],
       RIIElements = [],
       RIMElements = [],
       RIOElements = [],
       RIPElements = [],
       RIRElements = [],
       RITElements = [],
       SKElements = [],
       RIZElements = [],
       carSegments = [],
       hotelSegments = [],
       auxHotelSegments = [],
       fareOriginalIssueElements = [],
       ticketingAirlineElements = [],
       fareMiscTktInfoElements = [],
       fareManualTktElements = [],
       fareFormOfPaymentElems = [],
       IUElements = [];
    }
    /**
     * Get Map with key as segment name and value as array of segment data
     *
     * @member of PNRHelperBuilder
     * @instance
     * @param {Object} references of the element from PNR Response
     * @returns {map<segment name, [segmentdata]>} jsonElementsMap with key as segmanet name and value as array of segment data
     */
    PNRHelperBuilder.prototype.getJsonElementsMap = function(data) {
        pnrHelperObj = new PNRHelper();
        var strData = JSON.parse(data);
        clearArray();
        loadDataElementsIndivElements(strData);
        loadItineraryInfo(strData);
        setElementsinMap();
        return pnrHelperObj;
    };
    return PNRHelperBuilder;

})();