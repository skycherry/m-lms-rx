$(function() {
  var courseSearchPage = new Vue({
    el: '#courseSearchPage',
    mixins: [searchMixin],
    data: function () {
      return {
        searchKey: '',
        searchValue : '',
        tabbarActive: -1,
        courseList: [],
        loading: false,
        finished: false,
        refreshing: false,
        pageInfo: {
          total:0,
          pageSize: 10,
          pageNo: 1
        },
      };
    },
    created: function () {
      var query = parseUrlQuery()
      if (query) {
        this.searchKey = query.searchKey || ''
      } else {
        this.searchKey = ''
      }
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
      }
    }
  });
})
