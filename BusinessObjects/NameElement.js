var NameElement = (function() {
    /**
     * Represents NameElement.
     *
     * @constructs NameElement
     * @property {number} ElementNo Element Number
     * @property {string} TatooNumber
     * @property {string} Text Cryptic text line of Name element
     * @property {string} FirstName Passenger first name
     * @property {string} LastName Passenger last name
     * @property {string} Type Passenger type ADT | CHD | PAX
     * @property {string} DateOfBirth Date of Birth in format 02AUG16
     * @property {string} PaxID
     * @property {Object.<InfantElement>} Infant Infant Object
     * @property {string} RawText PNR response
     */
    function NameElement() {
        this.ElementNo;
        this.TatooNumber;
        //Full JSON element
        this.Text;
        this.FirstName;
        this.LastName;
        this.Type = null;
        this.DateOfBirth;
        this.PaxID;
        this.Infant = "";
        this.RawText;
    }

    return NameElement;
})();

var InfantElement = (function() {
    /**
     * Represents InfantElement.
     *
     * @constructs InfantElement
     * @property {string} Text Cryptic text line of Infant
     * @property {string} FirstName Infant's first name
     * @property {string} LastName Infant's last name
     * @property {string} Type Passenger type
     * @property {string} DateOfBirth Date of Birth in format 02AUG16
     * @property {string} PaxID
     */
    function InfantElement() {
        //Full JSON element passengerData
        this.Text;
        this.FirstName;
        this.LastName;
        this.Type;
        this.DateOfBirth;
        this.PaxID;
    }

    return InfantElement;
})();

