var RIElements = (function() {
    /**
     * Represents RIElements.
     *
     * @constructs RIElements
     * @property {AdjRmkInvoiceElements} Array of AdjRmkInvoice objects
     * @property {AgencyBillingDateElements} Array of AgencyBillingDueDate Elements objects
     * @property {PrintAgencyDueDateElements} Array of PrintAgencyDueDate Element objects
     * @property {AgencyDueDateElements} Array of AgencyDueDate Element objects
     * @property {FreeflowInvRemarkElements} Array of FreeflowInvRemark Element objects
     * @property {InvItineraryRmkElements} Array of InvItineraryRmk Element objects
     * @property {InvoiceRemarkElements} Array of InvoiceRemark Element objects
     * @property {ItineraryInvRmkElements} Array of ItineraryInvRmk Element objects
     * @property {ItineraryRemarkElements} Array of ItineraryRemark Element objects
     * @property {OverrideInvTotalElements} Array of OverrideInvTotal Element objects
     * @property {ProfileItineraryRmkElements} Array of ProfileItineraryRmk Element objects
     */

    function RIElements() {
        this.AdjRmkInvoiceElements = [];
        this.AgencyBillingDateElements = [];
        this.PrintAgencyDueDateElements = [];
        this.AgencyDueDateElements = [];
        this.FreeflowInvRemarkElements = [];
        this.InvItineraryRmkElements = [];
        this.InvoiceRemarkElements = [];
        this.ItineraryInvRmkElements = [];
        this.ItineraryRemarkElements = [];
        this.OverrideInvTotalElements = [];
        this.ProfileItineraryRmkElements = [];
    }

    return RIElements;
})();

var RIElementsBuilder = (function() {
    /**
     * Represents RIElementsBuilder.
     *
     * @constructs RIElementsBuilder
     */
    function RIElementsBuilder() {

    }
    /**
     * Parses PNR response to get RI elements
     *
     * @memberof RIElementsBuilder
     * @instance
     * @param {Object} Map object dataElementsIndivMap
     * @returns {Array.<RIElements>} Array of RI elements
     */
    RIElementsBuilder.prototype.parseRIElements = function(dataElementsIndivMap) {
        var riElements = new RIElements();
        var riaElements = dataElementsIndivMap.get('RIA');
        var ribElements = dataElementsIndivMap.get('RIB');
        var ricElements = dataElementsIndivMap.get('RIC');
        var ridElements = dataElementsIndivMap.get('RID');
        var rifElements = dataElementsIndivMap.get('RIF');
        var riiElements = dataElementsIndivMap.get('RII');
        var rimElements = dataElementsIndivMap.get('RIM');
        var rioElements = dataElementsIndivMap.get('RIO');
        var ripElements = dataElementsIndivMap.get('RIP');
        var rirElements = dataElementsIndivMap.get('RIR');
        var ritElements = dataElementsIndivMap.get('RIT');
        if(riaElements != null && riaElements.length>0 )
        {
            assignRIXElements(riaElements, riElements.AdjRmkInvoiceElements);
        }
        if(ribElements != null && ribElements.length>0 )
        {
            assignRIXElements(ribElements, riElements.AgencyBillingDateElements);
        }
        if(ricElements != null && ricElements.length>0 )
        {
            assignRIXElements(ricElements, riElements.PrintAgencyDueDateElements);
        }
        if(ridElements != null && ridElements.length>0 )
        {
           assignRIXElements(ridElements, riElements.AgencyDueDateElements);
        }
        if(rifElements != null && rifElements.length>0 )
        {
            assignRIXElements(rifElements, riElements.FreeflowInvRemarkElements);
        }
        if(riiElements != null && riiElements.length>0 )
        {
            assignRIXElements(riiElements, riElements.InvItineraryRmkElements);
        }
        if(rimElements != null && rimElements.length>0 )
        {
            assignRIXElements(rimElements, riElements.ProfileItineraryRmkElements);
        }
        if(rioElements != null && rioElements.length>0 )
        {
            assignRIXElements(rioElements, riElements.ItineraryInvRmkElements);
        }
        if(ripElements != null && ripElements.length>0 )
        {
            assignRIXElements(ripElements, riElements.InvoiceRemarkElements);
        }
        if(rirElements != null && rirElements.length>0 )
        {
            assignRIXElements(rirElements, riElements.ItineraryRemarkElements);
        }
        if(ritElements != null && ritElements.length>0 )
        {
            assignRIXElements(ritElements, riElements.OverrideInvTotalElements);
        }
        return riElements;
    };

    var RIElement = function(){
        this.ElementNo = '';
        this.Text = '';
        this.Associations = '';
    };
    /**
     * assignRIXElements.
     *
     * @memberOf RIElemBuilder
     * @inner
     * @param {Object} RIXElements JSON node.
     * @param {Object} RIElements Object.
     */
    function assignRIXElements(rixElements,ElementsArray)
    {
        for(var i =0; i<rixElements.length; i++)
        {
            var rixElement = new RIElement();
            rixElement.ElementNo = parseInt(rixElements[i].elementManagementData.lineNumber);
            rixElement.Text = rixElements[i];
            var referenceForDataElement = rixElements[i].referenceForDataElement;
            rixElement.Associations = referenceForDataElement ? new AssociationBuilder().getAssociations(referenceForDataElement.reference) : null;
            ElementsArray[ElementsArray.length] = rixElement;
        }
    }
    return RIElementsBuilder;
})();