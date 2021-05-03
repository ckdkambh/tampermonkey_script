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
    var url = "http://192.168.0.108:8070/";
    jQuery(document).ready(function() {
        var my_timer = function(length){
            return new Promise(function (resolve, reject) {
                setTimeout(resolve, length);
            });
        };

        var my_timer_checker = function(fun){
            console.log('my_timer_checker start');
            return new Promise(function (resolve, reject) {
                var loop = function(){
                    my_timer(1000).then(function(){
                        if (!fun()){
                            loop();
                        }else{
                            console.log('my_timer_checker stop');
                            resolve();
                        }
                    });
                };
                loop();
            });
        };
        var getdata = function (context) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({method:'GET',
                                   url:url + context,
                                   onload : function (response) {
                                       resolve(response.responseText);
                                   }});
            });
        };

        my_timer_checker(function(){
            var linkString = $('video')[0].getAttribute('src');
            return linkString !== null;
        }).then(function(){
            var linkString = $('video')[0].getAttribute('src');
            linkString = "http:" + linkString;
            console.log('%s', linkString);

            getdata('++++'+linkString+'----').then(function(result){
                console.log(result);
                window.opener=null;
                window.open('','_self');
                window.close();
            });
        });

        //alert('已经复制');
        //GM_setClipboard(linkString);
    });

})();
