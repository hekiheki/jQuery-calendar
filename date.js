;(function($, window, document,undefined) {
    //Calendar
    var Calendar = function(ele, opt) {
        this.$element = ele;
        this.name = this.$element.attr('id');
        this.defaults = "yyyy-mm-dd";
        
        this.options = $.extend({}, this.defaults, opt)

    }
    //定义Calendar的方法
    Calendar.prototype = {
        init: function() {
            var _this = this;
            var _Date = new Date(),
                y = _Date.getFullYear(),
                m = _Date.getMonth()+1,
                d = _Date.getDate(),
                sy = y-50,
                ey = y+20;     
            _this.$element.focus(function(){
                if(!$('#Calendar').length>0){
                    _this.creatCalendarDOM(sy,ey,y,m,d);
                }else{
                    _this.showCalendar();
                }
                _this.setPosition();
                // 改变年份
                $('body').on('change','#setYear',function(){
                    year = $('#setYear').val();
                    month = $('#setMonth').val();
                    $('#Calendar tbody').html(_this.createDaysDom(year,month));
                    if(year == y && month == m){
                        _this.isToday(d);
                    }  
                })
                // 改变月份
                $('body').on('change','#setMonth',function(){
                    year = $('#setYear').val();
                    month = $('#setMonth').val();
                    $('#Calendar tbody').html(_this.createDaysDom(year,month));
                    if(year == y && month == m){
                        _this.isToday(d);
                    }
                })
                // 选择日期
                $('body').on('click','.calendar-td',function(){
                    $('.calendar-td').removeClass('calendar-td-on');
                    $(this).addClass('calendar-td-on');
                    var showY = $('#setYear').val();
                    var showM = $('#setMonth').val();
                    var showD = $(this).text();
                    _this.$element.val(showY+'-'+showM+'-'+showD);
                    _this.hideCalendar();
                }) 
            });

            
            
            $('body').on('click','.calendar-close',function(){
                _this.hideCalendar();
            })
        },
        creatCalendarDOM: function(sy,ey,y,m,d){
            var _this = this;
            var years = _this.setYearValue(sy,ey);
            var weeks = ['日','一','二','三','四','五','六'];
            var months = [];
            for(var i=1;i<13;i++){
                months.push(i+'月');
            }

            // 生成选择年份的选择框
            var setYearSelect = '<select id="setYear">';
            for(var i=0;i<years.length;i++){
                setYearSelect +='<option value="'+years[i]+'">'+years[i]+'</option>';
            }
            setYearSelect += '</select>';
            // 生成选择月份的选择框
            var setMonthSelect = '<select id="setMonth">';
            for(var i=0;i<months.length;i++){
                var value = i+1;
                setMonthSelect +='<option value="'+value+'">'+months[i]+'</option>';
            }
            setMonthSelect += '</select>';
            // 生成顶部的节点
            var topDiv = '<div class="calendar-top">'+setYearSelect+setMonthSelect+'<i class="calendar-close iconfont icon-close"></i></div>';
            
            // 生成显示星期的节点
            var weeksTr = '<thead><tr>';
            for(var i=0;i<weeks.length;i++){
                weeksTr +='<th>'+weeks[i]+'</th>';
            }
            weeksTr += '</tr></thead>';
            var daysTr= _this.createDaysDom(y,m);
            var dateFormatDiv = '<div id="dateFormatDiv"><table cellspacing="2">'+weeksTr+'<tbody name="'+this.name+'">'+daysTr+'</tbody></table></div>';
            
            // 生成日历节点
            var containerDiv = '<div id="Calendar" class="calendar-box">'+topDiv+dateFormatDiv+'</div>';
            $('body').append(containerDiv);

            $('#setYear').val(y);
            $('#setMonth').val(m);

            // 是否是今天
            _this.isToday(d);
        },
        setYearValue: function(startY,endY){   // 设置开始年份和结束年份
            var years = [];
            for(var i=startY;i<=endY;i++){
                years.push(i);
            }
            return years;
        },
        leapYear: function(year){    // 判断闰年
            return !(year % (year % 100 ? 4 : 400));
        },
        createDaysDom: function(y,m){   // 生成日期节点
            // 生成日期节点
            var _this = this,
                daysTr = '<tr>',
                daysLength = 30,
                days = [];
            // 判断每个月天数
            if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
                daysLength = 31;
            }else if(m==4||m==6||m==7||m==10){
                daysLength = 30;
            }else if(m==2){
                _this.leapYear(y) ? daysLength = 29 : daysLength=28;
            }
           // 把星期几和日期对应起来
            for(var i=1;i<=daysLength;i++){
                var dayValue = new Date(y+'-'+m+'-'+i).getDay();
                days.push({day: dayValue,date: i});
            }
            // 1号不是星期天的时候，补齐表格
            if(days[0].day!=0){
                for(var i=0;i<days[0].day;i++){
                    daysTr += '<td></td>';
                }
            }
            //是星期六的那天，换行
            for(var i=0;i<days.length;i++){
                if(days[i].day==6){
                    daysTr += '<td class="calendar-td">'+days[i].date+'</td></tr><tr>';
                }else{
                    daysTr += '<td class="calendar-td">'+days[i].date+'</td>';
                }
            }
            daysTr += '</tr>';

            return daysTr;
        },
        showCalendar: function(){
            $('#Calendar').show();
        },
        hideCalendar: function(){
            $('#Calendar').hide();
        },
        isToday: function(d){
            $('.calendar-td').each(function(){
                var my = $(this);
                if(my.text() == d){
                    my.addClass('calendar-td-today');
                }
            })
        },
        setPosition: function(){
            var inputHeight = this.$element.outerHeight(),
                inputTop = this.$element.offset().top,
                inputLeft = this.$element.offset().left;
            $('#Calendar').css({
                left: inputLeft+'px',
                top: inputHeight+inputTop+'px'
            })
        }
    }
    
    $.fn.myCalendar = function(options) {
        
        var calendar = new Calendar(this, options);
        
        // calendar.$element.focus(function(){
        //     calendar.init()
        // })
        // console.log(calendar.$element)
        //调用其方法
        return calendar.init();
    }
  })(jQuery, window, document);