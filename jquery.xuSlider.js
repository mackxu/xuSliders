;(function ( $, window, document, undefined ) {
    'use strict';
    // Create the defaults once
    var pluginName = 'xuSlider',
        defaults = {
            
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
            var $el = $(this.element)
                , $sliders = $el.find('ul')

                ;
        },
        clone: function() {
            $sliders
                .find('li')
                .eq(0).clone(true).appendTo($sliders)
                .end()
                .eq(-1).clone(true).prependTo($sliders);
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