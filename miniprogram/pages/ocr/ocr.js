Page({
  data: {
    imglist: [],
    type:""
  },
  onLoad: function (options) {
    
    this.initlist(options.index);
    this.data.type = options.index;
    
  },

  onShow:function(){
    this.initlist(this.data.type);
  },

  toimgshow(e) {
    
    wx.setStorageSync('showimg', this.data.imglist[e.currentTarget.dataset.i]);
    
    wx.navigateTo({
      url: '../show/show?type='+this.data.type,
    })
  },
  initlist(type) {
    wx.showLoading({
      title: '列表加载',
    })
    let that = this;
    
    wx.cloud.callFunction({
      name: 'init',
      
      data: {
        type: type
      },
      success(res) {
        
        if (res.result.code == 0) {
          that.setData({
            imglist: res.result.list
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
  
  uploadimg() {
    let that = this;
    
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let imgUrl = res.tempFilePaths[0];
        
        
        that.uploadImgweb(imgUrl)
      }
    })
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
    
    if(that.data.type=="car")
    {
      wx.cloud.callFunction({
        name: 'carrec',
        data: {

          img: imgsrc
        },
        success(aee) {
          
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
          type: that.data.type ,
          img: imgsrc
        },
        
        success(aee) {
          
          that.pushimg(aee.result, imgsrc);

        },
        fail(e) {
          console.log(e);
        }
      })
    }
  },

  pushimg(e,imgsrc)
  {
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
          that.initlist(that.data.type);
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

  removeimg(e) {
    let that = this;
    wx.showModal({
      title: '确认删除',
      content: '你是否确认删除这个图片以及识别结果？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除图片',
          })
          wx.cloud.callFunction({
            name: 'removeimg',
            data: {
              type: that.data.type,
              img: e.currentTarget.dataset.img
            },
            success(res) {
              if (res.result.code == 0) {
                that.initlist(that.data.type);
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
        }
      }
    })
  },
  toCamera() {
    wx.navigateTo({
      url: '../camera/camera?index='+this.data.type,
    })
  }  
  
  
})