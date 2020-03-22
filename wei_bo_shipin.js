// ==UserScript==
// @name         微博图片下载tv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://weibo.com/tv*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require     http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function() {
    'use strict';
    jQuery(document).ready(function() {
        var linkString = $('video')[0].getAttribute('src');
        linkString = "http:" + linkString;
        console.log('%s', linkString);
        var getdata = function (context) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({method:'GET',
                                   url:'http://192.168.31.40:8070/'+context,
                                   onload : function (response) {
                                       resolve(response.responseText);
                                   }});
            });
        };
        getdata('++++'+linkString+'----').then(function(result){
            console.log(result);
            window.opener=null;
            window.open('','_self');
            window.close();
        });
        //alert('已经复制');
        //GM_setClipboard(linkString);
    });

})();
