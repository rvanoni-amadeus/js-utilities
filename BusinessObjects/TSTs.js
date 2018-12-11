//TST Library
//Properties: TSTS array
// Method: getTSTS
// Event: ReceivedResponse
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Class in Javascript
// Constructeur
function Tsts() {
    this.TSTs = [];
    this.Error = "";
    this.Text = "";
    this.webResponse = "";
}

var parsePNRRespone = function (status) {
    var result = this.webResponse;
    this.Text = result;
    var self = this;
    var res = CheckError.call(self);   
    var error = "ERROR";
    // Check if this is a PNR - No Error, if so, no parsing
    if (!res) {
        var data = this.webResponse;
        var fareListLength = data.response.model.output.response.fareList.length;
        if (typeof (fareListLength) != 'undefined') {
            for (var i = 0; i < fareListLength; i++) {
                var fare = data.response.model.output.response.fareList[i];
                var sTST = getTST(fare);
                this.TSTs.push(sTST);
            }
        } else {
            var sTST = getTST(data.response.model.output.response.fareList);
            this.TSTs.push(sTST);
        }
        retObj = {
            mainData: this.TSTs,
            crypticData: result,
            self: self,
            status: status
        };
        mapProperties(retObj);
    } else {
        if (result.response.model.output.listMessages) {
            error = result.response.model.output.listMessages[0].subMessages[0].localizedMessage.toString();
        } else if (result.response.model.serverEvent) {
            error = result.response.model.serverEvent;
        }
        this.RetrieveCurrent = Constants.HST_ERR_TIMEOUT;
        this.reject(error);
    }

};

function fulfillMainObj(status, pnrObj, mainData) {
    if (status === "fulfill") {
        pnrObj.fulfill(mainData);
    }
}

function mapProperties(retObj) {    
    fulfillMainObj(retObj.status, retObj.self, retObj.mainData);
}

function getTST(FareList) {
    var sTST = new Object();
    sTST.ID = FareList.fareReference.iDDescription.iDSequenceNumber.toString();
    sTST.FCA = getFCA(FareList.otherPricingInfo.attributeDetails);
    sTST.FV =  FareList.validatingCarrier.carrierInformation.carrierCode.toString();
    sTST.Pax = getPaxTST(FareList.paxSegReference.refDetails);
    sTST.Reemision = getReemision(FareList.fareDataInformation.fareDataMainInformation.fareDataQualifier.toString());
    sTST.Total = getFare(FareList.fareDataInformation.fareDataSupInformation, 'TFT');    
    sTST.Equiv = getFare(FareList.fareDataInformation.fareDataSupInformation, 'E');
    sTST.Taxes = getTaxes(FareList.taxInformation);
    if (sTST.Reemision && sTST.Total.amount == 0) {
        var oFare = new Object();
        oFare.currency = sTST.Total.currency.toString();
        oFare.amount = "0";
        sTST.Fare = oFare;
    } else if (sTST.Reemision && sTST.Total.amount != 0) {
        var oFare = new Object();
        oFare.currency = sTST.Total.currency.toString();
        oFare.amount =  getFareReemision(sTST.Total.amount, sTST.Taxes);
        sTST.Fare = oFare;
    }
    else {
        sTST.Fare = getFare(FareList.fareDataInformation.fareDataSupInformation, 'B');
    }
    if (sTST.Reemision) {
        sTST.OriginalTicket = getOriginalTicket(FareList);
    } else {
        sTST.OriginalTicket = "";
    }
    sTST.Segments = getSegments(FareList.segmentInformation);
    sTST.DateTST = getDateTST(FareList.lastTktDate);
    sTST.TypePax = FareList.statusInformation.firstStatusDetails.tstFlag;
    return sTST;
}

function getOriginalTicket(FareList) {
    var sTkt = "";
    if (typeof (FareList.automaticReissueInfo.ticketInfo.documentDetails.number) != 'undefined') {
        sTkt = FareList.automaticReissueInfo.ticketInfo.documentDetails.number;
    }

    return sTkt;
}

function getReemision(sFareType) {
    var blnReemision = false;

    if (sFareType == "R" || sFareType == "W" || sFareType == "Y") {
        blnReemision = true;
    }

    return blnReemision;
}

function getFareReemision(TotalAmount, oTaxes) {
    var totalAmmount = 0;
    totalAmmount += parseFloat(TotalAmount);
    for (var h = 0; h < oTaxes.length; h++) {
        var oTax = oTaxes(h);
        if (oTax.Identifier == "X") {
            totalAmmount -= parseFloat(oTax.amount);
        }
    }

    return totalAmmount;
}

