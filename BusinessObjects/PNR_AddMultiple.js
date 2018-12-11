//Global variable that will be updated each time we need to update the PNR
var strPNR =''; 

function InitPNRToUpdate(bSave) {
    if (!bSave) {
        strPNR = '{"-xmlns": "http://webservices.amadeus.com/PNR_AddMultiElements","pnrActions": {"optionCode": "0"},"dataElementsMaster": {"marker1": "","dataElementsIndiv":';
    } else {
        strPNR = '{"-xmlns": "http://webservices.amadeus.com/PNR_AddMultiElements","pnrActions": {"optionCode": "1"},"dataElementsMaster": {"marker1": "","dataElementsIndiv":';
    }
};

// Displays the response after PNR is updated with or without success
function showResponse(data) {
    var result = JSON.stringify(data, null, 2);
    
    // Check if this is a PNR - No Error, if so, no parsing
    try {
        if (result.response.model.output.response.MessagesOnly_Reply.CAPI_Messages.Text.length > 0) {
           // alert(strToParse.response.model.output.response.MessagesOnly_Reply.CAPI_Messages.Text);
			 this.reject(strToParse.response.model.output.response.MessagesOnly_Reply.CAPI_Messages.Text);
         } else {
			this.fulfill('PNR Updated, do not forget to save your PNR'); 
		 }
    } catch(e) {
		this.fulfill('PNR Updated, do not forget to save your PNR'); 
    };
};

// Send the Update request to Central System
function UpdatePNR(input) {
    input = JSON.parse(input);
    // After the JSON is build we will use the Service Catalog to udpdate the PNR using the 
    catalog.requestService( "ws.addMultiElement_v14.1", input, {
                                   fn: showResponse,
                                   scope: window
                                  });
};

// Building the string to add all elements in 1 shot
function AddElement(Elements,bSave) {
    // Elements represent an array of elements to add to the PNR
    // Elements is an array of Element
    // Element shoudl contain the Type of element to add, and the data.
    // Build the Json string to be pushed through the WS
var self = this;
return new Promise(function(fulfill,reject){   
                self.fulfill = fulfill;
				self.reject = reject;
   InitPNRToUpdate(bSave);
    if (Elements.length > 1) {
        strPNR+= '[';
        for (var i=0;i<Elements.length;i++) {
            if (Elements[i].Type == 'RM') {
                if (i > 0) { 
                    strPNR+=',{"elementManagementData": {"segmentName": "RM"},"extendedRemark": {"structuredRemark": {"type": "RM", "freetext":"'+ Elements[i].FreeFlow + '"}}}';
                } else {
                    strPNR+='{"elementManagementData": {"segmentName": "RM"},"extendedRemark": {"structuredRemark": {"type": "RM", "freetext":"'+ Elements[i].FreeFlow + '"}}}';
                }
            }
        }
        strPNR+= ']';
    } else if(Elements.length == 1) {
	strPNR+='{"elementManagementData": {"segmentName": "RM"}, "extendedRemark": {"structuredRemark": {"type" : "RM", "freetext":"'+ Elements[0].FreeFlow + '"}}}';
    } else {        
        alert('No element to add to PNR');
    };
    strPNR+='}}';
    UpdatePNR(strPNR);
	});
};


//------------------------------------------------------- Class --------------------------------------------------------------------
// Class that represents the element to add... This is more specific to a Remark this one...
function Element() {
    this.Type;
    this.FreeFlow;
    this.Category;
};
