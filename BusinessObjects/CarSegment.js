var CarSegment = (function() {
    /**
     * Represents CarSegment.
     *
     * @constructs CarSegment
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     * @property {Array.<string>} Car Type
     * @property {string} Company
     * @property {string} Confirmation Number
     * @property {string} DropOff Date
     * @property {number} ElementNo Element number
     * @property {string} Location
     * @property {string} PickOff Date
     * @property {string} Rate Guarantee
     * @property {string} SegmentID segment name
     * @property {string} Text text associated with this segment
     */
    function CarSegment() {
        this.Associations;
        this.CarType;
        this.Company;
        this.ConfirmationNo;
        this.DropOffDate;
        this.ElementNo;
        this.Location;
        this.PickUpDate;
        this.RateGuarantee;
        this.SegmentID;
        this.Text;
    }
    return CarSegment;
})();

var CarSegmentBuilder = (function() {
    /**
     * Represents CarSegmentBuilder.
     *
     * @constructs CarSegmentBuilder
     */
    function CarSegmentBuilder() {}

    /**
     * Parses PNR response to get CarSegments
     *
     * @memberof CarSegmentBuilder
     * @instance
     * @param {data} PNR Response
     * @returns {Array.<CarSegment>} Array of CarSegment objects
     */
    CarSegmentBuilder.prototype.parseCarSegments = function(dataElementsIndivMap) {
        var carSegments = [];
        var allElems = dataElementsIndivMap.has(Constants.CarSegmentCode) ? dataElementsIndivMap.get(Constants.CarSegmentCode) : [];
        //loop through each car segment
        for (var index = 0; index < allElems.length; index++) {
            if (allElems[index]) {
                var objCarSegment = new CarSegment();

                if (allElems[index].elementManagementItinerary) {
                    objCarSegment.SegmentID = allElems[index].elementManagementItinerary.segmentName;
                    objCarSegment.ElementNo = allElems[index].elementManagementItinerary.lineNumber ? parseInt(allElems[index].elementManagementItinerary.lineNumber) : objCarSegment.ElementNo;
                    objCarSegment.Associations = (allElems[index].elementManagementItinerary.reference != null) ? new AssociationBuilder().getAssociations(allElems[index].elementManagementItinerary.reference) : null;
                }
                if (allElems[index].typicalCarData) {
                    objCarSegment.CarType = getCarType(allElems[index].typicalCarData.vehicleInformation);
                    objCarSegment.Company = allElems[index].typicalCarData.companyIdentification ? allElems[index].typicalCarData.companyIdentification.companyCode : null;
                    objCarSegment.ConfirmationNo = allElems[index].typicalCarData.cancelOrConfirmNbr.reservation ? allElems[index].typicalCarData.cancelOrConfirmNbr.reservation.controlNumber : null;
                    objCarSegment.RateGuarantee = rateGuarantee(allElems[index].typicalCarData.rateInfo);
                }
                if (allElems[index].travelProduct) {
                    objCarSegment.Location = allElems[index].travelProduct.boardpointDetail ? allElems[index].travelProduct.boardpointDetail.cityCode : null;
                    objCarSegment.PickUpDate = allElems[index].travelProduct.product ? allElems[index].travelProduct.product.depDate : null;
                    objCarSegment.DropOffDate = allElems[index].travelProduct.product ? allElems[index].travelProduct.product.arrDate : null;
                }
                objCarSegment.Text = allElems[index];
                carSegments.push(objCarSegment);
            }
        }
        return carSegments;
    };

    /**
     * gives RateGuarantee value
     * @internal function
     * @param  {Object} rateInfo
     * @returns string lclRate
     */
    function rateGuarantee(rateInfo) {
        var lclRate;
        var rateInfoArr = [];
        if (rateInfo instanceof Array) {
            rateInfoArr = rateInfo;
        } else if (rateInfo) {
            rateInfoArr.push(rateInfo);
        }
        for (var i = 0; i < rateInfoArr.length; i++) {
            if (rateInfoArr[i].chargeDetails && rateInfoArr[i].chargeDetails.type === 'RG') {
                lclRate = rateInfoArr[i].chargeDetails.comment;
                break;
            }
        }
        return lclRate;
    }

    /**
     * gives carType Array
     * @internal function
     * @param  {Object} vehicleInformation
     * @returns Array.<string> carType
     */
    function getCarType(vehicleInformation) {
        var carType = [];
        if (vehicleInformation && vehicleInformation.vehicleCharacteristic && vehicleInformation.vehicleCharacteristic.vehicleRentalPrefType) {
            if (vehicleInformation.vehicleCharacteristic.vehicleRentalPrefType instanceof Array) {
                carType = vehicleInformation.vehicleCharacteristic.vehicleRentalPrefType;
            } else {
                carType.push(vehicleInformation.vehicleCharacteristic.vehicleRentalPrefType);
            }
        }
        return carType;
    }

    return CarSegmentBuilder;
})();