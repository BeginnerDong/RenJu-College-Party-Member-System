import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

  data: {

    sForm:{
      login_name:'',
      password:''

    },
    web_show:true,
    code:''
  },

 

  onLoad(){
    const self = this;
    //wx.removeStorageSync('login');
    //wx.removeStorageSync('token');
    //wx.removeStorageSync('user_type');
    //wx.removeStorageSync('info');
  },

  

  submit(){
    const self = this;
    wx.showLoading(); 
    if(api.checkComplete(self.data.sForm)){
         
      wx.setStorageSync('login',self.data.sForm);
    }else{
      api.showToast('请输入账号密码','none')
    }
    const callback = (res)=>{
      if(res.data.info.user_type==0){       
          wx.setStorageSync('info',res.data.info); 
          wx.redirectTo({
            url: '/pages/user/user'
          })
          api.showToast('登陆成功','none')  
      }else{
          wx.hideLoading();
         api.showToast('用户不存在','none')
      }
    }
    token.getToken(callback);
  },


  bindInputChange(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    self.setData({
      web_sForm:self.data.sForm,
    });
  },



  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


})  

  