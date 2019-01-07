import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   currentId:0,
   mainData:[],
   getBefore:{},
   isFirstLoadAllStandard:['getMainData'],
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.getBefore = {
      caseData:{
        tableName:'Label',
        searchItem:{
          title:['=',['公告通知']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    self.getMainData();
  },

  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = api.cloneForm(self.data.getBefore);
    postData.getAfter = {
      relation:{
        tableName:'Relation',
        middleKey:'id',
        key:'relation_one',
        searchItem:{
          status:1,
          relation_two:wx.getStorageSync('info').user_no 
        },
        condition:'='
      }
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },

  relationAdd(e){
    const self = this;
    api.buttonCanClick(self);
    var id = api.getDataSet(e,'id');
    const postData = {};
    postData.tokenFuncName = 'getStudentToken';
    postData.data = {
      relation_one:id,
      relation_two:wx.getStorageSync('info').user_no,
      thirdapp_id:getApp().globalData.thirdapp_id,
    };
    const callback = (res)=>{
      if(res.solely_code==100000){
        self.getMainData(true);
      };
    };
    api.relationAdd(postData,callback);
  },

  tab(e){
    const self = this;
    api.buttonCanClick(self);
    var currentId = api.getDataSet(e,'id');
    api.buttonCanClick(self,true);
    self.setData({
      currentId:currentId
    });
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

})

  