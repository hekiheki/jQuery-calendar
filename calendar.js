;(function($, window, document,undefined) {
    //Calendar
    var Calendar = function(ele, opt) {
        this.$element = ele;
        this.defaults = {
            format: "yyyy-MM-dd"
        };
        
        this.options = $.extend('', this.defaults, opt)

    }
    //定义Calendar的方法
    Calendar.prototype = {
        init: function() {
            
            var _Date = new Date(),
            y = _Date.getFullYear(),
            m = _Date.getMonth()+1,
            d = _Date.getDate(),
            sy = y-50,
            ey = y+20; 

            var _this = this;
            
            if(!$('.calendar-box').length){
                $('body').append('<div class="calendar-box" style="display:none"></div>');
            }
            // _this.dateFormat(_this.options.format);
            var id = 'calendar-'+_this.$element.attr('id');
            _this.$element.focus(function(){
                if(_this.$element.val()==""){
                    $('.calendar-box').show().html(_this.creatClendarDiv(id,y,m,d,sy,ey));
                }else{
                    // var date = _this.$element.val();
                    var inputValue = _this.$element.val(),
                        newDate = new Date(inputValue),
                        newY = newDate.getFullYear(),
                        newM = newDate.getMonth()+1,
                        newD = newDate.getDate();
                    $('.calendar-box').show().html(_this.creatClendarDiv(id,newY,newM,sy,ey));
                    $('.calendar-day').each(function(){
                        if($(this).text()==newD){
                            $(this).addClass('calendar-select');
                        }
                    })
                }
                _this.setPosition($('#'+id));
                _this.isToday(y,m,d);
                _this.setInputVal(_this.$element);
                _this.prevMonth(y,m,d);
                _this.nextMonth(y,m,d);
            })
        },
        creatClendarDiv: function(id,y,m){
            var CalendarDiv = '<div class="calendar-container" id="'+id+'">'+
                '<div class="calendar-top-box"><i id="prevMonth" class="iconfont icon-prev"></i>'+
                '<span class="calendar-years">'+y+'</span>年'+
                '<span class="calendar-months">'+m+'</span>月'+
                '<i id="nextMonth" class="iconfont icon-next"></i></div>'+
                '<div class="calendar-weeks">'+
                '<span class="calendar-week calendar-sun">日</span>'+
                '<span class="calendar-week">一</span>'+
                '<span class="calendar-week">二</span>'+
                '<span class="calendar-week">三</span>'+
                '<span class="calendar-week">四</span>'+
                '<span class="calendar-week">五</span>'+
                '<span class="calendar-week calendar-sat">六</span></div>'+
                '<div class="calendar-days">'+this.setDays(y,m)+'</div></div>';
            return CalendarDiv;
        },
        setDays: function(y,m){
            var daysLength,_this = this,daysSpan="",days=[];
            if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
                daysLength = 31;
            }else if(m==4||m==6||m==9||m==11){
                daysLength = 30;
            }else if(m==2){
                _this.leapYear(y) ? daysLength = 29 : daysLength=28;
            }

            
            for(var i=1;i<=daysLength;i++){
                var dayValue = new Date(y+'-'+m+'-'+i).getDay();
                days.push({day: dayValue,date: i});    
            }
            // 1号不是星期天的时候，补齐标签
            if(days[0].day!=0){
                for(var i=0;i<days[0].day;i++){
                    daysSpan += '<span></span>';
                }
            }
            //是星期六的那天，换行
            for(var i=0;i<days.length;i++){
                if(days[i].day==6){
                    daysSpan += '<span class="calendar-day">'+days[i].date+'</span></div><div class="calendar-row">';
                }else{
                    daysSpan += '<span class="calendar-day">'+days[i].date+'</span>';
                }
            }
            return '<div class="calendar-row">'+daysSpan+'</div>';
        },
        leapYear: function(year){    // 判断闰年
            return !(year % (year % 100 ? 4 : 400));
        },
        setPosition: function(ele){
            var inputHeight = this.$element.outerHeight(),
                inputTop = this.$element.offset().top,
                inputLeft = this.$element.offset().left;
            ele.css({
                left: inputLeft+'px',
                top: inputHeight+inputTop+'px'
            })
        },
        isToday: function(y,m,d){
            var year = $('.calendar-years').text(),
                month = $('.calendar-months').text();
            if(year == y && month == m){
                $('.calendar-day').each(function(){
                    if($(this).text()==d){
                        $(this).addClass('calendar-today');
                    }
                })
            }
        },
        setInputVal: function(ele){
            var _this = this;
            $('.calendar-day').click(function(){
                var year = $('.calendar-years').text(),
                month = $('.calendar-months').text(),
                day = $(this).text();
                $('.calendar-day').removeClass('calendar-select');
                $(this).addClass('calendar-select');
                // ele.val(year+'-'+month+'-'+day);
                ele.val(_this.dateFormat(year+'-'+month+'-'+day,_this.options.format));
                _this.hideCalendar();
            });
        },
        dateFormat: function(date,fmt){
            var time = new Date(date).format(fmt);
            return time;
        },
        hideCalendar: function(){
            $('.calendar-box').hide();
        },
        prevMonth: function(y,m,d){
            var _this = this;
           $('#prevMonth').click(function(){
                var month = parseInt($('.calendar-months').text());
                if(month>1){
                    $('.calendar-months').text(month-1); 
                }else{
                    var year = parseInt($('.calendar-years').text());
                    $('.calendar-months').text(12); 
                    $('.calendar-years').text(year-1);
                }
                year = parseInt($('.calendar-years').text());
                month = parseInt($('.calendar-months').text());
                $('.calendar-days').html(_this.setDays(year,month));
                _this.isToday(y,m,d);
                _this.setInputVal(_this.$element);
            })
        },
        nextMonth: function(y,m,d){
            var _this = this;
            $('#nextMonth').click(function(){
                var month = parseInt($('.calendar-months').text());
                if(month<12){
                    $('.calendar-months').text(month+1);
                }else{
                    var year = parseInt($('.calendar-years').text());
                    $('.calendar-months').text(1);
                    $('.calendar-years').text(year+1);
                }
                year = parseInt($('.calendar-years').text());
                month = parseInt($('.calendar-months').text());
                $('.calendar-days').html(_this.setDays(year,month));
                _this.isToday(y,m,d);
                _this.setInputVal(_this.$element);
            })
        },
        prevYear: function(ele,sy,ey){

        },
        nextYear: function(ele,sy,ey){

        },
    }
    Date.prototype.format = function(fmt) { 
        var o = { 
           "M+" : this.getMonth()+1,                 //月份 
           "d+" : this.getDate(),                    //日 
           "h+" : this.getHours(),                   //小时 
           "m+" : this.getMinutes(),                 //分 
           "s+" : this.getSeconds(),                 //秒 
           "q+" : Math.floor((this.getMonth()+3)/3), //季度 
           "S"  : this.getMilliseconds()             //毫秒 
       }; 
       if(/(y+)/.test(fmt)) {
               fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
       }
        for(var k in o) {
           if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
       return fmt; 
   }        
    
    $.fn.myCalendar = function(options) {
        
        var calendar = new Calendar(this, options);

        //调用其方法
        return calendar.init();
    }
  })(jQuery, window, document);