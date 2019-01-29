import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   num:0,
   searchItem:{
    /*create_time:['>',new Date(new Date().toLocaleDateString()).getTime()/1000]*/
     menu_id:15
   },
   mainData:[],
   getBefore:{},
   isFirstLoadAllStandard:['getMainData'],
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.setData({
    	web_num:self.data.num
    })

  },

  onShow(){
    const self = this;
    self.data.mainData = [];
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
    if(JSON.stringify(api.cloneForm(self.data.getBefore)) != "{}"){
    	postData.getBefore = api.cloneForm(self.data.getBefore);
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


  tab(e){
    const self = this;
    api.buttonCanClick(self);
    var num = api.getDataSet(e,'num');
    self.data.getBefore = {};
	    if(num==0){

	    }else if(num==1){
	    	self.data.getBefore.relation={
	          tableName:'Message',
	        	searchItem:{
	        	  status:['in',[1]]
	        	},
	          fixSearchItem:{
	            user_no:['in',[wx.getStorageSync('info').user_no]]
	          },
	       	 	middleKey:'id',
	        	key:'relation_id',
	        	condition:'not in',	
	    	}
	  		      			   	    	
	    }else if(num==2){
	    	self.data.getBefore.relation={
          tableName:'Message',
        	searchItem:{
        	  behavior:['in',[1]]
        	},
          fixSearchItem:{
            user_no:['in',[wx.getStorageSync('info').user_no]]
          },
       	 	middleKey:'id', 
        	key:'relation_id',
        	condition:'in',	
	    	}
	    }else if(num==3){
	    	self.data.getBefore.relation={
        tableName:'Message',
        	searchItem:{
        	  behavior:['in',[2]]
        	},
          fixSearchItem:{
            user_no:['in',[wx.getStorageSync('info').user_no]]
          },
       	 	middleKey:'id',
        	key:'relation_id',
        	condition:'in',	
	    	}
	    };
		   
    self.setData({
      web_num:num
    });
    self.getMainData(true)
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

  