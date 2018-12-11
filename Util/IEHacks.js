if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
String.prototype.trimLeft = function() {
    return this.replace(/^\s+/, "");
};
String.prototype.trimRight = function() {
    return this.replace(/\s+$/, "");
};