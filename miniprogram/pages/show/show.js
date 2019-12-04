Page({
  
  data: {
    imgdata:{},
    type:""
  },
  onLoad: function (options) {
    
    let imgdata=wx.getStorageSync('showimg');
    
    this.setData({
      imgdata:imgdata,
      type:options.type
    
    })
  },
  
  
})
