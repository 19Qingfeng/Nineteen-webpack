# 19-webpack
重新温习温习webpack。


#### 什么是loader？
> webpack默认知道如何打包js文件，对于一些css，图片，字体等非js文件需要使用使用loader去处理让webpack识别通过loader处理。
<br>
File-loader举例 -> 当webpack碰到test匹配的.jpeg结尾的文件就会交给use的file-loader处理。<br>
+ 首先遇到test-img.jpeg会将它移动到dist目录下，同时会修改名称。(文件移动到打包目录下)
+ 然后得到一个图片相对与dist目录的一个名称然后讲名称返回给require的变量default属性中。(同时获得移动文件的地址)

> 其实loader就是一个特定方案，让webapck对一些不支持的文件通过loader认识他们并且进行打包。<br>
> webpack对于非js文件通过loader进行识别。<br>
> module中的rules进行配置。