// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async(event, context) => {
  var mess = {};
  try {
    var obimg = {};
    obimg.src = event.img;
    obimg.content=event.content;
    const userdata = await db.collection('AI-user').where({
      _id: event.userInfo.openId + event.type
    }).update({
      data: {
        ocrlist: _.push(obimg)
      }
    });
    
    mess.code = 0;
  } catch (e) {
    console.log(e);
    mess.code = -1;
    mess.err = e;
  }
  return mess;
}