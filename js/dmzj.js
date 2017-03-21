var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var path = require('path');
var base_path = require('../base').base_path;
var _ = require('underscore');
var async = require('async')
var fsWriteFileSync = require('./util').fsWriteFileSync;
var startRequest = require('./util').startRequest;
var util = require('util');
var data_path = base_path + '/data/';
var html_path = base_path + '/html/';
var txt_path = base_path + '/txt/';

function load_detail_page(url) {
    var index = url.indexOf('.com');
    var domain_name = url.substring(0, index + 4)
    async.waterfall([
        function (cb) {
            startRequest(url, cb)
        },
        function (data, cb) {
            var $ = cheerio.load(data);
            var title = $('.novel_t').text();
            var str = title.replace(/(\n)+|(\r\n)+/g, "");
            str = str.replace(/\ +/g, "");
            var pages_url = count_pages($);
            var file_path = data_path + str + '.txt';
            fsWriteFileSync(file_path);
            savedContentDetailSync($, str);
            async.timesSeries(pages_url.length, function (n, next) {
                var url = domain_name + pages_url[n];
                console.log(url);
                startRequest(url, function (err, data) {
                    if (err) {
                        next(err)
                    } else {
                        var $ = cheerio.load(data);
                        savedContentDetailSync($, str);
                        setTimeout(function () {
                            next(null, null)
                        }, 3000)
                    }
                })
            }, cb)
        }
    ], function (err, result) {
        console.log(result)
    })
}

function savedContentDetailSync($, news_title, cb) {
    $(".novel_text p").each(function (index1, item1) {
        var str = '\n';
        str += $(item1).text();
        fs.appendFileSync(data_path + news_title + '.txt', str, 'utf-8');
    })
}

function count_pages($) {
    var item_data = {};
    var pages_obj = $('.pages .font14black .jump_select option');
    var pages_length = pages_obj.length;
    var first_val = pages_obj.first().val().split('.');
    var arr = [];
    for (var i = 2; i <= pages_length; i++) {
        var str = first_val[0] + '_' + i + '.' + first_val[1];
        arr.push(str)
    }
    return arr
}
load_detail_page("http://xs.dmzj.com/852/2989/67675.shtml")