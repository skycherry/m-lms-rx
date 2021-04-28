$(function() {
  var courseDetails = new Vue({
    el: '#courseDetails',
    data: function () {
      return {
        tabbarActive: -1,
        courseId: '',
        activeNames: [1],
        activeUnitId: '',
        activeUnit: null,
        activeUnitVideoCurrentTime: 0,
        chapterList: [],
        courseInfo: {},
      };
    },
    created: function () {
      var queryObj = parseUrlQuery();
      this.courseId = '';
      this.activeNames = [];
      this.activeUnit = '';
      if (queryObj) {
        if (queryObj.courseId) {
          this.courseId = queryObj.courseId
        }
        if (queryObj.chapterId) {
          this.activeNames = [parseInt(queryObj.chapterId)]
        }
        if (queryObj.unitId) {
          this.activeUnitId = queryObj.unitId
        }
      }
      this.onLoad();
    },
    methods: {
      onLoad: function () {
        var _this = this;
        $.ajax({
          url: '../data/course_details.json',
          type: 'post',
          dataType: 'json',
          data: {
            courseId: _this.courseId
          },
          success: function (response) {
            if (response.status == 1) {
              if (Array.isArray(response.data.chapterList)) {
                response.data.chapterList.forEach(function (item, index) {
                  _this.chapterList.push(item);
                  // 当参数为空时进行赋值
                  if(index === 0 && !_this.activeNames.length) {
                    _this.activeNames = [item.chapterId]
                  }
                  if (_this.activeNames.length && _this.activeNames[0] === item.chapterId) {
                    var activeUnitIndex = -1
                    if (Array.isArray(item.unitList)) {
                      item.unitList.forEach(function (unit, uIndex) {
                        if (unit.unitId == _this.activeUnitId) {
                          activeUnitIndex = uIndex;
                          _this.activeUnit = unit;
                          _this.activeUnitVideoCurrentTime = unit.unitVideoCurrentTime;
                        }
                      })
                    }
                    if (activeUnitIndex === -1) {
                      if(Array.isArray(item.unitList) && item.unitList.length) {
                        _this.activeUnit = item.unitList[0];
                        _this.activeUnitId = item.unitList[0].unitId;
                        _this.activeUnitVideoCurrentTime = item.unitList[0].unitVideoCurrentTime;
                      } else {
                        _this.activeUnit = null;
                        _this.activeUnitId = '';
                      }
                    }
                  }
                })
              }
              //课程详情
              if (response.data.courseInfo) {
                _this.courseInfo = response.data.courseInfo;
              }
              if (_this.activeUnit) {
                _this.$nextTick(function () {
                  // 存在video 初始化
                  if ($('#wow-video').length) {
                    _this.initVideo()
                  }
                })
              }
            }
          }
        })
      },
      initVideo: function () {
        var that = this;
        var interval = 0; // 定时器
        var networkStateInv = 0; // 网络定时器

        var myPlayer = videojs('wow-video');

        // 初始化
        myPlayer.ready(function(){
          myPlayer.currentTime(that.activeUnitVideoCurrentTime);
          myPlayer.play();
        });
        //播放
        myPlayer.on('play', function () {
          interval = setInterval(function () {
            var currentTime = myPlayer.currentTime();
            that.submitCurrentTime(currentTime, that.courseId, that.activeUnitId, 0);
          },2000);
        });
        //暂停
        myPlayer.on('pause', function () {
          clearInterval(interval);
        });
        //播放完毕
        myPlayer.on('ended', function () {
          //退出全屏
          if (myPlayer.isFullscreen_) {
            myPlayer.exitFullscreen()
          }
          //停止定时器
          clearInterval(interval);
          clearInterval(networkStateInv);
          //观看结束提交
          var currentTime = myPlayer.currentTime();
          that.submitCurrentTime(currentTime, that.courseId, that.activeUnitId, 1);
        });

        //网络错误显示
        networkStateInv = setInterval(function () {
          var networkState = myPlayer.networkState();
          if(networkState !== 1 && networkState !== 2) {
            clearInterval(interval);
            clearInterval(networkStateInv);
          }
        }, 1000);

      },
      submitCurrentTime: function (currentTime, courseId, unitId, isOver){
        var that = this;
        $.ajax({
          url: '',
          data: {currentTime: currentTime, courseId: courseId, unitId: unitId, isOver: isOver},
          type: 'post',
          dataType: 'json',
          success: function (response) {
            if (response.status == 1) {
              //需要返回的数据
              //---finish：是否看完 （0、未看完 1、已看完）
              //---name: 下节课名称
              //---url: 下节课地址
              var _data = response.data;
              if(_data.finish == 1 && isOver == 1) {
                if (_data.url) {
                  // 跳转到下一页
                }
              }
            }else{
              clearInterval(that.interval);
            }
          },
          error: function () {
            clearInterval(that.interval);
          }
        })
      },
      submitStudyResult: function (unit) {
        var that = this;
        console.log('that', that.imagePreview)
        // 图片
        if (unit.unitType == 4) {

        }



        if (unit.unitType !== 0 && unit.unitType !== 1) {
          $.ajax({
            url: '',
            data: {courseId: that.courseId, unitId: unit.unitId},
            type: 'post',
            dataType: 'json',
            success: function (response) {
              if (response.status == 1) {

              }
            }
          })
        }
      }, // 图片和pdf时点击计算学习结果
    }
  });
})