var NameElementBuilder = (function() {
    /**
     * Represents NameElementBuilder.
     *
     * @constructs NameElementBuilder
     */
    function NameElementBuilder() {}

    /**
     * Parses PNR reponse to get NameElements.
     *
     * @memberof NameElementBuilder
     * @instance
     * @param {Object} PNR response.
     * @returns {Array.<NameElement>|null} Array of NameElement objects if any or else null.
     */
    NameElementBuilder.prototype.parseNameElements = function(data) {
        var objName = new NameElement();
        var objInfant = new InfantElement();
        var DateObj = new Date();
        var DateOfBirth;
        var strName = JSON.parse(data);
        var checkGroupPNR = false;
        var nameElems = [];
        // Check if there is some name elements
        // Check if there is more than one Name ElementNo
        try {
            strName.response.model.output.response.travellerInfo.length;
        } catch (e) {
            // No Name Elements, we can stop
            return nameElems;
        }
        if (strName.response.model.output.response.travellerInfo.length > 0) {
            if (strName.response.model.output.response.travellerInfo[0].elementManagementPassenger.segmentName === "NG") {
                checkGroupPNR = true;
            }
        } else {
            checkGroupPNR = false;
        }
        //To handle Group PNR's
        if (checkGroupPNR) {
            nameElems = addGroupPNRObjects(strName);
            return nameElems;
        }
        // Check if there is more than one Name ElementNo
        else if (strName.response.model.output.response.travellerInfo.length > 0) {
            // Loop for name Element to be added with NameElements
            var iMax = strName.response.model.output.response.travellerInfo.length;
            for (var i = 0; i < iMax; i++) {
                // Careful, we could have an infant with different name from parent... This will create a totally new passengerData, so an array with the 2 pax...
                objName.ElementNo = parseInt(strName.response.model.output.response.travellerInfo[i].elementManagementPassenger.lineNumber);
                // We have to check if we have infants with Last name different from adult pax
                if (strName.response.model.output.response.travellerInfo[i].passengerData.length > 0) {
                    // We have an infant with the same parent name
                    // First element is the parent
                    // Second if the bb
                    // Manage the parent
                    objName.FirstName = strName.response.model.output.response.travellerInfo[i].passengerData[0].travellerInformation.passenger.firstName;
                    objName.LastName = strName.response.model.output.response.travellerInfo[i].passengerData[0].travellerInformation.traveller.surname;
                    objName.Initial = strName.response.model.output.response.travellerInfo[i].passengerData[0].travellerInformation.passenger.firstName;
                    objName.RawText = strName.response.model.output.response.travellerInfo[i];
                    try {
                        if (strName.response.model.output.response.travellerInfo[i].passengerData[0].travellerInformation.passenger.type.length > 0) {
                            objName.Type = strName.response.model.output.response.travellerInfo[i].passengerData[0].travellerInformation.passenger.type;
                        }
                    } catch (e) {};
                    // We have to manage the infant
                    objInfant = new InfantElement();
                    objInfant.FirstName = strName.response.model.output.response.travellerInfo[i].passengerData[1].travellerInformation.passenger.firstName;
                    objInfant.LastName = strName.response.model.output.response.travellerInfo[i].passengerData[1].travellerInformation.traveller.surname;
                    try {
                        if (strName.response.model.output.response.travellerInfo[i].passengerData[1].dateOfBirth.dateAndTimeDetails.date.length > 0) {
                            DateOfBirth = strName.response.model.output.response.travellerInfo[i].passengerData[1].dateOfBirth.dateAndTimeDetails.date;
                            objInfant.DateOfBirth = DateObj.GetInfantDateOfBirth(DateOfBirth);
                        }
                    } catch (e) {};
                    try {
                        if (strName.response.model.output.response.travellerInfo[i].passengerData[1].travellerInformation.passenger.type.length > 0) {
                            objInfant.Type = strName.response.model.output.response.travellerInfo[i].passengerData[1].travellerInformation.passenger.type;
                        }
                    } catch (e) {};
                    objName.Infant = objInfant;
                } else {
                    // We have to check if there is an Infant linked to this pax with the same Last name
                    objName.LastName = strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.traveller.surname;
                    objName.RawText = strName.response.model.output.response.travellerInfo[i];
                    if (strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger.length > 0) {
                        // We have an infant with the same parent name
                        // First element is the parent
                        // Second if the bb
                        // Manage the parent
                        objName.FirstName = strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger[0].firstName;
                        objName.Initial = strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger[0].firstName;
                        try {
                            if (strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger[0].type.length > 0) {
                                objName.Type = strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger[0].type;
                            }
                        } catch (e) {};
                        // We have to manage the infant
                        objInfant = new InfantElement();
                        objInfant.FirstName = strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger[1].firstName;

                        try {
                            if (strName.response.model.output.response.travellerInfo[i].passengerData.dateOfBirth.dateAndTimeDetails.date.length > 0) {
                                DateOfBirth = strName.response.model.output.response.travellerInfo[i].passengerData.dateOfBirth.dateAndTimeDetails.date;
                                objInfant.DateOfBirth = DateObj.GetInfantDateOfBirth(DateOfBirth);
                            }
                        } catch (e) {};
                        try {
                            if (strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger[1].type.length > 0) {
                                objInfant.Type = strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger[1].type;
                            }
                        } catch (e) {};
                        objName.Infant = objInfant;
                    } else {
                        objName.FirstName = strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger.firstName;
                        objName.Initial = strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger.firstName;
                        // Check if there is a type to associate to PAX
                        try {
                            if (strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger.type) {
                                objName.Type = strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger.type;
                            } else if (strName.response.model.output.response.travellerInfo[i].passengerData.travellerInformation.passenger.infantIndicator) {
                                objName.Type = "INF";
                            }
                        } catch (e) {};
                    };
                };
                // Set NameElement into the collections of Names
                nameElems[i] = objName;
                objName = new NameElement();
            };
            return nameElems;
        } else {
            //Only one name element
            try {
                // Careful, we could have an infant with different name from parent... This will create a totally new passengerData, so an array with the 2 pax...
                objName.ElementNo = parseInt(strName.response.model.output.response.travellerInfo.elementManagementPassenger.lineNumber);
                // We have to check if we have infants with Last name different from adult pax
                if (strName.response.model.output.response.travellerInfo.passengerData.length > 0) {
                    // We have an infant with the same parent name
                    // First element is the parent
                    // Second if the bb
                    // Manage the parent
                    objName.FirstName = strName.response.model.output.response.travellerInfo.passengerData[0].travellerInformation.passenger.firstName;
                    objName.LastName = strName.response.model.output.response.travellerInfo.passengerData[0].travellerInformation.traveller.surname;
                    objName.Initial = strName.response.model.output.response.travellerInfo.passengerData[0].travellerInformation.passenger.firstName;
                    objName.RawText = strName.response.model.output.response.travellerInfo;
                    try {
                        if (strName.response.model.output.response.travellerInfo.passengerData[0].travellerInformation.passenger.type.length > 0) {
                            objName.Type = strName.response.model.output.response.travellerInfo.passengerData[0].travellerInformation.passenger.type;
                        }
                    } catch (e) {};
                    // We have to manage the infant
                    objInfant = new InfantElement();
                    objInfant.FirstName = strName.response.model.output.response.travellerInfo.passengerData[1].travellerInformation.passenger.firstName;
                    objInfant.LastName = strName.response.model.output.response.travellerInfo.passengerData[1].travellerInformation.traveller.surname;
                    try {
                        if (strName.response.model.output.response.travellerInfo.passengerData[1].dateOfBirth.dateAndTimeDetails.date.length > 0) {
                            DateOfBirth = strName.response.model.output.response.travellerInfo.passengerData[1].dateOfBirth.dateAndTimeDetails.date;
                            objInfant.DateOfBirth = DateObj.GetInfantDateOfBirth(DateOfBirth);
                        }
                    } catch (e) {};
                    try {
                        if (strName.response.model.output.response.travellerInfo.passengerData[1].travellerInformation.passenger.type.length > 0) {
                            objInfant.Type = strName.response.model.output.response.travellerInfo.passengerData[1].travellerInformation.passenger.type;
                        }
                    } catch (e) {};
                    objName.Infant = objInfant;
                } else {
                    // We have to check if there is an Infant linked to this pax with the same Last name
                    objName.LastName = strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.traveller.surname;
                    if (strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger.length > 0) {
                        // We have an infant with the same parent name
                        // First element is the parent
                        // Second if the bb
                        // Manage the parent
                        objName.FirstName = strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger[0].firstName;
                        objName.Initial = strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger[0].firstName;
                        objName.RawText = strName.response.model.output.response.travellerInfo;
                        try {
                            if (strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger[0].type.length > 0) {
                                objName.Type = strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger[0].type;
                            }
                        } catch (e) {};
                        // We have to manage the infant
                        objInfant = new InfantElement();
                        objInfant.FirstName = strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger[1].firstName;
                        try {
                            if (strName.response.model.output.response.travellerInfo.passengerData.dateOfBirth.dateAndTimeDetails.date.length > 0) {
                                DateOfBirth = strName.response.model.output.response.travellerInfo.passengerData.dateOfBirth.dateAndTimeDetails.date;
                                objInfant.DateOfBirth = DateObj.GetInfantDateOfBirth(DateOfBirth);
                            }
                        } catch (e) {};
                        try {
                            if (strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger[1].type.length > 0) {
                                objInfant.Type = strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger[1].type;
                            }
                        } catch (e) {};
                        objName.Infant = objInfant;
                    } else {
                        objName.FirstName = strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger.firstName;
                        objName.Initial = strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger.firstName;
                        objName.RawText = strName.response.model.output.response.travellerInfo;
                        // Check if there is a type to associate to PAX
                        try {
                            if (strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger.type) {
                                objName.Type = strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger.type;
                            } else if (strName.response.model.output.response.travellerInfo.passengerData.travellerInformation.passenger.infantIndicator) {
                                objName.Type = "INF";
                            }
                        } catch (e) {};
                    };
                };
                // Set NameElement into the collections of Names
                nameElems[0] = objName;
                objName = new NameElement();
                return nameElems;
            } catch (e) {};
        };
    };

    /**
     * Handles Group PNR's name elements
     *
     * @memberOf NameElementBuilder
     * @inner
     * @param {Object} strName PNR response
     * @returns {Array.<NameElement>} Array of NameElement objects
     */
    function addGroupPNRObjects(strName) {
        var nameArray = [];
        var DateObjVar = new Date();
        strName.response.model.output.response.travellerInfo.shift();
        for (var index = 0; index < strName.response.model.output.response.travellerInfo.length; index++) {
            var objNameVar = new NameElement();
            if (strName.response.model.output.response.travellerInfo[index]["elementManagementPassenger"]["segmentName"] === "NM") {
                //Check if passenger Associated with Infant.
                var paxData;
                if (strName.response.model.output.response.travellerInfo[index]["enhancedPassengerData"].length > 0) {
                    paxData = strName.response.model.output.response.travellerInfo[index]["enhancedPassengerData"][0]["enhancedTravellerInformation"]["otherPaxNamesDetails"];
                    objNameVar.ElementNo = parseInt(strName.response.model.output.response.travellerInfo[index]["elementManagementPassenger"]["lineNumber"]);
                    objNameVar.LastName = paxData["surname"];
                    objNameVar.FirstName = paxData["givenName"];
                    objNameVar.Initial = paxData["givenName"];
                    objNameVar.RawText = strName.response.model.output.response.travellerInfo[index];
                    // We have to manage the infant
                    var objInfantVar = new InfantElement();
                    var infData = strName.response.model.output.response.travellerInfo[index]["enhancedPassengerData"][1]["enhancedTravellerInformation"]["otherPaxNamesDetails"];
                    objInfantVar.FirstName = infData["givenName"];
                    var dateOfBirthData = strName.response.model.output.response.travellerInfo[index]["enhancedPassengerData"][1]["dateOfBirthInEnhancedPaxData"];
                    objInfantVar.DateOfBirth = dateOfBirthData ? DateObjVar.GetInfantDateOfBirth(strName.response.model.output.response.travellerInfo[index]["enhancedPassengerData"][1]["dateOfBirthInEnhancedPaxData"]["dateAndTimeDetails"]["date"]) : null;
                    objInfantVar.Type = strName.response.model.output.response.travellerInfo[index]["enhancedPassengerData"][1]["enhancedTravellerInformation"]["travellerNameInfo"]["type"];
                    objNameVar.Infant = objInfantVar;
                    // Set NameElement into the collections of Names
                    nameArray[index] = objNameVar;
                } else {
                    paxData = strName.response.model.output.response.travellerInfo[index]["enhancedPassengerData"]["enhancedTravellerInformation"]["otherPaxNamesDetails"];
                    objNameVar.ElementNo = parseInt(strName.response.model.output.response.travellerInfo[index]["elementManagementPassenger"]["lineNumber"]);
                    objNameVar.LastName = paxData["surname"];
                    objNameVar.FirstName = paxData["givenName"];
                    objNameVar.Initial = paxData["givenName"];
                    objNameVar.Type = strName.response.model.output.response.travellerInfo[index].passengerData.travellerInformation.passenger.infantIndicator ? "INF" : null;
                    objNameVar.Type = strName.response.model.output.response.travellerInfo[index].passengerData.travellerInformation.passenger.type || objNameVar.Type;
                    objNameVar.Infant = createInfantElement(strName.response.model.output.response.travellerInfo[index]);
                    objNameVar.RawText = strName.response.model.output.response.travellerInfo[index];
                    // Set NameElement into the collections of Names
                    nameArray[index] = objNameVar;
                }
            }
        }
        return nameArray;
    }
    /**
    * createInfantElement.
    * @param {Object} Traveller Info.
    * @returns {Object} InfantElement
    */
    function createInfantElement(strName){
        var infElem = "";
        var DateObjVar = new Date();
        var dobData = strName.enhancedPassengerData.dateOfBirthInEnhancedPaxData;
        if(strName.enhancedPassengerData.enhancedTravellerInformation.travellerNameInfo.infantIndicator && dobData){
            infElem = new InfantElement();
            infElem.DateOfBirth = dobData ? DateObjVar.GetInfantDateOfBirth(dobData.dateAndTimeDetails.date) : null;
            var infPassenger = strName.passengerData.travellerInformation.passenger[1];
            infElem.Type = infPassenger ? infPassenger.type : null;
        }
        return infElem;
    }

    /**
     * GetInfantDateOfBirth.
     * @param {Date} DateValue.
     */
    Date.prototype.GetInfantDateOfBirth = function(DateValue) {
        var DateObj = new Date();
        var DateStr = DateValue.substr(0, 2) + DateObj.GetShortMonthName(parseInt(DateValue.substr(2, 2)) - 1) + DateValue.substr(6, 2);
        return DateStr;
    };
    /**
     * MonthNames.
     */
    Date.prototype.MonthNames = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"
    ];

    /**
     * GetMonthName.
     * @param {int} month.
     */
    Date.prototype.GetMonthName = function(month) {
        return this.MonthNames[month];
    };

    /**
     * GetMonthName.
     * @param {int} month.
     */
    Date.prototype.GetShortMonthName = function(month) {
        return this.GetMonthName(month).substr(0, 3);
    };


    return NameElementBuilder;
})();