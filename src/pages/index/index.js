import Taro, { Component} from '@tarojs/taro'
import { View,Image} from '@tarojs/components'
import { AtInput, AtForm,Picker,AtTag ,AtTextarea,AtButton,AtIcon,AtModal, AtModalHeader, AtModalContent, AtModalAction} from 'taro-ui'
import './index.scss'
export default class Index extends Component {

  config = {
    navigationBarTitleText: '在线报名'
  }
  constructor () {
    super(...arguments)
    this.state = {
      name:"",//昵称
      gender:"",//性别
      contact:"",//联系方式
      provinces:{},//居住省
      provincesList:[],//省份列表
      provinceCitiesList:[],//所选省的城市
      provinceCitiesObj:{},//所选城市
      university:"",//学校对象
      universityCode:"",//选择学校code
      birthday:"",//生日
      tags:[],//标签
      intro:"",//介绍
      myType:[],//风格
      myPhoto:[],//照片
      identityCode:"",//身份证
      myHeight:"",//身高
      myHeightList:['150-155','155-160','160-165','165-170','170-175','175-180','180-185','185-190','190-195'],
      hometown:"",//家乡
      hometownObj:{},//家乡对象
      universitiesList:[],//学校列表
      cities:[],//城市列表,
      tagname:"",
      isOpened:false,
      isScope:true,//是否授权
      nickName:""
    }
  }
  //
  handleInput (stateName, value) {
    this.setState({
      [stateName]: value
    })
  }
  //改变性别
  changeGender = e => {
    this.setState({
      gender: ['male', 'female'][e.detail.value]
    })
  }
  //改变所选学校
  changeUni = e=>{
    this.setState({
      university:this.state.universitiesList[e.detail.value],
      universityCode:this.state.universitiesList[e.detail.value].code
    })
  }
  //改变家乡
  changeCities = e=>{
    this.setState({
      hometownObj:this.state.cities[e.detail.value],
      hometown:this.state.cities[e.detail.value].code
    })
  }
  //改变星座
  changeConstellation = e=>{
    this.setState({
      constellation:this.state.constellationList[e.detail.value]
    })
  }
  //改变身高选项
  changeHeight = e=>{
    this.setState({
      myHeight:this.state.myHeightList[e.detail.value]
    })
  }
  //改变生日
  changeBirthday = (e)=>{
    this.setState({
      birthday:e.detail.value
    });
  }
  //居住城市改变
  changeRegion = (e)=>{
    console.log(e);
    this.getUniversitiesList(this.state.provinceCitiesList[e.detail.value[1]].code);
    this.setState({
      provinces:this.state.provincesList[e.detail.value[0]],
      provinceCitiesObj:this.state.provinceCitiesList[e.detail.value[1]],
      university:"",
      universityCode:""
    })

  }
  //居住城市省改变
  onColchangeRegion = (e)=>{
    console.log(e.detail);
    if(e.detail.column==0){//省份改变
      this.getcitiesByprovId(this.state.provincesList[e.detail.value].code);
    }
  }
  addTags = ()=>{
    this.setState({
        tagname:"",
        isOpened:true
    })
  }
  addTagsClick =(bolean)=>{
    if(bolean){
      this.setState({
          isOpened:false,
          tagname:"",
          tags:this.state.tags.concat([this.state.tagname])
      })
    }else{
      this.setState({
          isOpened:false,
          tagname:""
      })
    }
  }
  //改变介绍
  changeIntro = (e)=>{
    this.setState({
      intro:e.detail.value
    })
  }
  //改变理想中的Ta
  changeMytype = (e)=>{
    this.setState({
      myType:e.detail.value
    })
  }
  //取学校
  getUniversitiesList = (cityCode)=>{
    let _that = this;
    Taro.request({
      url: 'https://happycollege.applinzi.com/api/metadata/cities/'+cityCode+'/universities',
      data: {},
      header: {
        'content-type': 'application/json'
      }
    })
      .then((res) => {
        console.log(res.data);
        _that.setState({
          universitiesList:res.data
        })
      })
  }
  //取省份列表
  getProvincesList = ()=>{
    let _that = this;
    Taro.request({
      url: 'https://happycollege.applinzi.com/api/metadata/provinces',
      data: {},
      header: {
        'content-type': 'application/json'
      }
    })
      .then((res) => {
        console.log(res.data);
        _that.setState({
          provincesList:res.data
        })
      })
  }
  //根据省份取城市列表
  getcitiesByprovId = (id)=>{
      Taro.request({
          url: 'https://happycollege.applinzi.com/api/metadata/provinces/'+id+'/cities',
          data: {},
          header: {
              'content-type': 'application/json'
          }
      }).then((res) => {
          this.setState({
              provinceCitiesList:res.data,
          })
      })
  }
  //取家乡列表
  getcitiesList = ()=>{
    let _that = this;
    Taro.request({
      url: 'https://happycollege.applinzi.com/api/metadata/cities',
      data: {},
      header: {
        'content-type': 'application/json'
      }
    })
      .then((res) => {
        console.log(res.data);
        _that.setState({
          cities:res.data,
        })
      })
  }
  //删除照片
    deleteImage = (index)=>{
      let myPhoto = this.state.myPhoto;
      myPhoto.splice(index,1);
      this.setState({
          myPhoto:myPhoto
      })
    }
  //选照片
  chooseImage = ()=>{
      const count = 3 - this.state.myPhoto.length;
      if(count==0){
          Taro.showToast({
              "title":"最多选择三张",
              "icon":"none"
          })
          return;
      }
    Taro.chooseImage({
      count: count,
      sourceType: ['album', 'camera'],
      success:(res) => {
          console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        this.setState({
          myPhoto:this.state.myPhoto.concat(tempFilePaths)
        })
      }
    })
  }
  uploadFile = ()=>{
      var _that = this;
      if(_that.state.myPhoto.length==0){
          Taro.showToast({
              "title":"请先选择照片",
              "icon":"none"
          })
          return;
      }
      return new Promise(function (resolve,reject) {
          var PhotoArr = [];
          var index = 0;
          for(let i =0;i<_that.state.myPhoto.length;i++){
              Taro.uploadFile({
                  url: 'https://happycollege.applinzi.com/api/upload',
                  filePath: _that.state.myPhoto[i],
                  name: 'file',
                  formData: {
                      'user': 'test'
                  },
                  success:(res)=>{
                      index ++ ;
                      const data = JSON.parse(res.data);
                      PhotoArr.push(data[0].url);
                      if(index ==_that.state.myPhoto.length){
                          resolve(PhotoArr);
                      }
                      //do something
                  }
              })
          }
      })


  }
  //提交
  submit = ()=>{

    let state = Object.assign({},this.state);
    if(state.intro.length<40){
        Taro.showToast({
            "title":"自我介绍不能少于40字",
            "icon":"none"
        })
      return;
    }
    if(state.myType.length<40){
        Taro.showToast({
            "title":"理想中的Ta不能少于40字",
            "icon":"none"
        })
        return;
    }
    state.city = state.provinces.name+this.state.provinceCitiesObj.name;
    state.university = state.university.name;
  //默认手机号
    state.wechat = state.contact;
    state.contact = "wechat";
    state.nickName = state.nickName;
    delete state['provincesList'];
    delete state['provinceCitiesList'];
  delete state['universityCode'];
  delete state['myHeightList'];
  delete state['universitiesList'];
  delete state['cities'];
  Taro.showLoading({
      title:"正在提交信息，请稍后",
      mask:true
  })
    this.uploadFile().then((res)=>{
        state.myPhoto = res;
        console.log(state);
        Taro.request({
            url: 'https://happycollege.applinzi.com/api/users',
            data: state,
            method:"POST",
            header: {
                'content-type': 'application/json'
            }
        }).then((res) => {
            Taro.hideLoading();
            if(res.data._id){
                Taro.showToast({
                    "title":"注册成功"
                })
                this.setState({
                    name:"",//昵称
                    gender:"",//性别
                    contact:"",//联系方式
                    provinces:{},//居住省
                    provincesList:[],//省份列表
                    provinceCitiesList:[],//所选省的城市
                    provinceCitiesObj:{},//所选城市
                    university:"",//学校对象
                    universityCode:"",//选择学校code
                    birthday:"",//生日
                    tags:[],//标签
                    intro:"",//介绍
                    myType:[],//风格
                    myPhoto:[],//照片
                    identityCode:"",//身份证
                    myHeight:"",//身高
                    myHeightList:['150-155','155-160','160-165','165-170','170-175','175-180','180-185','185-190','190-195'],
                    hometown:"",//家乡
                    hometownObj:{},//家乡对象
                    universitiesList:[],//学校列表
                    cities:[],//城市列表,
                    tagname:"",
                    isOpened:false,
                    isScope:true,//是否授权
                    nickName:""
                })
                this.getcitiesList();
                this.getProvincesList();
                this.getcitiesByprovId(1);


            }else{
                Taro.showToast({
                    "title":res.data.message,
                    "icon":"none"
                })
            }
        })


    });

  }

