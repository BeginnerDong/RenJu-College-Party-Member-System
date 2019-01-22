import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
      isFirstLoadAllStandard:['getMainData'],
    
      submitData:{
        content:'',
        mainImg:[],
        file:[],
        type:3,
      },
 
    },

  onLoad(options){
    const self = this;
    

    self.data.url = 'https://xianjiaoda.solelycloud.com/userReortsSubmit.html?token='
    +token.getStudentToken()+'&id='+options.id+'&user_no='+options.user_no;
    console.log(self.data.url)
    self.setData({
    	web_url:self.data.url
    })
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
        if(self.data.mainData.message.length>0){
          self.data.submitData.content = res.info.data[0].message[0].content,
          self.data.submitData.mainImg = res.info.data[0].message[0].mainImg
        }
        
      }else{
        api.showToast('数据错误','fail');
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_submitData:self.data.submitData,
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },

  messageAdd(){
    const self = this;
    var nowTime  = new Date().getTime();
    const postData = {};
    postData.tokenFuncName = 'getStudentToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    postData.data.relation_id = self.data.mainData.id;
    postData.data.passage1 = self.data.mainData.end_time;
    postData.data.passage2 = nowTime;
    console.log('postData',postData)
    const callback = (res)=>{
      if(res.solely_code==100000){
        api.showToast('提交成功','none',1000);
        setTimeout(function(){
          self.intoPathRedi()
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
    postData.data = api.cloneForm(self.data.submitData);

    const callback = (res)=>{
      if(res.solely_code==100000){
        api.showToast('修改成功','none',1000);
        setTimeout(function(){
          self.intoPathRedi()
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
      api.showToast('请补全信息','none',1000);
      api.buttonCanClick(self,true);
    };
  },

  deleteImg(e){
    const self = this;
    var index = api.getDataSet(e,'index');
    console.log('deleteImg',index)
    self.data.submitData.mainImg.splice(index,1);
    self.setData({
      web_submitData:self.data.submitData
    })
  },

  upLoadImg(){
    const self = this;
    if(self.data.submitData.mainImg.length>2){
      api.showToast('仅限3张','fail');
      return;
    };
    wx.showLoading({
      mask: true,
      title: '图片上传中',
    });
    const callback = (res)=>{
      console.log('res',res)
      if(res.solely_code==100000){

        self.data.submitData.mainImg.push({url:res.info.url})
        self.setData({
          web_submitData:self.data.submitData
        });
        wx.hideLoading()  
      }else{
        api.showToast('网络故障','none')
      }

    };

    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths;
        console.log(callback)
        api.uploadFile(tempFilePaths[0],'file',{tokenFuncName:'getStudentToken'},callback)
      },
      fail: function(err){
        wx.hideLoading();
      }
    })
  },


  upLoadFile(){
    const self = this;
    wx.showLoading({
      mask: true,
      title: '文件上传中',
    });
    const callback = (res)=>{
      console.log('res',res)
      if(res.solely_code==100000){
        self.data.submitData.file.push({url:res.info.url})
        self.setData({
          web_submitData:self.data.submitData
        });  
      }else{
        api.showToast('网络故障','none')
      }
    };
    wx.chooseVideo({
      success: function(res) { 
        console.log(res);
        var src = res.tempFilePath;
        console.log(callback)
        api.uploadFile(src,'file',{tokenFuncName:'getStudentToken'},callback)
      },
      fail: function(err){
        wx.hideLoading();
      }
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

  