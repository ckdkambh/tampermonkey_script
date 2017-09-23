// ==UserScript==
// @name         秀人网
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.xiuren8.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @require    http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
(function(){
    jQuery(document).ready(function() {
        linkString = '';
        linkCount = 0;
        $("body").append('<div id="myDiv" style="display:none;"></div>');
        var partList = $("a.product-title");
        for (var i = 0; i < partList.length; i++){
            var htmlobj=$.ajax({url:partList[i]["href"],async:false});
            $("#myDiv").html(htmlobj.responseText);
            var downLink;
            try{
                downLink = $($("#myDiv pre pre")[0])[0].innerHTML;
            }catch(e){
                try{
                    downLink = $($("#myDiv pre")[0])[0].innerHTML;
                }
                catch(e){
                    console.log('%o', partList[i].innerHTML);
                }
            }
            console.log(downLink);
            linkString += (downLink+'\n');
            linkCount++;
            $("#myDiv").html('');
        }
        GM_setClipboard(linkString);
        console.log('已经复制'+linkCount+'条连接进入剪切板');
    });
})();

// Your code here...
