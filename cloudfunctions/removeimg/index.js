const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  var mess = {};
  try {
    const userdata = await db.collection('AI-user').where({
      _id: event.userInfo.openId+event.type
    }).update({
      data: {
        ocrlist: _.pull({
          src: event.img
        })
      }
    });
    await cloud.deleteFile({
      fileList: [event.img]
    })
    mess.code = 0;
  }
  catch (e) {
    console.log(e);
    mess.code = -1;
    mess.err = e;
  }
  return mess;
}