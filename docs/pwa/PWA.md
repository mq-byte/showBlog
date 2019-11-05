---
title: PWA详解
---

# PWA 渐进式的web应用

## 介绍
我将带你快速熟悉一个pwa应用的基本使用

本文中涉及到的内容：
- fetch
- CacheStorage
- service worker
- SyncMannager
- postManager 与 messageChannal
- manifest.json
- 消息推送

## Fetch
Fetch 提供了许多与XMLHttpRequest相同的功能，为什么要在这里提及这个,因为在我们在service worker环境中是不能去使用XMLHttpRequest对象的，故而这是一个非常重要的api。

**Fetch 的核心在于对 HTTP 接口的抽象，包括 Request，Response，Headers，Body这些接口**

这里只是简单介绍

### 基本用法

```js
Promise<Response> fetch(input[, init]);
```
**参数介绍：**
- input定义要获取的资源。可能值：
 1. string：资源的 URL。一些浏览器会接受 blob: 和 data: 作为 schemes.
 2. Request 对象。

- init 可选
1. method: 请求方法，如 GET、POST。
2. headers: 请求的头，可以为 Headers 的对象，或者形如{'Content-Type': 'image/jpeg'}。
3. body: 请求体。可能为 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。GET 或 HEAD 无请求体。
4. mode: 请求的模式，如 cors、 no-cors 或者 same-origin。
5. credentials: 请求的 credentials，如 omit、same-origin 或者 include。为了在当前域名内自动发送 cookie ， 必须提供这个选项， 从 Chrome 50 开始， 这个属性也可以接受 FederatedCredential 实例或是一个 PasswordCredential 实例。
6. ...

## CacheStorage

这是一个可以缓存浏览器缓存的接口，离线应用的核心就靠他了

### CacheStorage常用方法介绍

name | 描述 |
- | - | 
Cache.match(request, options) | 该方法会检查是否存在该request的缓存，返回 Promise对象，resolve的结果是跟 Cache 对象匹配的第一个已经缓存的请求。 | 
Cache.matchAll(request, options) | 同上，不同的是resolve的结果是跟Cache对象匹配的所有请求组成的数组。 | 
Cache.add(request) | 抓取这个URL, 检索并把返回的response对象添加到给定的Cache对象.这在功能上等同于调用 fetch(), 然后使用 Cache.put() 将response添加到cache中. | 
Cache.addAll(requests) | 抓取一个URL数组，检索并把返回的response对象添加到给定的Cache对象。 | 
Cache.put(request, response) | 同时抓取一个请求及其响应，并将其添加到给定的cache。 | 
Cache.delete(request, options) | 搜索key值为request的Cache 条目。如果找到，则删除该Cache 条目，并且返回一个resolve为true的Promise对象；如果未找到，则返回一个resolve为false的Promise对象。 | 
Cache.keys(request, options) | 返回一个Promise对象，resolve的结果是Cache对象key值组成的数组。 | 

**options参数的解释：**  
- **ignoreSearch**（Boolean）: 忽略url中的query部分（?后面的参数）默认值：false
- **ignoreMethod**（Boolean）: 如果设置为 true在匹配时就不会验证 Request 对象的http 方法 (通常只允许是 GET 或 HEAD 。) 默认值：false  
- **ignoreVary**（Boolean）: 该值如果为 true 则匹配时不进行 VARY   部分的匹配。默认值：false  
- **cacheName**（DOMString）: 代表一个具体的要被搜索的缓存。注意该选项被 Cache.match()方法忽略。

## service worker

这是我们要花时间最多的地方！

### 生命周期

1. installing（正在安装）  

**当你调用 navigator.serviceWorker.register 注册一个新的 service worker ，service worker 代码就会被下载、解析、进入installing阶段。若安装成功则进入installed,失败则进入redundant**

2. installed/waiting（已安装/等待中）

**installed 状态下的service worker会判断自己是否已经被注册过，如果是第一次注册将进入activating状态，如果发现自己被注册且处于activated状态，那么将进入waiting状态**

3. activating（激活中）

**此状态下的sw将进入activated（必将进入activated状态）**

4. activated（已激活）

