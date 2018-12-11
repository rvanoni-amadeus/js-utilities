var OtherElements = (function() {

    /**
     * Represents OtherElements.
     *
     * @constructs OtherElements
     * @property {IUElements} Array of IU objects
     * @property {SKElements} Array of SK Elements objects
     */
    function OtherElements() {
        this.IUElements = [];
        this.SKElements = [];
    }
    return OtherElements;
})();

var OtherElementsBuilder = (function() {
    /**
     * Represents OtherElementsBuilder.
     *
     * @constructs OtherElementsBuilder
     */
    function OtherElementsBuilder() {

    }
    /**
     * Parses PNR response to get Other elements
     *
     * @memberof OtherElementsBuilder
     * @instance
     * @param {Object} Map object dataElementsIndivMap
     * @returns {Array.<OtherElements>} Array of Other elements
     */
    OtherElementsBuilder.prototype.parseOtherElements = function(dataElementsIndivMap) {
        var otherElements = new OtherElements();
        var IUElementsJSONList = dataElementsIndivMap.get('IU');
        var SKElementsJSONList = dataElementsIndivMap.get('SK');
        if(IUElementsJSONList != null && IUElementsJSONList.length>0)
        {
            assignIUElements(IUElementsJSONList, otherElements);
        }
        if(SKElementsJSONList != null && SKElementsJSONList.length>0 )
        {
            assignSKElements(SKElementsJSONList, otherElements);
        }
        return otherElements;
    };

    /**
     * Represents OtherElement.
     *
     * @constructs OtherElement
     * @property {string} ElementNo
     * @property {string} Text
     * @property {object} Associations
     */
    var OtherElement = function(){
        this.ElementNo = '';
        this.Text = '';
        this.Associations = '';
    };

    /**
     * assignIUElements.
     *
     * @memberOf OtherElemBuilder
     * @inner
     * @param {Object} IUElements JSON node.
     * @param {Object} OtherElements Object.
     */
    function assignIUElements(IUElements, OtherElements) {
        for(var i =0; i<IUElements.length; i++)
        {
            var IUElement = new OtherElement();
            IUElement.ElementNo = parseInt(IUElements[i].elementManagementItinerary.lineNumber);
            IUElement.Text = IUElements[i];
            var referenceForSegment = IUElements[i].referenceForSegment;
            IUElement.Associations = referenceForSegment ? new AssociationBuilder().getAssociations(referenceForSegment.reference) : null;
            OtherElements.IUElements[OtherElements.IUElements.length] = IUElement;
        }
    };

    /**
     * assignSKElements.
     *
     * @memberOf OtherElemBuilder
     * @inner
     * @param {Object} SKElements JSON node.
     * @param {Object} OtherElements Object.
     */
    function assignSKElements(SKElements, OtherElements) {
        for(var i =0; i<SKElements.length; i++)
        {
            var SKElement = new OtherElement();
            SKElement.ElementNo = parseInt(SKElements[i].elementManagementData.lineNumber);
            SKElement.Text = SKElements[i];
            var referenceForDataElement = SKElements[i].referenceForDataElement;
            SKElement.Associations = referenceForDataElement ? new AssociationBuilder().getAssociations(referenceForDataElement.reference) : null;
            OtherElements.SKElements[OtherElements.SKElements.length] = SKElement;
        }
    };

    return OtherElementsBuilder;
})();