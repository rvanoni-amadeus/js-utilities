var AirSegment = (function() {
    /**
     * Represents AirSegment.
     *
     * @constructs AirSegment
     * @property {number} ElementNo Element number
     * @property {string} SegmentName Segment name
     * @property {number} DayChange Day Change
     * @property {number} NbrOfPsgrs Number of passengers
     * @property {string} AirlineReference Airline Reference
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     * @property {string} Text text associated with this segment
     * @property {string} Airline Airline
     * @property {string} FlightNumber Flight Number
     * @property {string} ClassType Class Type
     * @property {string} BoardPoint Arrival Airport Code
     * @property {string} OffPoint Departure Airport Code
     * @property {string} DepartureTime Departure Time
     * @property {string} DepartureDate Departure Date
     * @property {string} ArrivalTime Arrival Time
     * @property {string} ArrivalDate Arrival Date
     * @property {string} Equipment equipment
     */
    function AirSegment() {
        this.ElementNo;
        this.SegmentName;
        this.DayChange;
        this.NbrOfPsgrs;
        this.AirlineReference;
        this.Associations;
        this.Text;
        this.Airline;
        this.FlightNumber;
        this.ClassType;
        this.BoardPoint;
        this.OffPoint;
        this.DepartureTime;
        this.DepartureDate;
        this.ArrivalTime;
        this.ArrivalDate;
        this.Equipment;
        this.Stops;
    }

    return AirSegment;
})();

var AirSegmentBuilder = (function() {
    /**
     * Represents AirSegmentBuilder.
     *
     * @constructs AirSegmentBuilder
     */
    function AirSegmentBuilder() {}

    /**
     * Parses PNR repsponse to get AirSegments
     *
     * @memberof AirSegmentBuilder
     * @instance
     * @param {data} PNR Response
     * @returns {Array.<AirSegment>} Array of AirSegment objects
     */
    AirSegmentBuilder.prototype.parseAirSegments = function(data) {
        var itnrCount = 0;
        var strAir = JSON.parse(data);
        var itineraryInfoData = [];
        var airElems = [];
        if (strAir.response.model.output.response.originDestinationDetails) {
            var itinaryData = strAir.response.model.output.response.originDestinationDetails.itineraryInfo || null;
        }
        if (itinaryData) {
            if (Array.isArray(itinaryData)) {
                itineraryInfoData = itinaryData;
            } else {
                itineraryInfoData.push(itinaryData);
            }
            // Check if there is some Air segments within the PNR
            for (itnrCount; itnrCount < itineraryInfoData.length; itnrCount++) {
                if ((itineraryInfoData[itnrCount].elementManagementItinerary.segmentName === 'AIR') && (itineraryInfoData[itnrCount].relatedProduct)) {
                    addAirSegment(airElems, itineraryInfoData[itnrCount]);
                }
            }
        }
        return airElems;
    };

    /**
     * Filters AirSegments from PNR response
     *
     * @memberof AirSegmentBuilder
     * @inner
     * @param {Array} airElems .
     * @param {Object} itineraryInfoData itineraryInfoData Element.
     * @param {Number} itnrCount count.
     */
    function addAirSegment(airElems, itineraryInfoData) {
        var statusCodeInfo = [];
        var airInactive = false;
        var statusCode = itineraryInfoData.relatedProduct.status;
        if (Array.isArray(statusCode)) {
            statusCodeInfo = statusCode;
        } else {
            statusCodeInfo.push(statusCode);
        }
        for (var statusCount = 0; statusCount < statusCodeInfo.length; statusCount++) {
            if (statusCodeInfo[statusCount] === 'B') {
                airInactive = true;
                break;
            }
        }
        if (!airInactive) {
            setAirSegmentElement(airElems, itineraryInfoData);
        }
    };
	
	 function getAssociations(references) {
        var associations = [];
        var referencesArray = [];
        if (Array.isArray(references)) {
            referencesArray = references;
        } else {
            referencesArray.push(references);
        }
        var refLength = referencesArray.length;
        for (var refCount = 0; refCount < refLength; refCount++) {
            var association = new Association();
            association.TatooNumber = referencesArray[refCount].number;
            association.Qualifier = referencesArray[refCount].qualifier;
            associations[refCount] = association;
        }
        return associations;
    }

    /**
     * Builds AirSegment object and adds it to an Array
     *
     * @memberof AirSegmentBuilder
     * @inner
     * @param {Array} airElems Array of AirSegment objects.
     * @param {Object} itineraryInfoData itineraryInfoData Element.
     */
    function setAirSegmentElement(airElems, itineraryInfoData) {
        // We consider the segment
        var objAir = new AirSegment();
        var elemNo = itineraryInfoData.elementManagementItinerary.lineNumber;
        objAir.ElementNo = (elemNo === null || elemNo === undefined ) ? objAir.ElementNo : parseInt(elemNo);
        objAir.SegmentName = itineraryInfoData.elementManagementItinerary.segmentName;
        var travelProduct = itineraryInfoData.travelProduct;
        if(travelProduct)
        {
            if(travelProduct.productDetails)
            {
                 objAir.FlightNumber = travelProduct.productDetails.identification;
                objAir.ClassType = travelProduct.productDetails.classOfService;
            }
            var product = travelProduct.product;
            if(product)
            {
                objAir.DepartureDate = product.depDate;
                objAir.ArrivalDate = product.arrDate;
                objAir.DepartureTime = product.depTime;
                objAir.ArrivalTime = product.arrTime;
                var dayChangeIndicator = product.dayChangeIndicator;
                objAir.DayChange = (dayChangeIndicator === null || dayChangeIndicator === undefined) ? 0 : parseInt(dayChangeIndicator);
            }
            objAir.OffPoint = travelProduct.offpointDetail ? travelProduct.offpointDetail.cityCode : "";
            objAir.Airline = travelProduct.companyDetail ? travelProduct.companyDetail.identification : "";
            objAir.BoardPoint = travelProduct.boardpointDetail ? travelProduct.boardpointDetail.cityCode : "";
        }
        objAir.Text = itineraryInfoData;
        objAir.Associations = (itineraryInfoData.referenceForSegment != null) ? getAssociations(itineraryInfoData.referenceForSegment.reference) : null;
        objAir.AirlineReference = itineraryInfoData.itineraryReservationInfo ? itineraryInfoData.itineraryReservationInfo.reservation.controlNumber : null;
        var quantity = itineraryInfoData.relatedProduct.quantity;
        objAir.NbrOfPsgrs = (quantity === null || quantity === undefined) ? 0 : parseInt(quantity);
        objAir.Equipment = itineraryInfoData.flightDetail ? (itineraryInfoData.flightDetail.productDetails ? itineraryInfoData.flightDetail.productDetails.equipment : null) : null;
        objAir.Stops = itineraryInfoData.flightDetail ? (itineraryInfoData.flightDetail.productDetails ? itineraryInfoData.flightDetail.productDetails.numOfStops : null) : null;
        // We add the air Segment to the collection
        airElems.push(objAir);
    }

    return AirSegmentBuilder;
})();