**一旦 service worker 激活，它就准备好接管页面并监听功能性事件了（例如 fetch 事件）**

5. redundant（废弃）

**当sw注册失败或者被新的sw替换将进入此状态（只有这两种情况会进入redundant）**


### 结合代码理解service worker生命周期

页面中的代码：
```js
if("serviceWorker" in navigator){
    window.onload = function(){
        navigator.serviceWorker.register("./sw.js").then((registration)=>{
            var sw = null, state;
            if(registration.installing) {
                sw = registration.installing;
                state = 'installing';
            } else if(registration.waiting) {
                sw = registration.waiting;
                state = 'installed'
            } else if(registration.active) {
                sw = registration.active;
                state = 'activated'
            }
            state && console.log(`sw state is ${state}`);
            if(sw) {
                sw.onstatechange = function() {
                    console.log(`sw state is ${sw.state}`);
                }
            }
        }).catch(()=>{
            console.log('sw fail');
        })
    }

}
```

sw.js：
```js
self.addEventListener('install',function () {
    console.log('install callback');
})

self.addEventListener('activate',function () {
    console.log('activate callback');
})

self.addEventListener('fetch',function () {
    console.log('fetch callback');
})
```

**首次刷新页面**控制台输出：
```shell
install callback
sw state is installing
sw state is installed
activate callback
sw state is activating
sw state is activated
```

**再次刷新页面**控制台输出：
```shell
sw state is activated
fetch callback
```

**install，与active事件仅仅执行一次，fetch在首次刷新也面试时是不请求的**

### 更新service worker

当更新sw时，刷新页面，此时：
1. 新的sw的install回调触发，进入installing
2. 新的sw发现上一个sw还处于actived状态则进入waiting状态
3. 此时调用slkipwating方法或者关闭浏览器再次打开浏览器，会使旧的sw进入redundant，新的sw进入actived

代码此处可以自己尝试

### waitUntil延长生命周期

waitUntil函数传入promise作为参数，当promise执行完成才会接着往下走。

#### 在install事件中调用该方法

1.加入成功的回调：
```js
self.addEventListener('install',function (event) {
    event.waitUntil(new Promise(function(resolve) {
        setTimeout(() => {
            console.log('install 2s')
            resolve()
        }, 2000)
    }))
})
```

控制台输出：
```js
sw state is installing
install 2s
sw state is installed
activate callback
sw state is activating
sw state is activated
```

2. 加入失败的回调：
```js
self.addEventListener('install',function (event) {
    event.waitUntil(new Promise(function(resolve,reject) {
        setTimeout(() => {
            console.log('install 2s')
            reject()
        }, 2000)
    }))
})
```


控制台输出：

```js
sw state is installing
install 2s
sw state is redundant
Uncaught (in promise) undefined
```

**sw直接进入redundant阶段**

#### 在activate事件中调用该方法

与install大致都一样，不同的是当你调用reject时，**sw不会进入redundant阶段，而是最终还是进入actived阶段**。

### 生命周期常见应用
1. 一般我们会在install中缓存请求，这是为了能够在下一次请求中使用到这些缓存。
2. 在active中我们应该清除旧的缓存。
3. 在fetch中我们便可以使用这些缓存，并且更新他们

### service worker的作用域范围?

service worker只能捕获当前目录及其子目录下的请求！

