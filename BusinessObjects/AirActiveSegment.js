var AirActiveSegment = (function() {
    /**
     * Represents AirActiveSegment.
     *
     * @constructs AirActiveSegment
     * @property {number} ElementNo Elemenent Number
     * @property {string} SegmentName Segment Name
     */
    function AirActiveSegment() {
        this.ElementNo;
        this.SegmentName;
    }

    return AirActiveSegment;
})();

var AirActiveSegmentBuilder = (function() {
    /**
     * Represents AirActiveSegmentBuilder.
     *
     * @constructs AirActiveSegmentBuilder
     */
    function AirActiveSegmentBuilder() {}

    /**
     * Parsese PNR response to get AirActiveSegments
     *
     * @memberof AirActiveSegmentBuilder
     * @instance
     * @param {Object} data PNR Response
     * @returns {Array.<AirActiveSegment>} Array of AirActiveSegment objects
     */
    AirActiveSegmentBuilder.prototype.parseAirActiveSegments = function(data) {
        var objAir = new AirActiveSegment();
        var itnrCount = 0;
        var strAir = JSON.parse(data);
        var itineraryInfoData = [];
        var airActiveElems = [];
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
                    addAirActiveSegment(airActiveElems, objAir, itineraryInfoData, itnrCount);
                    objAir = new AirActiveSegment();
                }
            }
        }
        return airActiveElems;
    };

    /**
     * Filters AirActiveSegments in PNR response.
     *
     * @memberof AirActiveSegmentBuilder
     * @inner
     * @param {Array} airActiveElems Array of AirActiveSegment objects .
     * @param {Object} objAir AirActiveSegment object.
     * @param {Object} itineraryInfoData itinerary info from PNR response.
     * @param {Number} itnrCount index of intinerary info in PNR response.
     */
    function addAirActiveSegment(airActiveElems, objAir, itineraryInfoData, itnrCount) {
        var statusCodeInfo = [];
        var airInactive = false;
        var statusCode = itineraryInfoData[itnrCount].relatedProduct.status;
        if (Array.isArray(statusCode)) {
            statusCodeInfo = statusCode;
        } else {
            statusCodeInfo.push(statusCode);
        }
        for (var statusCount = 0; statusCount < statusCodeInfo.length; statusCount++) {
            if (statusCodeInfo[statusCount] === 'B' || statusCodeInfo[statusCount] === 'HX' || statusCodeInfo[statusCount] === 'NO' || statusCodeInfo[statusCount] === 'US') {
                airInactive = true;
                break;
            }
        }
        if (!airInactive) {
            setAirActiveSegmentElement(airActiveElems, objAir, itnrCount, itineraryInfoData);
        }
    }

    /**
     * Adds all properties to the Air Segments.
     *
     * @memberof AirActiveSegmentBuilder
     * @inner
     * @param {Array} airActiveElems Array of AirActiveSegment objects.
     * @param {Object} objAir AirActiveSegment object.
     * @param {Number} index index of itineraryInfo.
     * @param {Object} itineraryInfoData itinerary info in PNR Response.
     */
    function setAirActiveSegmentElement(airActiveElems, objAir, index, itineraryInfoData) {
        // We consider the segment
        objAir.ElementNo = parseInt(itineraryInfoData[index].elementManagementItinerary.lineNumber);
        objAir.SegmentName = itineraryInfoData[index].elementManagementItinerary.segmentName;
        // We add the air Segment to the collection
        airActiveElems.push(objAir);
    }

    return AirActiveSegmentBuilder;
})();