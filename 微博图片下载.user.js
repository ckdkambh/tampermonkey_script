// ==UserScript==
// @name         微博图片下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://weibo.com/*
// @match        http://www.weibo.com/*
// @grant        GM_setClipboard  
// @grant        GM_addStyle
// @require    http://code.jquery.com/jquery-1.11.0.min.js  
// ==/UserScript==
/* jshint -W097 */
'use strict';
/*
左上角是选项，单击选择执行另外的选项，双击执行当前的选项
输出到剪切板
*/
var videoLinkSet = new Set(); 
(function(){
    jQuery(document).ready(function() {
        var setList1 = $('.gn_set');
        setList1.append('<div class="gn_set_list">'+
                        '<select id="mode_choose">'+
                        '<option name="mode_choose" value="none" checked>请选择</option>'+
                        '<option name="mode_choose" value="img">图片</option>'+
                        '<option name="mode_choose" value="video">视频</option>'+
                        '</select>'+
                        '</div>');

        GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:50%; height:auto; border:0; margin:0;background-color:#ffff00;}'+
                    '.TMbtn{position:fixed; opacity:0.6; height:50px; width:15px; border-width:2px 4px 2px 0px; border-color:#ffff00; border-radius:0 5px 5px 0; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:0;} '+
                    '.TMbtn:hover{width:25px; opacity:1;} '+
                    '.TMbtnLeft{opacity:0.6; border-width:2px 4px 2px 0px; border-color:#ffff00; border-radius:0 5px 5px 0; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:0;} '+
                    '.TMbtnLeft:hover{width:25px; opacity:1;} ');

        var imgSearch = function(){
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
            return linkList;
        };

        var videoSearch = function(){
            var videoList = $('video');
            var linkList = new Array();
            for(var i = 0; i < videoList.length; i++){
                linkList.push(videoList[i].getAttribute('src'));
            }
            linkList = linkList.filter(function(x){
                return x != null && x != "";
            });
            return linkList;
        };

        var processStart = function(){
            var val=$('#mode_choose').val();
            if (val == 'img'){
                linkList = imgSearch();
            }else if(val == 'video'){
                linkList = videoLinkSet;
            }
            else{
                return;
            }
            var linkString='';
            var linkCount = 0;
            for(var i of linkList){
                linkString = linkString + i +'\r\n ';
                linkCount++;
            }
            GM_setClipboard(linkString);
            alert('已经复制'+linkCount+'条连接进入剪切板');
        };

        $('#mode_choose').change(processStart);

        $('#mode_choose').dblclick(processStart);

        $(document).scroll(function(){
            linkList = videoSearch();
            for(var i = 0; i < linkList.length; i++){
                var oldSize = videoLinkSet.size;
                videoLinkSet.add(linkList[i]);
                if (oldSize != videoLinkSet.size){
                    console.log('发现新链接'+linkList[i]);
                }
            }
        });

        $('body').append('<div id="TManays">'+
                         ' <div id="closed_div" style="display:inline">'+
                         '  <button id="open_btn_l" class="TMbtn" style="left:0;">></button>'+
                         ' </div>'+
                         ' <div id="opened_div" style="display:none">'+
                         '  <div style="position:fixed; left:0;width:120px;height:50px;background-color:#ffff00;">'+
                         '   <div style="width:100px;">'+
                         '    <div style="margin:5px;">'+
                         '     <label><input type="radio" name="mode_choose" value="1" checked>图片</label>'+
                         '     <label><input type="radio" name="mode_choose" value="2">视频</label>'+    
                         '    </div>'+
                         '    <div style="margin:5px;">'+
                         '     <p align="center">'+
                         '       <button id="start_btn_l">开始</button>'+
                         '     </p>'+
                         '    </div>'+
                         '   </div>'+
                         '   <div style="position:absolute; right:0;top:0;width:20px;">'+
                         '    <button id="close_btn_l" class="TMbtnLeft" style="width:20px;height:50px; border:0; margin:0;"><</button>'+
                         '   </div>'+
                         '  </div>'+
                         ' </div>'+
                         '</div>');
        $('#open_btn_l').click(function(){
            $('#closed_div')[0].style.display = "none";
            $('#opened_div')[0].style.display = "inline";
        });

        $('#close_btn_l').click(function(){
            $('#closed_div')[0].style.display = "inline";
            $('#opened_div')[0].style.display = "none";
        });
    });
})();

// Your code here...