比如：  
当service worker在/pwa/sw.js下时那么只能捕获/pwa/*的请求，所以一般我们都应该将sw.js放置于/根目录下。


### 代码示例

如果你复制以下代码将在页面显示css代码

```js
var CACHE_NAME = "gih-cache";
var CACHED_URLS = [
    "/pwa/test.css"
];

self.addEventListener('install',function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(CACHED_URLS);
        })
    );
})

self.addEventListener('activate',function (event) {
    // event.waitUntil(
    //     caches.keys().then(function(cacheNames) {
    //         return Promise.all(
    //             cacheNames.map(function(cacheName) {
    //                 if (CACHE_NAME !== cacheName && cacheName.startsWith("gih-cache")) {
    //                     return caches.delete(cacheName);
    //                 }
    //             })
    //         );
    //     })
    // );
})

self.addEventListener('fetch',function (event) {
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                let fetchPromise = fetch(event.request).then(function(networkResponse) {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                })
                return response || fetchPromise;
            })
        })
    );
})

```

## 离线开发的策略
1. **仅网络**
2. **先网络后缓存**：当我们希望用户看见内容一直是最新的，那么可以使用这种模式，在fetch中更新缓存数据
3. **缓存后网络**：当不需要用户看见最新的内容，我们可以先将缓存呈现给用户，在fetch中更新缓存，下一次用户刷新可以看见最新的缓存。（以上代码采取的就是这种）

## syncManager 后台同步

在用户使用web app时，网页可能会被关闭，用户连接可能会断开，甚至服务器有时候也会故障。但是，**只要用户设备上安装了浏览器**，后台同步中的操作就不会消失，直到它成功完成为止。

### 注册后台同步事件
在页面中：
```js
navigator.serviceWorker.ready.then(function(registration) {     
    registration.sync.register('send-messages');
});
```

### 监听sync事件
在sw.js中
```js
self.addEventListener("sync", function(event) { 
    if (event.tag === "send-messages") {
        event.waitUntil(function() { 
            var sent = sendMessages(); 
            if (sent) {
                return Promise.resolve(); 
            }else{
                return Promise.reject(); 
                
            }
        }); 
    }
});
```
### sync事件何时结束？
当后台多次尝试不成功时，那么sync事件也会提供结束时的标识符**event.lastChance**。

```js
self.addEventListener("sync", event => { 
    if (event.tag == "add-reservation") {
        event.waitUntil( 
            addReservation()
            .then(function() {
                return Promise.resolve();
            }).catch(function(error) {
                if (event.lastChance) { 
                    return removeReservation();
                } else {
                    return Promise.reject();
                }
            })
        ); 
    }
});
```
## postMessage
当我们将逻辑代码放入service worker中时，我们就一定会有页面与service worker通信的需求，此时postMessage便是这么一个担任通信的角色。

### 1. 窗口向service worker通信
页面代码：
```js
navigator.serviceWorker.controller.postMessage( {
    arrival: "05/11/2022", 
    nights: 3, 
    guests: 2
})
```
service worker代码：
```js
self.addEventListener("message", function (event) { 
    console.log(event.data);
});
```

### 2. service worker向所有打开的窗口通信
页面代码：
```js
navigator.serviceWorker.addEventListener("message", function (event) {
    console.log(event.data);
});

```
service worker代码：
```js
self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
        if (client.url.includes("/my-account")) { 
            client.postMessage("Hi client: "+client.id);
        } 
    });
});
```


### 3. service worker向特定窗口通信

service worker代码：
```js
//当你可以获得某个客户端id时便可以向特定的客户端发送消息
self.clients.get("d2069ced-8f96-4d28").then(function(client) {
    client.postMessage("Hi window, you are currently " +
                        client.visibilityState);
});
```

#### 获得特定的客户端id
```js

//通过clients对象获取客户端id
self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
        self.clients.get(client.id).then(function(client) {  
            client.postMessage("Messaging using clients.matchAll()");
        });
    });
});

//通过event.sourse.id 获得·客户端id
self.addEventListener("message", function(event) {
    self.clients.get(event.source.id).then(function(client) {
        client.postMessage("Messaging using clients.get(event.source.id)");
    });
});

//简化写法
self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
        client.postMessage("Messaging using clients.matchAll()"); 
    });
});

```

## MessageChannel
在介绍第四种通信方式（窗口间通信）时，我想先插入介绍一下MessageChannel这个对象，他是实现我们service worker与窗口间相互通信的一种有效的技术手段。

### 演示代码

```js
// 窗口代码
var msgChan = new MessageChannel(); 
msgChan.port1.onmessage = function(event) {
    console.log("Message received in page:", event.data); 
};
var msg = {action: "triple", value: 2}; 
//这里可以是postMessage的第二个参数
navigator.serviceWorker.controller.postMessage(msg, [msgChan.port2]);


// service worker代码 
self.addEventListener("message", function (event) {
    var data = event.data;
    var openPort = event.ports[0]; 
    if (data.action === "triple") {
        openPort.postMessage(data.value*3); 
    }
});
```

### 4. 窗口间的通信

窗口间通信方式有多种，你如localStorage这些都可以实现，这里还是应该思考如何使用service worker来进行通信，这里先不再赘述。

### manifest.json
当我们的web应用已经使用以上技术做到了一系列的离线优化后，我们可以考虑将我们的应用安装在本地。

页面引入：
```html
<link rel="manifest" href="/manifest.json">
```

manifest.json:
```json
{
    "short_name": "Gotham Imperial",
    "name": "Gotham Imperial Hotel",
    "description": "Book your next stay, manage reservations, and explore Gotham", "start_url": "/my-account?utm_source=pwa",
    "scope": "/",
    "display": "fullscreen",
    "icons": [
        {
        "src": "/img/app-icon-192.png", "type": "image/png",
        "sizes": "192x192"
        }, {
        } 
    ],
    "theme_color": "#242424",
    "background_color": "#242424" 
}
```

### 属性介绍

- **name与/或short_name：**  
name 是应用的全名。当空间足够长时，就会使用这个字段作为显示名称，short_name 可以作为短 名的备选方案

- **start_url：**  
当用户点击图标时，打开的 URL。可以是根域名，也可以是内部页面。

- **icon：**  
包含了一个或多个对象的数组，对象属性：src(图标的绝对路径或者相对路径)、type(文件类型)和 sizes(图片的像素尺寸)。要触发Web应用安装横条，清单中至少要包含一个图标， 尺寸至少是 144像素×144像素。 
由于每个设备都会根据设备分辨率，从这个数组中选择最佳的图标尺寸，因此建议至少 包含 192×192 的图标和 512×512 的图标，以覆盖大多数的设备和用途。

- **display：**
1. browser——在浏览器中打开应用。
2. standalone——打开应用时不显示浏览器栏(不显示浏览器界面，例如地址栏)。
3. fullscreen——打开应用时不显示浏览器栏和设备栏(例如在安卓设备上，这意味着 同时隐藏浏览器界面和屏幕顶部的状态栏)。

- **description：**  
应用的描述。

- **orientation：**  
允许你强制指定某个屏幕方向。

- **theme_color**  
主题颜色可以让浏览器和设备调整 UI 以匹配你的网站(见图 9-5)。这个颜色的选择会 影响浏览器地址栏颜色、任务切换器中的应用颜色，甚至是设备状态栏的颜色。主题颜色也可以通过页面的meta标签进行设置(例如:<meta name="theme-color" content="#2196F3">)。如果页面带有 theme-color 的 meta 标签，则该设置会覆盖清单 中的 theme_color 设置。请注意，虽然 meta 标签可以让你设置或者覆盖单个页面的主 题颜色，但是清单文件中的 theme_color 设置是会影响整个应用的。


- **background_color**  
设置应用启动画面的颜色以及应用加载时的背景色。一旦加载后，页面中定义的任何背 景色(通过样式表或者内联 HTML 标签设置)都会覆盖这一设置;但是，通过将其设 置为与页面背景色相同的颜色，就可以实现从页面启动的瞬间到完全渲染之间的平滑过 渡。如果不设置这一颜色，页面就会从白色背景启动，随后被页面的背景色替换。

- **scope**  
如果我们设置了"scope": "/my-account/"，当用户在这个作用域内跳转时(例 如 /my-acount/talater 或者 /my-account?sort=date)，会留在应用中。但是一旦用户点 击了这个范围外的链接(例如 /index.html 或者 https://pwabook.com)，页面就会在浏 览器中打开。


- **dir**  
显示 name、short_name 和 description参数文本的方向。默认情况下适配浏览器的语言 设置，但是也可以设置为以下值之一。  
• ltr——从左到右的语言，例如英语和葡萄牙语  
• rtl——从右到左的语言，例如希伯来语和阿拉伯语  
• auto——使用浏览器的语言设置

- **lang**  
指定 name、short_name 和 description 参数文本的主要语言。
可以和 dir 参数一起用来保证任何语言的文本正确显示，包括从右到左的语言。

...


## 消息推送



更新中
