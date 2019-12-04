// miniprogram/pages/home/home.js
Page({
  toAlbum(e) {

    wx.navigateTo({
      url: '../ocr/ocr?index=' + e.currentTarget.dataset.index,
    })
  }
})