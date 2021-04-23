$(function() {
  var courseDetails = new Vue({
    el: '#courseDetails',
    data: function () {
      return {
        tabbarActive: -1,
        activeNames: [1],
        activeUnitId: '',
        activeUnit: null,
        chapterList: [],
        teacherList: []
      };
    },
    created: function () {
      var queryObj = parseUrlQuery();
      this.activeNames = []
      this.activeUnit = ''
      if (queryObj) {
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
          data: {},
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
              if (Array.isArray(response.data.teacherList)) {
                response.data.teacherList.forEach(function (item) {
                  _this.teacherList.push(item);
                })
              }
              if (_this.activeUnit) {
                _this.$nextTick(function () {
                  _this.initVideo()
                })
              }
            }
          }
        })
      },
      initVideo: function () {
        var myPlayer = videojs('wow-video');
      }
    }
  });
})
