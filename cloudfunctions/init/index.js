const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  var mess = {};
  
    const userdata = (await db.collection('AI-user').where({
      _id: event.userInfo.openId+event.type
    }).get()).data;
    if (userdata.length != 0) {
      mess.list = userdata[0].ocrlist;
      mess.code = 0;
    }
    else {
      await db.collection('AI-user').add({
        data: {
          _id: event.userInfo.openId+this.event.type,
          ocrlist: []
        }
      });
      mess.list = [];
      mess.code = 0;
    }
  return mess;
  }
  
 
