import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
  data: {
   
    },

  onLoad(options){
     const self = this;
  },
  login(){
    wx.navigateTo({
      url:'/pages/manager/manager'
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

  