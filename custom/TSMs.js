//TST Library
//Properties: TSTS array
// Method: getTSTS
// Event: ReceivedResponse
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Class in Javascript
// Constructeur
function Tsms() {
    this.TSMs = [];
    this.Error = "";
    this.Text = "";
    this.webResponse = "";
}

var parseTSMRespone = function (status) {
    var result = this.webResponse;
    this.Text = result;
    var self = this;
    var res = false;
    if (result.Response.indexOf("NO TSM RECORD EXISTS") > -1 || result.Response.indexOf("NO ACTIVE TQM") > -1 || result.Response.indexOf("NO EXISTE NINGUN REGISTRO TSM") > -1) {
        res = true;
    }

    var error = "ERROR";
    // Check if this is a PNR - No Error, if so, no parsing
    if (!res) {
        var data = this.webResponse.Response;
        var ValidTQMList = /^M\s/;
        var mathch = ValidTQMList.exec(data);
        if (mathch != null) {
            var ListTSMS = getListTSM(data);
            var Commands = [];
            for (var h = 0; h < ListTSMS.length; h++) {
                Commands.push({ "cmd": "TQM/M" + ListTSMS[h], "callback": getTSM, "parameter": self });
            }
            executeCommand1({ "commands": Commands, "nextStep": EnvioFinal, "self":self, "status":status });
        } else {
            getTSM(this.webResponse, self);
            EnvioFinal(self,status);
        }        
    } else {
        error = "NO TSM RECORD EXISTS";
        this.RetrieveCurrent = Constants.HST_ERR_TIMEOUT;
        this.reject(error);
    }

};

function EnvioFinal(self, status) {
    retObj = {
        mainData: self.TSMs,
        crypticData: self.webResponse.Response,
        self: self,
        status: status
    };
    mapProperties(retObj);
}

function executeCommand1(args) {
    if (args.commands.length > 0) {
        catalog.requestService("commandpage.sendCommand", { command: args.commands[0].cmd, transmit: true }, { "fn": commandResponse1, "scope": window, "params": args });
    } else {
        args.nextStep(args.self, args.status);
    }
}

function commandResponse1(data, args) {  
    if (args.commands[0].callback !== undefined && args.commands[0].parameter === undefined) {
        args.commands[0].callback(data);
    } else if (args.commands[0].callback !== undefined && args.commands[0].parameter !== undefined) {
        args.commands[0].callback(data, args.commands[0].parameter);
    }
    args.commands.shift();
    executeCommand1(args);
}

function getListTSM(data) {
    var elemenTQM = []
    var TQMListElements = /(\d\d?)\s+(PC)?\./gi;
    var matches =  data.match(TQMListElements);    
    if (matches != null) {
        for (var h = 0; h < matches.length ; h++) {
            elemenTQM.push(matches[h].replace('.', '').trim());
        }
    }

    return elemenTQM
}

function fulfillMainObj(status, pnrObj, mainData) {
    if (status === "fulfill") {
        pnrObj.fulfill(mainData);
    }
}

function mapProperties(retObj) {
    fulfillMainObj(retObj.status, retObj.self, retObj.mainData);
}

function getTSM(data1, self) {
    var data = data1.Response;    
    var oTSM = new Object();
    var sTSMType = "";
    var sRegexTotal = /\s+TOTAL\s+([A-Z]{3})\s+(\d+(\.\d+)?)/;
    var regExFare = /\s+FARE\s+([A-Z]{1})+\s+([A-Z]{3})\s+(\d+(\.\d+)?)/;
    var sRegexType = /^TSM\s+(\d+)\s+TYPE/;
    var sRegexDate = /\/([0-9]{2}[A-Z]{3})+/;
    var sRegexAll = /\d+\s+\.\d+\s+\w+\s+\w+\s+\w+(\+|\/\w+\+|\/\w+)\s+([A-Z]{3})\s+(\d+(\.\d+)?)/;
    var TSTPax =  /[\r\n]\s{2,3}(\d{1,2}\.[^,]*(?=\s\d{1,2}\s{3}))/;
    var TSTPaxElement = /(\d{1,2})\.\w+(\s\w+)*\/\w+(\s\w+)*(\([A-Z0-9\s+\w+]*\))?/;
    var sEquiv = /\s+EQUIV\s+([A-Z]{3})\s+(\d+(\.\d+)?)/
    var TQMTax = /TAX(\d{3})\s+([A-Z]{1})\s+([A-Z]{3})(EXEMPT|\s+(\d+(\.\d+)?))(\s+|-)?([A-Z0-9]{2,4})/;
    var sRegexAerline = /CARR\s([A-Z0-9]{2})/;

    var matchTotal = sRegexTotal.exec(data);
    var matchFare = regExFare.exec(data);
    var matchEquiv = sEquiv.exec(data);
    var matchType = sRegexType.exec(data);		
    var matchDate = sRegexDate.exec(data);
    var matchAerline = sRegexAerline.exec(data);

    var Total = new Object();
    var Fare = new Object();
    var Equiv = new Object();

    if (matchTotal != null) {
        Total.currency = matchTotal[1];
        Total.amount = matchTotal[2];

        if (matchFare != null) {
            Fare.amount = matchFare[3];
            Fare.currency = matchFare[2];
        }

        if (matchEquiv != null) {
            Equiv.amount = matchEquiv[2];
            Equiv.currency = matchEquiv[1];
        }
        var sDate = ''
        if (matchDate != null) {
            sDate = getDateTSM(matchDate[1]);
        }

        if (matchType != null) {
            sTSMType = matchType[1];
        }

        var paxs = []
        var inf = "";
        var matchDataPax = TSTPax.exec(data);

        var matchPax = TSTPaxElement.exec(matchDataPax[1]);
        if (matchPax != null) {
            if (typeof (matchPax[4]) != 'undefined') {
                inf = matchPax[4].toString().find("(INF)") ? "INF" : "ADT"
            } else {
                inf = "ADT";
            }
            paxs.push(matchPax[1]);
        }

        var taxs = []
        var TotalTax = 0
        var matchtaxs = TQMTax.exec(data);
        if (matchtaxs != null) {
            var tax = new Object();
            tax.Identifier=  matchtaxs[2];
            tax.currency =  matchtaxs[3];
            tax.amount = matchtaxs[5];
            tax.taxNature = matchtaxs[8];
            tax.isoCountry = matchtaxs[8];
            taxs.push(tax);            
        }
        var sAerline = "";
        if (matchAerline != null) {
            sAerline = matchAerline[1];
        }

        oTSM.ID = sTSMType;
        oTSM.Pax = paxs;
        oTSM.Total = Total;
        oTSM.Fare = Fare;
        oTSM.Equiv = Equiv;
        oTSM.Taxes = taxs;
        oTSM.DateTSM = sDate;
        oTSM.TypePax = inf;
        oTSM.Aerline = sAerline;
    }

   self.TSMs.push(oTSM);
}

function getDateTSM(sDate) {
    var Months = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };
    var dNow = new Date();
    var sYear = dNow.getFullYear().toString();
    var sDay = sDate.substring(0, 2);
    var sMonth = Months[sDate.substring(2)];

    return Date.parse(sYear + "-" + sMonth +"-" + sDay);
}

Tsms.prototype.getTSMS = function () {
    var self = this;
  return new Promise(function (fulfill, reject) {
        self.fulfill = fulfill;
        self.reject = reject;
        window.smartScriptSession.send("TQM").then(function (data) {
         self.webResponse = data;
         parseTSMRespone.call(self, "fulfill");
        }, function (data) {
         self.reject("INVALID_RESPONSE");
        });
    });
}



