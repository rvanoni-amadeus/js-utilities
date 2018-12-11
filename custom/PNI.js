//PN Library
//Properties: PN array
// Method: INSERT NOTE PROFILE
// Event: ReceivedResponse
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Class in Javascript
// Constructeur


var templateProfileWS = {
    Profile: {
        Accesses: {
            Access: {
                AccessPerson: {
                    NamePrefix: {},
                    GivenName: {},
                    MiddleName: {},
                    NameSurffix: {},
                    SurnamePrefix: {},
                    Surname: {},
                    NameTitle: {},
                    AdditionalTitle: {}
                },
                AccessComment: {},
                AccessPersonID: {},
            },
        },
        Customer: {
            PersonName: {
                NamePrefix: {},
                GivenName: {},
                MiddleName: {},
                NameSurffix: {},
                SurnamePrefix: {},
                Surname: {},
                NameTitle: {},
                AdditionalTitle: {}
            },
            Telephone: {
                IndividualPNRSecurity: {
                    Receiver: {},
                    AccessMod: {},
                },
                LanguageSpoken: {},
            },
            Email: {},
            Address: {
                StreetNmbr: {},
                StreetType: {},
                AddressLine: {},
                CityName: {},
                PostalCode: {},
                County: {},
                StateProv: {},
                CountryName: {},
                AddresseeName: {
                    NamePrefix: {},
                    GivenName: {},
                    MiddleName: {},
                    NameSuffix: {},
                    SurnamePrefix: {},
                    Surname: {},
                    NameTitle: {},
                    AdditionalTitle: {},
                },
                CompanyName: {},
            },
            URL: {},
            CitizenCountryName: {},
            PhysChallName: {},
            PaymentForm: {
                PaymentCard: {
                    CardHolderName: {},
                    CardIssuerName: {},
                    CardAddressLink: {},
                    Address: {
                        StreetNmbr: {},
                        StreetType: {},
                        AddressLine: {},
                        CityName: {},
                        PostalCode: {},
                        County: {},
                        StateProv: {},
                        CountryName: {},
                        AddresseeName: {
                            NamePrefix: {},
                            GivenName: {},
                            MiddleName: {},
                            NameSuffix: {},
                            SurnamePrefix: {},
                            Surname: {},
                            NameTitle: {},
                            AdditionalTitle: {},
                        },
                    },
                    PrefContext: {},
                },
                DirectBill: {
                    CompanyName: {},
                    Address: {
                        StreetNmbr: {},
                        StreetType: {},
                        AddressLine: {},
                        CityName: {},
                        PostalCode: {},
                        County: {},
                        StateProv: {},
                        CountryName: {},
                        AddresseeName: {
                            NamePrefix: {},
                            GivenName: {},
                            MiddleName: {},
                            NameSuffix: {},
                            SurnamePrefix: {},
                            Surname: {},
                            NameTitle: {},
                            AdditionalTitle: {},
                        },
                    },
                    Email: {},
                    Telephone: {},
                },
                LoyaltyRedemption: {},
                MiscChargeOrder: {},
                Check: {},
                Cash: {},
                BankAcct: {
                    BankAcctName: {},
                    Address: {
                        StreetNmbr: {},
                        StreetType: {},
                        AddressLine: {},
                        CityName: {},
                        PostalCode: {},
                        County: {},
                        StateProv: {},
                        CountryName: {},
                        AddresseeName: {
                            NamePrefix: {},
                            GivenName: {},
                            MiddleName: {},
                            NameSuffix: {},
                            SurnamePrefix: {},
                            Surname: {},
                            NameTitle: {},
                            AdditionalTitle: {},
                        }
                    },
                },
                ReferenceNumber: {},
                Voucher: {},
            },
            TravelArranger: {},
            RelatedTraveler: {
                UniqueID: {},
                ExternalID: {},
                PersonName: {
                    GivenName: {},
                    MiddleName: {},
                    NameSuffix: {},
                    SurnamePrefix: {},
                    Surname: {},
                    NameTitle: {},
                    AdditionalTitle: {},
                },
                Telephone: {},
                Email: {},
            },
            RelatedCompany: {
                UniqueID: {},
                CompanyName: {},
            },
            ContactPerson: {
                UniqueID: {},
                PersonName: {
                    NamePrefix: {},
                    GivenName: {},
                    MiddleName: {},
                    NameSuffix: {},
                    SurnamePrefix: {},
                    Surname: {},
                    NameTitle: {},
                    AdditionalTitle: {},
                },
                Telephone: {},
                CompanyName: {},
                EmployeeInfo: {},
                Email: {},
                Address: {
                    StreetNmbr: {},
                    StreetType: {},
                    AddressLine: {},
                    CityName: {},
                    PostalCode: {},
                    County: {},
                    StateProv: {},
                    CountryName: {},
                    AddresseeName: {
                        NamePrefix: {},
                        GivenName: {},
                        MiddleName: {},
                        NameSuffix: {},
                        SurnamePrefix: {},
                        Surname: {},
                        NameTitle: {},
                        AdditionalTitle: {},
                    },
                },
            },
            Document: { DocHolderName :{}},
            CustLoyalty: { SubAccountBalance: {}},
            ExternalCustLoyalty: { SubAccountBalance: {} },
            EmployeeInfo: {},
            LanguageSpoken: {},
            EmployerInfo: {},
            PersonalId: {},
            TPA_Extensions: {
                EtvLoginInfo: {},
                CustomFields: { CustomField: {}},
            },
            FamilyInfo: {},
            LivingLocation: {},
            LivingCountryName: {},
            Rates: {},
            TravelCategories: {
                TripPurpose: {},
                TravellerCategory: {},
            },
            Vehicle: {
                VehType: {},
                VehClass: {},
                VehIdentity: {},
            },
            FlightInfo: { FlightHistory: {}},
            LoungeCoupons: { AdditionalInformation: {}},
            
        },
        UserID: { CompanyName: {}},
        PrefCollections: {
            PrefCollection: {
                RuleManagement: {
                    TripPurpose: {},
                    TravellerCategory: {},
                    OriginLocation: {},
                    DestinationLocation: {},
                    ConnectingLocation: {},
                    AdditionalInformation: {},
                },
                AirlinePref: {
                    VendorPref: {},
                    PaymentFormPref: {},
                    AirportOriginPref: {},
                    AirportDestinationPref: {},
                    FareElementsPref: {
                        Route: {
                            Origin: {},
                            Destination: {},
                        }
                    },
                    SeatPref: { SeatPreferences: {}},
                    TicketingAccountInformation: { GST_Details: {}},
                    TicketingElementPref: {},
                    SSR_Pref: {},
                    CabinPref: {},
                    TicketDistribPref: {},
                    OS_Pref: {},
                    SK_Pref: {},
                    TourCodePref: {
                        FormattedTourCode: {},
                        StaffTourCode: {},
                        FreeFlowTourCode: {},
                    },
                    AdditionalInformation: {},
                    EquipPref: {},
                    RateRangePref: {},
                    BookingClassPref: {},
                    FlightSegmentPref: {
                        DepartureAirport: {},
                        ArrivalAirport: {},
                        OperatingAirline: {},
                        sequence: {},
                        MarketingAirline: {},
                        sequence: {},
                        Comment: {},
                    },
                    MealPref: {},
                },
                OtherSrvcPref: {
                    IndividualPNRSecurity: {
                        Receiver: {},
                        AccessMod: {},
                    }
                },
                CustomField: {},
                CommonPref: {
                    AddressPref: {},
                    TicketDistribPref: {},
                    ContactPref: {},
                    TravelManagementPref: {},
                    DocumentPref: {},
                    PassengerTypePref: {},
                    FormOfIdentification: {},
                },
                HotelPref: {
                    LoyaltyPref: {},
                    PaymentFormPref: {},
                    HotelChainPref: {},
                    PropertyNamePref: {},
                    SecurityFeaturePref: {},
                    BusinessSrvcPref: {},
                    PersonalSrvcPref: {},
                    PropertyAmenityPref: {},
                    FoodSrvcPref: {},
                    PhysChallPref: {},
                    PropertyLocationPref: {},
                    RoomAmenityPref: {},
                    BedTypePref: {},
                    RoomLocationPref: {},
                    RecreationSrvcPref: {},
                    PropertyClassPref: {},
                    PropertyTypePref: {},
                    RoomTypePref: {},
                    RateRangePref: {},
                    SpecialRatePref: {},
                    AdditionalInformation: {},
                    VendorPref: {},
                },
                VehicleRentalPref: {
                    VendorPref: {},
                    VehTypePref: {
                        VehType: {},
                        VehClass: {},
                        VehIdentity: {},
                    },
                    SpecialEquipPref: {},
                    RateQualifierPref: {},
                    FarePref: {
                        Route: {
                            Origin: {},
                            Destination: {},
                        }
                    },
                    AdditionalInformation: {},
                    PaymentFormPref: {},
                    LoyaltyPref: {},
                },
                RailPref: {
                    RailAmenities: { RailAmenity: {}},
                    ClassCodePref: {},
                    SeatAssignmentPref: {},
                    OriginStationPref: {},
                    DestinationStationPref: {},
                    PaymentFormPref: {},
                    TicketDistribPref: {},
                    FarePref: {
                        Route: {
                            Origin: {},
                            Destination: {},
                        }
                    },
                    AdditionalInformation: {},
                    VendorPref: {},
                },
                UserPref: {
                    SearchPref: {},
                    InterestPref: {},
                },
                FarePref: {
                    NegotiatedFareCode: {},
                    sequence: {},
                    DiscountPricing: {},
                    FareExpandedParameter: {},
                    FareTypeRequest: {},
                },
                AirportPref: { Transport: {}},
            }
        },
        CompanyInfo: {
            CompanyName: {},
            OtherCompanyName: {},
            AddressInfo: {
                StreetNmbr: {},
                StreetType: {},
                AddressLine: {},
                CityName: {},
                PostalCode: {},
                County: {},
                StateProv: {},
                CountryName: {},
                AddresseeName: {
                    NamePrefix: {},
                    GivenName: {},
                    MiddleName: {},
                    NameSuffix: {},
                    SurnamePrefix: {},
                    Surname: {},
                    NameTitle: {},
                    AdditionalTitle: {},
                },
            },
            URL: {},
            TelephoneInfo: {},
            Email: {},
            PaymentForm: {
                PaymentCard: {
                    CardHolderName: {},
                    CardIssuerName: {},
                    CardAddressLink: {},
                    Address: {
                        StreetNmbr: {},
                        StreetType: {},
                        AddressLine: {},
                        CityName: {},
                        PostalCode: {},
                        County: {},
                        StateProv: {},
                        CountryName: {},
                        AddresseeName: {
                            NamePrefix: {},
                            GivenName: {},
                            MiddleName: {},
                            NameSuffix: {},
                            SurnamePrefix: {},
                            Surname: {},
                            NameTitle: {},
                            AdditionalTitle: {},
                        },
                    },
                    PrefContext: {},
                },
                DirectBill: {
                    CompanyName: {},
                    Address: {
                        StreetNmbr: {},
                        StreetType: {},
                        AddressLine: {},
                        CityName: {},
                        PostalCode: {},
                        County: {},
                        StateProv: {},
                        CountryName: {},
                        AddresseeName: {
                            NamePrefix: {},
                            GivenName: {},
                            MiddleName: {},
                            NameSuffix: {},
                            SurnamePrefix: {},
                            Surname: {},
                            NameTitle: {},
                            AdditionalTitle: {},
                        },
                    },
                    Email: {},
                    Telephone: {},
                },
                LoyaltyRedemption: {},
                MiscChargeOrder: {},
                Check: {},
                Cash: {},
                BankAcct: {
                    BankAcctName: {},
                    Address: {
                        StreetNmbr: {},
                        StreetType: {},
                        AddressLine: {},
                        CityName: {},
                        PostalCode: {},
                        County: {},
                        StateProv: {},
                        CountryName: {},
                        AddresseeName: {
                            NamePrefix: {},
                            GivenName: {},
                            MiddleName: {},
                            NameSuffix: {},
                            SurnamePrefix: {},
                            Surname: {},
                            NameTitle: {},
                            AdditionalTitle: {},
                        }
                    },
                },
                ReferenceNumber: {},
                Voucher: {},
            },
            DepositPayment: {
                GuaranteePayment: {
                    AmountPercent: {},
                    Deadline: {},
                    Description: {},
                }
            },
            TravelArranger: {},
            LoyaltyProgram: {},
            ExternalLoyaltyProgram: {},
            ContactPerson: {
                UniqueID: {},
                PersonName: {
                    NamePrefix: {},
                    GivenName: {},
                    MiddleName: {},
                    NameSuffix: {},
                    SurnamePrefix: {},
                    Surname: {},
                    NameTitle: {},
                    AdditionalTitle: {}
                },
                Telephone: {},
                CompanyName: {},
                EmployeeInfo: {},
                Email: {},
                Address: {
                    StreetNmbr: {},
                    StreetType: {},
                    AddressLine: {},
                    CityName: {},
                    PostalCode: {},
                    County: {},
                    StateProv: {},
                    CountryName: {},
                    AddresseeName: {
                        NamePrefix: {},
                        GivenName: {},
                        MiddleName: {},
                        NameSuffix: {},
                        SurnamePrefix: {},
                        Surname: {},
                        NameTitle: {},
                        AdditionalTitle: {},
                    },
                },
            },
            PersonalId: {},
            Rates: {},
            Location: {},
            TravelCategories: {
                TripPurpose: {},
                TravellerCategory: {},
            },
            LocationCountryName: {},
            TPA_Extensions: { ApplicationKey: {}},
            Document: { DocHolderName: {}},
        },
        Affiliations: { TPA_Extensions: { PublicationSetting: { Parameter: {}} } },
        Agreements: {
            CommissionInfo: {},
            MarginInfo: {},
            DiscountInfo: {},
            ContractInformation: {},
            OwnerRights: {
                UniqueID: {},
                PersonName: {
                    NamePrefix: {},
                    GivenName: {},
                    MiddleName: {},
                    NameSuffix: {},
                    SurnamePrefix: {},
                    Surname: {},
                    NameTitle: {},
                    AdditionalTitle: {},
                },
                Telephone: {},
                Email: {},
            },
            ReceptorRights: {
                UniqueID: {},
                PersonName: {
                    NamePrefix: {},
                    GivenName: {},
                    MiddleName: {},
                    NameSuffix: {},
                    SurnamePrefix: {},
                    Surname: {},
                    NameTitle: {},
                    AdditionalTitle: {},
                },
                Telephone: {},
                Email: {},
            },
            LegalStatement: {
                UniqueID: {},
                PersonName: {
                    NamePrefix: {},
                    GivenName: {},
                    MiddleName: {},
                    NameSuffix: {},
                    SurnamePrefix: {},
                    Surname: {},
                    NameTitle: {},
                    AdditionalTitle: {},
                }
            },
        },
        Comments: { Comment: {}},
        CustomFields: { CustomField: {}},
        SocialNetworks: {
            SocialNetwork: {
                SocialNetworkBasicInfo: {
                    Name: {
                        NamePrefix: {},
                        GivenName: {},
                        MiddleName: {},
                        NameSuffix: {},
                        SurnamePrefix: {},
                        Surname: {},
                        NameTitle: {},
                        AdditionalTitle: {},
                    },
                    Gender: {},
                    Locale: {},
                    Picture: {},
                    WebPage: {},
                },
                SocialNetworkAuthorizedData: {
                    BirthDate: {},
                    Location: {},
                    Email: {},
                    Interests: { Interest: {}},
                    Relations: {
                        Relation: {
                            Name: {
                                NamePrefix: {},
                                GivenName: {},
                                MiddleName: {},
                                NameSuffix: {},
                                SurnamePrefix: {},
                                Surname: {},
                                NameTitle: {},
                                AdditionalTitle: {},
                            },
                            Gender: {},
                            Locale: {},
                            Picture: {},
                            WebPage: {},
                            sequence: {},
                            UserID: {},
                        }
                    },
                },
            }
        },
        Notifications: {
            Notification: {
                CustomerNotification: {},
                ThirdPartyNotification: {},
                NotificationSecurity: { AmadeusOfficeID: {}},
                LanguageSpoken: {},
                Event: {},
            }
        },
        NoxIDs: { NoxID: {}},
    }
};

