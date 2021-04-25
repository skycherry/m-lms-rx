var searchMixin = {
  data: function () {
    return {
      showSearch: false,
      hostCourseList: []
    }
  },
  created: function () {
    this.getHotSearch()
  },
  methods: {
    getHotSearch: function () {
      var _this = this;
      $.ajax({
        url: '../data/hotCourse.json',
        type: 'post',
        dataType: 'json',
        data: {},
        success: function (response) {
          if (response.status == 1) {
            if (Array.isArray(response.data)) {
              response.data.forEach(function (item) {
                _this.hostCourseList.push(item)
              })
            }
          }
        }
      })
    },
    handleSearchBtnClick: function () {
      var _this = this;
      this.showSearch = true
      this.$nextTick(function () {
        $(_this.$refs['search']).find('.van-field__control').focus()
      })
    },
    handleSearchCancel: function () {
      this.showSearch = false
    },
    handleSearch: function (value) {
      if (value.trim()) {
        window.location.href='./my_course_search.html?searchKey=' + encodeURIComponent(value)
      } else {
        this.showSearch = false
      }
    }
  }
}

var parseUrlQuery = function (url) {
  var query = {};
  var urlToParse = url || window.location.href;
  var i;
  var params;
  var param;
  var length;
  if (typeof urlToParse === 'string' && urlToParse.length) {
    urlToParse = urlToParse.indexOf('?') > -1 ? urlToParse.replace(/\S*\?/, '') : '';
    params = urlToParse.split('&').filter(paramsPart => paramsPart !== '');
    length = params.length;

    for (i = 0; i < length; i += 1) {
      param = params[i].replace(/#\S+/g, '').split('=');
      query[decodeURIComponent(param[0])] = typeof param[1] === 'undefined' ? undefined : decodeURIComponent(param.slice(1).join('=')) || '';
    }
  }
  return query;
}
