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
                if ($('#rpb0W5J')[0] !== undefined){
                    getdata(1).then(function(result1){
                        console.log('1');
                        console.log(result1);
                        $('#rpb0W5J')[0].value = result1;
                        console.log($('#rpb0W5J')[0].value);
                        $('span.text').click();
                    })
                } else {
                    getdata(1).then(function(result1){
                        console.log('2');
                        console.log(result1);
                    })
                    result = '2';
                }
            }

            if (result == '2'){
                getdata(2);
                my_timer(3000).then(function(){
                    console.log('3');
                    if ($('span.zbyDdwb')[0] !== undefined){
                        $('span.zbyDdwb')[0].click();
                    }
                });

                my_timer(5000).then(function(){
                    console.log('4');
                    $('span.text')[0].click();
                });

                my_timer_checker(function(){
                    console.log('5');
                    return $('span.treeview-txt')[1] !== undefined;
                }).then(function(){
                    console.log('6');
                    for (var i = 0; i < $('span.text').length; i++){
                        if ($('span.text')[i].innerHTML === "确定"){
                            $('span.text')[i].click();
                        }
                    }
                });

                my_timer_checker(function(){
                    console.log('7');
                    if ($('span.tip-msg')[0] === undefined){
                        return false;
                    }else if ($('span.tip-msg').children('a')[0] === undefined){
                        return false;
                    }else{
                        return $('span.tip-msg').children('a')[0].innerHTML === "点击查看";
                    }
                }).then(function(){
                    console.log('8');
                    window.location.reload();
                });
            }
        });
    });
})();
// Your code here...
