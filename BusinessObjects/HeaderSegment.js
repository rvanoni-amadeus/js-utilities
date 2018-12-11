    var Header = (function() {
        /**
         * Represents Header.
         *
         * @constructs Header
         * @property {string} RecordLocator PNR RecordLocator
         * @property {string} Time
         * @property {string} Date
         * @property {string} CompanyId
         * @property {string} Indicator
         * @property {string} OfficeOfResponsibility
         */
        function Header() {
            this.RecordLocator;
            this.Time;
            this.Date;
            this.CompanyId;
            this.Indicator;
            this.OfficeOfResponsibility;
        }

        return Header;
    })();

    var HeaderBuilder = (function() {
        /**
         * Represents HeaderBuilder.
         *
         * @constructs HeaderBuilder
         */
        function HeaderBuilder() {}

        /**
         * Parsing Header.
         *
         * @memberof HeaderBuilder
         * @instance
         * @param {data} PNR Response
         * @returns {Array.<Header>} Array of Header element objects
         */
        HeaderBuilder.prototype.parseHeaders = function(data) {
            var objHeader = new Header();
            var iHeaderCount = 0;
            var headers = [];
            var reservation;
            var strHeader = JSON.parse(data);
            if (strHeader.response.model.output.response.pnrHeader) {
                if (strHeader.response.model.output.response.pnrHeader instanceof Array) {
                    reservation = strHeader.response.model.output.response.pnrHeader[0].reservationInfo.reservation || null;
                } else {
                    reservation = strHeader.response.model.output.response.pnrHeader.reservationInfo.reservation || null;
                }
            }

            if (reservation) {
                objHeader.RecordLocator = reservation.controlNumber;
                objHeader.Time = reservation.time;
                objHeader.Date = reservation.date;
                objHeader.CompanyId = reservation.companyId;
                var officeResponsibility = strHeader.response.model.output.response.securityInformation.responsibilityInformation || null;
                if (officeResponsibility != null) {
                    objHeader.OfficeResponsibility = officeResponsibility.officeId;
                }
                var statusInformation = strHeader.response.model.output.response.pnrHeaderTag ? strHeader.response.model.output.response.pnrHeaderTag.statusInformation : null;
                objHeader.Indicator = getHeaderIndicator(statusInformation);
                // We add the Header Segment to the collection
                headers[iHeaderCount] = objHeader;
            }
            return headers;
        };

        function getHeaderIndicator(statusInformation) {
            var indicatorArr = [];
            if (statusInformation instanceof Array) {
                for (var i = 0; i < statusInformation.length; i++) {
                    indicatorArr.push(statusInformation[i].indicator);
                }
            } else if (statusInformation) {
                indicatorArr.push(statusInformation.indicator);
            }
            return indicatorArr.join(" ");
        }

        return HeaderBuilder;
    })();