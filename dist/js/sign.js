$(function() {
  //验证规则
  var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  var phoneReg = /^1\d{10}$/;
  var password = /^[\S]{6,16}$/;
  //登录
  var signInPage = new Vue({
    el: '#signInPage',
    data: function () {
      return {
        form: {
          userName: '',
          password: ''
        },
        showFlag: false
      };
    },
    methods: {
      handleSignIn: function () {
        var _this = this;
        if (!this.form.userName) {
          this.$toast('请输入邮箱或手机号');
          return
        }
        if (!emailReg.test(this.form.userName) && !phoneReg.test(this.form.userName)) {
          this.$toast('邮箱或手机号输入有误');
          return;
        }
        if (!this.form.password) {
          this.$toast('密码不能为空');
          return;
        }
        if (!password.test(this.form.password)) {
          this.$toast('请输入6-16位密码');
          return;
        }

        //TODO:提交
        $.ajax({
          url: '',
          data:  this.form,
          type: 'post',
          dataType: 'json',
          success: function (response) {
            if(response.status == 1) {
              _this.$toast({
                message: response.msg,
                onClose: function () {
                  //跳转
                  location.href = '';
                }
              });
            }else{
              this.$toast(response.msg);
            }
          }
        })
      },
      handleShowPwd: function () {
        this.showFlag = !this.showFlag;
      }
    }
  });

  //注册
  var signUpPage = new Vue({
    el: '#signUpPage',
    data: function () {
      return {
        form: {
          userPhone: '',
          userEmail: '',
          industry: -1,
          scale: -1,
          nature: -1,
          userCode: '',
          password: ''
        },
        disabled: true,
        codeText: '获取验证码',
        getCodeInv: null,
        textType: false,
        showPicker: false,
        industryStr: '',
        scaleStr: '',
        natureStr: '',
        categoryList: [],
        scaleList: [],
        natureList: [],
        columns: [],
        currentPickerType: 1,
        pickerDefaultIndex: 0
      };
    },
    mounted: function () {
      this.getCompanyInfo();
    },
    methods: {
      blurTestPhone: function () {
        var _this = this;
        if (phoneReg.test(this.form.userPhone)) {
          //检测手机号是否可用
          $.post('', {userPhone: this.form.userPhone}, function (response) {
            if(response.status == 1) {
              //手机号未注册设置可发送验证码
              _this.disabled = false;
            }else {
              this.$toast(response.msg);
            }
          }, 'json');
        } else {
          this.$toast('手机号输入有误');
        }
      },
      handleGetCode: function () {
        var _this = this;
        if (!_this.disabled) {
          $.ajax({
            url: '../data/demo.json',
            type: 'post',
            data: {phone: _this.form.userPhone},
            dataType: 'json',
            beforeSend: function () {
              _this.disabled = true;
            },
            success: function (response) {
              if(response.status == 1) {
                var time = 60;
                _this.codeText = '重新获取 <span class="color-blue">' + time + 'S</span>';
                _this.getCodeInv = setInterval(function () {
                  if(time > 0) {
                    time --;
                    _this.codeText = '重新获取 <span class="color-blue">' + time + 'S</span>';
                  }else {
                    _this.disabled = false;
                    _this.codeText = '重新获取';
                    clearInterval(_this.getCodeInv);
                    _this.getCodeInv = null
                  }
                }, 1000);
              }else {
                _this.$toast(response.msg);
              }
            }
          });
        }
      },//验证码
      handleShowPwd: function () {
        this.textType = !this.textType;
      },
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
                  if (item.id === _this.form.industry) {
                    _this.industryStr = item.text;
                  }
                })
              }
              if (Array.isArray(_data.enterpriseScale)) {
                _data.enterpriseScale.forEach(function (item) {
                  _this.scaleList.push(item)
                  if (item.id === _this.form.scale) {
                    _this.scaleStr = item.text;
                  }
                })
              }
              if (Array.isArray(_data.enterpriseNature)) {
                _data.enterpriseNature.forEach(function (item) {
                  _this.natureList.push(item)
                  if (item.id === _this.form.nature) {
                    _this.natureStr = item.text
                  }
                })
              }
            }
          }
        })
      }, //获取企业信息
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
          if (this.columns[i].id === this.form[key]) {
            this.pickerDefaultIndex = i;
            break;
          }
        }
      },
      onConfirm: function (value) {
        if (this.currentPickerType ==  1) {
          this.form.industry = value.id;
          this.industryStr = value.text;
        }
        if (this.currentPickerType ==  2) {
          this.form.scale = value.id;
          this.scaleStr = value.text;
        }
        if (this.currentPickerType ==  3) {
          this.form.nature = value.id;
          this.natureStr = value.text
        }
        this.showPicker = false;
      },
      handleSignUp: function () {
        var _this = this;
        if (!this.form.userPhone) {
          this.$toast('请输入手机号');
          return
        }
        if (!phoneReg.test(this.form.userPhone)) {
          this.$toast('手机号输入有误');
          return;
        }
        if (!this.form.userEmail) {
          this.$toast('请输入邮箱');
          return
        }
        if (!emailReg.test(this.form.userEmail)) {
          this.$toast('邮箱输入有误');
          return;
        }
        if (this.form.industry === -1) {
          this.$toast('请选择企业行业类别');
          return;
        }
        if (this.form.scale === -1) {
          this.$toast('请选择企业规模');
          return;
        }
        if (this.form.nature === -1) {
          this.$toast('请选择企业性质');
          return;
        }
        if (!this.form.userCode) {
          this.$toast('请输入验证码');
          return;
        }
        if (!this.form.password) {
          this.$toast('密码不能为空');
          return;
        }
        if (!password.test(this.form.password)) {
          this.$toast('请输入6-16位密码');
          return;
        }

        //TODO:提交
        $.ajax({
          url: '',
          data:  this.form,
          type: 'post',
          dataType: 'json',
          success: function (response) {
            if(response.status == 1) {
              _this.$toast({
                message: response.msg,
                onClose: function () {
                  //跳转
                  location.href = '';
                }
              });
            }else{
              _this.$toast(response.msg);
            }
          }
        })
      } //注册
    }
  });

  //找回密码
  var findPwdPage = new Vue({
    el: '#findPwdPage',
    data: function () {
      return {
        form: {
          userPhone: '',
          userImageCode: '',
          userCode: '',
          password: ''
        },
        signTitle: '找回密码',
        validateCodeImageSrc: '',
        codeText: '',
        disabled: false,
        showFlag: true,
        textType: false,
        getCodeInv: null
      };
    },
    mounted: function () {
      if ($('#findPwdPage').length) {
        this.handleChangePic();
      }
    },
    methods: {
      handleChangePic: function () {
        var _this = this;
        $.post('../data/pic.json', {}, function (response){
          if(response.status == 1) {
            _this.validateCodeImageSrc = response.data.imgUrl;
          }else {
            this.$toast(response.msg);
          }
        }, 'json');
      },//检验码
      handleFindPwd: function () {
        var _this = this;
        if (!this.form.userPhone) {
          this.$toast('请输入手机号');
          return
        }
        if (!phoneReg.test(this.form.userPhone)) {
          this.$toast('手机号输入有误');
          return;
        }
        if (!this.form.userImageCode) {
          this.$toast('检验码不能为空');
          return;
        }

        //TODO:提交
        $.ajax({
          url: '../data/phone.json',
          data:  {userPhone: _this.form.userPhone, userImageCode: _this.form.userImageCode},
          type: 'post',
          dataType: 'json',
          success: function (response) {
            if(response.status == 1) {
              _this.$toast({
                message: response.msg,
                onClose: function () {
                  _this.showFlag = !_this.showFlag;
                  _this.signTitle = '已发送验证码至: <span class="short">'+ _this.form.userPhone +'</span>';
                  _this.handleGetCode();
                  _this.form.userImageCode = ''
                  _this.form.userCode = ''
                  _this.form.password = ''
                }
              });
            }else{
              this.$toast(response.msg);
            }
          }
        })
      }, //提交检验码
      handleGetCode: function () {
        var _this = this;
        if (!_this.disabled) {
          $.ajax({
            url: '',
            type: 'post',
            data: {phone: _this.form.userPhone},
            dataType: 'json',
            beforeSend: function () {
              _this.disabled = true;
            },
            success: function (response) {
              if(response.status == 1) {
                var time = 60;
                _this.codeText = '重新获取 <span class="color-blue">' + time + 'S</span>';
                _this.getCodeInv = setInterval(function () {
                  if(time > 0) {
                    time --;
                    _this.codeText = '重新获取 <span class="color-blue">' + time + 'S</span>';
                  }else {
                    _this.disabled = false;
                    _this.codeText = '重新获取';
                    clearInterval(_this.getCodeInv);
                    _this.getCodeInv = null
                  }
                }, 1000);
              }else {
                this.$toast(response.msg);
              }
            }
          });
        }
      },//验证码
      handleShowPwd: function () {
        this.textType = !this.textType;
      },
      handleBack: function () {
        this.showFlag = !this.showFlag;
        this.signTitle = '找回密码';
        this.handleChangePic();
        if (this.getCodeInv) {
          this.disabled = false;
          this.codeText = '重新获取';
          clearInterval(this.getCodeInv);
          this.getCodeInv = null
        }
      },
      handleModifyPwd: function () {
        var _this = this;
        if (!this.form.userCode) {
          this.$toast('请输入验证码');
          return
        }
        if (!this.form.password) {
          this.$toast('密码不能为空');
          return;
        }
        if (!password.test(this.form.password)) {
          this.$toast('请输入6-16位密码');
          return;
        }

        //TODO:提交
        $.ajax({
          url: '',
          data:  {userCode: _this.form.userCode, password: _this.form.password},
          type: 'post',
          dataType: 'json',
          success: function (response) {
            if(response.status == 1) {
              _this.$toast({
                message: response.msg,
                onClose: function () {
                  //跳转
                  location.href = '';
                }
              });
            }else{
              this.$toast(response.msg);
            }
          }
        })
      }//提交新密码
    }
  });
})
