var HotelSegment = (function() {
    /**
     * Represents HotelSegment.
     *
     * @constructs HotelSegment
     * @property {number} ElementNo Element number
     * @property {string} SegmentID segment name
     * @property {string} ChainCode ChainCode
     * @property {string} City City name
     * @property {string} CheckInDate Check In Date
     * @property {string} CheckOutDate Check Out Date
     * @property {string} RoomRate RoomRate
     * @property {string} Guarantee Guarantee
     * @property {string} ConfirmationNo Confirmation Number
     * @property {string} Text text associated with this segment
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function HotelSegment() {
        this.ElementNo;
        this.SegmentID;
        this.ChainCode;
        this.City;
        this.CheckInDate;
        this.CheckOutDate;
        this.RoomRate;
        this.Guarantee;
        this.ConfirmationNo;
        this.Text;
        this.Associations;
    }
    return HotelSegment;
})();

var HotelSegmentBuilder = (function() {
    /**
     * Represents HotelSegmentBuilder.
     *
     * @constructs HotelSegmentBuilder
     */
    function HotelSegmentBuilder() {}

    /**
     * Parses PNR respone to get HotelSegments
     *
     * @memberof HotelSegmentBuilder
     * @instance
     * @param {dataElementsIndivMap} Map of Segments
     * @returns {Array.<HotelSegment>} Array of HotelSegment objects
     */
    HotelSegmentBuilder.prototype.parseHotelSegments = function(dataElementsIndivMap) {
        var hotelSegments = [];
        var allElems = dataElementsIndivMap.has(Constants.HotelSegmentCode) ? dataElementsIndivMap.get(Constants.HotelSegmentCode) : [];
        //loop through each hotel segment
        for (var index = 0; index < allElems.length; index++) {
            var objHotel = new HotelSegment();
            objHotel.ElementNo = allElems[index].elementManagementItinerary.lineNumber ? parseInt(allElems[index].elementManagementItinerary.lineNumber) : objHotel.ElementNo;
            objHotel.SegmentID = allElems[index].elementManagementItinerary.segmentName;
            var hotelReservationInfo = allElems[index].hotelReservationInfo;
            if (hotelReservationInfo) {
                objHotel.ChainCode = hotelReservationInfo.hotelPropertyInfo.hotelReference.chainCode;
                objHotel.ConfirmationNo = hotelReservationInfo.cancelOrConfirmNbr.reservation.controlNumber;
                objHotel.City = hotelReservationInfo.hotelPropertyInfo.hotelReference.cityCode;
                var roomRateIdentifier = hotelReservationInfo.roomRateDetails.roomInformation.roomRateIdentifier;
                if (roomRateIdentifier) {
                    objHotel.RoomRate = roomRateIdentifier.roomType + roomRateIdentifier.ratePlanCode;
                }
                var formOfPayment = hotelReservationInfo.guaranteeOrDeposit.creditCardInfo.formOfPayment;
                if (formOfPayment) {
                    objHotel.Guarantee = [formOfPayment.type, formOfPayment.vendorCode, formOfPayment.creditCardNumber, "EXP", formOfPayment.expiryDate].join('');
                }
                var requestedDates = hotelReservationInfo.requestedDates;
                if (requestedDates) {
                    objHotel.CheckInDate = giveDateValue(requestedDates, "beginDateTime");
                    objHotel.CheckOutDate = giveDateValue(requestedDates, "endDateTime");
                }
            }
            objHotel.Associations = (allElems[index].referenceForSegment != null) ? new AssociationBuilder().getAssociations(allElems[index].referenceForSegment.reference) : null;
            objHotel.Text = allElems[index];
            hotelSegments.push(objHotel);
        }
        return hotelSegments;
    };
    return HotelSegmentBuilder;
})();

/// <summary>
/// gives Date value in DDMMYY format
/// </summary>
/// <param name="requestedDates">JToken</param>
/// <param name="dateTag">string</param>
/// <returns>string</returns>
function giveDateValue(requestedDates, dateTag) {
    var dateObj = requestedDates[dateTag];
    var dateParams = [];
    for (var i = 0; i < Constants.dateParameters.length - 1; i++) {
        if (dateObj[Constants.dateParameters[i]]) {
            dateParams.push(dateObj[Constants.dateParameters[i]].length === 1 ? "0" + dateObj[Constants.dateParameters[i]] : dateObj[Constants.dateParameters[i]]);
        }
    }
    if (dateObj[Constants.dateParameters[2]]) {
        dateParams.push(dateObj[Constants.dateParameters[2]].length === 4 ? dateObj[Constants.dateParameters[2]].substr(2) : dateObj[Constants.dateParameters[2]]);
    }
    return (dateParams.join(""));
}