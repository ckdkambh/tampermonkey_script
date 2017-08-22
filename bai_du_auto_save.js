// ==UserScript==
// @name         百度云自动下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pan.baidu.com/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @require      http://code.jquery.com/jquery-latest.js
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

        getdata(4).then(function(result){
            console.log(result);
            if (result == '3' || result === '0'){
                jumpHtml();
            }

            if (result == '1'){
                if ($('#accessCode')[0] !== undefined){
                    getdata(1).then(function(result1){
                        console.log(result1);
                        $('#accessCode')[0].value = result1;
                        $('span.text').click();
                    })
                } else {
                    getdata(1).then(function(result1){
                        console.log(result1);
                    })
                    result = '2';
                }
            }

            if (result == '2'){
                getdata(2);
                my_timer(3000).then(function(){
                    if ($('span.zbyDdwb')[0] !== undefined){
                        $('span.zbyDdwb')[0].click();
                    }
                });

                my_timer(5000).then(function(){
                    $('span.text')[0].click();
                });

                my_timer_checker(function(){
                    return $('span.treeview-txt')[1] !== undefined;
                }).then(function(){
                    if ($('span.zbyDdwb')[0] !== undefined){
                        $('span.text')[24].click();
                    } else {
                        $('span.text')[7].click();
                    }
                });

                my_timer_checker(function(){
                    if ($('span.tip-msg')[0] === undefined){
                        return false;
                    }else if ($('span.tip-msg').children('a')[0] === undefined){
                        return false;
                    }else{
                        return $('span.tip-msg').children('a')[0].innerHTML === "点击查看";
                    }
                }).then(function(){
                    window.location.reload();
                });
            }
        });
    });
})();
// Your code here...
