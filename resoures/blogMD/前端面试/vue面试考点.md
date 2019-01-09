## 1. vue生命周期？[你可能不是真的了解](https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA)

## 2. 计算属性 vs 监听属性 vs 方法?

## 3. v-if v-show区别，应用环境？template 组件包裹？

## 4. v-for key?

## 5. 数组更新检测机制？defineProperty的理解？vue3.0中的proxy?
[defineProperty](https://segmentfault.com/a/1190000011294519)

## 6. 如何传入事件对象？

## 7. Passive event listeners？
[点击查看](https://blog.csdn.net/shenlei19911210/article/details/70198771)
由于浏览器无法预先知道一个事件处理函数中会不会调用 preventDefault()，它需要等到事件处理函数执行完后，才能去执行默认行为，然而事件处理函数执行是要耗时的


## 8. 组件data是个函数？

## 9. 注册组件的方式？

## 10. 组件数据传值？
1. 父子组件？
2. 兄弟组件？

## 11. 动态组件？作用？


## 12. 自定义事件？


## 13. .sync?
[点击查看](https://www.jianshu.com/p/6b062af8cf01)


## 14. 插槽？

## 15. 插件？

## 16. 路由，vux,ssr(nuxt)?


## 17. 路由解析流程？
1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。