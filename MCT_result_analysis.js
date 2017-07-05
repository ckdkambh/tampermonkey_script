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
var isIni = true;
var selectedEle = null;
(function() {
    'use strict';
    jQuery(document).ready(function() {
        GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:50%; height:auto; border:0; margin:0;background-color:#ffff00;}'+
                    '.TMbtn{position:fixed; opacity:0.6; height:50px; width:15px; border-width:2px 4px 2px 0px; border-color:#ffff00; border-radius:0 5px 5px 0; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:0;} '+
                    '.TMbtn:hover{width:25px; opacity:1;} '+
                    '.TMbtnLeft{opacity:0.6; border-width:2px 4px 2px 0px; border-color:#ffff00; border-radius:0 5px 5px 0; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:0;} '+
                    '.TMbtnLeft:hover{width:25px; opacity:1;} '+
                    'defaultl { background:lightblue; color:black }');

        $('body').append('<div id="TManays">'+
                         ' <div id="closed_div" style="display:inline">'+
                         '  <button id="open_btn_l" class="TMbtn" style="left:0;">></button>'+
                         ' </div>'+
                         ' <div id="opened_div" style="display:none">'+
                         '  <div style="position:fixed; left:0;width:120px;height:50px;background-color:#ffff00;">'+
                         '   <div style="width:100px;background-color:#ffff00;">'+
                         '    <div style="margin:5px;">'+
                         '     <label><input type="checkbox" name="mode_choose_l" value="S1AP">S1AP</label><br />'+
                         '     <label><input type="checkbox" name="mode_choose_l" value="X2AP">X2AP</label><br />'+
                         '     <label><input type="checkbox" name="mode_choose_l" value="RRC">RRC</label><br />'+
                         '     <label><input type="checkbox" name="mode_choose_l" value="BBMC">BBMC</label><br />'+
                         '     <label><input type="checkbox" name="mode_choose_l" value="NAS">NAS</label>'+
                         '    </div>'+
                         '    <div style="margin:5px;">'+
                         '     <p align="center">'+
                         '       <button id="runAnalysis">开始过滤</button><br />'+
                         '       <button id="clearChooseMode">清除筛选</button>'+
                         '     </p>'+
                         '    </div>'+
                         '   </div>'+
                         '   <div style="position:absolute; right:0;top:0;width:20px;">'+
                         '    <button id="close_btn_l" class="TMbtnLeft" style="width:20px;height:50px; border:0; margin:0;"><</button>'+
                         '   </div>'+
                         '  </div>'+
                         ' </div>'+
                         '</div>');

        $('body').append('<div id="filter_div" style="display:none;white-space:pre;margin:0 5 0 5;">'+
                         '</div>');

        var padString = function(oldString, tarLength){
            if (oldString.length >= tarLength){
                return oldString;
            }
            var padStr = new Array(tarLength-oldString.length).join(" ");
            return oldString+padStr;
        };

        var protocolAnalysis = function(bodyString){
            try{
                var txtInLines = bodyString.split("\n");
                var title = (txtInLines[1].split("\""))[1];
                var firstKind, secondKind, j = 0;
                for (var i = 2; i < txtInLines.length; i++){
                    txtInLines[i] = txtInLines[i].trim();
                    if (txtInLines[i].indexOf("#") === 0){
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
                            }else if (txtInLines[i].indexOf("RRC-") != -1){
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
                title = padString(firstKind,20)+":"+padString(secondKind,50)+"||"+padString(title,60);
                return title;
            }
            catch (err){
                return '!@#';
            }
        };

        var funAnalysis = function(){
            var divList = $('div.default');
            for (var i = 1; i < divList.length; i++){
                var oldHtml = divList[i].innerHTML;
                var title = protocolAnalysis(divList[i].innerHTML);
                divList[i].innerHTML =
                    '<div class="combine_l">'+
                    '<div class="defaultl title_l">'+
                    title+
                    '</div>'+
                    '<div class="defaultl body_l" style="display:none;">'+
                    oldHtml+
                    '</div>'+
                    '</div>'+
                    '</div>';
            }
        };

        var isChoosed = function(chechedList, keyWord){
            for (var i = 0; i < chechedList.length; i++){
                if (keyWord.indexOf(chechedList[i].value) != -1){
                    return true;
                }
            }
            return false;
        };

        var cleanFilterDiv = function(){
            $('#filter_div').children().remove(".default");
        };

        $('#runAnalysis').click(function(){
            if (isIni){
                document.body.style.backgroundColor = 'lightblue';
                console.log("init");
                funAnalysis();
                isIni = false;
                $('.title_l').click(function(){
                    if (selectedEle !== null)
                        selectedEle.css( 'background','lightblue');
                    selectedEle = $(this).parent(".combine_l");
                    selectedEle.css( 'background','Moccasin');
                    var bodyElem = $(this).parent(".combine_l").children(".body_l");
                    if (bodyElem[0].style.display == 'none')
                        bodyElem[0].style.display = 'block';
                    else
                        bodyElem[0].style.display = 'none';
                });
            }
            cleanFilterDiv();
            var chechedList = $('input:checkbox[name="mode_choose_l"]:checked');
            var divList = $('.default');
            for (var i = 1; i < divList.length; i++){
                var keyWord = ($(divList[i]).find(".title_l")[0].innerText.split(":"))[0];
                if (isChoosed(chechedList, keyWord)){
                    $(divList[i]).clone(true).css('margin', '5px').appendTo("#filter_div");
                }
                $('#filter_div').css('display','block');
                $('pre').css('display','none');
            }
        });

        $('#clearChooseMode').click(function(){
            if (isIni){
                document.body.style.backgroundColor = 'lightblue';
                console.log("init");
                funAnalysis();
                isIni = false;
                $('.title_l').click(function(){
                    if (selectedEle !== null)
                        selectedEle.css( 'background','lightblue');
                    selectedEle = $(this).parent(".combine_l");
                    selectedEle.css( 'background','Moccasin');
                    var bodyElem = $(this).parent(".combine_l").children(".body_l");
                    if (bodyElem[0].style.display == 'none')
                        bodyElem[0].style.display = 'block';
                    else
                        bodyElem[0].style.display = 'none';
                });
            }
            cleanFilterDiv();
            var divList = $('.default');
            $('#filter_div').css('display','none');
            $('pre').css('display','block');
        });

        $('#open_btn_l').click(function(){
            $('#closed_div')[0].style.display = "none";
            $('#opened_div')[0].style.display = "inline";
        });

        $('#close_btn_l').click(function(){
            $('#closed_div')[0].style.display = "inline";
            $('#opened_div')[0].style.display = "none";
        });

    });
    // Your code here...
})();
