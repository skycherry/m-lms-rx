$(function() {
  var myPage = new Vue({
    el: '#myPage',
    data: function () {
      return {
        tabbarActive: 2,
        userInfo: {
          avatar: '',
          username: '',
          sex: '',
          company: '',
          job: '',
          industry: -1,
          scale: -1,
          nature: -1,
        },
        nickname: '',
        showPicker: false,
        industryStr: '',
        scaleStr: '',
        natureStr: '',
        categoryList: [],
        scaleList: [],
        natureList: [],
        columns: [],
        currentPickerType: 1,
        pickerDefaultIndex: 0,

        showModifyPopup: false,
        modifyPasswordInfo: {
          originalPassword: '' ,
          newPassword: '' ,
          newPassword2: '' ,
        },
      };
    },
    mounted: function () {
      this.getUserInfo();
    },
    methods: {
      getUserInfo: function () {
        var _this = this;
        $.ajax({
          url: '../data/userInfo.json',
          type: 'post',
          dataType: 'json',
          data: {},
          success: function (response) {
            if (response.status == 1) {
              for (var key in response.data) {
                if (response.data.hasOwnProperty(key) && _this.userInfo.hasOwnProperty(key)) {
                  _this.userInfo[key] = response.data[key]
                }
              }
              _this.nickname = _this.userInfo.username;
              _this.getCompanyInfo();
            }
          }
        })
      }, //获取用户信息
      getCompanyInfo: function () {
        var _this = this;
        $.ajax({
          url: '../data/companyInfo.json',
          type: 'post',
          dataType: 'json',
          data: {},
          success: function (response) {
            if (response.status == 1) {
              var _data = response.data;
              if (Array.isArray(_data.industryCategory)) {
                _data.industryCategory.forEach(function (item) {
                  _this.categoryList.push(item)
                  if (item.id === _this.userInfo.industry) {
                    _this.industryStr = item.text;
                  }
                })
              }
              if (Array.isArray(_data.enterpriseScale)) {
                _data.enterpriseScale.forEach(function (item) {
                  _this.scaleList.push(item)
                  if (item.id === _this.userInfo.scale) {
                    _this.scaleStr = item.text;
                  }
                })
              }
              if (Array.isArray(_data.enterpriseNature)) {
                _data.enterpriseNature.forEach(function (item) {
                  _this.natureList.push(item)
                  if (item.id === _this.userInfo.nature) {
                    _this.natureStr = item.text
                  }
                })
              }
            }
          }
        })
      }, //获取企业信息
      afterRead: function(file) {
        //上传图片
        var formData = new FormData()
        formData.append('file', file.file)
        var _this = this;
        $.ajax({
          url: '../data/pic.json',
          processData: false,
          contentType: false,
          type: 'post',
          dataType: 'json',
          data: formData,
          success: function (response) {
            if (response.status == 1) {
              _this.userInfo.avatar = response.data.imgUrl;
            }
          }
        })
      }, //上传头像
      handleSaveInfo: function () {
        var _this = this;
        if (!_this.userInfo.username) {
          $('.js-input-name').addClass('error').find('.info-error').html('请填写姓名');
          return
        }
        if (!_this.userInfo.sex) {
          $('.js-input-sex').addClass('error').find('.info-error').html('请选择性别');
          return
        }
        if (!_this.userInfo.company) {
          $('.js-input-company').addClass('error').find('.info-error').html('请填写公司');
          return
        }
        if (!_this.userInfo.job) {
          $('.js-input-job').addClass('error').find('.info-error').html('请填写职务');
          return
        }
        //TODO:提交
        $.ajax({
          url: '',
          data:  _this.userInfo,
          type: 'post',
          dataType: 'json',
          success: function (response) {
            if(response.status == 1) {
              _this.$toast({
                message: response.msg,
                onClose: function () {
                  // location.href = '';
                }
              });
            }else{
              this.$toast(response.msg);
            }
          }
        })
      },//保存信息
      clearError: function () {
        $('.js-input').removeClass('error').find('.info-error').html('');
      },
      handleShowPicker: function(type) {
        var key = ''
        if (type === 1) {
          this.columns = this.categoryList;
          key = 'industry'
        } else if (type === 2) {
          this.columns = this.scaleList;
          key = 'scale'
        } else {
          this.columns = this.natureList;
          key = 'nature'
        }
        this.currentPickerType = type;
        this.showPicker = true;
        this.pickerDefaultIndex = 0;
        for (var i = 0; i < this.columns.length; i++) {
          if (this.columns[i].id === this.userInfo[key]) {
            this.pickerDefaultIndex = i;
            break;
          }
        }
      },
      onConfirm: function (value) {
        if (this.currentPickerType ==  1) {
          this.userInfo.industry = value.id;
          this.industryStr = value.text;
        }
        if (this.currentPickerType ==  2) {
          this.userInfo.scale = value.id;
          this.scaleStr = value.text;
        }
        if (this.currentPickerType ==  3) {
          this.userInfo.nature = value.id;
          this.natureStr = value.text
        }
        this.showPicker = false;
      },

      popupModifyPassword: function () {
        this.showModifyPopup = true;
      },
      clearInputError: function () {
        $('.popup-panel').find('.js-input').removeClass('error').find('.info-error').html('');
      },
      closeModifyPopup: function () {
        var _this = this;
        for(let key  in _this.modifyPasswordInfo){
          _this.modifyPasswordInfo[key] = '';
        }
        _this.clearInputError();
      },
      handleModifyPassword: function () {
        var _this = this;
        if (!_this.modifyPasswordInfo.originalPassword) {
          $('.js-original-password').addClass('error').find('.info-error').html('请输入原密码');
          return
        }
        if (!_this.modifyPasswordInfo.newPassword) {
          $('.js-new-password').addClass('error').find('.info-error').html('请输入新密码');
          return
        }
        if (!/^[\S]{6,12}$/.test(_this.modifyPasswordInfo.newPassword)) {
          $('.js-new-password').addClass('error').find('.info-error').html('请输入正确的密码');
          return
        }
        if(_this.modifyPasswordInfo.originalPassword === _this.modifyPasswordInfo.newPassword) {
          $('.js-new-password').addClass('error').find('.info-error').html('新密码与原密码一致');
          return;
        }
        if (!_this.modifyPasswordInfo.newPassword2) {
          $('.js-new-password2').addClass('error').find('.info-error').html('请再次输入新密码');
          return
        }
        if(_this.modifyPasswordInfo.newPassword !== _this.modifyPasswordInfo.newPassword2) {
          $('.js-new-password2').addClass('error').find('.info-error').html('密码输入不一致');
          return;
        }

        //TODO:提交
        $.ajax({
          url: '',
          data:  _this.modifyPasswordInfo,
          type: 'post',
          dataType: 'json',
          success: function (response) {
            if(response.status == 1) {
              _this.$toast({
                message: response.msg,
                onClose: function () {
                  // location.href = '';
                }
              });
            }else{
              _this.$toast(response.msg);
            }
          }
        })
      }, //修改密码
    }
  });
})
