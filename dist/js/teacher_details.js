$(function() {
  var teacherDetailsPage = new Vue({
    el: '#teacherDetailsPage',
    data: function () {
      return {
        searchKey: '',
        searchValue : '',
        tabbarActive: -1,
        info: {},
        courseList: [],
        loading: false,
        finished: false,
        refreshing: false,
        pageInfo: {
          total:0,
          pageSize: 10,
          pageNo: 1
        },
        showFlag: false,
        showFlagText: '查看更多'
      };
    },
    created: function () {
      var query = parseUrlQuery();
      if (query) {
        this.searchKey = query.searchKey || '';
        this.searchValue = this.searchKey;
      } else {
        this.searchKey = ''
      }
      this.getTeacherInfo();
    },
    methods: {
      getTeacherInfo: function () {
        var _this = this;
        $.ajax({
          url: '../data/teacher_details.json',
          type: 'post',
          dataType: 'json',
          data: {},
          success: function (response) {
            if (response.status == 1) {
              _this.info = response.data;
            }
          }
        })
      },
      handleShowInfo: function () {
        this.showFlag = !this.showFlag;
        if (this.showFlag) {
          this.showFlagText = '收起';
        }else{
          this.showFlagText = '查看更多';
        }
      },
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
            key: _this.searchKey,
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
      handleCourseSearch: function (value) {
        if (value.trim()) {
          window.location.href='./teacher_details.html?searchKey=' + encodeURIComponent(value)
        }
      }//搜索课程
    }
  });
})
