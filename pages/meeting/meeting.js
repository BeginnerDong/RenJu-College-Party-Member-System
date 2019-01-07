import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    searchItem:{
      status:1,
    },
    mainData:[],
    isFirstLoadAllStandard:['getMainData'],
    sForm:{
      name:''
    },
    getBefore:{}
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id=options.id;
    self.getMainData()
  },

  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };

    const postData={};
    postData.tokenFuncName='getTeacherToken';
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      relation_id:self.data.id,
      type:1,
      class:2,
      user_type:0
    };
    if(JSON.stringify(self.data.getBefore) != "{}"){
      postData.getBefore = api.cloneForm(self.data.getBefore);
    };
    postData.getAfter = {
      userInfo:{
        tableName:'UserInfo',
        middleKey:'user_no',
        key:'user_no',
        condition:'=',
        searchItem:{
          status:1,
        }
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
    api.messageGet(postData,callback);
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm
    })
  },

  search(){
    const self = this;
    if(self.data.sForm.name){  
      self.data.getBefore = {
        userInfo:{
          tableName:'UserInfo',
          middleKey:'user_no',
          key:'user_no',
          condition:'in',
          searchItem:{
            name:['LIKE',['%'+self.data.sForm.name+'%']],
          }
        }
      };
      self.getMainData(true)
      
    }else if(self.data.sForm.name==''){
        self.data.getBefore = {};
        self.getMainData(true)  
    }
  },

  messageUpdate(e){
    const self = this;
    var id = api.getDataSet(e,'id');
    var num = api.getDataSet(e,'num');
    api.buttonCanClick(self);
    const postData = {};
    postData.tokenFuncName = 'getTeacherToken';
    postData.searchItem={
      id:id,
      user_type:0
    };
    postData.data = {};
    if(num==0){
      postData.data.score = 3
    }else if(num==1){
      postData.data.score = 1
    };
    
    const callback = (res)=>{
      if(res.solely_code==100000){
        api.showToast('修改成功','none',1000);
        setTimeout(function(){
          self.getMainData(true)
        },1000);
      };
      api.buttonCanClick(self,true);
    };
    api.messageUpdate(postData,callback);
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  