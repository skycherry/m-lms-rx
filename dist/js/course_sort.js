$(function() {
  var courseSortPage = new Vue({
    el: '#courseSortPage',
    mixins: [searchMixin],
    data: function () {
      return {
        searchValue : '',
        tabbarActive: 1,
        fatherList: [],
        sonList: [],
        fatherId: 0,//父id
        sonId: 0,//子id
        oldFatherId: 0,
        oldSonId: 0,
        courseList: [],//课程列表
        loading: false,
        finished: false,
        refreshing: false,
        pageInfo: {
          total:0,
          pageSize: 10,
          pageNo: 1
        },
        sortPopup: false,
        fatherName: '',
        sonName: ''
      };
    },
    created: function () {
      this.loadSort();
    },
    methods: {
      onLoad: function () {
        var _this = this;
        //刷新执行
        if (_this.refreshing) {
          _this.pageInfo.pageNo = 1;
          _this.courseList = [];
          _this.refreshing = false;
        }
        //加载数据
        $.ajax({
          url: '../data/course_search.json',
          type: 'post',
          dataType: 'json',
          data: {
            fatherId: _this.fatherId,
            sonId: _this.sonId,
            pageNo: _this.pageInfo.pageNo
          },
          success: function (response) {
            if (response.status == 1) {
              if (Array.isArray(response.data.list)) {
                response.data.list.forEach(function (item) {
                  _this.courseList.push(item)
                })
              }
              if (_this.courseList.length >= response.data.pageInfo.total) {
                _this.finished = true;
              }
              _this.pageInfo.total = response.data.pageInfo.total;
              _this.pageInfo.pageNo ++;
            }
          },
          complete: function () {
            _this.loading = false;
          }
        })
      },
      onRefresh: function () {
        // 清空列表数据
        this.finished = false;
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true;
        this.onLoad();
      },
      loadSort: function () {
        var _this = this;
        $.ajax({
          url: '../data/sort.json',
          type: 'post',
          dataType: 'json',
          data: {},
          success: function (response) {
            if (response.status == 1) {
              if (Array.isArray(response.data)) {
                response.data.forEach(function (item) {
                  _this.fatherList.push(item)
                })
              }
            }
          }
        });
      },
      handleParentAllClick: function () {
        this.fatherId = 0;
        this.sonId = 0;
      },
      handleSonAllClick: function () {
        this.sonId = 0;
      },
      handleFatherSort: function (list) {
        this.fatherId = list.id;
        this.sonId = 0;
        this.sonList = list.children;
      },
      handleChildrenSort: function (list) {
        this.sonId = list.id;
      },
      handleClearSort: function () {
        this.fatherId = 0;
        this.sonId = 0;
      },
      handleSubSort: function () {
        //重载数据
        var _this = this;
        this.pageInfo.pageNo = 1;
        this.courseList = [];
        this.onLoad();
        //显示分类
        if (this.fatherId) {
          this.fatherList.forEach(function (item) {
            if (item.id === _this.fatherId) {
              _this.fatherName = item.text;
            }
          })
          if (this.sonId) {
            this.sonList.forEach(function (item) {
              if (item.id === _this.sonId) {
                _this.sonName = item.text;
              }
            })
          } else{
            this.sonName = ''
          }
        } else {
          this.fatherName = ''
        }
        //记录id
        this.oldFatherId = this.fatherId;
        this.oldSonId =  this.sonId;
        //关闭弹窗
        this.sortPopup = false;
      },
      handlePopupClose: function () {
        this.fatherId = this.oldFatherId;
        this.sonId =  this.oldSonId;
      },//关闭弹窗
      handleSortCourse: function () {
        this.sortPopup = true;
      }//打开弹窗
    }
  });
})
