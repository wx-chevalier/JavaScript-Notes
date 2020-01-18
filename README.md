![封面](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/8/1/1-roedigbmFjRYkZobdZWuKg.jpeg)

# 现代 JavaScript 开发：语法基础与工程实践

历经二十载风云变幻，JavaScript 也终于成为了一流的语言，在前端开发、服务端开发、嵌入式开发乃至于机器学习与数据挖掘、操作系统开发等各个领域都有不俗的表现。而在这不断的变化之后，也有很多语法或者模式成了明日黄花；本系列文章即是希望为读者总结与呈现出最新的应该掌握的 JavaScript 语法基础与实践基础。

JavaScript 的设计与语法一直为人所诟病，不过正如 Zeit 的 CEO Guillermo Rauch 所言：JavaScript 虽然生于泥沼，但是在这么多年不断地迭代中，它也慢慢被开发者与市场所认可，最终化茧成蝶，被广泛地应用在从客户端到服务端，从应用开发、系统构建到数据分析的各个领域。JavaScript 最薄弱的一点在于其是解释性的无类型的语言，这一点让其在大型项目或者系统开发中充满了很多的性能瓶颈或者不稳定性；譬如在 JavaScript 中某个函数可以接受任意数目、任意类型的参数，而 Java 则会在编译时即检测参数类型是否符合预期。早期的 JavaScript 仅被用于为网页添加简单的用户交互，譬如按钮响应事件或者发送 Ajax 请求；不过随着 Webpack 等现代构建工具的发展，开发者可以更加工程化地进行高效的前端项目开发，并且整个网页的加载性能也大大提高，譬如 PWA 等现代 Web 技术能够使 Web 应用拥有与原生应用相近的用户体验。

我喜爱这门语言，所以我希望能够以绵薄之力让更多的人无痛地使用它，在返回主页后您可以看到更多有关 JavaScript 的代码实践。本篇的所有参考资料声明在 [Awesome JavaScript Lists](https://ngte-al.gitbook.io/i/?q=JavaScript)。

![](https://i.postimg.cc/L8hGQznm/image.png)

# About

## Home & More | 延伸阅读

![技术视野](https://s2.ax1x.com/2019/12/03/QQJLvt.png)

您可以通过以下导航来在 Gitbook 中阅读笔者的系列文章，涵盖了技术资料归纳、编程语言与理论、Web 与大前端、服务端开发与基础架构、云计算与大数据、数据科学与人工智能、产品设计等多个领域：

- 知识体系：《[Awesome Lists | CS 资料集锦](https://ng-tech.icu/Awesome-Lists)》、《[Awesome CheatSheets | 速学速查手册](https://ng-tech.icu/Awesome-CheatSheets)》、《[Awesome Interviews | 求职面试必备](https://ng-tech.icu/Awesome-Interviews)》、《[Awesome RoadMaps | 程序员进阶指南](https://ng-tech.icu/Awesome-RoadMaps)》、《[Awesome MindMaps | 知识脉络思维脑图](https://ng-tech.icu/Awesome-MindMaps)》、《[Awesome-CS-Books | 开源书籍（.pdf）汇总](https://github.com/wx-chevalier/Awesome-CS-Books)》

- 编程语言：《[编程语言理论](https://ng-tech.icu/ProgrammingLanguage-Series/#/)》、《[Java 实战](https://ng-tech.icu/Java-Series)》、《[JavaScript 实战](https://ng-tech.icu/JavaScript-Series)》、《[Go 实战](https://ng-tech.icu/Go-Series)》、《[Python 实战](https://ng-tech.icu/ProgrammingLanguage-Series/#/)》、《[Rust 实战](https://ng-tech.icu/ProgrammingLanguage-Series/#/)》
- 软件工程、模式与架构：《[编程范式与设计模式](https://ng-tech.icu/SoftwareEngineering-Series/)》、《[数据结构与算法](https://ng-tech.icu/SoftwareEngineering-Series/)》、《[软件架构设计](https://ng-tech.icu/SoftwareEngineering-Series/)》、《[整洁与重构](https://ng-tech.icu/SoftwareEngineering-Series/)》、《[协作与项目管理](https://ng-tech.icu/SoftwareEngineering-Series/)》

* Web 与大前端：《[现代 Web 全栈开发与工程架构](https://ng-tech.icu/Web-Series/)》、《[数据可视化](https://ng-tech.icu/Frontend-Series/)》、《[iOS](https://ng-tech.icu/Frontend-Series/)》、《[Android](https://ng-tech.icu/Frontend-Series/)》、《[混合开发与跨端应用](https://ng-tech.icu/Web-Series/)》、《[Node.js 全栈开发](https://ng-tech.icu/Node-Series/)》

* 服务端开发实践与工程架构：《[服务端功能域](https://ng-tech.icu/Backend-Series/#/)》、《[微服务与云原生](https://ng-tech.icu/MicroService-Series/#/)》、《[测试与高可用保障](https://ng-tech.icu/Backend-Series/#/)》、《[DevOps](https://ng-tech.icu/Backend-Series/#/)》、《[Spring](https://ng-tech.icu/Spring-Series/#/)》、《[信息安全与渗透测试](https://ng-tech.icu/Backend-Series/#/)》

* 分布式基础架构：《[分布式系统](https://ng-tech.icu/DistributedSystem-Series/#/)》、《[分布式计算](https://ng-tech.icu/DistributedSystem-Series/#/)》、《[数据库](https://github.com/wx-chevalier/Database-Series)》、《[网络](https://ng-tech.icu/DistributedSystem-Series/#/)》、《[虚拟化与云计算](https://github.com/wx-chevalier/Cloud-Series)》、《[Linux 与操作系统](https://github.com/wx-chevalier/Linux-Series)》

* 数据科学，人工智能与深度学习：《[数理统计](https://ng-tech.icu/Mathematics-Series/#/)》、《[数据分析](https://ng-tech.icu/AI-Series/#/)》、《[机器学习](https://ng-tech.icu/AI-Series/#/)》、《[深度学习](https://ng-tech.icu/AI-Series/#/)》、《[自然语言处理](https://ng-tech.icu/AI-Series/#/)》、《[工具与工程化](https://ng-tech.icu/AI-Series/#/)》、《[行业应用](https://ng-tech.icu/AI-Series/#/)》

* 产品设计与用户体验：《[产品设计](https://ng-tech.icu/Product-Series/#/)》、《[交互体验](https://ng-tech.icu/Product-Series/#/)》、《[项目管理](https://ng-tech.icu/Product-Series/#/)》

* 行业应用：《[行业迷思](https://github.com/wx-chevalier/Business-Series)》、《[功能域](https://github.com/wx-chevalier/Business-Series)》、《[电子商务](https://github.com/wx-chevalier/Business-Series)》、《[智能制造](https://github.com/wx-chevalier/Business-Series)》

此外，你还可前往 [xCompass](https://ng-tech.icu/) 交互式地检索、查找需要的文章/链接/书籍/课程；或者也可以关注微信公众号：**某熊的技术之路**以获取最新资讯。