function PNI() {
    this.PNI = [];
    this.PRF_NOTES_CATEGORY_0 = "";
    this.PRF_NOTES_TEXT_0 = "";
    this.PRF_RECLOC_0="",
    this.webResponse = "";

    
}

function fillTemplate(Template, Data) {
    if (typeof (Data) === "object") {
        for (var key in Data) {
            if (key.substring(0, 1) == "-") {
                Template[key] = Data[key];
            } else {
                if (Array.isArray(Data[key])) {
                    Template[key] = Data[key]
                } else {
                    if (key in Template) {
                        Template[key] = fillTemplate(Template[key], Data[key]);
                    } else {

                    }
                }
            }
        }
    } else {
        Template = Data;
    }
    return Template;
}

function cleanEmpityElements(x) {
    var type = typeof x;
    if (x instanceof Array) {
        type = 'array';
    }
    if ((type == 'array') || (type == 'object')) {
        for (k in x) {
            var v = x[k];
            if ((v === '' ||  _.size(v)===0) && (type == 'object') ) {
                delete x[k];
            } else {
                cleanEmpityElements(v);
             
            }
        }
        if ((_.size(x) >= 0) && (type == 'object')) {
            for (k in x) {
                var v = x[k];
                if ((v === '' || _.size(v) === 0) && (type == 'object')) {
                    delete x[k];
                } else {
                    cleanEmpityElements(v);
                }
            }
        }
    }
}

