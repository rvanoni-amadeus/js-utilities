var Association = (function() {
    /**
     * Represents Association which will be made of a LineNumber/TatooNumber and a type (PAX/SEG).
     *
     * @constructs Association
     * @property {string} TatooNumber Unic number in the PNR
     * @property {string} Qualifier Qualifier for this Segment
     */
    function Association() {
        this.TatooNumber = '';
        this.Qualifier = '';
    }

    return Association;
})();

var AssociationBuilder = (function() {
    /**
     * Represents AssociationBuilder.
     *
     * @constructs AssociationBuilder
     */
    function AssociationBuilder() {

    }

    /**
     * Get Array of Association Objects
     *
     * @memberof AssociationBuilder
     * @instance
     * @param {Object} references of the element from PNR Response
     * @returns {Array.<Association>} Array of Association Objects
     */
    AssociationBuilder.prototype.getAssociations = function(references) {
        var associations = [];
        if (references) {
            if (references.length > 0) {
                for (var i = 0; i < references.length; i++) {
                    associations.push(createAssociationobj(references[i]));
                }
            } else {
                associations.push(createAssociationobj(references));
            }
        }
        return associations;
    };

    /**
     * Creates Associationobj
     *
     * @memberof AssociationBuilder
     * @inner
     * @param {Object} reference Object from PNR response
     * @returns {Association} Association Obj after setting Tatoo Number and Qualifier
     */
    function createAssociationobj(reference) {
        var associationsObj = new Association();
        associationsObj.Qualifier = reference.qualifier;
        associationsObj.TatooNumber = reference.number;
        return associationsObj;
    };

    return AssociationBuilder;

})();