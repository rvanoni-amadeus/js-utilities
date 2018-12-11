var TicketElement = (function() {
    /**
     * Represents TicketElement.
     *
     * @constructs TicketElement
     * @property {string} Action status
     * @property {string} Associations Associations
     * @property {number} ElementID Segment name
     * @property {string} ElementNo Line number in PNR
     * @property {number} ETAirlineCode E-Ticket Airline code
     * @property {string} FreeFlow
     * @property {number} Date Ticket date
     * @property {string} DocumentPrintOption
     * @property {string} Location office id
     * @property {string} QueueCategory Segment name
     * @property {object} Text Ticket element data in PNR response
     * @property {string} Time Ticket time
     */
    function TicketElement() {
        this.Action = "";
        this.Associations = null;
        this.ElementID = null;
        this.ElementNo = 0;
        this.ETAirlineCode;
        this.FreeFlow = null;
        this.Date = null;
        this.DocumentPrintOption = null;
        this.Location ="";
        this.QueueCategory = null;
        this.Text = null;
        this.Time = null;
    }

    return TicketElement;
})();

var TicketElementBuilder = (function() {
    /**
     * Represents TicketElementBuilder.
     *
     * @constructs TicketElementBuilder
     */
    function TicketElementBuilder() {}
    /**
     * Setting QueueCategory, ETAirlineCode, Date and Time of TicketElements.
     *
     * @memberof TicketElementBuilder
     * @param {Obj} TicketElement Object instance
     * @param {Map} TicketElements JSON node
     * @returns {Obj} TicketElement Object instance
     */
    var setQueuecategoryEtairlinecodeDateTime = function(objTkt,ticket){
        if (ticket) {
                    objTkt.Date = (ticket.date) ? ticket.date : '1899-12-30T00:00:00';
                    if ("ET" === ticket.electronicTicketFlag) {
                        objTkt.ETAirlineCode = (ticket.airlineCode) ? ticket.airlineCode : null;
                    } else {
                        objTkt.ETAirlineCode = null;
                    }
                    objTkt.Location = (ticket.officeId) ? ticket.officeId.trim() : null;
                    if (ticket.queueCategory && ticket.queueNumber) {
                        objTkt.QueueCategory = "Q" + ticket.queueNumber + "C" + ticket.queueCategory;
                    }
                    else {
                        objTkt.QueueCategory = null;
                    }
                    objTkt.Time = (ticket.time) ? ticket.time : '1899-12-30T00:00:00';
                } else {
                    objTkt.Date = '1899-12-30T00:00:00';
                    objTkt.QueueCategory = null;
                    objTkt.Time = '1899-12-30T00:00:00';
                    objTkt.ETAirlineCode = null;
                }
        return objTkt;
    };

    /**
     * Parsing TicketElement.
     *
     * @memberof TicketElementBuilder
     * @instance
     * @param {Map} data Data Elements in PNR response
     * @returns {Array.<TicketElement>} Array of TicketElement objects
     */
    TicketElementBuilder.prototype.parseTicketElements = function(data) {
        var ticketDataElems = data.get('TK');
        var ticketElems = [];
        if (ticketDataElems != null) {
            var item = '';
            var iMax = ticketDataElems.length;
            for (index = 0; index < iMax; index++) {
                item = ticketDataElems[index];
                objTkt = new TicketElement();
                objTkt.Action = (item.ticketElement.ticket.indicator) ? item.ticketElement.ticket.indicator : '';
                objTkt.FreeFlow = (item.ticketElement.ticket.freetext) ? item.ticketElement.ticket.freetext.trim() : null;
                if(objTkt.FreeFlow && objTkt.FreeFlow.startsWith("-"))
                {
                    objTkt.FreeFlow = objTkt.FreeFlow.substring(1);
                }
                objTkt.Associations = (item.referenceForDataElement) ? new AssociationBuilder().getAssociations(item.referenceForDataElement.reference) : null;
                objTkt.ElementID = (item.elementManagementData.segmentName) ? item.elementManagementData.segmentName : '';
                objTkt.ElementNo = (item.elementManagementData.lineNumber) ? parseInt(item.elementManagementData.lineNumber) : '';
                var ticket = item.ticketElement.ticket;
                objTkt = setQueuecategoryEtairlinecodeDateTime(objTkt,ticket);
                objTkt.Text = item;
                ticketElems.push(objTkt);
            }
        }
        return ticketElems;
    };
    return TicketElementBuilder;
})();