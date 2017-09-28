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
       // $('#__QQCP_RIGHT_Div').remove();
        //$('#__QQCP_LEFT_Div').remove();
       // $('#__mhcm_r_b_4468').remove();

        console.log('1234');
        var c_n = $('body').children();
        console.log('%o', c_n);
        c_n.map((x)=>{
            console.log('%o', c_n[x]);
            console.log('checking %s', c_n[x].id);
            if(c_n[x].id !== 'wrapper')
            {
                c_n[x].remove();
            }
        });

        $('div.card-header').append('<button id="start_l">'+
                                    '开始'+
                                    '</button>');

        $('#start_l').click(()=>{
            console.log("#########");
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
                        continue;
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
    });
})();

// Your code here...
