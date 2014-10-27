xuSliders
=========

jquery插件 焦点图效果

2014/10/22 添加fullSlider插件

主要逻辑    
1、克隆2份当前slider  
2、相对平移（当超出范围时）  
3、向右移动判断是否出界补全时需要注意 
> currLeft - sliderUnit 获得显示的最右边坐标   
> 再次减去sliderUnit 才能判断继续向右运动是否出界 

4、补全视图，使用css的`relative`属性
