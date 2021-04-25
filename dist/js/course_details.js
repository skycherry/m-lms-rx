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
        chapterList: [],
        courseInfo: {},
        interval: 0,
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
                          _this.activeUnit = unit
                          activeUnitIndex = uIndex
                        }
                      })
                    }
                    if (activeUnitIndex === -1) {
                      if(Array.isArray(item.unitList) && item.unitList.length) {
                        _this.activeUnit = item.unitList[0]
                        _this.activeUnitId = item.unitList[0].unitId
                      } else {
                        _this.activeUnit = null
                        _this.activeUnitId = ''
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
        var myPlayer = videojs('wow-video');
        myPlayer.on('play', function () {
          console.log('play');
          that.interval = setInterval(function () {
            var currentTime = myPlayer.currentTime();
            that.submitCurrentTime(currentTime, '1010', 0);
          },2000);
        });
        myPlayer.on('ended', function () {
          clearInterval(that.interval);
          var currentTime = myPlayer.currentTime();
          that.submitCurrentTime(currentTime, '1010', 1);
        });
      },
      submitCurrentTime: function (currentTime, id, isOver){
        var that = this;
        $.ajax({
          url: '../data/banner.json',
          data: {currentTime: currentTime, id: id, isOver: isOver},
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
                  // 跳页
                } else {
                  // 显示没有下一节的内容
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
      }
    }
  });
})
