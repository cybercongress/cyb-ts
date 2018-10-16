module.exports = {

     sortObjectKeys(obj) {
        let sort = function (obj) {
            let tmp = {};
            Object.keys(obj).sort().forEach(function (k) {
                if (Array.isArray(obj[k])) {
                    let p = [];
                    obj[k].forEach(function (item) {
                        if (item != null && typeof(item) === "object") {
                            p.push(sort(item));
                        } else {
                            p.push(item);
                        }
                    });
                    tmp[k] = p;
                } else if (obj[k] != null && typeof(obj[k]) === "object") {
                    tmp[k] = sort(obj[k]);
                } else if (obj[k] != null && typeof(obj[k]) === "function") {
                    tmp[k] = eval(obj[k].toString())
                } else {
                    tmp[k] = new String(obj[k]).toString();
                }
            });
            return tmp;
        };
        return sort(obj)
    },

    isEmpty(obj) {
        switch (typeof obj) {
            case "undefined": {
                return true
            }
            case "string": {
                return obj.length === 0
            }
            case "number": {
                return obj === 0
            }
            case "object": {
                if (obj == null) {
                    return true
                } else if (Array.isArray(obj)) {
                    return obj.length === 0
                } else {
                    return Object.keys(obj).length === 0
                }
            }
        }
    },

    toString(str) {
        if (typeof str === "number") {
            return str + ""
        } else if (this.isEmpty(str)) {
            return ""
        } else {
            return str.toString()
        }
    }
};