function addCommentsTOProfile(JsonProfile) {

    if (JsonProfile.response.model.output.response.Errors!==undefined) {
        self.Error(JsonProfile.response.model.output.response.Errors.Error["#value"]);
        return "";
    }
    else {

        if (JsonProfile.response.model.output.response.Profiles.ProfileInfo.Profile !== undefined) {
            //var Templatenewprofile = templateProfileWS["Profile"];
            var Templatenewprofile = jQuery.extend(true, {}, templateProfileWS["Profile"]);
            var profileOldData = JsonProfile.response.model.output.response.Profiles.ProfileInfo.Profile;
            fillTemplate(Templatenewprofile, profileOldData);

            return Templatenewprofile;

        }
    }
}

PNI.prototype.updateProfileTraveler = function (template,recloc) {
    
    var self = this;

    var jsonUpdateProfile = '{"-Version": "12.5","-xmlns": "http://xml.amadeus.com/2008/10/AMA/Profile","UniqueID": {"-ID": "$prfRecloc","-Instance": "1","-ID_Context": "CSX","-Type": "21"},"Position": {"-XPath": "\\\\\\\\","Root": {"-Operation": "replace","Profile": {"-ProfileType": "1","-Status": "A","Customer": {"PersonName": {"-Context": "UN","GivenName": "Tester","Surname": "Test"},"TravelArranger": ""}}}}}';
    var inputUpdate = JSON.parse(jsonUpdateProfile);
    inputUpdate.UniqueID["-ID"] = recloc;

    cleanEmpityElements(template);

    inputUpdate.Position.Root.Profile = template;

    return new Promise(function (success, failure) {
        self.success = success;
        self.failure = failure;
    smartScriptSession.sendWS("ws.updateProfile_v1.0", inputUpdate).then(function (data) {
        self.webResponse = data;
        self.success(data);
        console.log(inputUpdate);
        }, function (error) {

            self.failure(error);

        });
    });

}