  onGotUserInfo = (e)=>{
    console.log(e);
    this.setState({
        nickName:e.detail.userInfo.nickName,
        isScope:true
    })
  }
  componentWillMount () { }

  componentDidMount () {

    this.getcitiesList();
    this.getProvincesList();
    this.getcitiesByprovId(1);
    Taro.getSetting({
        success:(res)=>{
            if (res.authSetting['scope.userInfo']) {
              this.setState({
                  isScope:true
              })
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              Taro.getUserInfo({
                  success: (res)=> {
                    this.setState({
                        nickName:res.userInfo.nickName
                    })
                  }
              })
            }else{

            }
        }
    })

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    let objArr = [];
    objArr.push(this.state.provincesList);
    objArr.push(this.state.provinceCitiesList);
      return (
          <View className='page'>
              <View className = {this.state.isScope?"":"hide"}>
                  <View className={'doc-body'}>
                      {/* 输入框类型 */}
                      <View className='panel'>
                          <View className='panel__content no-padding'>
                              <View className='component-item'>
                                  <AtForm>
                                      <AtInput name='name' title='昵称*' type='text' placeholder='请填写昵称' value={this.state.name} onChange={this.handleInput.bind(this, 'name')} />

                                      <View className='pickerWrap'>
                                          <View className="label">性别*</View>
                                          <Picker className='right' mode='selector' range={['男', '女']} onChange={this.changeGender}>
                                              <View className='picker'>
                                                  {this.state.gender==""?"选择你的性别":this.state.gender=="male"?"男":"女"}
                                              </View>
                                          </Picker>
                                      </View>
                                      <AtInput name='contact' title='微信号*' type='text' placeholder='微信号（公开）' value={this.state.contact} onChange={this.handleInput.bind(this, 'contact')} />
                                      <View className='pickerWrap'>
                                          <View className="label">现居城市*</View>
                                          <Picker className='right' mode='multiSelector' onColumnchange={this.onColchangeRegion} rangeKey='name'  range={objArr} onChange={this.changeRegion}>
                                              <View className='picker'>
                                                  {Object.keys(this.state.provinces).length==0?"选择现居城市":this.state.provinces.name+this.state.provinceCitiesObj.name}
                                              </View>
                                          </Picker>
                                      </View>
                                      <View className='pickerWrap'>
                                          <View className="label">学校名称*</View>
                                          <Picker className='right' mode='selector' rangeKey='name' range={this.state.universitiesList} onChange={this.changeUni}>
                                              <View className='picker'>
                                                  {this.state.university==""?"选择学校":this.state.university.name}
                                              </View>
                                          </Picker>
                                      </View>
                                      <View className='pickerWrap'>
                                          <View className="label">生日*</View>
                                          <Picker className='right' mode='date' rangeKey='name' value={this.state.birthday} onChange={this.changeBirthday}>
                                              <View className='picker'>
                                                  {this.state.birthday?this.state.birthday:"选择你的生日"}
                                              </View>
                                          </Picker>
                                      </View>
                                      <View className='pickerWrap'>
                                          <View className="label">个性标签</View>
                                          <View className='right'>
                                              {
                                                  this.state.tags.map((item,index)=>{
                                                      console.log(item,index);
                                                      return <AtTag
                                                          name={item}
                                                          type='primary'
                                                          active={true}
                                                          circle
                                                      >{item}</AtTag>
                                                  })
                                              }

                                              <AtTag
                                                  name='自定义'
                                                  type='primary'
                                                  active={true}
                                                  circle
                                                  onClick={this.addTags}
                                              >+自定义</AtTag>
                                          </View>
                                      </View>

                                      <View className='pickerWrap'>
                                          <View className="label">美照*</View>
                                          <View className='right'>
                                              <AtIcon onClick={this.chooseImage} value='file-new' size='30'></AtIcon>
                                              <View className="imageWrap">
                                                  {this.state.myPhoto.map((e,i)=>{
                                                      return <View className="imageItem"><AtIcon onClick={this.deleteImage.bind(this,i)} value='close' size='20' color="#fff"></AtIcon><Image mode="center" src={e} /></View>
                                                  })}
                                              </View>
                                          </View>
                                      </View>
                                      <AtInput name='value7' title='身份证*' type='idcard' placeholder='身份证号码（不公开）' value={this.state.identityCode} onChange={this.handleInput.bind(this, 'identityCode')} />
                                      <View className='pickerWrap'>
                                          <View className="label">身高*</View>
                                          <Picker className='right' mode='selector' range={this.state.myHeightList} onChange={this.changeHeight}>
                                              <View className='picker'>
                                                  {this.state.myHeight?this.state.myHeight:"请选择身高范围"}
                                              </View>
                                          </Picker>
                                      </View>
                                      <AtInput name='hometown' title='家乡*' type='text' placeholder='请输入家乡地址' value={this.state.hometown} onChange={this.handleInput.bind(this, 'hometown')} />
                                      <View className='pickerWrap'>
                                          <View className="label">自我介绍*</View>
                                          <View className='right'>
                                              <AtTextarea
                                                  value={this.state.intro}
                                                  onChange={this.changeIntro}
                                                  minlength='40'
                                                  maxlength = '600'
                                                  placeholder='自我介绍，对爱情的向往、个人性格特点、兴趣爱好、生活态度、人生理想等等，不少于40字，多多益善哦～'
                                              />
                                          </View>
                                      </View>
                                      <View className='pickerWrap'>
                                          <View className="label">理想的Ta*</View>
                                          <View className='right'>
                                              <AtTextarea
                                                  value={this.state.myType}
                                                  onChange={this.changeMytype}
                                                  minlength='40'
                                                  maxlength = '600'
                                                  placeholder='自我发挥，可从各个方面写一下你理想中的Ta是什么样子的～，不少于40字，多多益善哦～'
                                              />
                                          </View>
                                      </View>
                                      {/*<View className='pickerWrap'>
                                      <View className="label">家乡</View>
                                          <Picker className='right' mode='selector' rangeKey='name' range={this.state.cities} onChange={this.changeCities}>
                                            <View className='picker'>
                                              {Object.keys(this.state.hometownObj)==0?"请选择家乡城市":this.state.hometownObj.name}
                                            </View>
                                          </Picker>
                                        </View>*/}
                                      {/*<View className='pickerWrap'>
                                          <View className="label">星座</View>
                                          <Picker className='right' mode='selector' range={this.state.constellationList} onChange={this.changeConstellation}>
                                              <View className='picker'>
                                                  {this.state.constellation?this.state.constellation:"请选择星座"}
                                              </View>
                                          </Picker>
                                      </View>*/}
                                      <AtButton className='submitButton' onClick={this.submit} type='primary'>提交注册</AtButton>
                                  </AtForm>
                              </View>
                          </View>
                      </View>

                      <AtModal isOpened={this.state.isOpened}>
                          <AtModalHeader>添加自定义标签</AtModalHeader>
                          <AtModalContent>
                              <AtInput name='tag_name' title='' type='text' placeholder='请输入自定义标签名字' value={this.state.tagname} onChange={this.handleInput.bind(this, 'tagname')} />
                          </AtModalContent>
                          <AtModalAction>
                              <Button onClick={this.addTagsClick.bind(this,false)}>取消</Button>
                              <Button onClick={this.addTagsClick.bind(this,true)}>确定</Button>
                          </AtModalAction>
                      </AtModal>
                  </View>
              </View>
              <View className={this.state.isScope?"hide":""} style={{"position":"fixed","bottom":"200rpx","left":"100rpx","right":"100rpx"}}>
                  <View style={{"margin":"100rpx",textAlign:"center"}}>高校脱单墙</View>
                <AtButton  onGetUserInfo={this.onGotUserInfo} open-type="getUserInfo">授权获取信息</AtButton>
              </View>
          </View>

      )

  }
}

