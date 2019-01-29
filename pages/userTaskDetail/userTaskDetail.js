import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
  data: {
      isFirstLoadAllStandard:['getMainData'],
   
    },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.id= options.id;
  },

  onShow(){
    const self = this;
    self.getMainData()
  },

  getMainData(){
    const  self =this;
   
    const postData={};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.id
    };
    postData.getAfter = {
      message:{
        tableName:'Message',
        middleKey:'id',
        key:'relation_id',
        searchItem:{
          status:1,
          user_no:wx.getStorageSync('info').user_no
        },
        condition:'='
      }
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
      }else{
        api.showToast('数据错误','fail');
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_user_no:wx.getStorageSync('info').user_no,
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },

  

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


 
})

  