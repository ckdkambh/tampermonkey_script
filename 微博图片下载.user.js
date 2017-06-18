// ==UserScript==
// @name         微博图片下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://weibo.com/*
// @match        http://www.weibo.com/*
// @grant        GM_setClipboard  
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

    });
})();

// Your code here...