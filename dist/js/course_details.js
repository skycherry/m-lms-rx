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
        myPlayer: null,
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
        this.myPlayer = videojs('wow-video');
      }
    }
  });
})
