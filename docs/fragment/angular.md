---
title: angular7.0使用指南
---

# angular7.0使用指南

本文章宗旨在于快速开始angular开发，或者快速了解angular开发注意事项的文章

## 环境搭建
1. 脚手架安装：npm i -g @angular/cli
2. 新建项目：ng new my-app
 

<font color=red >如果安装脚手架报错，强制清理npm缓存后重新安装</font>

## 组件与模板
当你下载好官方案列后，你可能对目录都不太熟悉，先不要将关注点放在这里，文章致力于如何快速上手一个angular项目。


### 理解模板表达式上下文
<font color=red >表达式中的上下文变量是由以下三种组成：</font>
1. 模板变量 （<font color=red >模板的 $event 对象</font>、<font color=red >模板输入变量 (let hero)</font>和<font color=red >模板引用变量(#heroForm)</font> ）
2. 指令的上下文变量（<font color=red >指令中的属性</font>）
3. 组件的成员变量（<font color=red >组件实列</font>）

**当存在相同的表达式变量优先顺序：模板变量>>指令的上下文变量>>组件的成员变量**



```javascript
import { Component } from '@angular/core';

//my-app/src/app/app.component.ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private data0:Number = 1121; 
  data1 = '<div>dddddd</div>';
  data2 = {
    aaa:222
  };
  data3(){
  };
  data4 = null;
  data5 = undefined;
  data6 = [1,2,3]
}
```
```html
<div>
  <div>data0 ：{{data0}}</div>
  <div>data1 ：{{data1}}</div>
  <div>data2 ：{{data2}}</div>
  <div>data3 ：{{data3}}</div>
  <div>data4 ：{{data4}}</div>
  <div>data5 ：{{data5}}</div>
  <div>data6 ：{{data6}}</div>
  <div>data7 ：{{data7}}</div>
</div>

<!-- 
	data0 ：1121
	data1 ：<div>dddddd</div>
	data2 ：[object Object]
	data3 ：function () { }
	data4 ：
	data5 ：
	data6 ：1,2,3
	data7 ： 
-->
```

### 理解HTML attribute 与 DOM property 
先来看一个列子
```javascript
//html：<input type="text" value="a">
var outPutVal = function(){
    console.log('getAttribute：',inO.getAttribute('value'));
    console.log('inO.value:',inO.value);
}

window.onload = function(){
    var inO = document.querySelect('input');
    outPutVal(inO);
    //getAttribute： a
    //inO.value: a
    document.onclick = function(){
        //<input type="text" value="a"> 手动输入value为aaaaa后打印
        outPutVal(inO);
        //getAttribute： a
        //inO.value: aaaaa
    }
}
```

以上原生js展示了HTML attribute 与 DOM property 的区别:
1. 少量 HTML attribute 和 property 之间有着 1:1 的映射，如 id。
2. 有些 HTML attribute 没有对应的 property，如 colspan。
3. 有些 DOM property 没有对应的 attribute，如 textContent。

<font color=red >angular中模板绑定是通过 property 和事件来工作的，而不是 attribute</font>

**特殊的attribute 绑定**
```html
[attr.aria-label]="actionName"
<td [attr.colspan]="1 + 1">
```

### 指令
指令分为三种：
1. 组件 — 拥有模板的指令
2. 结构型指令 — 通过添加和移除 DOM 元素改变 DOM 布局的指令
3. 属性型指令 — 改变元素、组件或其它指令的外观和行为的指令。


#### 属性指令
1. ngClass
2. ngStyle
3. ngModel


#### 结构型指令
1. ngIf
2. ngFor
3. ngSwitch

##### ng-template *号语法
```html
<div *ngIf="hero" class="name">{{hero.name}}</div>
-----------------------------------
<ng-template [ngIf]="hero">
  <div class="name">{{hero.name}}</div>
</ng-template>
```


```html
<div *ngFor="let hero of heroes; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  ({{i}}) {{hero.name}}
</div>
-----------------------------------
<ng-template ngFor let-hero [ngForOf]="heroes" let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
  <div [class.odd]="odd">({{i}}) {{hero.name}}</div>
</ng-template>
```
<font color=red >在渲染视图之前，Angular 会把 < ng-template > 及其包裹内容替换为一个注释</font>

##### ng-container
会将兄弟元素归为一组并且<font color=red >ng-template 会无副作用的包裹内部元素</font>

无副作用是什么意思？（举个例子：破坏了html结构！）：
```html
<p>
  I turned the corner
  <span *ngIf="hero">
    and saw {{hero.name}}. I waved
  </span>
  and continued on my way.
</p>

---------------------------

<p>
  I turned the corner
  <ng-container *ngIf="hero">
    and saw {{hero.name}}. I waved
  </ng-container>
  and continued on my way.
</p>
```




#### 组件--特殊的指令（拥有模板的指令）
```
ng g c components/A 创建组件
```
#### 组件通信的几种方式
#####  1.输入属性 @Input()（父组件传递数据给子组件）
```javascript
//a.component.ts
  @Input()
  inAttr:String;


  private _name:String = '';
----------------------------------------------------
  @Input()
  set inAttr2(name:String){
    this._name = name;
  }
  
  get inAttr2():String{
    return this._name;
  }
```
##### 2.输出属性 @Output()（子组件传递数据给父组件）
```javascript
//子组件中
@Output()
myEvent:EventEmitter<DataType> = new EventEmitter();

this.myEvent.emit(Data);

//父组件中
(myEvent)="myHandleEvent($event)"
myHandleEvent(Data:DataType){
    
}
```

##### 3.中间人模式（兄弟组件通过公共的父组件传值）

##### 4.父组件获得子组件引用 #child（只可以在组件模板中使用）

##### 5. @ViewChild()父组件类插入子组件 （在组件类中使用）
1. 被注入的子组件只有在 Angular 显示了父组件视图之后才能访问（ngAfterViewInit生命周期中访问）
2. Angular 的单向数据流规则会阻止在同一个周期内更新父组件视图。应用在显示秒数之前会被迫再等一轮。
3. 解决方法：使用 setTimeout() 来更改数据
```javascript
@ViewChild(ChildComponent)
private childComponent: ChildComponent;

ngAfterViewInit() {
    setTimeout(() => this.seconds = () => this.childComponent.changeData, 0);
}
```

##### 6.通过服务更改数据（任意组件结构中使用）



#### 自定义指令
```
ng g d myDirective/demo
```
1. 属性型指令

ElementRef：对视图中某个原生元素的包装器。

```javascript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDemo]'
})
export class DemoDirective {
  //构造函数要声明需要注入的元素 el: ElementRef。
  constructor(private el:ElementRef) { }
  // 注册事件
  @HostListener('click')
  show(){
    console.log(this.el.nativeElement);
    console.log(this.ss);
  }
  //指令参数，当参数名与指令名相同时，可以直接赋值给指令
  @Input()
  ss:String = 'aaa';
}

```

```html
<button appDemo [ss]="bbb">click me</button>
```


2. 结构型指令

TemplateRef：取得 < ng-template > 的内容

ViewContainerRef: 访问视图容器


```javascript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appUnless]'})
export class UnlessDirective {
  //第一次传入true时不执行任何if分支,提升性能
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      //实列化一个试图，并把它插入到该容器中
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```
### 管道
你可以将管道理解成将数据处理之后再显示的一种操作符，如：

```html
<p>{{ birthday}}</p>
<p>{{ birthday | date }}</p>
<!--链式调用管道-->
<p>{{ birthday | date | uppercase}}</p>
```

#### angular内置的管道：
DatePipe、UpperCasePipe、LowerCasePipe、CurrencyPipe 和 PercentPipe.......

#### 自定义管道

```js
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'exponentialStrength'})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, exponent: string): number {
    let exp = parseFloat(exponent);
    return Math.pow(value, isNaN(exp) ? 1 : exp);
  }
}
```

#### 纯(pure)管道与非纯(impure)管道
1. Angular 只有在它检测到输入值发生了<font color=red >纯变更</font>时才会执行<font color=red >纯管道</font>。 <font color=red >纯变更</font>是指对原始类型值(String、Number、Boolean、Symbol)的更改， 或者对对象引用(Date、Array、Function、Object)的更改。

2. Angular 会在每个组件的变更检测周期中执行<font color=red >非纯管道</font>。 非纯管道可能会被调用很多次，和每个按键或每次鼠标移动一样频繁。

```js
@Pipe({
  name: 'flyingHeroesImpure',
  pure: false
})
export class FlyingHeroesImpurePipe extends FlyingHeroesPipe {}
```



## 依赖注入
依赖注入是实现控制反转的一种方式，将对象的创造权交出去，它的好处可以在实际开发中体现出来，以下会介绍它

### angular实现控制反转的手段就是依赖注入
### 依赖注入的好处：
依赖注入会让你用一种松耦合的方式去写代码，易于调试：

举个例子：

当你的服务分为开发版本与线上版本时，你可能需要两个不同的服务devDataSevice与proDataSevice,
当你不使用依赖注入时，你需要在多个组件中new 出这两个对象来使用这两个服务，在线上环境与测试环境之间切换时，你需要更改多个组件中的代码，如果使用依赖注入的形式，你只需要更改提供器中的代码就可以更改所有组件中的服务，这大大降低了代码的耦合程度并且提高了可维护性。

### 首先创建一个服务
```js
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor() { }
}
```

### 服务提供商（注入器）
在哪里书写服务提供商：

1. <font color=red >在服务本身的 @Injectable() 装饰器中的 providedIn 的元数据选项</font>

    providedIn的值可以是'root'或者某个特定的NgModule

2. <font color=red >在 NgModule 的 @NgModule() 装饰器中的providers元数据选项</font>
3. <font color=red >在组件的 @Component() 装饰器中providers元数据选项</font>
4. <font color=red >在指令的 @Directive() 装饰器中providers元数据选项</font>（元素级注入器）
 
providers中如何书写：
```javascript
provider:[ProductService]
provider:[{provide:ProductService,useClass:ProductService}]
provider:[{provide:ProductService,useClass:AnotherProductService}]
provider:[{provide:ProductService,useFactory:(参数A)=>{return ob},deps:[参数A]}]
provider:[{provide:"IS_DEV_ENV",useValue:{isDev:true}}]
```
### 注入器冒泡
1. Angular 会尝试寻找该组件自己的注入器
2. 如果该组件的注入器没有找到对应的提供商，它就去寻找它父组件的注入器直到 Angular 找到一个合法的注入器或者超出了组件树中的祖先位置为止。
3. 如果超出了组件树中的祖先还未找到，Angular 就会抛出一个错误。

### 注入服务：
在构造函数中注入：
```javascript
construct(private productService:ProductService){...};
```

1. <font color=red >@Optional()</font>是对productService的装饰器，当找不到服务的提供商时，参数值设为null
2. <font color=red >@Host()</font> 装饰器会禁止在宿主组件以上的搜索。宿主组件通常就是请求该依赖的那个组件。 不过，当该组件投影进某个父组件时，那个父组件就会变成宿主。
3. <font color=red > @Inject()</font>自定义提供商
4. <font color=red > @Self()</font> 和 <font color=red > @SkipSelf()</font> 来修改提供商的搜索方式




## @angular/router路由
1. 设置base标签,告诉路由该如何合成导航
```html
<!--index.html中的head标签中加入<base href="/">来告诉路由该如何合成导航用的 URL-->
<base href="/">
```

2. 导入路由配置
```javascript
//app.module.ts
//导入路由核心模块
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'**',component:AComponent}
];

@NgModule({
  ...
  imports: [RouterModule.forRoot(routes)]
  ...
})
export class AppModule { }
```
### Routes路由配置介绍
1. path "**"表示匹配所有
2. redirectTo "表示要转走的路径"
3. pathMatch "full"表示匹配程度
4. component 表示要显示的组件
5. data 数据传递
6. children:[] 子路由
7. canActivate:[PermissionGuard]
8. canDeactivate:[FocusGuard]
9. resolve:{Stock:StockResolve}
10. outlet 辅助路由

3. 设置导航输出位置
```js
<router-outlet></router-outlet>
<!-- Routed components go here -->
```

### 路由跳转
1. 声明式跳转
```html
<a [routerLink]="['/path']" routerLinkActive="active">routelink</a>
<a [routerLink]="['./path']">routelink</a>
<a [routerLink]="['{outlets:{aux:'aaa'}}']">routelink</a> 辅助路由 
http://localhost:4200/a(aux:aaa)
```
2. 命令式跳转

Router可调用navigate与navigateByUrl()

### 路由数据传递：
```javascript
//1.
[routerLink] = "['/path',1]"
//http://localhost:4200/path/1
// this.routeInfo.snapshot.queryParams
//2.
[routerLink]="['/b',1]" [queryParams]="{id:3}"
// http://localhost:4200/b/1?id=3
// this.routeInfo.snapshot.params
// 3.
{path:'a',component:AComponent,data:{id:666}} 
//this.routeInfo.snapshot.queryParams
//this.routeInfo.snapshot.data
```
### ActivatedRoute 常用：this.routeInfo见上面
## 守卫路由
### 1.canActivate
```javascript
export class PermissionGuard implements CanActivate{
  canActivate(){
    let hasPemission:boolean = Math.random() < 0.5;
    return hasPemission;
  }
}
```
### 2.canDeactivate
```javascript
export class FocusGuard implements CanDeactivate<CComponent>{
  canDeactivate(component:CComponent){
    if(component.isFoucs){
      return true;
    }else {
      return confirm('不关注一下嘛？');
    }
  }
}
```
### 3.resolve 读取数据前
```javascript
@Injectable()
export class StockResolve implements Resolve<Stock>{
  constructor(
    private route:Router
  ){}
  resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
      return new Stock(1,'name');
  }
}
```

## 生命周期钩子
当 Angular的<font color=red > 组件</font>或<font color=red >指令</font>， 新建、更新和销毁时所触发的钩子函数

### 钩子函数的执行顺序
1. constructor 这个不是生命周期钩子，但是它一定是最先执行的
2. ngOnChanges 输入属性被赋值时调用 (不可变对象的改变)
3. ngOnInit 第一次显示数据绑定和设置指令/组件的输入属性之后
4. ngDoCheck 在每个变更检测周期中，紧跟在 ngOnChanges() 和 ngOnInit() 后面调用
5. ngAfterContentInit 外部内容投影进组件/指令的视图之后调用
6. ngAfterContentChecked 投影组件内容的变更检测之后调用
7. ngAfterViewInit 初始化完组件视图及其子视图之后调用
8. ngAfterViewChecked 组件视图和子视图的变更检测之后调用
9. ngOnDestroy 次销毁指令/组件之前调用



### 初始化阶段
```javascript
//1.constructor 
//2.ngOnChanges
//3.ngOnInit
//4.ngDoCheck
//5.ngAfterContentInit
//6.ngAfterContentChecked
//7.ngAfterViewInit
//8.ngAfterViewChecked
```
### 变化阶段
```javascript
//1.ngOnChanges
//2.ngDoCheck
//3.ngAfterContentChecked
//4.ngAfterViewChecked
```
### 组件销毁阶段
```javascript
//1.ngOnDestroy
// 在路由变更时改变
```
### ngAfterViewInit,ngAfterViewChecked
1. 子组件组装好父组件才会组装
2. 组件是在试图组装完毕调用
3. 再此方法中不可以更改视图数据

### ngAfterContentInit,ngAfterContentChecked，投影
```html
1.子组件
<div>
  <ng-content></ng-content>
</div>
2.父组件
<SComponent>
    <!--在此写入的东西会投影到子组件-->
</SComponent>
```

## 表单
1. ReactiveFormsModule响应式表单
2. FormsModule模板式表单

### 模板式表单
1. 在angular中会自动加上ngForm来处理表单，如果不用angular来处理则加上ngNoForm
2. 在表单中加上#myForm="ngForm",则可以在页面使用{ {myForm.value | json } }去检测表单中有ngModule的value 对象名为name值

#### NgForm 对应 FormGroup
#### ngModel 对应  FormControl
#### ngModelGroup 对应  FormArray
```html
<form #myForm="ngForm" action="/regist" (ngSubmit)="createUser(myForm.value)" method="post">
  <div>
    <input ngModel name="a" type="text" required pattern="[a-zA-Z0-9]+">
  </div>
  <div>
    second:<input ngModel #second="ngModel" name="a" type="text" required pattern="[a-zA-Z0-9]+">
  </div>
  <div>
    <input ngModel name="b" type="text" required pattern="[a-zA-Z0-9]+">
  </div>
  <div ngModelGroup="tow">
    <input ngModel name="a" type="text">
    <input ngModel name="b" type="text">
  </div>
  <button type="submit">提交</button>
</form>
<div>
  {{myForm.value | json}}
  <br>
  second值是：{{second.value}}
</div>
```
### 响应式表单
```javascript
private nickName = new FormControl('tom');
private passwordInfo = new  FormGroup({
  password: new FormControl(),
  passwordConfirm:new  FormControl()
});
private email = new FormArray([
    new FormControl('a@a.com'),
    new FormControl('b@b.com')
]);
```
#### FormControl
管理单体表单控件的值和有效性状态
#### FormGroup
管理一组 AbstractControl 实例的值和有效性状态
#### FormArray
管理一组 AbstractControl 实例的值和有效性状态
```html
<form [formGroup]="formModel" action="/regist" (Submit)="createUser()" method="post">
   <input  formControlName="nikname">
   <ul formArrayName="emails">
      <li *ngFor="let email of formModel.get('emails').controls;let i = index;">
        <input [formControlName]="i">
      </li>
    </ul>
    <button >增加email.....</button>
   <input  formControlName="emails">
   <div formGroupName="passwordInfo">
      <input formControlName="password">
      <input formControlName="passwordConfirm">
    </div>
</form>
```
#### FormBuilder快捷语法
```javascript
private formModel:FormGroup;
private fb:FormBuilder = new FormBuilder();
/*this.formModel = new FormGroup({
  nikname:new FormControl(),
  emails:new FormArray([
      new FormControl()
  ]),
  mobile:new FormControl(),
  passwordInfo:new FormGroup({
    password:new FormControl(),
    passwordConfirm:new FormControl()
  })
});*/
this.formModel = this.fb.group({
  nikname:[''],
  emails:this.fb.array([
      ['']
  ]),
  mobile:[''],
  passwordInfo:this.fb.group({
    password:[''],
    passwordConfirm:['']
  })
});
```
### angular表单 校验器
```javascript
  //自定义校验器
  xxx(param:AbstractControl):{[key:string]:any}{
    return null;
  }
  // eg:
  moblieValid(moblie:FormControl):any{
    ..........
    // return null;表示成功
    // return {...};不成功
  }
  
  
  //预定义校验器
  Validators.required ......
  nikname:["xxxx",[Validators.required,.....]]
  .....................
  let niknameValid;boolean = this.formModel.get('nikname').valid;
  passwordInfo:this.fb.group({
      password:[''],
      passwordConfirm:['']
    }，{validator:this.passwordValidator}) //一次校验多个字段
    
```
#### 显示错误信息
```html
<div [hidden]="!formModel.hasError('required','nickname')"></div>
```


### 由于文章过于冗长，关于表单，httpclient等内容我将重新开启一篇文章，感谢广大读者的支持。
