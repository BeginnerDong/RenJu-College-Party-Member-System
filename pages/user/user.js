import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
  data: {
 	isFirstLoadAllStandard:['userInfoGet']
  },

  onLoad(options){
  	const self = this;
  	api.commonInit(self);
  	self.userInfoGet();
  },

  userInfoGet(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getStudentToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        
      };
      
     
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userInfoGet',self);  
    };
    api.userGet(postData,callback);
  },
 
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  intoPathRedirect(e){
    const self = this;
    var res = api.checkTeacherLogin();
	if(res){
		api.pathTo(api.getDataSet(e,'path'),'redi');
	}else{
	    api.pathTo('/pages/teacherLogin/teacherLogin','redi');
	}
  }, 
 
})

  