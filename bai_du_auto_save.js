// ==UserScript==
// @name         百度云自动下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pan.baidu.com/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @require      http://127.0.0.1:8070/jquery-3.1.1.js
// @run-at document-end
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function(){
    jQuery(document).ready(function() {
        var getdata = function (step) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({method:'GET',
                                   url:'http://127.0.0.1:8070/'+step,
                                   onload : function (response) {
                                       resolve(response.responseText);
                                   }});
            });
        };
        var jumpHtml = function(){
            getdata(0).then(function(result1){
                console.log(result1);
                window.location.href=result1;
            })
        };
        getdata(4).then(function(result){
            console.log(result);
            if (result == '3' || result === '0'){
                jumpHtml();
            }else if (result == '1'){
                getdata(1).then(function(result1){
                    console.log(result1);
                    $('#accessCode')[0].value = result1;
                    $('span.text').click();
                })
            }else if (result == '2'){
                setTimeout("if ($('span.zbyDdwb')[0] !== undefined) $('span.zbyDdwb')[0].click();",4000);
                setTimeout("$('span.text')[0].click();",5000);
                getdata(2);
                setTimeout("$('span.zbyDdwb')[0] !== undefined ? $('span.text')[18].click() : $('span.text')[7].click();",10000);
                setTimeout("window.location.reload();",15000);
            }
        });
    });
})();
// Your code here...
