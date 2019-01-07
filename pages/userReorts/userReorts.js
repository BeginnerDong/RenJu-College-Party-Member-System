import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   currentId:0,
   searchItem:{
    /*create_time:['>',new Date(new Date().toLocaleDateString()).getTime()/1000]*/
   },
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
          title:['=',['思想汇报']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };

  },

  onShow(){
    const self = this;
     self.getMainData();
  },

  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.getBefore = api.cloneForm(self.data.getBefore);
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
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
/*
        for (var i = 0; i < self.data.mainData.length; i++) {
          if(self.data.mainData[i].message.length>0){
            console.log('for',self.data.mainData[i].message[0].create_time)
            self.data.mainData[i].message[0].passage1 = parseInt(self.data.mainData[i].message[0].passage1)
            
          }
        };*/
       
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


  tab(e){
    const self = this;
    api.buttonCanClick(self);
    self.setData({
      currentId:api.getDataSet(e,'id')
    });
    api.buttonCanClick(self,true)
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



  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
  
})

  