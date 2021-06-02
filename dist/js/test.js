$(function() {

    function copyObject(toObj, fromObj) {
        if (toObj && fromObj) {
            for (var key in fromObj) {
                if (fromObj.hasOwnProperty(key)) {
                    toObj[key] = fromObj[key]
                }
            }
        }
    }

    var tplSingleChoicePanel = $('#tplSingleChoicePanel').html(); // 单选题
    var tplSingleChoice = $('#tplSingleChoice').html(); // 单选题

    Vue.component('singleChoicePanel', {
        template: tplSingleChoicePanel,
        props: {
            questions: Object,
        },
        data: function() {
            return {}
        },
        mounted: function () {

        },
        methods: {

        }
    });
    Vue.component('singleChoice', {
        template: tplSingleChoice,
        props: {
            index: Number,
            question: {
                type: Array,
                default: function () {
                    return []
                }
            },
        },
        data: function() {
            return {
                radio: ""
            }
        },
        mounted: function () {

        },
        watch: {
            question: {
                handler: function(value) {
                    if (value) {

                    }
                },
                immediate: true
            }
        },
        methods: {

        }
    });


    var testPage = new Vue({
        el: '#testPage',
        data: function () {
            return {
                paperInfo: []
            }
        },
        mounted: function () {
            this.getPaperInfo();
        },
        methods: {
            getPaperInfo: function () {
                var that = this;
                $.ajax({
                    url: '../data/test/paper.json',
                    type: 'post',
                    data: {},
                    dataType: 'json',
                    success: function (response) {
                        if (response.status == 1) {
                            if (Array.isArray(response.data)) {
                                that.paperInfo = response.data;
                            }
                        } else {

                        }
                    }
                })
            }
        }
    });
})
