function PopUp() { 
};
PopUp.prototype.GetPopUpId = function() {  
	var popupId = "";
    if (location.search.length > 0 && location.search.match('&') !== -1) {
	   var arr = location.search.split('&');
	   for (i=0; i < arr.length; i++){
		 if (arr[i].indexOf('POPUP_ID') !== -1) {
		   popupId = arr[i].split("=")[1];
		 }				 
	   }   
	}
 return popupId
}