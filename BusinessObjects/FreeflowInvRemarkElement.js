var FreeflowInvRemarkElement = (function() {
    /**
     * Represents FreeflowInvRemarkElement.
     *
     * @constructs FreeflowInvRemarkElement
     * @property {number} ElementNo Element number
     * @property {string} TatooNumber Unic number in the PNR
     * @property {string} Qualifier Qualifier for this Segment
     * @property {string} Text PNR response
     * @property {string} Type Remark type
     * @property {string} FreeFlowText Text associated to this remark
     * @property {Array.<Association>} Associations Passenger and Segment Associations
     */
    function FreeflowInvRemarkElement() {
        //Line Number in the PNR
        this.ElementNo;
        //Unic number in the PNR
        this.TatooNumber;
        //Qualifier for this Segment
        this.Qualifier;
        //Full JSON element
        this.Text;
        //Remark Type
        this.Type;
        //Text associated to this remark
        this.FreeFlowText;
        // Store the listof associations. An association will be made of a LineNumber/TatooNumber and a type (PAX/SEG)
        this.Associations;
    }

    return FreeflowInvRemarkElement;
})();

var FreeflowInvRemarkElementBuilder = (function() {
    /**
     * Represents FreeflowInvRemarkElementBuilder.
     *
     * @constructs FreeflowInvRemarkElementBuilder
     */
    function FreeflowInvRemarkElementBuilder() {}

    /**
     * Parsing FreeflowInvRemarkElement.
     *
     * @memberof FreeflowInvRemarkElementBuilder
     * @instance
     * @param {data} PNR response
     * @returns {Array.<FreeflowInvRemarkElement>} Array of FreeflowInvRemarkElement objects
     */
    FreeflowInvRemarkElementBuilder.prototype.parseFreeflowInvRemarkElements = function(data) {
        var objInv;
        var rmkElems = [];
        var invCount = 0;
        var strInv = JSON.parse(data);
        if (strInv.response.model.output.response.dataElementsMaster) {
            var invDetails = strInv.response.model.output.response.dataElementsMaster.dataElementsIndiv || null;
        }
        var invData = [];
        if (invDetails) {
            // Loop for Itinerary Element to be added with HotelSegments
            if (Array.isArray(invDetails)) {
                invData = invDetails;
            } else {
                invData.push(invDetails);
            }
            var iMax = invData.length;
            for (var i = 0; i < iMax; i++) {
                // Check if there is some Hotel segments within the PNR
                if (invData[i].elementManagementData.segmentName === 'RIF') {
                    objInv = new FreeflowInvRemarkElement();
                    objInv.TatooNumber = invData[i].elementManagementData.reference.number;
                    objInv.Qualifier = invData[i].elementManagementData.reference.qualifier;
                    objInv.ElementNo = parseInt(invData[i].elementManagementData.lineNumber);
                    objInv.Text = invData[i];
                    objInv.FreeFlowText = invData[i].extendedRemark.structuredRemark.freetext;
                    objInv.Type = invData[i].extendedRemark.structuredRemark.type;

                    //Assoctiaton
                    objInv.Associations = (invData[i].referenceForDataElement != null) ? getAssociations(invData[i].referenceForDataElement.reference) : objInv.Associations;
                    // We add the Hotel Segment to the collection
                    rmkElems[invCount] = objInv;
                    invCount++;
                }
            }
        }
        return rmkElems;
    };

    /**
     * Get Associations
     *
     * @memberOf FreeflowInvRemarkElementBuilder
     * @inner
     * @param {Array} references element's references.
     * @returns {Array.<Association>} Array of Association objects
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

    return FreeflowInvRemarkElementBuilder;
})();