import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
  data: {

    position: ['积极分子', '预备党员', '正式党员'],
    array: ['教授', '副教授','讲师','博士后','职员','高级','中级','初级'],
    index: 0,
    currentId:0,
    sForm:{
      name:'',
      phone:'',
      email:'', 
      gender:'',

      address:'',//入党日期
      level:'',//身份
      passage1:'',//出生日期
      idCard:'' //职称
    },
    isFirstLoadAllStandard:['userInfoGet'],
  },

  onLoad: function () {
    const self = this;
    api.commonInit(self);  
    self.setData({
      web_index:self.data.index,
      web_currentId:self.data.currentId
    });
    self.userInfoGet();
  },


  userInfoGet(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getStudentToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.sForm.name = res.info.data[0].info.name;
        self.data.sForm.phone = res.info.data[0].info.phone; 
        self.data.sForm.address = res.info.data[0].info.address;
        self.data.sForm.email = res.info.data[0].info.email;
        self.data.sForm.level = res.info.data[0].info.level;
        self.data.sForm.passage1 = res.info.data[0].info.passage1;
        self.data.sForm.idCard = res.info.data[0].info.idCard;
        self.data.sForm.gender = res.info.data[0].info.gender;
      };
      self.data.mainData = res;
     
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userInfoGet',self);
      self.setData({
        web_sForm:self.data.sForm,
      });
      
    };
    api.userGet(postData,callback);
  },

  changeBind(e){
    const self = this;
    if(api.getDataSet(e,'value')){
      self.data.sForm[api.getDataSet(e,'key')] = api.getDataSet(e,'value');
    }else{
      api.fillChange(e,self,'sForm');
    };
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },

  userInfoUpdate(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getStudentToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    const callback = (data)=>{
      if(data.solely_code==100000){
        api.showToast('完善成功','none',1000);

        setTimeout(function(){
         self.intoPathRedi()
        },1000);
      }else{
        api.showToast('网络故障','none')
      };
      api.buttonCanClick(self,true);
    };
    api.userInfoUpdate(postData,callback);
  },

  submit(){
    const self = this;
    api.buttonCanClick(self);
    var phone = self.data.sForm.phone;
    const pass = api.checkComplete(self.data.sForm);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','none')
        api.buttonCanClick(self,true);
      }else{
        wx.showLoading();
        const callback = (user,res) =>{
          self.userInfoUpdate(); 
       };
       api.getAuthSetting(callback);   
     }
   }else{
      api.showToast('请补全信息','none');
      api.buttonCanClick(self,true);
   };
  },

  positionChange(e) {
    const self = this;
    console.log('position',e.detail.value)
    self.data.sForm.level = self.data.position[e.detail.value];
    console.log(self.data.position[e.detail.value])
    self.setData({
      web_index:e.detail.value,
      web_sForm: self.data.sForm
    })
  },

  bindPickerChange(e) {
    const self = this;
    console.log('bindPickerChange',e.detail.value);
    self.data.sForm.idCard = self.data.array[e.detail.value];
    console.log(self.data.array[e.detail.value])
    self.setData({
      web_currentId:e.detail.value,
      web_sForm: self.data.sForm
    })
  },

  birthChange(e) {
    const self = this;
    console.log('birthChange',e.detail.value)
    self.data.sForm.passage1 = e.detail.value
    self.setData({
      web_sForm: self.data.sForm
    })
  },

  dateChange(e) {
    const self = this;
    console.log('birthChange',e.detail.value)
    self.data.sForm.address = e.detail.value
    self.setData({
      web_sForm: self.data.sForm
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

  