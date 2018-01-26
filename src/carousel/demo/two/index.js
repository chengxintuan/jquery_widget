const fs = require('fs');
const path = require('path');
const express = require('express');

const rootPath = path.join(__dirname, '../../../../');
const viewsPath = path.join(rootPath, 'src/carousel/demo/two');
const staticPath = path.join(rootPath, '/src/static');

const app = express();

app.use(express.static(staticPath));
app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    getSyncFn(function (imgArr) {
        res.render('index', {
            'title': '走马灯',
            'imgArr': imgArr
        });
    });
});

// 使用同步的node读取文件状态的方法
function getImgFile(callback) {
    const carouselPath = path.join(staticPath, 'image/carousel');
    const imgArr = [];

    fs.readdir(carouselPath, function (err, files) {
        if (err) {
            console.log('文件夹没有图片!!!');
            return;
        }

        for (var i = 0; i < files.length; i++) {
            var stats = fs.statSync(path.join(carouselPath, files[i]));

            if (stats.isFile()) {
                imgArr.push('image/carousel/' + files[i]);
            }
        }

        callback(imgArr);
    })
}

// 强行将异步的方法转换成同步的方法
function getSyncFn(callback) {
    const carouselPath = path.join(staticPath, 'image/carousel');
    const imgArr = [];

    fs.readdir(carouselPath, function (err, files) {
        if (err) {
            console.log('文件夹没有图片!!!');
            return;
        }

        (function iteerator(i) {
            if (i === files.length) {
                callback(imgArr);
                return;
            }

            fs.stat(path.join(carouselPath, files[i]), function (err, stats) {
                if (err) {
                    console.log('找不到这张图片!!!');
                    return;
                }

                if (stats.isFile()) {
                    imgArr.push('image/carousel/' + files[i]);
                }

                iteerator(i + 1);
            });
        })(0)
    })
}

app.listen(4000);
