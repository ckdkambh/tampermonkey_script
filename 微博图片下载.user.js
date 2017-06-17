// ==UserScript==
// @name         微博图片下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://weibo.com/*
// @match        http://www.weibo.com/*
// @grant        none  
// @require    http://code.jquery.com/jquery-1.11.0.min.js  
// @require    http://www.dayanmei.com/js/zeroclipboard/ZeroClipboard.min.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
(function(){
    jQuery(document).ready(function() {
        var setList1 = $('.gn_set');
        setList1.append('<div class="gn_set_list"><button id="getImgBtn">获取图片</button><div>')
        
        var setList2 = $('#pl_common_top');
        setList2.append('<div class="gn_set_list"><textarea id="mycontainer" rows="2" cols="40"></textarea><div>')

        $('#getImgBtn').click(function(){
            var imgList = $('img');
            var linkList = new Array();
            for(var i = 0; i < imgList.length; i++){
                linkList.push(imgList[i].getAttribute('src'));
            }
            linkList = linkList.filter(function(x){
                return x.indexOf('thumb150') != -1;
            });
            linkList = linkList.map(function(x){
                if(x.indexOf('thumb150') != -1){
                    return x.replace('thumb150', 'large');
                }
                else{
                    return '';
                }
            });
            document.getElementById('mycontainer').value='';
            for(var i = 0; i < linkList.length; i++){
                document.getElementById('mycontainer').value = document.getElementById('mycontainer').value + linkList[i]+'\n';
            }
            alert('已经选中'+linkList.length+'条连接，按Ctrl+V复制连接');
            document.getElementById('mycontainer').focus();
            document.getElementById('mycontainer').select();
            console.log(document.getElementById('mycontainer').value);
        });

    });
})();

// Your code here...