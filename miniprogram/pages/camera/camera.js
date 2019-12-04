Page({
  data: {
    type: ""
  },
  onLoad: function (options) {

    
    this.data.type = options.index;

  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    const that = this;
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.uploadImgweb(res.tempImagePath);
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  
  
  uploadImgweb(imgUrl) {
    wx.showLoading({
      title: '上传图片',
    })
    let that = this;
    wx.cloud.uploadFile({
      cloudPath: 'ocr/' + imgUrl.slice(imgUrl.length - 20, imgUrl.length),
      filePath: imgUrl,
      success: res => {
        wx.hideLoading();
        console.log(res.fileID);
        that.addimg(res.fileID);
      },
      fail: err => {
        wx.hideLoading();
        console.log("上传失败", err)
      }
    })
  },

  addimg(imgsrc) {
    wx.showLoading({
      title: '识别中',
    })
    let that = this;
    console.time('tcb');
    if (that.data.type == "car") {
      wx.cloud.callFunction({
        name: 'carrec',
        data: {

          img: imgsrc
        },
        success(aee) {
          console.timeEnd('tcb');
          console.log(aee);
          that.pushimg(aee.result, imgsrc);

        },
        fail(e) {
          console.log(e);
        }
      })
    }
    else if (that.data.type == "star") {
      wx.cloud.callFunction({
        name: 'star',
        data: {

          img: imgsrc
        },
        success(aee) {
          console.timeEnd('tcb');
          console.log(aee);
          that.pushimg(aee.result, imgsrc);

        },
        fail(e) {
          console.log(e);
        }
      })
    }
    else {
      wx.cloud.callFunction({
        name: 'baiduAI',
        data: {
          type: that.data.type,
          img: imgsrc
        },

        success(aee) {
          console.timeEnd('tcb');
          console.log(aee);
          that.pushimg(aee.result, imgsrc);

        },
        fail(e) {
          console.log(e);
        }
      })
    }
  },

  pushimg(e, imgsrc) {
    let that = this;
    wx.cloud.callFunction({
      name: 'carId',
      data: {
        type: that.data.type,
        img: imgsrc,
        content: e
      },
      success(res) {

        if (res.result.code == 0) {
          wx.navigateBack({
            delta: 1,
          })
        }
        else if (res.result.code == -1) {
          console.log(res.err);
          wx.showModal({
            title: '系统错误',
            content: '系统出现问题，请稍后再试!',
          })
        }
        wx.hideLoading();
      },
      fail(err) {
        console.log(err);
        wx.showModal({
          title: '网络错误',
          content: '网络出现问题，请稍后再试!',
        })
        wx.hideLoading();
      }
    })
  },
  


  
})