PNI.prototype.getTemplateToFill = function (recloc) {
    
    var self = this;
    var txtRetrievePNI;
    txtRetrievePNI = '{}';
    var jsonElement = JSON.parse(txtRetrievePNI);
    return new Promise(function (success, failure) {

        self.success = success;
        self.failure = failure;
        var jsonRetrievePDRT = '{"-xmlns": "http://xml.amadeus.com/2008/10/AMA/Profile","-Version": "12.5","UniqueID": {"-Type": "21","-ID_Context": "CSX", "-ID": "$prfRecloc"},"ReadRequests": {"ProfileReadRequest": {"-ProfileType": "1"}}}'
        var input = JSON.parse(jsonRetrievePDRT);
        input.UniqueID["-ID"] = recloc.trim();

        smartScriptSession.sendWS("ws.retrieveProfile_v1.0", input).then(
            function (data) {
                
                var profileUpdated = addCommentsTOProfile(data);
                if (profileUpdated !== "") {
                    //profileUpdated.Comments.Comment = self.PNI;
                    // se limpian los campos que no tienen datos
                   // cleanEmpityElements(profileUpdated);
                    self.success(profileUpdated);

                } else {
                    self.failure(data);
                }

            },
            function (failure) {

                console.log(failure);
                self.failure(failure);
            }

            );
    });
}

