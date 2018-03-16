var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
var iconv = require('iconv-lite');//这个模块能解决写文件乱码的问题
var schedule = require('node-schedule');

function Page() { }
Object.assign(Page.prototype, {
    init: function () {
        schedule.scheduleJob('*/1 * * * * *', function () {  //每秒钟执行某个任务
            console.log(new Date().toLocaleString());
            http.get('http://news.baidu.com/', function (res) {
                if (res.statusCode = '200') {
                    var html = '';
                    res.on('data', function (data) {
                        html += data;
                    })
                    res.on('end', function () {
                        var $ = cheerio.load(html);
                        var result = [];
                        var list = $('.mod-tab-content .focuslistnews li a');
                        for (var i = 0; i < list.length; i++) {
                            var item = list.eq(i);
                            result.push({
                                title: item.text(),
                                href: item.attr('href')
                            })
                        }
                        result = JSON.stringify(result);
                        var buf = new Buffer(result);
                        var str = iconv.decode(buf,'utf8');   
                        fs.writeFile('data.json', str, function (err) {
                            if (err) {
                                console.log('错误为：' + err);
                            } else {
                                console.log('  成功！！！  ')
                            }
                        })
                    })
                }
            })
        });
    }
})
var page = new Page();
page.init();
