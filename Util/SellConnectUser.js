/**
 * getSellConnectUserInfo
 */
function getSellConnectUserInfo() {
    this.userInfoObj;
}

/**
 * Register
 * @param {type} type of scripting
 */
getSellConnectUserInfo.prototype.Register = function(type) {
    if (type === "userManagement") {
        return new Promise(function(fulfill, reject) {
            self.fulfill = fulfill;
            self.reject = reject;
            smartScriptSession.sendWS("usermanagement.retrieveUser")
                .then(function(data) {
                    self.fulfill(data);
                }, function (failure) {
                    self.reject(failure);
                });
        });
    }
};