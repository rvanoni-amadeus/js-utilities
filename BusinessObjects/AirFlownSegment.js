var AirFlownSegment = (function() {
    /**
     * Represents AirFlownSegment.
     *
     * @constructs AirFlownSegment
     * @property {number} ElementNo Element number
     * @property {string} SegmentName Segment Name
     */
    function AirFlownSegment() {
        this.ElementNo;
        this.SegmentName;
        this.DepartureDate;
        this.OffPoint;
        this.BoardPoint;
        this.Text;
    }

    return AirFlownSegment;
})();

var AirFlownSegmentBuilder = (function() {
    /**
     * Represents AirFlownSegmentBuilder.
     *
     * @constructs AirFlownSegmentBuilder
     */
    function AirFlownSegmentBuilder() {}

    /**
     * Parses PNR response to get AirARNKSegments
     *
     * @memberof AirFlownSegmentBuilder
     * @instance
     * @param {Object} data PNR response
     * @returns {Array.<AirFlownSegment>} Array of AirFlownSegment objects
     */
    AirFlownSegmentBuilder.prototype.parseAirFlownSegments = function(data) {
        var objAir = new AirFlownSegment();
        var strAir = JSON.parse(data);
        var itnrCount = 0;
        var itineraryInfoData = [];
        var airFlownElems = [];
        if (strAir.response.model.output.response.originDestinationDetails) {
            var itinaryData = strAir.response.model.output.response.originDestinationDetails.itineraryInfo || null;
        }
        if (itinaryData) {
            // Check if there is some Air segments within the PNR
            if (Array.isArray(itinaryData)) {
                itineraryInfoData = itinaryData;
            } else {
                itineraryInfoData.push(itinaryData);
            }
            for (itnrCount; itnrCount < itineraryInfoData.length; itnrCount++) {
                if ((itineraryInfoData[itnrCount].elementManagementItinerary.segmentName === 'AIR') && (itineraryInfoData[itnrCount].relatedProduct)) {
                    addAirFlownSegment(airFlownElems, objAir, itineraryInfoData, itnrCount);
                    objAir = new AirFlownSegment();
                }
            }
        }
        return airFlownElems;
    };

    /**
     * Filters AirFlownSegments from PNR response
     *
     * @memberof AirFlownSegmentBuilder
     * @inner
     * @param {Array} airFlownElems Array of AirFlownSegment objects
     * @param {Object} objAir AirFlownSegment Object.
     * @param {Object} itineraryInfoData itineraryInfo data in PNR response.
     * @param {Number} itnrCount index of itineraryInfo.
     */
    function addAirFlownSegment(airFlownElems, objAir, itineraryInfoData, itnrCount) {
        var statusCodeInfo = [];
        var airflown = false;
        var statusCode = itineraryInfoData[itnrCount].relatedProduct.status;
        if (Array.isArray(statusCode)) {
            statusCodeInfo = statusCode;
        } else {
            statusCodeInfo.push(statusCode);
        }
        for (var statusCount = 0; statusCount < statusCodeInfo.length; statusCount++) {
            if (statusCodeInfo[statusCount] === 'B') {
                airflown = true;
                break;
            }
        }
        if (airflown) {
            setAirFlownSegmentElement(airFlownElems, objAir, itnrCount, itineraryInfoData);
        }
    }

    /**
     * Builds AirFlownSegment object and adds it to an Array
     *
     * @memberof AirFlownSegmentBuilder
     * @inner
     * @param {Array} airFlownElems Array of AirFlownSegment objects
     * @param {Object} objAir AirFlownSegment Object.
     * @param {Number} index index of itineraryInfo.
     * @param {Object} itineraryInfoData itineraryInfo data in PNR response.
     */
    function setAirFlownSegmentElement(airFlownElems, objAir, index, itineraryInfoData) {
        objAir.ElementNo = parseInt(itineraryInfoData[index].elementManagementItinerary.lineNumber);
        objAir.SegmentName = itineraryInfoData[index].elementManagementItinerary.segmentName;
        if(itineraryInfoData[index].travelProduct)
        {
            objAir.DepartureDate = itineraryInfoData[index].travelProduct.product ? itineraryInfoData[index].travelProduct.product.depDate : null ;
            objAir.BoardPoint = itineraryInfoData[index].travelProduct.boardpointDetail ? itineraryInfoData[index].travelProduct.boardpointDetail.cityCode : "";
            objAir.OffPoint = itineraryInfoData[index].travelProduct.offpointDetail ? itineraryInfoData[index].travelProduct.offpointDetail.cityCode : "";
            objAir.Text = itineraryInfoData[index];
        }
        objAir.Text = itineraryInfoData[index];
        // We add the air Segment to the collection
        airFlownElems.push(objAir);
    }
    return AirFlownSegmentBuilder;
})();