import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
  data: {
    date:2018-9-21,
    date1:2018-9-21,
    position: ['积极分子', '党员', '优秀党员'],
    array: ['教授', '副教授'],
    index: 0,
    currentId:0,
    },

  onLoad(options){
     const self = this;
  },
   position(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange(e) {
    this.setData({
      currentId: e.detail.value
    })
  },
   bindDateChange(e) {
    const self = this;
    self.setData({
      date: e.detail.value
    })
  },
  bindDateChange1(e) {
    const self = this;
    self.setData({
      date1: e.detail.value
    })
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },
 
})

  