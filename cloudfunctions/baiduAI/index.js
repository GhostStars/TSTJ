// 云函数入口文件
const cloud = require('wx-server-sdk')
var superagent = require('superagent')


cloud.init()

var AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;

// 设置APPID/AK/SK
var APP_ID = "";
var API_KEY = "";
var SECRET_KEY = "";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);



// 云函数入口函数
exports.main = async (event, context) => {


  let first = event.img.indexOf('.');
  let end = event.img.indexOf('/', first);
  let httpsrc = 'http://' + event.img.slice(first + 1, end) + '.tcb.qcloud.la/' + event.img.slice(end + 1, event.img.length);
  console.log(httpsrc);


  var image = await new Promise(async function (resolve, reject) {
    const url = httpsrc;
    await superagent.get(url).buffer(true).parse((res) => {
      let buffer = [];
      res.on('data', (chunk) => {
        buffer.push(chunk);
      });
      res.on('end', () => {
        const data = Buffer.concat(buffer);
        const base64Img = data.toString('base64');
        resolve(base64Img)
      });
    });
  })


  if (event.type == "plant") {
    return new Promise(function (resolve, reject) {
      client.plantDetect(image).then(function (result) {
        resolve(result.result);
      }).catch(function (err) {
        reject(err);
        return;
      });

    });
  }
  else if (event.type == "animal") {
    return new Promise(function (resolve, reject) {
      client.animalDetect(image).then(function (result) {
        resolve(result.result);
      }).catch(function (err) {
        reject(err);
        return;
      });

    });
  }
  else if (event.type == "fav") {
    return new Promise(function (resolve, reject) {
      client.ingredient(image).then(function (result) {
        resolve(result.result);
      }).catch(function (err) {
        reject(err);
        return;
      });

    });
  }
  else if (event.type == "food") {
    return new Promise(function (resolve, reject) {
      client.dishDetect(image).then(function (result) {
        resolve(result.result);
      }).catch(function (err) {
        reject(err);
        return;
      });

    });
  }
  else if (event.type == "landmark") {
    return new Promise(function (resolve, reject) {
      client.landmark(image).then(function (result) {
        resolve(result.result);
      }).catch(function (err) {
        reject(err);
        return;
      });

    });
  }
  else if (event.type == "logo") {
    return new Promise(function (resolve, reject) {
      client.logoSearch(image).then(function (result) {
        resolve(result.result);
      }).catch(function (err) {
        reject(err);
        return;
      });

    });
  }
  else if (event.type == "general") {
    return new Promise(function (resolve, reject) {
      client.advancedGeneral(image).then(function (result) {
        resolve(result.result);
      }).catch(function (err) {
        reject(err);
        return;
      });

    });
  }
}