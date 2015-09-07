/**
 * Created by qufan on 2015/7/27 0027.
 */
var utility = require('utility');

var urlEncode = function (s) {
    if (typeof s !== 'string') {
        throw new TypeError('not string');
    }
    s = s.replace('*', '-tSl2nWmMsagD-gEr');
    //s = urlEncode(s);
    //s = s.replace(/\-/g, '+').replace(/_/g, '/');
    s=encodeURIComponent(s);
    s = s.replace('-tSl2nWmMsagD-gEr', '*');
    return s;
};


var httpBuildQuery = function (params) {
    var query = '';
    for (var k in params) {
        var key = urlEncode(String(k));
        var value = urlEncode(String(params[k]));
        query = query + key + "=" + value + "&";
    }
    var len = query.length;
    if (len) {
        query = query.substring(0, len-1);
    }
    return query;
};


var getQueryString = function (info) {
    if(info == null){
        return '';
    }else{
        //info.sort();
        return httpBuildQuery(info);
    }

};

var getHashedValue = function (qs, time, salt) {
    var temp = qs + "&time=" + time + "&salt=" + salt;
    console.log(temp);
    temp = utility.md5(temp);
    return temp.toUpperCase();
};

var getInfoHash = function (info, time, salt) {
    var qs = getQueryString(info);
    return getHashedValue(qs, time, salt);
};

var convert = function (origin, from_charset, to_charset) {

};

var url_get_xml = function (url, time_out) {

};

exports.getInfoHash = getInfoHash;