PNI.prototype.SendPNI = function () {
    var self = this;
    var txtRetrievePNI;
    txtRetrievePNI = '{}';
    var jsonElement=JSON.parse(txtRetrievePNI);
    return new Promise(function (success, failure) {
        
        self.success = success;
        self.failure = failure;
        var jsonRetrievePDRT = '{"-xmlns": "http://xml.amadeus.com/2008/10/AMA/Profile","-Version": "12.5","UniqueID": {"-Type": "21","-ID_Context": "CSX", "-ID": "$prfRecloc"},"ReadRequests": {"ProfileReadRequest": {"-ProfileType": "1"}}}'
        var input = JSON.parse(jsonRetrievePDRT);
        input.UniqueID["-ID"] = self.PRF_RECLOC_0.toString().trim();

        var jsonUpdateProfile = '{"-Version": "12.5","-xmlns": "http://xml.amadeus.com/2008/10/AMA/Profile","UniqueID": {"-ID": "$prfRecloc","-Instance": "1","-ID_Context": "CSX","-Type": "21"},"Position": {"-XPath": "\\\\\\\\","Root": {"-Operation": "replace","Profile": {"-ProfileType": "1","-Status": "A","Customer": {"PersonName": {"-Context": "UN","GivenName": "Tester","Surname": "Test"},"TravelArranger": ""}}}}}';
        var inputUpdate = JSON.parse(jsonUpdateProfile);
        inputUpdate.UniqueID["-ID"] = self.PRF_RECLOC_0.toString().trim();
        //se recupera el perfil  de del usuario usando el ws

        smartScriptSession.sendWS("ws.retrieveProfile_v1.0", input).then(
            function (data) {
                
                var profileUpdated = addCommentsTOProfile(data);
                if (profileUpdated !== "") {
                    // se adicionan los comentarios PN
                    if (Array.isArray(profileUpdated.Comments.Comment)) {
                        for (var i = 0; i < self.PNI.length; i++) {
                            profileUpdated.Comments.Comment.push(self.PNI[i]);
                        }
                    } else {
                        profileUpdated.Comments.Comment = sefl.PNI;
                    }
                    //profileUpdated.Comments.Comment = self.PNI;
                    // se limpian los campos que no tienen datos
                    cleanEmpityElements(profileUpdated);
                    inputUpdate.Position.Root.Profile = profileUpdated;
                    smartScriptSession.sendWS("ws.updateProfile_v1.0", inputUpdate).
                    then(function (data) {
                        
                        self.webResponse = data;
                        self.success(data);
                    }, function (error) {
                        
                        self.failure(error);

                    });
                } else {
                    self.failure(data);
                }

            },
            function (failure) {
                
                console.log(failure);
                self.failure(failure);
            }

            );
    });
}