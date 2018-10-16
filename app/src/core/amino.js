module.exports = {
    marshalJSON(key, message) {
        return {
            "type": key,
            "value": message
        }
    }
};