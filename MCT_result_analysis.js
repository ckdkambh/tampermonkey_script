// ==UserScript==
// @name         MCT result analysis
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tgfweb.lmera.ericsson.se/executions/*
// @grant        GM_addStyle
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery(document).ready(function() {
        GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:0px; height:auto; border:0; margin:0;}'+
                    '.TMbtn{position:fixed; left:0; opacity:0.6; height:50px; border-width:2px 4px 2px 0px; border-color:#ffff00; border-radius:0 5px 5px 0; background-color:#ffff00; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:0;} ');

        document.body.style.backgroundColor = 'lightblue';
        var div=document.createElement("div");
        div.innerHTML='<div id="TManays">'+
            '<button id="runAnalysis" class="TMbtn">run</button>'+
            '</div>';
        document.body.appendChild(div);

        var protocolAnalysis = function(bodyString){
            try{
                var txtInLines = bodyString.split("\n");
            }
            catch (err){
                return '';
            }
            var title = (txtInLines[1].split("\""))[1];
            var firstKind, secondKind, j = 0;
            for (var i = 2; i < txtInLines.length; i++){
                txtInLines[i] = txtInLines[i].trim();
                if (txtInLines[i].indexOf("#") == 0){
                    j++;
                    if (j == 1){
                        if (txtInLines[i].indexOf("nas") != -1){
                            firstKind = 'NAS';
                            secondKind = (txtInLines[i].split("{"))[0].substring(1);
                            break;
                        }else if (txtInLines[i].indexOf("BBMC_") != -1){
                            firstKind = 'BBMC';
                            secondKind = (txtInLines[i].split("\'"))[1];
                            break;
                        }else if (txtInLines[i].indexOf("NC_") != -1){
                            firstKind = 'NC';
                            secondKind = (txtInLines[i].split("\'"))[1];
                            break;
                        }else if (txtInLines[i].indexOf("RRC") != -1){
                            firstKind = 'RRC';
                        }else if (txtInLines[i].indexOf("X2AP") != -1){
                            firstKind = 'X2AP';
                        }else if (txtInLines[i].indexOf("S1AP") != -1){
                            firstKind = 'S1AP';
                        }else{
                            firstKind = '';
                            secondKind = (txtInLines[i].split("\'"))[1];
                            break;
                        }
                    }else{
                        secondKind = (txtInLines[i].split("\'"))[1];
                        break;
                    }
                }
            }
            title = firstKind+":"+secondKind+"||"+title;
            return title;

        };

        var funAnalysis = function(){
            var divList = $('div.default');
            for (var i = 1; i < divList.length; i++){
                var oldHtml = divList[i].innerHTML;
                var title = protocolAnalysis(divList[i].innerHTML);
                divList[i].innerHTML = '<div class="default title_l">'+
                    title+
                    '<div class="default body_l" style="display:none;">'+
                    oldHtml+      
                    '</div>'+
                    '</div>';  
            }
        };

        funAnalysis();

        $('#runAnalysis').click(function(){
            console.log('1111');
        });
        
        $('.title_l').click(function(){
            var bodyElem = this.getElementsByClassName("body_l");
            if (bodyElem[0].style.display == 'none')
                bodyElem[0].style.display = 'block';
            else
                bodyElem[0].style.display = 'none';
        });
        
        
    });
    // Your code here...
})();
