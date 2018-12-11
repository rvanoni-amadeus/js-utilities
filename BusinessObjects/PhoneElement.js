var PhoneElement = (function() {
    /**
     * Represents PhoneElement.
     *
     * @constructs PhoneElement
     * @property {number} ElementNo Element number
     * @property {string} TatooNumber
     * @property {string} Qualifier Qualifier for this Segment
     * @property {string} TypeCode
     * @property {Object} Text PhoneElement's JSON
     * @property {string} Type
     * @property {string} FreeFlowText Text associated to this remark
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function PhoneElement() {
        this.ElementNo;
        this.TatooNumber;
        this.Qualifier;
        this.TypeCode;
        //Full JSON element
        this.Text;
        this.Type;
        this.FreeFlowText;
        // Store the listof associations. An association will be made of a LineNumber/TatooNumber and a type (PAX/SEG)
        this.Associations;
    }

    return PhoneElement;
})();

var PhoneElementBuilder = (function() {
    /**
     * Represents PhoneElementBuilder.
     *
     * @constructs PhoneElementBuilder
     */
    function PhoneElementBuilder() {}

    /**
     * Parsing PhoneElement.
     *
     * @memberof PhoneElementBuilder
     * @instance
     * @param {data} PNR Response.
     */
    PhoneElementBuilder.prototype.parsePhoneElements = function(data) {
        var objPhone;
        var phoneElems = [];
        var phoneCount = 0;
        var strPhone = JSON.parse(data);
        if (strPhone.response.model.output.response.dataElementsMaster) {
            var phoneDetails = strPhone.response.model.output.response.dataElementsMaster.dataElementsIndiv || null;
        }
        var phoneData = [];
        if (phoneDetails) {
            // Loop for Itinerary Element to be added with HotelSegments
            if (Array.isArray(phoneDetails)) {
                phoneData = phoneDetails;
            } else {
                phoneData.push(phoneDetails);
            }
            var iMax = phoneData.length;
            for (var i = 0; i < iMax; i++) {
                // Check if there are phone segments within the PNR
                if (phoneData[i].elementManagementData.segmentName === 'AP') {
                    objPhone = new PhoneElement();
                    objPhone.TatooNumber = phoneData[i].elementManagementData.reference.number;
                    objPhone.Qualifier = phoneData[i].elementManagementData.reference.qualifier;
                    objPhone.ElementNo = parseInt(phoneData[i].elementManagementData.lineNumber);
                    objPhone.Type = phoneData[i].otherDataFreetext.freetextDetail.type;
                    objPhone.SubjectQualifier = phoneData[i].otherDataFreetext.freetextDetail.subjectQualifier;
                    objPhone.Text = phoneData[i];



                    switch (objPhone.Type) {
                        case "3":
                            objPhone.TypeCode = "B";
                            break;
                        case "4":
                            objPhone.TypeCode = "H";
                            break;
                        case "5":
                            objPhone.TypeCode = "";
                            break;
                        case "6":
                            objPhone.TypeCode = "A";
                            break;
                        case "7":
                            objPhone.TypeCode = "M";
                            break;
                        case "P01":
                            objPhone.TypeCode = "F";
                            break;
                        case "P02":
                            objPhone.TypeCode = "E";
                            break;
                        default:
                            objPhone.TypeCode = "";
                    }
                    if (objPhone.TypeCode !== "") {
                        objPhone.FreeFlowText = objPhone.TypeCode + ' ' + phoneData[i].otherDataFreetext.longFreetext;
                    } else {
                        objPhone.FreeFlowText = phoneData[i].otherDataFreetext.longFreetext;
                    }
                    //Assoctiaton
                    objPhone.Associations = (phoneData[i].referenceForDataElement != null) ? getAssociations(phoneData[i].referenceForDataElement.reference) : null;

                    // We add the phone element to the collection
                    phoneElems[phoneCount] = objPhone;
                    phoneCount++;
                }
            }
        }

        return phoneElems;
    };

    /**
     * Get Associations
     *
     * @memberOf PhoneElementBuilder
     * @inner
     * @param {Array} references element's references.
     */
    function getAssociations(references) {
        var associations = [];
        var associationObj;
        if (references.length > 0 && references != null) {
            for (var i = 0; i < references.length; i++) {
                associationObj = new Association();
                associationObj.TatooNumber = references[i].number;
                associationObj.Qualifier = references[i].qualifier;
                associations[i] = associationObj;
            }
        } else {
            associationObj = new Association();
            associationObj.TatooNumber = references.number;
            associationObj.Qualifier = references.qualifier;
            associations[0] = associationObj;
        }
        return associations;
    }

    return PhoneElementBuilder;
})();