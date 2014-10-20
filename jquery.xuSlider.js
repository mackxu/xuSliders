;(function ( $, window, document, undefined ) {
    'use strict';
    // Create the defaults once
    var pluginName = 'xuSlider',
        defaults = {
            controlNav: true,
            directionNav: true,
            startAt: 0,
            animateTime: 700,
            slideshowSpeed: 2000,
            pauseOnHover: true,
            autoSlide: true
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options);
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var $el = this.$el = $(this.element); 
            this.$sliders = $el.find('ul');
            this.$controlNavs = $el.find('.control-nav li');
            this.unit = -$el.width();               // 每次动作的滚动长度单位
            this.autoTimer = null;                  
            // 调整结构和样式
            this.clone();
            var $slidersAll = this.$slidersAll = this.$sliders.find('li')
                , slidersNum = this.slidersNum = $slidersAll.length
                , startAt = ++this.options.startAt
                ;
            // 绘制配置的样式
            this.$sliders.css({ left: startAt * this.unit, width: -slidersNum * this.unit, position: 'relative' });
            $slidersAll.css({ width: -this.unit, height: $el.height(), float: 'left' }).eq(startAt).addClass('slider-active');
            this.$controlNavs[startAt - 1].className = 'active';
            // 为DOM添加监听事件
            this.addEvent();
            // 默认自动slide
            this.options.autoSlide && this.autoSlide();
        },
        clone: function() {
            var $slidersAll = this.$sliders.find('li');
            $slidersAll.eq(0).clone(true).addClass('clone').appendTo(this.$sliders);
            $slidersAll.eq(-1).clone(true).addClass('clone').prependTo(this.$sliders);
        },
        move: function(callback, autoEmit) {
            var self = this, end = this.options.startAt;
            // 移动的向量
            this.$sliders.animate({
                left: end * this.unit
            }, this.options.animateTime, function() {
                if(typeof callback === 'function') {
                    callback(), end = self.options.startAt;     // 回调函数会更新options.startAt
                }
                self.$sliders.css('left', end * self.unit);
                self.$slidersAll.removeClass('slider-active').eq(end).addClass('slider-active');
                self.$controlNavs.removeClass('active').get(end - 1).className = 'active';
                // 如果配置是自动播放, 手动滑动后, 继续自动播放
                !autoEmit && self.options.autoSlide && self.autoSlide();
            });
        },
        next: function(autoEmit) {
            var self = this;
            self.options.startAt += 1;
            self.move(function() {
                // 当最后一帧再次向后点击时
                self.slidersNum - 1 === self.options.startAt && (self.options.startAt = 1);
            }, autoEmit);
        },
        autoSlide: function() { 
            var self = this;
            self.autoTimer = setInterval(function() {
                // 由于自动播放和下一帧动作同时走next(), 用参数做区分
                self.next(true);
            }, self.options.slideshowSpeed); 
        },
        addEvent: function() {
            var evType = window.ontouchstart ? 'touchstart' : 'click'
                , self = this
                , options = self.options
                , delay = 200
                ;
            // 为左右箭头添加监听事件
            self.$el.find('.direction-nav').on(evType, 'a', function() {
                var el = this;
                // 取消自动播放
                clearInterval(self.autoTimer);
                if(el.className.indexOf('next') !== -1) {
                    // 向后移动
                    el.timer != null && clearTimeout(el.timer);                 // 添加点击延迟，默认200ms
                    el.timer = setTimeout(function() { self.next(); }, delay);
                }else {
                    // 向前移动
                    el.timer != null && clearTimeout(el.timer);
                    el.timer = setTimeout(function() {
                        self.options.startAt -= 1;
                        self.move(function() {
                            // 当第一帧再次向前点击时, 显示第0帧, 调整到最后一帧
                            0 === self.options.startAt && (self.options.startAt = self.slidersNum - 2);
                        });
                    }, delay);
                }
            });
            self.$el.find('.control-nav').on(evType, 'li', function() {
                clearInterval(self.autoTimer);
                // 利用原生api: dataset, 返回的是字符串类型
                self.options.startAt = +this.dataset.id;
                self.move();
            });

            // hover时停止自动播放
            self.$el.on('mouseenter', function() {
                options.pauseOnHover && clearInterval(self.autoTimer);
            }).on('mouseleave', function() {
                options.pauseOnHover && options.autoSlide && self.autoSlide();
            });
            
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            // 避免重复提添加监听事件
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

})(jQuery, window);