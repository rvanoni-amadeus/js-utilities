/// <reference path="../ext/promise-7.0.4.min.js" />
(function () {

    // Checking if global session object is already present in browser, loads session code only when session object is not present
    if (typeof (window.smartScriptSession) === 'undefined') {

        //Session Library
        //Properties: HostResponse
        // Method: Send
        //         SendSpecialKey
        //Event: ReceivedResponse
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Class in Javascript
        // Constructeur
        var Session = function () {
            var self = this;

            // Reference dynamically the service catalog
            //  if we are going to use this to patch the catalog, we need to save it for later
            this.scriptSrc = "https://" + document.referrer.replace("https://", "").split("/")[0] + "/ExternalCatalog.js";
            this.secoUrl = document.referrer;

            //get all GET parameters received in the querystring
            function getParams() {
                var params = {};
                var vars = window.location.search.substring(1).split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    if (typeof params[pair[0]] === "undefined") {
                        params[pair[0]] = decodeURIComponent(pair[1]);
                        // If second entry with this name, make it into a list of values
                    } else if (typeof params[pair[0]] === "string") {
                        var arr = [params[pair[0]], decodeURIComponent(pair[1])];
                        params[pair[0]] = arr;
                        // If third or later entry with this name, push it into the list
                    } else {
                        params[pair[0]].push(decodeURIComponent(pair[1]));
                    }
                }
                return params;
            }
            this.qsParams = getParams();
            // the SmartTool id as sent by SmartScript
            this.smartToolId = this.qsParams['POPUP_ID'];
            // the external catalog version as sent by SmartScript
            this.externalCatalogVersion = this.qsParams['EXTERNAL_CATALOG_VERSION'];

            // Use of Session Storage api to store some information
            // This will be useful when the smartcontent will navigate to a different
            // page than the one loaded by SECO (for sites that are not single page websites)
            // the catalog will now only be loaded when a referrer is defined
            // this referrer is expected to be Sell Connect
            if (document.referrer !== "") {
                /*if (typeof Storage !== "undefined") {
                    localStorage.setItem('value1', 'true');
                    var val1 = localStorage.getItem('value1');
                    if (sessionStorage.secoSmartScriptCatalogUrl) {
                        this.scriptSrc = sessionStorage.secoSmartScriptCatalogUrl;
                    } else {
                        sessionStorage.secoSmartScriptCatalogUrl = this.scriptSrc;
                    }
                    if (sessionStorage.secoUrl) {
                        this.secoUrl = sessionStorage.secoUrl;
                    } else {
                        sessionStorage.secoUrl = this.secoUrl;
                    }

                } else {
                    // no Storage is available : this context shouldn't happen on
                    // supported browser unless explicitely deactivated by the user
                    // no specific management for now

                }*/
                var script = document.createElement('script');
                script.src = this.scriptSrc + "?externalCatalogVersion=" + this.externalCatalogVersion;
                script.onload = function () {
                    self.__loaded();
                }
                document.getElementsByTagName('head')[0].appendChild(script);

            } else {
                // the script has been loaded in a window/tab outside Seco :
                // we don't want to update the url to use from here,
                // and this is an invalid way to load the script anyway
                // so we can't load the external catalog at all
                // no error throw to allow for externally loadable scripts (if the need arise)
                // to work without errors
            }

            var webSdkPlatform = window.webSdkPlatform;
            if (typeof webSdkPlatform === 'undefined') {
                webSdkPlatform = "/";
            }

            if (!window.Promise) {
                var promiseScript = document.createElement('script');
                promiseScript.src = webSdkPlatform + "Scripts/src/app/assets/js/ext/promise-7.0.4.min.js";
                document.getElementsByTagName('head')[0].appendChild(promiseScript);

                //var doneScript = document.createElement('script');
                //doneScript.src = webSdkPlatform + "src/app/assets/js/ext/promise-done-7.0.4.min.js";
                //document.getElementsByTagName('head')[0].appendChild(doneScript);
            }

            this.LastResponse;
            // reintroduced with the v1.0.7 typo for backward compatibility
            this.LasResponse;
            this.LastCommand = "";
            sessionScope = this;
            this.__lastCmdCtx = {};
            //subscribe events array list
            sessionScope.__sbEventList = [];

            //  flags to keep track of the state of the Session
            this.__established = false; // have we successfuly connected to the catalog ?
            this.__pending_response = false; // is a request to the catalog already running ?
            this.__delayed_calls = []; // The array to store the pending requests

        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //HostResponse Library
        //Properties:
        //  Response
        //  LastCommand
        //  ResponseType
        //  NumberOfLines
        //  Lines
        //  GetLineFromBuffer
        var HostResponse = function (data) {
            if (typeof data !== "undefined") {
                this.Response = data.Response || data.response || data;
                this.LastCommand = data.Command;
                this.ResponseType = data.ResponseType;
                this.NumberOfLines = data.NbOfLines;
                this.Lines = [];
                if (this.Response && typeof this.Response === "string") {
                    this.Lines = this.Response.trim().split(/\n/);
                }
                this.GetLineFromBuffer = function (lineIndex) {
                    var line = "";
                    if (lineIndex > 0 && lineIndex <= this.NumberOfLines) {
                        line = this.Lines[lineIndex - 1];
                    }
                    return line;
                }
            }
        };

        /**
         * Utility class to
         * - represent a call to the service catalog
         * - get a promise object for which the triggers are saved as part of the this.callback.params which we will pass to the catalog.
         *   In the callback handler, we will be able to access this.callback.params (as the second argument of the callback handlers) and
         *   therefore we will be able to reject or fulfill accordingly.
         *   The user can simply use the promise normally to chain .then()
         * @constructs EventRequestCall
         * @property {Object} event
         * @property {Object} callback
         */
        var EventRequestCall = function (event, callback) {
            this.event = event;
            this.callback = callback;
        };

        /**
         *
         * @method
         * @memberof EventRequestCall
         * This method creates a Promise.
         * It captures and appends the promise triggers to the callback property's params : this.callback.params
         * When the catalog calls this.callback, it will pass this.callback.params as function argument (alongside the response) to the callback function
         * From the callback we will be able to access the triggers and fullfil or reject the promise based on the result of the catalog request.
         * Finally the Promise is returned, which gives the ability to let the caller add .then clauses to the promise.
         * @result {Promise}
         */
        EventRequestCall.prototype.getPromise = function () {
            var self = this;

            // if the callback does not have a params member : intialise italics
            if (typeof this.callback.params === "undefined") {
                this.callback.params = {};
            }

            return new Promise(function (fulfill, reject) {
                self.callback.params.__fulfill = fulfill;
                self.callback.params.__reject = reject;
            });
        };

        /**
         *
         * Utility class to
         * - represent a call to the service catalog
         * - get a promise object for which the triggers are saved as part of the this.callback.params which we will pass to the catalog.
         *   In the callback handler, we will be able to access this.callback.params (as the second argument of the callback handlers) and
         *   therefore we will be able to reject or fulfill accordingly.
         *   The user can simply use the promise normally to chain .then()
         * @constructs CatalogCall
         * @param {String} request The catalog function to call, e.g.: "commandpage.sendCommand"
         * @param {Object} params The parameters for this type of request, e.g.: { command: strCommand, transmit: true }. Refer to catalog documentation for details
         * @param {Object} callback Callback for the catalog to call upon completion, e.g.: { "fn": self.__response_handler, "scope": self }. Refer to catalog documentation for details
         * @property {String} request
         * @property {Object} params
         * @property {Object} callback
         */
        var CatalogCall = function (request, params, callback) {
            this.request = request;
            this.params = params;
            this.callback = callback;
        };

        /**
         *
         * @public
         * @method
         * @memberof CatalogCall
         * This method creates a Promise.
         * It captures and appends the promise triggers to the callback property's params : this.callback.params
         * When the catalog calls this.callback, it will pass this.callback.params as function argument (alongside the response) to the callback function
         * From the callback we will be able to access the triggers and fullfil or reject the promise based on the result of the catalog request.
         * Finally the Promise is returned, which gives the ability to let the caller add .then clauses to the promise.
         * @result {Promise}
         */
        CatalogCall.prototype.getPromise = function () {
            var self = this;

            // if the callback does not have a params member : intialise italics
            if (typeof this.callback.params === "undefined") {
                this.callback.params = {};
            }

            return new Promise(function (fulfill, reject) {
                self.callback.params.__fulfill = fulfill;
                self.callback.params.__reject = reject;
            });
        }

        Session.prototype.getTaskList = function () {
            return this.requestService('tasks.getList', null);
        };

        /**
         *
         * @method
         * @memberof Session
         * Entry point for scripts to use Session object once promise js loads
         */
        Session.prototype.ready = function (cb) {
            var self = this;
            self.__readycb = cb;

            // webSdkPlatform must be already defined when the web application is hosted in a different server than the webSDK.
            // If it is not defined, we assume that the web application is hosted on the same server as webSDK.
            var webSdkPlatform = window.webSdkPlatform;
            if (typeof webSdkPlatform === 'undefined') {
                webSdkPlatform = "/";
            }

            // check if promise is already available
            if (!window.Promise) {
                var promiseScript = document.createElement('script');
                promiseScript.src = webSdkPlatform + "WebSDK/ThirdPartyLibraries/v1.0.9/promise/promise-7.0.4.min.js";
                promiseScript.onload = function () {
                    self.__readycb();
                };
                document.getElementsByTagName('head')[0].appendChild(promiseScript);
            } else {
                self.__readycb();
            }
        };

        //////Catalog Method
        Session.prototype.__loaded = function () {
            // patch the catalog
            this.__patchCatalog();

            // Connection to the external catalog
            catalog.connect({
                scope: this,
                fn: sessionScope.__connected
            }, this.secoUrl);

        };

        /**
         *
         * @private
         * @method
         * @memberof Session
         * Separate the patch of the catalog to be able to override it in unit test context
         * Furthermore, this piece of code should be temporary as future version of the catalog should contain
         * a more proper way to update to specify the catalog URL
         */
        Session.prototype.__patchCatalog = function () {

            // Override Catalog connect method to be able to override catalog.dest property
            // to allow the communication with external catalog also when navigating to a
            // different page than the one configured in site manager.
            catalog.connect = function (callback, secoUrl) {
                catalog.cb = callback;

                catalog.dest = secoUrl;
                var msg = JSON.stringify({
                    "message": "loaded"
                });
                catalog.win.postMessage(msg, catalog.dest);
            }
        };

        /**
         * @private
         * @method
         * @memberof Session
         * Callback for connection to the catalog : it is called upon successful connection.
         * @param {Object} params Includes the smart trigger command : params.lastCommand
         */
        Session.prototype.__connected = function (params) {
            var self = this;


            catalog.subscribe("commandpage.notifyResponse", {
                "fn": this.__receivedResponse,
                "scope": self
            });

            catalog.subscribe('tasks.activated', {
                'fn': this.__tasksActivated,
                'scope': self
            });

            if (params !== undefined) {
                sessionScope.LastCommand = params.lastCommand;
                if (sessionScope.__lastCmdCtx.__fulfill) {
                    sessionScope.__lastCmdCtx.__fulfill(sessionScope.LastCommand);
                }
                //Subscribe list of events
                sessionScope.__sbEventList.forEach(function (element) {
                    catalog.subscribe(element.event, element.callback);
                });
            }

            //  catalog is ready to send commands
            //         No request should be pending as we have only just established the session.
            if (this.__pending_response == true) {
                throw "SmartSession invalid state : can not be 'pending response' right now";
            }

            this.__established = true;
            //  kick in the dequeueing of the queued commands
            this.__processNextDelayedCall();

        };

        //////Methods
        Session.prototype.sendSpecialKey = function (specialKey) {
            return this.requestService("commandpage.SendSpecialKey", {
                "key": specialKey
            });
        };

        /** @function requestService
         *  @description This function makes request for generic catalog services.
         *  @param {String} request it is catalog request, e.g.: "ws.retrievePNR_v14.1"
         *  @param {Object} input The input parameters for this type of request, e.g.: {"retrievalFacts": {"retrieve": {"type": 1}}}. Refer to catalog documentation for details
         */
        Session.prototype.requestService = function (request, input) {
            var self = this;
            var aCall = new CatalogCall(request, input, {
                fn: {
                    onSuccess: self.__success_response_handler,
                    onError: self.__error_response_handler
                },
                "scope": self
            });
            var aPromise = aCall.getPromise();
            this.__doSendOrQueue(aCall);

            return aPromise;
        };
        /**
         * Success callback function on response of request service
         * @private
         * @method
         * @memberof Session
         * @param {Object} data
         * @param {Object} params
         */
        Session.prototype.__success_response_handler = function (data, params) {
            aResponse = new HostResponse(data);
            this.LastResponse = aResponse;
            this.LasResponse = this.LastResponse;

            //  use the triggers we passed along with the callback
            if (typeof aResponse.Response === "undefined" || aResponse.Response.error) {
                params.__reject(data);
            } else {
                params.__fulfill(data);
            };
            //  as we have just received the last response, Session is ready to shoot again
            this.__pending_response = false;
            //  if we have some pending call, send the first one.
            this.__processNextDelayedCall();
        };
        /**
         * Error callback function on response of request service
         * @private
         * @method
         * @memberof Session
         * @param {Object} data
         * @param {Object} params
         */
        Session.prototype.__error_response_handler = function (data, params) {
            params.__reject(data);
            //  as we have just received the last response, Session is ready to shoot again
            this.__pending_response = false;
            //  if we have some pending call, send the first one.
            this.__processNextDelayedCall();
        };

        /** @function subscribeEvent
         *  @description This generic method enables a script to subscribe to an event, e.g.: catalog.subscribe("air.searched", { fn: ghost.onAirSearchEvent,scope: ghost});. Refer to catalog Events documentation for details
         *  @param {String} eventName it is catalog request
         */
        Session.prototype.subscribeEvent = function (eventName) {
            var self = this;
            var aCall;
            var aPromise;

            aCall = new EventRequestCall(eventName, {
                "fn": self.fullfillRequestCall,
                "scope": self
            });
            aPromise = aCall.getPromise();

            if (self.__established) {
                catalog.subscribe(aCall.event, aCall.callback);
            } else {
                sessionScope.__sbEventList.push(aCall);
            }

            return aPromise;
        };
        /**
         * @function fullfillRequestCall
         * @description fulfills the promise reguest
         * @param {Object} data
         * @param {Object} params
         */
        Session.prototype.fullfillRequestCall = function (data, params) {
            params.__fulfill(data);
        };

        /**
         *
         * @private
         * @method
         * @memberof Session
         * Method to process the first element in the queue of delayed calls to the catalog.
         * If successful : the call is removed from the queue.
         */
        Session.prototype.__processNextDelayedCall = function () {
            if (this.__delayed_calls.length > 0) {

                // run the command at the head of the queue
                var theCall = this.__delayed_calls[0];
                if (this.__doSendImmediate(theCall)) {
                    // if the catalog was called, remove from the queue
                    this.__delayed_calls.splice(0, 1);
                }
            }
        };

        Session.prototype.__receivedResponse = function (data) {
            this.LastResponse = new HostResponse(data);
            this.LasResponse = this.LastResponse;
            CheckDuplicateSegment(data);
        };

        Session.prototype.__tasksActivated = function (data) {
            var popupId = this.getPopupId();
            var taskId = data.id;
            catalog.setContext(taskId, popupId, { fn: this.onContextChanged, scope: this });
        };

        Session.prototype.onContextChanged = function (data) {
            var self = this;
            catalog.subscribe("commandpage.notifyResponse", {
                "fn": this.__receivedResponse,
                "scope": self
            });
        };

        Session.prototype.isLastUIActive = function () {
            // Not yet imnplemented
            return true;
        };

        Session.prototype.sessionName = function () {
            //Not yet implemented
            return "";
        };

        /**
         * @public
         * @method
         * @memberof Session
         * Method to send a cryptic command
         * @param {String} strCommand the cryptic command to send
         * @returns {Promise} A promise which will resolved/reject upon receiving the response
         */
        Session.prototype.send = function (strCommand) {
            return this.requestService("commandpage.sendCommand", {
                command: strCommand,
                transmit: true
            });
        };

        /**
         *
         * @private
         * @method
         * @memberof Session
         * Method to decide whether to send or queue a call.
         * And then execute the chosen action.
         * @param {CatalogCall} iCall
         * @returns {Boolean} True if the command was submitted to the catalog. False if it was queued
         */
        Session.prototype.__doSendOrQueue = function (iCall) {
            var aResult = true;
            //  the session is ready for immediate submission
            if (this.__established && this.__pending_response == false) {

                // We are calling the catalog : set the __pending_response (this is actually a sort of a lock)
                this.__pending_response = true;

                // Forward the call to the catalog. The callback object is already 'wired' to the promise
                catalog.requestService(iCall.request, iCall.params, iCall.callback);
            }
                //  else append to queue
            else {
                aResult = false;
                this.__delayed_calls.push(iCall);
            }
            return aResult;
        };

        /**
         *
         * @private
         * @method
         * @memberof Session
         * This method only send a request to the catalog if the session is available.
         * Else, it does nothing and notifies caller by returning false.
         * It should be used only to replay delayed calls : if the call can not be made, we do not want to queue the call again
         * Rather we would leave it in its current position in the list.
         * @param {CatalogCall} iCall
         * @returns {Boolean} True if the command was submitted to the catalog. False otherwise : nothing happened in that case.
         */
        Session.prototype.__doSendImmediate = function (iCall) {
            var aResult = true;
            if (this.__established && this.__pending_response == false) {
                this.__pending_response = true;

                // Forward the call to the catalog. The callback object is already 'wired' to the promise
                catalog.requestService(iCall.request, iCall.params, iCall.callback);
            } else {
                aResult = false;
            }

            return aResult;
        }

        /** @function refreshBookingFileIfRequired
         *  @param {Boolean} isBookingFileDisplayReqd : Tells whether subscribe to bookingFile.displayed is required or not
         *  @description Refreshes the booking file only when Smart Tool is launched while being there on booking file
         *  fulfills the promise when booking file is fully displayed
         */
        Session.prototype.refreshBookingFileIfRequired = function (isBookingFileDisplayReqd) {
            if (isBookingFileDisplayReqd === undefined) {
                isBookingFileDisplayReqd = true;
            }
            var self = this;
            var aCall = new CatalogCall("getOffsetPositionsOf",
                'span[class*=\"title file\"]', {
                    "fn": self.__booking_file_handler,
                    "scope": self,
                    "params": {
                        "isBookingFileDisplayReqd": isBookingFileDisplayReqd
                    }
                });
            var aPromise = aCall.getPromise();
            this.__doSendOrQueue(aCall);

            return aPromise;
        };

        /** @function __booking_file_handler
         *  @description if user is on booking file view then booking file gets refreshed, we fulfill the promise and
         *  continue to process the next delayed call; if user is not on booking file view then we directly fullfil the
         *  promise and continue to process the next delayed call.
         */
        Session.prototype.__booking_file_handler = function (data, params) {
            var self = this;
            // Checks if data is valid then it subscribes to bookingfile.displayed catalog event and refreshes booking file
            if (data) {
                if (params.isBookingFileDisplayReqd) {
                    catalog.subscribe("bookingfile.displayed", {
                        "fn": processNext,
                        "scope": self
                    });
                    self.refreshBookingFile();
                } else {
                    self.refreshBookingFile();
                    processNext();
                }
            } else {
                processNext();
            };

            function processNext() {
                params.__fulfill();
                self.__pending_response = false;
                self.__processNextDelayedCall();
            }

        };

        /** @function refreshBookingFile
         *  @description It refreshes the booking file.
         */
        Session.prototype.refreshBookingFile = function () {
            catalog.requestService("bookingfile.refresh");
        };

        /** @function sendWS
         *  @description Sends web service request
         *  @param {String} webservice request The catalog function to call, e.g.: "ws.retrievePNR_v14.1"
         *  @param {Object} input The input parameters for this type of request, e.g.: {"retrievalFacts": {"retrieve": {"type": 1}}}. Refer to catalog documentation for details
         */
        Session.prototype.sendWS = function (request, input) {
            return this.requestService(request, input);
        };

        /** @function getLastCommand
         *  @description Gets the last command which launched the script.
         */
        Session.prototype.getLastCommand = function () {
            var aPromise;
            if (sessionScope.LastCommand !== "") {
                aPromise = Promise.resolve(sessionScope.LastCommand);
            } else {
                aPromise = new Promise(function (fulfill, reject) {
                    sessionScope.__lastCmdCtx.__fulfill = fulfill;
                    sessionScope.__lastCmdCtx.__reject = reject;
                });
            }
            return aPromise;
        };

        /** @function getRecordLocator
         *  @description Gets record locator.
         */
        Session.prototype.getRecordLocator = function () {
            return this.requestService("bookingfile.getRecloc", null);
        };

        /** @function getPopupId
         *  @description Gets the popup id.
         *  @returns {String} popup id
         */
        Session.prototype.getPopupId = function () {
            var popupId = '';
            if (location.search.length > 0 && location.search.match('&') !== -1) {
                var arr = location.search.split('&');
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf('POPUP_ID') !== -1) {
                        popupId = arr[i].split("=")[1];
                    }
                }
            }
            return popupId;
        };

        /** @function CloseWindow
         *  @param {object} strPOPUP_Id - popID of smart tool
         *  @description Closes smart tool popup
         */
        Session.prototype.CloseWindow = function (strPOPUP_Id) {
            return this.requestService("popups.close", {
                "id": strPOPUP_Id
            });
        };

        /** @function ShowSmartTool
         *  @param {object} strPOPUP_Id - popID of smart tool
         *  @description Shows hidden smart tool popup
         */
        Session.prototype.ShowSmartTool = function (strPOPUP_Id) {
            return this.requestService("popups.show", {
                "id": strPOPUP_Id
            });
        };

        /** @function HideSmartTool
         *  @param {object} strPOPUP_Id - popID of smart tool
         *  @description hides hidden smart tool popup
         */
        Session.prototype.HideSmartTool = function (strPOPUP_Id) {
            return this.requestService("popups.hide", {
                "id": strPOPUP_Id
            });
        };

        /**
         * @function popupResize
         * @description This function makes request for popup resize service
         * @param {String} popupId
         * @param {Integer} width of popup
         * @param {Integer} height of popup
         */
        Session.prototype.popupResize = function (popupId, width, height) {
            return this.requestService("popups.resize", {
                popupId: popupId,
                width: width,
                height: height
            });
        };

        /**
         * @function sendHiddenCommand
         * @description This function sends cryptic command in hidden mode
         * @param {String} strCommand cryptic command to send
         */
        Session.prototype.sendHiddenCommand = function (strCommand) {
            return this.requestService("commandpage.sendHiddenCommand", strCommand);
        };

        Session.prototype.executeCommand = function (args) {
            if (args.commands.length > 0) {
                catalog.requestService("commandpage.sendCommand", { command: args.commands[0].cmd, transmit: true }, { "fn": commandResponse, "scope": window, "params": args });
            } else {
                args.nextStep();
            }
        }

        Session.prototype.executeCommandHidden = function (args) {
            if (args.commands.length > 0) {
                catalog.requestService("commandpage.sendHiddenCommand", { command: args.commands[0].cmd, transmit: true }, { "fn": commandResponseHidden, "scope": window, "params": args });
            } else {
                args.nextStep();
            }
        }
        function commandResponseHidden(data, args) {
            console.log(JSON.stringify(data));
            if (args.commands[0].callback !== undefined && args.commands[0].parameter === undefined) {
                args.commands[0].callback(data);
            } else if (args.commands[0].callback !== undefined && args.commands[0].parameter !== undefined) {
                args.commands[0].callback(args.commands[0].parameter, data);
            }
            args.commands.shift();
            sessionScope.executeCommandHidden(args);
        }

        function commandResponse(data, args) {
            console.log(JSON.stringify(data));
            if (args.commands[0].callback !== undefined && args.commands[0].parameter === undefined) {
                args.commands[0].callback(data);
            } else if (args.commands[0].callback !== undefined && args.commands[0].parameter !== undefined) {
                args.commands[0].callback(args.commands[0].parameter, data);
            }
            args.commands.shift();
            sessionScope.executeCommand(args);
        }

        Session.prototype.isBookingFile = function () {
            var self = this;
            return new Promise(function (fulfill, reject) {
                self.fulfill = fulfill;
                self.reject = reject;
                catalog.requestService("getOffsetPositionsOf", 'span[class*=\"title file\"]', {
                    "fn": self.isBookingFileCallBack,
                    "scope": self
                });
            });
        };

        Session.prototype.isBookingFileCallBack = function (data) {
            if (data) {
                this.fulfill(true);
            } else {
                this.fulfill(false);
            }
        };
        Session.prototype.retrieveUser = function () {
            return this.requestService("usermanagement.retrieveUser", null);
        };
        Session.prototype.getFullCryptic = function (originalTextData) {
            var fullTextData = originalTextData.toString().replace(/\s+$/, "");
            return ")>" === fullTextData.slice(-2) ? new Promise(function (fulfill, reject) {
                smartScriptSession.send("mdr").then(function (response) {
                    fullTextData = fullTextData.slice(0, -2) + response.Response.toString().replace(/\s+$/, ""),
                        ")>" === fullTextData.slice(-2) ? smartScriptSession.getFullCryptic(fullTextData).then(fulfill, reject) : fulfill(fullTextData);
                });
            }) : Promise.resolve(fullTextData);
        };

        // setting up global session object - smartScriptSession
        window.smartScriptSession = new Session();
    }

})();
