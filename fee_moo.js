// ==UserScript==
// @name         飞猫下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.feemoo.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @require    http://127.0.0.1:8080/jquery-3.1.1.js  
// ==/UserScript==
/* jshint -W097 */
'use strict';
var cmdList = [];
var tik = 0;
(function(){
    jQuery(document).ready(function() {
        $('body').before('<textarea id="input_box_l" rows="3" cols="20">'+
                         '</textarea>');
        $('body').before('<button id="start_l">'+
                         '开始'+
                         '</button>');
        $('body').before('<label id="log_l">'+
                         '总共0个, 完成0个'+
                         '</label>');
        $('body').before('<button id="front_l">'+
                         '上一个'+
                         '</button>');
        $('body').before('<button id="next_l">'+
                         '下一个'+
                         '</button>');

        $('#start_l').click(()=>{
            var word_list = $("#input_box_l")[0].value.split("\n");
            word_list = word_list.filter((x)=>{
                return x.startsWith("vip_downvip_down");
            });
            word_list.forEach((x)=>{
                console.log(x);
            });
            cmdList = word_list;
            tik = 0;

            $('#log_l').html("总共"+cmdList.length+"个, 当前准备完成"+(tik+1)+"个");
            $("#start_l").attr({"disabled":"disabled"});
        });

        $('#next_l').click(()=>{
            if (tik<cmdList.length){
                setTimeout(cmdList[tik]);
                $('#log_l').html("总共"+cmdList.length+"个, 当前准备完成"+(tik+1)+"个");
                tik++;
            }
        });

        $('#front_l').click(()=>{
            if (tik>0){
                tik--;
                setTimeout(cmdList[tik]);
                $('#log_l').html("总共"+cmdList.length+"个, 当前准备完成"+(tik+1)+"个");
            }
        });
    });
})();

// Your code here...
