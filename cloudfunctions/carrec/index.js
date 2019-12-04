
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init();

const tencentcloud = require("tencentcloud-sdk-nodejs");
const TiiaClient = tencentcloud.tiia.v20190529.Client;
const models = tencentcloud.tiia.v20190529.Models;


const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;


let cred = new Credential("", "");
let httpProfile = new HttpProfile();
httpProfile.endpoint = "tiia.tencentcloudapi.com";

let clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;
let client = new TiiaClient(cred, "ap-beijing", clientProfile);
let req = new models.RecognizeCarRequest();


exports.main = async (event, context) => {
  
  let first = event.img.indexOf('.');
  let end = event.img.indexOf('/', first);
  let httpsrc = 'https://' + event.img.slice(first + 1, end) + '.tcb.qcloud.la/' + event.img.slice(end + 1, event.img.length);

  
  let params = '{"ImageUrl":"'+httpsrc+'"}'
  req.from_json_string(params);

 
    return new Promise(function (resolve, reject) {
      client.RecognizeCar(req, function (errMsg, response) {
        if (errMsg) {

          reject(errMsg);
          return;
        }
        resolve(response.CarTags);
      });
    });
  
  
}