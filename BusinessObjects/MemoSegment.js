var MemoSegment = (function() {
    /**
     * Represents MemoSegment.
     *
     * @constructs MemoSegment
     * @property {number} ElementNo Element number
     * @property {string} SegmentID segment name
     */
    function MemoSegment() {
        this.ElementNo;
        this.SegmentID;
        this.Text;
        this.Associations;
        this.City;
        this.FreeFlow;
        this.Date;
    }

    return MemoSegment;
})();

var MemoSegmentBuilder = (function() {
    /**
     * Represents MemoSegmentBuilder.
     *
     * @constructs MemoSegmentBuilder
     */
    function MemoSegmentBuilder() {}

    var setFreeFlowText = function(objMemo,itineraryDataObject)
    {
       if (itineraryDataObject.itineraryFreetext != null) {
            var freeFlow = itineraryDataObject.itineraryFreetext.longFreetext;
            if (freeFlow != null && freeFlow.indexOf("-") >= 0) {
                var index = freeFlow.indexOf("-");
                objMemo.FreeFlow = freeFlow.substring(index);
            } else {
                objMemo.FreeFlow = freeFlow;
            }
        }
        return objMemo;
    };

    /**
     * Parsing MemoSegment.
     *
     * @memberof MemoSegmentBuilder
     * @instance
     * @param {data} PNR response
     * @returns {Array.<MemoSegment>} Array of MemoSegment objects
     */
    MemoSegmentBuilder.prototype.parseMemoSegments = function(data) {
        var objMemo = new MemoSegment();
        var memoSegs = [];
        var iMemoCount = 0;
        var strMemo = JSON.parse(data);
        if (strMemo.response.model.output.response.originDestinationDetails) {
            var itineraryDetails = strMemo.response.model.output.response.originDestinationDetails.itineraryInfo;
        }
        var itineraryData = [];
        if (itineraryDetails) {
            // Loop for Itinerary Element to be added with MemoSegments
            if (Array.isArray(itineraryDetails)) {
                itineraryData = itineraryDetails;
            } else {
                itineraryData.push(itineraryDetails);
            }
            var iMax = itineraryData.length;
            for (var itineryCount = 0; itineryCount < iMax; itineryCount++) {
                // Check if there is some Memo segments within the PNR
                if (itineraryData[itineryCount].elementManagementItinerary.segmentName === 'RU') {
                    objMemo.ElementNo = itineraryData[itineryCount].elementManagementItinerary.lineNumber;
                    objMemo.SegmentID = itineraryData[itineryCount].elementManagementItinerary.segmentName;
                    objMemo.Text = itineraryData[itineryCount];
                    objMemo.Associations = (itineraryData[itineryCount].referenceForSegment != null) ? new AssociationBuilder().getAssociations(itineraryData[itineryCount].referenceForSegment.reference) : null;
                    objMemo.City = itineraryData[itineryCount].travelProduct.boardpointDetail.cityCode;
                    objMemo = setFreeFlowText(objMemo,itineraryData[itineryCount]);
                    if (itineraryData[itineryCount].travelProduct.product!= null)
                    {
                        objMemo.Date = itineraryData[itineryCount].travelProduct.product.depDate;
                    }
                    // We add the Memo Segment to the collection
                    memoSegs[iMemoCount] = objMemo;
                    iMemoCount++;
                    objMemo = new MemoSegment();
                }
            };

        }
        return memoSegs;
    };
    return MemoSegmentBuilder;
})();