function getFCA(attributeDetails) {
    var sResult = "";
    var LengthAttri = attributeDetails.length;
    if(typeof(LengthAttri) != 'undefined'){
        for (var h = 0; h < LengthAttri; h++) {
            var oAttr = attributeDetails[h];
            if (oAttr.attributeType == "FCA") {
                sResult = oAttr.attributeDescription.toString();
            }
        }
    }else{
        sResult = attributeDetails.attributeDescription.toString();
    }

    return sResult;
}

function getPaxTST(paxSegReferences) {
    var oPaxs = [];
    var PaxLength = paxSegReferences.length;
    if (typeof (PaxLength) != 'undefined') {
        for (var h = 0; h < PaxLength; h++) {
            var oPax = new Object();
            oPax.refNumber = paxSegReferences[h].refNumber.toString();
            oPaxs.push(oPax);
        }        
    } else {
        var oPax = new Object();
        oPax.refNumber = paxSegReferences.refNumber.toString();
        oPaxs.push(oPax);
    }
    return oPaxs;
}

function getFare(FareDataInformation,sType) {
    var oTotal = new Object();
    var fareLength = FareDataInformation.length;
    for (var h = 0; h < fareLength; h++) {
        var oFare = FareDataInformation[h];
        if (oFare.fareDataQualifier === sType) {
            oTotal.currency = oFare.fareCurrency.toString();
            oTotal.amount = oFare.fareAmount.toString();
        }
    }
    return oTotal;
}

function getTaxes(Taxes) {
    var oTaxes = [];
    if (typeof (Taxes) != 'undefined') {
        var taxLength = Taxes.length;
    }
    else
    {
        var taxLength = 0;
    }
    for (var h = 0; h < taxLength; h++) {
        var oTax = new Object();
        oTax.currency = Taxes[h].amountDetails.fareDataMainInformation.fareCurrency.toString();
        oTax.amount = Taxes[h].amountDetails.fareDataMainInformation.fareAmount.toString();
        oTax.Identifier = Taxes[h].taxDetails.taxIdentification.taxIdentifier.toString();
        if (typeof (Taxes[h].taxDetails.taxNature) != 'undefined') {
            oTax.taxNature = Taxes[h].taxDetails.taxNature.toString();
        } else {
            oTax.taxNature = Taxes[h].taxDetails.taxType.isoCountry.toString();
        }
        oTax.isoCountry = Taxes[h].taxDetails.taxType.isoCountry.toString();
        oTaxes.push(oTax);
    }

    return oTaxes;
}

function getSegments(segments) {
    var oSegments = [];
    var segLength = segments.length;
    if (typeof (segLength) != 'undefined') {
        for (var h = 0; h < segLength; h++) {
            if(typeof(segments[h].segmentReference) != 'undefined'){
                var oSegment = new Object();
                oSegment.refNumber = segments[h].segmentReference.refDetails.refNumber.toString();
                oSegments.push(oSegment);
            }
        }
    } else {
        var oSegment = new Object();
        oSegment.refNumber = segments.segmentReference.refDetails.refNumber.toString();
        oSegments.push(oSegment);
    }

    return oSegments;
}

function getDateTST(lastTktDates) {
    var dateTST;
    var lastTktLength = lastTktDates.length;
    for (var h = 0; h < lastTktLength; h++) {
        var olastTkt = lastTktDates[h];
        if (olastTkt.businessSemantic == 'CRD') {
            dateTST = Date.parse(olastTkt.dateTime.year + "-" + olastTkt.dateTime.month + "-" + olastTkt.dateTime.day);
            h = lastTktLength;
        }
    }
    dateTST = new Date(dateTST);

    return dateTST;
}

function CheckError() {
    var data = this.webResponse;
    var objTST = this;
    //var strToParse = JSON.parse(data);
    var strToParse = data;
    var errorKey = true;
    try {
        if (strToParse.response.model && strToParse.response.model.serverEvent == "genericerror") {
            if (strToParse.response.model.output.listMessages.length > 0) {
                objTST.Error = strToParse.response.model.output.listMessages[0].subMessages[0].localizedMessage.toString();
                return errorKey;
            }
        } else {
            return false;
        }
    } catch (e) {
        return false;
    };
};

Tsts.prototype.getTSTS = function(){
    var self = this;
    var txtRetrieveTST;
    txtRetrieveTST = '{"displayMode": {"attributeDetails": {"attributeType": "ALL"}}}';    
    var input = JSON.parse(txtRetrieveTST);
    
    return new Promise(function (fulfill, reject) {
        self.fulfill = fulfill;
        self.reject = reject;
        smartScriptSession.sendWS("ws.displayTST_v14.1", input)
     .then(function(data) {
         self.webResponse = data;
         parsePNRRespone.call(self, "fulfill");
     }, function(data) {
         self.reject("INVALID_RESPONSE");
     });
    });
}
    
    
    
