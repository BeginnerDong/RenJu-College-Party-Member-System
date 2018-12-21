import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
  data: {
      edit_show:false,
      sign_show:false,
    },

  onLoad(options){
     const self = this;
  },
  attend(){
    const self =this;
    self.setData({
      sign_show:true
    })
  },
  attend_no(){
    const self =this;
    self.setData({
      edit_show:true
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
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
 
})

  