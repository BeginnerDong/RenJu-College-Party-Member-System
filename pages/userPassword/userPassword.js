import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({

  data: {
    submitData:{
      password:'',
      password_new:'',
      password_new_copy:'', 
    },

    buttonCanClick:true
  },




  onLoad(options){
    const self = this;
    self.data.num=options.num;
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
    })
  },


  passwordUpdate(){
    const self = this;
      const postData = {};
      if(self.data.num==0){
        postData.tokenFuncName = 'getStudentToken';
      }else if(self.data.num==1){
        postData.tokenFuncName = 'getTeacherToken';
      }; 
      postData.searchItem = {
        user_no:wx.getStorageSync('info').user_no,
      };
      postData.data = {
        password:self.data.submitData.password_new,
      }; 
      const callback = (res) => { 
        if(res.solely_code==100000){
          api.showToast('请重新登陆','none',800)
          setTimeout(function(){
            api.logOff(); 
          },800)         
        }else{
          api.showToast(res.msg,'none',1000)
        };
        api.buttonCanClick(self,true);
      };
    api.userUpdate(postData,callback);    
  },



  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    if(self.data.submitData.password_new&&self.data.submitData.password_new_copy){
      if(self.data.submitData.password_new!=self.data.submitData.password_new_copy){
        api.showToast('新密码不一致','none'); 
        self.data.submitData.password_new_copy = ''   
      };  
    }; 
      self.setData({
        web_submitData:self.data.submitData
      });
  },



  submit(){
    const self = this;
    api.buttonCanClick(self);
    if(self.data.submitData.password != wx.getStorageSync('login').password){
      api.showToast('原密码错误','none');
      api.buttonCanClick(self,true);
      return;
    };
    setTimeout(function(){
      const pass = api.checkComplete(self.data.submitData);
      if(pass){
        self.passwordUpdate();      

      }else{
        api.showToast('请补全信息','none');
        api.buttonCanClick(self,true);
      }; 
    },100);
  },
  

}) 

  