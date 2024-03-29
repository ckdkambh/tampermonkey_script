// ==UserScript==
// @name         微博图片下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://weibo.com/*
// @match        http://www.weibo.com/*
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require     http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
/*
左上角是选项，单击选择执行另外的选项，双击执行当前的选项
输出到剪切板
*/
var videoLinkSet = new Map();
(function(){
    var url = "http://192.168.0.108:8070/";
    jQuery(document).ready(function() {
        GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:50%; height:auto; border:0; margin:0;background-color:#ffff00;}'+
                    '.TMbtn{position:fixed; opacity:0.6; height:50px; width:15px; border-width:2px 4px 2px 0px; border-color:#ffff00; border-radius:0 5px 5px 0; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:0;} '+
                    '.TMbtn:hover{width:25px; opacity:1;} '+
                    '.TMbtnLeft{opacity:0.6; border-width:2px 4px 2px 0px; border-color:#ffff00; border-radius:0 5px 5px 0; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:0;} '+
                    '.TMbtnLeft:hover{width:25px; opacity:1;} ');

        //-------GOLOBAL VALUE--------------
        //待滚动高度
        var heightToSet = 0;
        var numOfWb = 0;
        var video_class = '.WB_video.WB_video_mini';
        var post_list;
        //----------------------------------
        var imgSearch = function(){
            var imgList = $('img');
            var linkList = new Array();
            for(var i = 0; i < imgList.length; i++){
                linkList.push(imgList[i].getAttribute('src'));
            }
            var picList = $('.WB_media_a_m9');
            for (i = 0; i < picList.length; i++) {
                var firstIndex = picList[i].getAttribute('action-data').indexOf('picSrc=') + 'picSrc='.length;
                var lastIndex = picList[i].getAttribute('action-data').indexOf('&uid=');
                console.log('%s', picList[i].getAttribute('action-data').substring(firstIndex, lastIndex).replace(/&thumb_picSrc=/g, ","));
                picList[i].getAttribute('action-data').substring(firstIndex, lastIndex).replace(/&thumb_picSrc=/g, ",").split(',').map(function(x){
                    linkList.push("http:"+x.replace(/%2F/g, "/"));

                    return "";
                })
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

            linkList = linkList.map(function(x){
                return x.startsWith('http') ? x : 'http:'+x;
            });
            console.log('imgSearch:%O', linkList)
            return linkList;
        };

        var videoSearch = function(){
            var curWb = post_list[numOfWb];
            var videoList = $(curWb).find('video');
            var resultList = new Array();
            for(var i = 0; i < videoList.length; i++){
                var videoLinkGet = videoList[i].getAttribute('src');
                if (videoLinkGet !== null && videoLinkGet !== "")
                {
                    var dateGet = $($($(videoList[i]).parents('.WB_detail')[0]).find('.WB_from.S_txt2')[0]).find('a')[0].innerText;
                    dateGet = dateGet.replace('\n','').replace(/\s/g,'');
                    var txtGet = $($(videoList[i]).parents('.WB_detail')[0]).find('.WB_text.W_f14')[0].innerText;
                    txtGet = txtGet.replace('\n','').replace(/\s/g,'');
                    var text = dateGet + txtGet;
                    //innerText.replace('\n','').replace(/\s/g,'').substring(0, 60)
                    var outLink = videoLinkGet.startsWith('http:') ? videoLinkGet : 'http:' + videoLinkGet;
                    //if (outLink.startsWith('http:blob:')) {
                    //    outLink = outLink.substr('http:blob:'.length);
                    //    console.log('outLink:%s', outLink)
                    //}
                    resultList.push({link:outLink, text:text});
                }
            }
            return resultList;
        };

        var processStart = function(){
            var val=$('input:radio[name="mode_choose_l"]:checked').val();
            var linkString='';
            var linkCount = 0;
            var linkList;

            if (val == 1){
                linkList = imgSearch();
            }else{
                linkList = videoLinkSet;
            }
            linkList.forEach(function (value, key, map) {
                linkString = linkString + key +'\r\n'+ value +'\r\n';
                linkCount++;
            });
            GM_setClipboard(linkString);
            alert('已经复制'+linkCount+'条连接进入剪切板');
        };


        var videoLinkRecorder = function(){
            var linkList = videoSearch();
            console.log(linkList);
            for(var i = 0; i < linkList.length; i++){
                var oldSize = videoLinkSet.size;
                videoLinkSet.set(linkList[i]['link'], linkList[i]['text']);
                if (oldSize != videoLinkSet.size){
                    console.log('发现新链接'+linkList[i]['link']);
                    console.log(linkList[i]['text']);
                }
            }
        };

/*
        $(document).scroll(function(){
            console.log('monitor scroll');
            videoLinkRecorder();
        });
*/

        $('body').append('<div id="TManays">'+
                         ' <div id="closed_div" style="display:inline">'+
                         '  <button id="open_btn_l" class="TMbtn" style="left:0;">></button>'+
                         ' </div>'+
                         ' <div id="opened_div" style="display:none">'+
                         '  <div style="position:fixed; left:0;width:120px;height:50px;background-color:#ffff00;">'+
                         '   <div style="width:100px;">'+
                         '    <div style="margin:5px;">'+
                         '     <label><input type="radio" name="mode_choose_l" value="1" checked>图片</label>'+
                         '     <label><input type="radio" name="mode_choose_l" value="2">视频</label>'+
                         '    </div>'+
                         '    <div style="margin:5px;">'+
                         '     <p align="center">'+
                         '       <button id="start_btn_l">复制</button>'+
                         '       <button id="test_btn_l">解析</button>'+
                         '     </p>'+
                         '     <p align="center">'+
                         '       <button id="read_link">读取</button>'+
                         '       <button id="reset_link">清除</button>'+
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
        $('#start_btn_l').click(processStart);

        //定时检查函数，每一秒检查一次
        //局限，当前不支持传入带参数的函数
        var my_timer_checker = function(fun){
            console.log('my_timer_checker start');
            return new Promise(function (resolve, reject) {
                var loop = function(){
                    my_timer(1000).then(function(){
                        if (!fun()){
                            console.log('my_timer_checker looping...');
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

        var my_timer = function(length){
            return new Promise(function (resolve, reject) {
                setTimeout(resolve, length);
            });
        };

        var analysisWb = function(index,val,arr){
            console.log('%O', val);
            heightToSet += val.offsetTop;
            $(document).scrollTop(heightToSet);
            if ($(val).find(video_class).length !== 0)
            {
                console.log('###find a video');
            }
        };

        var getVideoLink = function(){
            var count = 0;
            if (numOfWb >= post_list.length)
            {
                console.log('analysis end');
                return;
            }
            console.log('there are %d wb left to analysis', post_list.length - numOfWb);
            var curWb = post_list[numOfWb];
            var videoProLink = $(curWb).find(video_class);
            heightToSet = curWb.offsetTop;
            $(document).scrollTop(heightToSet);
            if (videoProLink.length !== 0)
            {
                $(curWb).find('.ficon_cd_video').click();
                //$(curWb).find('.wbv-big-play-button').click();
                my_timer_checker(function(){
                    if ($(curWb).find('video').length !== 0 || count > 1)
                    {
                        return true;
                    }
                    else
                    {
//                         if ($(curWb).find('.icon_playvideo').length !== 0) {
//                             console.log('%O', $(curWb).find('.ficon_cd_video'));
//                             $(curWb).find('.ficon_cd_video').click();
//                             return true;
//                         }
                        count++;
                        console.log('%o', $(curWb));
                        return false;
                    }
                }).then(function(){
                    console.log('%O', videoProLink);
                    //console.log('!!!!!!!!%O', $(curWb).find('.W_ficon .ficon_cd_video').parents());
                    //$(curWb).find('.W_ficon .ficon_cd_video').click();
                    //$(curWb).find('.wbv-big-play-button').click();
                    videoLinkRecorder();
                    numOfWb++;
                    getVideoLink();
                });
            }
            else{
                numOfWb++;
                getVideoLink();
            }
        };

        //自动滚动点击函数
        var autoscroll = function(){
            var wbList = $('.WB_feed_detail.clearfix');
            //console.log(wbList);
            wbList.map(analysisWb);
            if ($('.layer_menu_list.W_scroll').length !== 0)
            {
                console.log('find end of the page');
                numOfWb = 0;
                heightToSet = 0;
                videoLinkSet.clear();
                post_list = $('.WB_feed_detail.clearfix');
                getVideoLink();
                return;
            }
            else
            {
                console.log('start timer to observe ');
                my_timer(2000).then(autoscroll);
            }
        };
        var getdata = function (context) {
            console.log(context);
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({method:'GET',
                                   url:url+context,
                                   onload : function (response) {
                                       resolve(response.responseText);
                                   }});
            });
        };
        $('#test_btn_l').click(function(){
            heightToSet = 0;
            autoscroll();
        });

        $('#read_link').click(function(){
            getdata('read123123123').then(function(result){
                GM_setClipboard(result);
                alert('已经复制连接进入剪切板');
            });
        });
        $('#reset_link').click(function(){
            getdata('reset123123123').then(function(result){
                GM_setClipboard(result);
                alert('已经清除服务器连接');
            });
        });


        /*
        //.WB_feed_detail.clearfix是每条微博最上层的控件，所以能引用offsetTop进行跳转
        $('#test_btn_l').click(function(){
            console.log('%O', $('.WB_feed_detail.clearfix')[numToRoll]);

            hToSet += $('.WB_feed_detail.clearfix')[numToRoll].offsetTop;
            $(document).scrollTop(hToSet);

            //console.log($($('.WB_feed_detail.clearfix')[numToRoll]).find('*'));

            if ($($('.WB_feed_detail.clearfix')[numToRoll]).find('.con-1.hv-pos').length !== 0)
            {
                console.log('find a video')

            }
            numToRoll++;
        });
*/
    });
})();

// Your code here...
