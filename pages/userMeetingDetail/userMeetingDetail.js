import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
  data: {
      isFirstLoadAllStandard:['getMainData'],
      edit_show:false,
      sign_show:false,
      submitData:{
        content:'',
        type:1,
        class:1,
   
      },
      submitDataTwo:{
        type:1,
        class:2,
        score:1
      }
    },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.id= options.id;
    self.getMainData();
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
          status:1
        },
        condition:'='
      }
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      }else{
        api.showToast('数据错误','fail');
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },

  messageAdd(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getStudentToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    postData.data.relation_id = self.data.mainData.id;

    const callback = (res)=>{
      if(res.solely_code==100000){
        api.showToast('提交成功','none',1000);
        setTimeout(function(){
          self.getMainData()
        },1000);
      };
      api.buttonCanClick(self,true);
    };
    api.messageAdd(postData,callback);
  },

  messageTwoAdd(){
    const self = this;
    api.buttonCanClick(self);
    const postData = {};
    postData.tokenFuncName = 'getStudentToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitDataTwo);
    postData.data.relation_id = self.data.mainData.id;
    const callback = (res)=>{
      if(res.solely_code==100000){
        api.showToast('确认参加','none',1000);
        setTimeout(function(){
          self.getMainData()
        },1000);
      };
      api.buttonCanClick(self,true);
      
    };
    api.messageAdd(postData,callback);
  },

  messageUpdate(){
    const self = this;
    api.buttonCanClick(self);
    const postData = {};
    postData.tokenFuncName = 'getStudentToken';
    postData.searchItem={
      id:self.data.mainData.message[0].id
    };
    postData.data = {
      score:2,
      sign_time:new Date().getTime()
    };

    const callback = (res)=>{
      if(res.solely_code==100000){
        api.showToast('签到成功','none',1000);
        setTimeout(function(){
          self.getMainData()
        },1000);
      };
      api.buttonCanClick(self,true);
    };
    api.messageUpdate(postData,callback);
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    self.setData({
      web_submitData:self.data.submitData,
    });  
    console.log(self.data.submitData)
  },

  submit(){
    const self = this;
    api.buttonCanClick(self);
    const pass = api.checkComplete(self.data.submitData);
    if(pass){
      self.messageAdd();    
    }else{
      api.showToast('请补全信息','none');
      api.buttonCanClick(self,true);
    };
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

  