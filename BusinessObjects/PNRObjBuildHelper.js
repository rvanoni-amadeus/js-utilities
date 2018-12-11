var PNRObjBuildHelper = (function() {

    /**
     * Represents PNRObjBuildHelper which will get all properties to build PNR object.
     *
     * @constructs PNRObjBuildHelper
     * @property {object} data PNR Response
     * @property {object} pnr PNR object
     * @property {map<segment name, [segmentdata]>} dataElementsIndivMap with key as segmanet name and value as array of segment data
     */
    function PNRObjBuildHelper(data, pnr, dataElementsIndivMap) {
        this.data = data;
        this.pnr = pnr;
        this.dataElementsIndivMap = dataElementsIndivMap;
    }

    /**
     * Gets TravelSegmentElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<TravelSegmentElement>} Array of TravelSegmentElement objects
     */
    PNRObjBuildHelper.prototype.getTravelAssistanceElements = function() {
        return new TravelAssistanceElementBuilder().parseTravelSegmentElements(this.data);
    };

    /**
     * Gets PhoneElement objects
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<PhoneElement>} Array of PhoneElement objects
     */
    PNRObjBuildHelper.prototype.getPhoneElements = function() {
        return new PhoneElementBuilder().parsePhoneElements(this.data);
    };

    /**
     * Gets MemoSegment objects
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<MemoSegment>} Array of MemoSegment objects
     */
    PNRObjBuildHelper.prototype.getMemoSegments = function() {
        return new MemoSegmentBuilder().parseMemoSegments(this.data);
    };

    /**
     * Gets FreeflowInvRemarkElement objects
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FreeflowInvRemarkElement>} Array of FreeflowInvRemarkElement objects
     */
    PNRObjBuildHelper.prototype.getFreeflowInvRemarkElements = function() {
        return new FreeflowInvRemarkElementBuilder().parseFreeflowInvRemarkElements(this.data);
    };

    /**
     * Gets HotelSegment objects
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<HotelSegment>} Array of HotelSegment objects
     */
    PNRObjBuildHelper.prototype.getHotelSegments = function() {
        return new HotelSegmentBuilder().parseHotelSegments(this.dataElementsIndivMap);
    };

    /**
     * Gets Header objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<Header>} Array of Header objects
     */
    PNRObjBuildHelper.prototype.getHeaderSegments = function() {
        return new HeaderBuilder().parseHeaders(this.data);
    };

    /**
     * Gets CarSegment objects
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<CarSegment>} Array of CarSegment objects
     */
    PNRObjBuildHelper.prototype.getCarSegments = function() {
        return new CarSegmentBuilder().parseCarSegments(this.dataElementsIndivMap);
    };

    /**
     * Gets AuxHotelSegment objects
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AuxHotelSegment>} Array of AuxHotelSegment objects
     */
    PNRObjBuildHelper.prototype.getAuxHotelSegments = function() {
        return new AuxHotelSegmentBuilder().parseAuxHotelSegments(this.dataElementsIndivMap);
    };

    /**
     * Gets AuxCarSegment objects
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AuxCarSegment>} Array of AuxCarSegment objects
     */
    PNRObjBuildHelper.prototype.getAuxCarSegments = function() {
        return new AuxCarSegmentBuilder().parseAuxCarSegments(this.data);
    };

    /**
     * Gets AirOpenSegment objects
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AirOpenSegment>} Array of AirOpenSegment objects
     */
    PNRObjBuildHelper.prototype.getAirOpenSegments = function() {
        return new AirOpenSegmentBuilder().parseAirOpenSegments(this.data);
    };

    /**
     * Gets AirFlownSegment objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AirFlownSegment>} Array of AirFlownSegment objects
     */
    PNRObjBuildHelper.prototype.getAirFlownSegments = function() {
        return new AirFlownSegmentBuilder().parseAirFlownSegments(this.data);
    };

    /**
     * Gets FareDiscountElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FareDiscountElement>} Array of FareDiscountElement objects
     */
    PNRObjBuildHelper.prototype.getFareDiscountElements = function() {
        return new FareDiscountElementBuilder().parseFDElements(this.data);
    };

    /**
     * Gets FareAutoTicketElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FareAutoTicketElement>} Array of FareAutoTicketElement objects
     */
    PNRObjBuildHelper.prototype.getFareAutoTicketElements = function() {
        return new FareAutoTicketElementBuilder().parseFareAutoTicketElements(this.data);
    };

    /**
     * Gets AirARNKSegment objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AirARNKSegment>} Array of AirARNKSegment objects
     */
    PNRObjBuildHelper.prototype.getAirARNKSegments = function() {
        return new AirARNKSegmentBuilder().parseAirARNKSegments(this.data);
    };

    /**
     * Gets all AirSegment objects including AirFlownSegments and AirOpenSegments
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AirSegment>} Array of AirSegment objects
     */
    PNRObjBuildHelper.prototype.getAllAirSegments = function() {
        return new AllAirSegmentsBuilder().parseAllAirSegments(this.pnr);
    };

    /**
     * Gets AirSegment objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AirSegment>} Array of AirSegment objects
     */
    PNRObjBuildHelper.prototype.getAirSegments = function() {
        return new AirSegmentBuilder().parseAirSegments(this.data);
    };

    /**
     * Gets AirActiveSegment objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AirActiveSegment>} Array of AirActiveSegment objects
     */
    PNRObjBuildHelper.prototype.getAirActiveSegments = function() {
        return new AirActiveSegmentBuilder().parseAirActiveSegments(this.data);
    };

    /**
     * Gets AirItineraryInfo objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AirItineraryInfo>} Array of AirItineraryInfo objects
     */
    PNRObjBuildHelper.prototype.getAirItineraryInfo = function() {
        return new AirItineraryInfoBuilder().parseAirItineraryInfo(this.pnr.AirSegments);
    };

    /**
     * Gets NameElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<NameElement>} Array of NameElement objects
     */
    PNRObjBuildHelper.prototype.getNameElements = function() {
        return new NameElementBuilder().parseNameElements(this.data);
    };

    /**
     * Gets RemarkElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<RemarkElement>} Array of RemarkElement objects
     */
    PNRObjBuildHelper.prototype.getRemarkElements = function() {
        return new RemarkElementBuilder().parseRemarkElements(this.dataElementsIndivMap);
    };

    /**
     * Gets GroupNameElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<GroupNameElement>} Array of GroupNameElement objects
     */
    PNRObjBuildHelper.prototype.getGroupNameElements = function() {
        return new GroupNameElementBuilder().parseGroupNameElements(this.data);
    };
    /**
     * Gets SSRElement object.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Object.<SSRElements>} Object of SSRElements
     */
    PNRObjBuildHelper.prototype.getSSRElement = function() {
        return new SSRElemBuilder().parseSSRElement(this.data);
    };
    /**
     * Gets AccountingAIElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<AccountingAIElement>} Array of AccountingAIElement objects
     */
    PNRObjBuildHelper.prototype.getAccountingAIElements = function() {
        return new AccountingAIElementBuilder().parseAccountingAIElements(this.data);
    };
    /**
     * Gets ServiceFeeRemark objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<ServiceFeeRemark>} Array of ServiceFeeRemark objects
     */
    PNRObjBuildHelper.prototype.getServiceFeeRemarks = function() {
        return new ServiceFeeRemarkBuilder().parseServiceFeeRemarks(this.dataElementsIndivMap);
    };
    /**

     * Gets OtherServiceElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<OtherServiceElement>} Array of OtherServiceElement objects
     */
    PNRObjBuildHelper.prototype.getOtherServiceElements = function() {
        return new OtherServiceElementBuilder().parseOtherServiceElements(this.dataElementsIndivMap);
    };

    /**
     * Gets FareFormOfPayment objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FareFormOfPayment>} Array of FareFormOfPayment objects
     */
    PNRObjBuildHelper.prototype.getFareFormOfPaymentElement = function() {
        return new FareFormOfPaymentElementBuilder().parseFareFormOfPaymentElement(this.dataElementsIndivMap);
    };
    /**
     * Gets ConfidentialRemarkElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<ConfidentialRemarkElement>} Array of ConfidentialRemarkElement objects
     */
    PNRObjBuildHelper.prototype.getConfidentialRemarkElements = function() {
        return new ConfidentialRemarkElementBuilder().parseConfidentialRemarkElements(this.dataElementsIndivMap);
    };

    /**
     * Gets OptionQueueElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<OptionQueueElement>} Array of OptionQueueElement objects
     */
    PNRObjBuildHelper.prototype.getOptionQueueElements = function() {
        return new OptionQueueElementBuilder().parseOptionQueueElements(this.dataElementsIndivMap);
    };

    /**
     * Gets FareEndoElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FareEndoElement>} Array of FareEndoElement objects
     */
    PNRObjBuildHelper.prototype.getFareEndoElements = function() {
        return new FareEndoElementBuilder().parseFareEndoElements(this.dataElementsIndivMap);
    };

    /**
     * Gets MailingAddressElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<MailingAddressElement>} Array of MailingAddressElement objects
     */
    PNRObjBuildHelper.prototype.getMailingAddressElements = function() {
        return new MailingAddressElementBuilder().parseMailingAddressElements(this.dataElementsIndivMap);
    };

    /**
     * Gets BillingAddressElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<BillingAddressElement>} Array of BillingAddressElement objects
     */
    PNRObjBuildHelper.prototype.getBillingAddressElements = function() {
        return new BillingAddressElementBuilder().parseBillingAddressElements(this.dataElementsIndivMap);
    };
    /**
     * Gets FareTourCodeElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FareTourCodeElement>} Array of FareTourCodeElement objects
     */
    PNRObjBuildHelper.prototype.getFareTourCodeElements = function() {
        return new FareTourCodeElementBuilder().parseFareTourCodeElements(this.dataElementsIndivMap);
    };
    /**
     * Gets FareAutoInvoiceElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FareAutoInvoiceElement>} Array of FareAutoInvoiceElement objects
     */
    PNRObjBuildHelper.prototype.getFareAutoInvoiceElements = function() {
        return new FareAutoInvoiceElementBuilder().parseFareAutoInvoiceElements(this.dataElementsIndivMap);
    };
    /**
     * Gets FareCommissionElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FareCommissionElement>} Array of FareCommissionElement objects
     */
    PNRObjBuildHelper.prototype.getFareCommissionElements = function() {
        return new FareCommissionElementBuilder().parseFareCommissionElements(this.dataElementsIndivMap);
    };
    /**
     * Gets TicketElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<TicketElement>} Array of TicketElement objects
     */
    PNRObjBuildHelper.prototype.getTicketElements = function() {
        return new TicketElementBuilder().parseTicketElements(this.dataElementsIndivMap);
    };

    /**
     * Gets RIElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<Array.<RIElement>>} Array of RIElement Arrays.
     */
    PNRObjBuildHelper.prototype.getRIElements = function() {
        return new RIElementsBuilder().parseRIElements(this.dataElementsIndivMap);
    };
    /**
     * Gets OtherServiceElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<OtherServiceElement>} Array of OtherServiceElement Arrays.
     */
    PNRObjBuildHelper.prototype.getOtherServiceElements = function() {
        return new OtherServiceElementBuilder().parseOtherServiceElements(this.dataElementsIndivMap);
    };
    /**
     * Gets OtherElements objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<OtherElements>} Array of OtherServiceElement Arrays.
     */
    PNRObjBuildHelper.prototype.getOtherElements = function() {
        return new OtherElementsBuilder().parseOtherElements(this.dataElementsIndivMap);
    };

    /**
     * Gets FareOriginalIssueElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<Array.<FareOriginalIssueElement>>} Array of FareOriginalIssueElement Arrays.
     */
    PNRObjBuildHelper.prototype.getFareOriginalIssueElements = function() {
        return new FareOriginalIssueElementBuilder().parseFareOriginalIssueElements(this.dataElementsIndivMap);
    };

    /**
     * Gets TicketingAirlineElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<Array.<TicketingAirlineElement>>} Array of TicketingAirlineElement Arrays.
     */
    PNRObjBuildHelper.prototype.getTicketingAirlineElements = function() {
        return new TicketingAirlineElementBuilder().parseTicketingAirlineElements(this.dataElementsIndivMap);
    };

    /**
     * Gets FareMiscTktInfoElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FareMiscTktInfoElement>} Array of FareMiscTktInfoElement objects
     */
    PNRObjBuildHelper.prototype.getFareMiscTktInfoElements = function() {
        return new FareMiscTktInfoElementBuilder().parseFareMiscTktInfoElements(this.dataElementsIndivMap);
    };

    /**
     * Gets FareManualTktElement objects.
     *
     * @memberOf PNRObjBuildHelper
     * @instance
     * @returns {Array.<FareManualTktElement>} Array of FareManualTktElement objects
     */
    PNRObjBuildHelper.prototype.getFareManualTktElements = function() {
        return new FareManualTktElementBuilder().parseFareManualTktElements(this.dataElementsIndivMap);
    };

    /**
    * Gets FareManualTktElement objects.
    *
    * @memberOf PNRObjBuildHelper
    * @instance
    * @returns {Array.<RIZElement>} Array of RizElement objects
    */
    PNRObjBuildHelper.prototype.getRizElements = function () {
        return new RizElementBuilder().parseRizElements(this.dataElementsIndivMap);
    };

    /**
    * Gets FareManualTktElement objects.
    *
    * @memberOf PNRObjBuildHelper
    * @instance
    * @returns {Array.<RIZElement>} Array of RizElement objects
    */
    PNRObjBuildHelper.prototype.getFSElements = function () {
        return new FSElementBuilder().parseFSElements(this.dataElementsIndivMap);
    };  

    return PNRObjBuildHelper;
})();