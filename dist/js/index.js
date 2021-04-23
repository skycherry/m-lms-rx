$(function() {
  var indexPage = new Vue({
    el: '#indexPage',
    mixins: [searchMixin],
    data: function () {
      return {
        searchValue: '',
        tabbarActive: 0,
        bannerImage: [],
        courseList: [],
        teacherList: []
      };
    },
    mounted: function () {
      this.onLoadBanner();
      this.onLoadCourse();
      this.onLoadTeacher();
    },
    methods: {
      onLoadBanner: function () {
        var _this = this;
        $.ajax({
          url: '../data/banner.json',
          type: 'post',
          dataType: 'json',
          data: {},
          success: function (response) {
            if (response.status == 1) {
              if (Array.isArray(response.data)) {
                response.data.forEach(function (item) {
                  _this.bannerImage.push(item)
                })
              }
            }
          }
        })
      },
      onLoadCourse: function () {
        var _this = this;
        $.ajax({
          url: '../data/course.json',
          type: 'post',
          dataType: 'json',
          data: {},
          success: function (response) {
            if (response.status == 1) {
              if (Array.isArray(response.data)) {
                response.data.forEach(function (item) {
                  _this.courseList.push(item)
                })
              }
            }
          }
        })
      },
      onLoadTeacher: function () {
        var _this = this;
        $.ajax({
          url: '../data/teacher.json',
          type: 'post',
          dataType: 'json',
          data: {},
          success: function (response) {
            if (response.status == 1) {
              if (Array.isArray(response.data)) {
                response.data.forEach(function (item) {
                  _this.teacherList.push(item)
                })
              }
            }
          }
        })
      },
    }
  });
})
