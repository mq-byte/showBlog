## 环境搭建
1. 脚手架安装：npm i -g @angular/cli
2. 新建项目：ng new my-app

==如果安装脚手架报错，强制清理npm缓存后重新安装==

## 组件与模板
当你下载好官方案列后，你可能对目录都不太熟悉，不过不用关心


### 理解模板表达式上下文
**==组建实列==就是模板表达式的上下文对象(Expression context)**

表达式中的上下文变量是由 ==**模板变量**== 、 ==**指令的上下文变量**==（如果有）和 ==**组件的成员变量**== 叠加而成的。
**当存在相同的表达式变量优先顺序：模板变量、指令的上下文变量、组件的成员变量**
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
        var outPutVal = function(inO){
            console.log('getAttribute：',inO.getAttribute('value'));
            console.log('inO.value',inO.value);
        }
        window.onload = function(){
            var inO = document.querySelector('input');
            //<input type="text" value="a"> 初始化value后打印
            outPutVal(inO);
            //getAttribute： a
			//test.html:14 inO.value a
            document.onclick = function(){
                //<input type="text" value="a"> 修改value为aaaaa后打印
                outPutVal(inO);
                	//getAttribute： a
				//test.html:14 inO.value aaaaa
            }
        }

		//1.少量 HTML attribute 和 property 之间有着 1:1 的映射，如 id。
		//2.有些 HTML attribute 没有对应的 property，如 colspan。
		//3.有些 DOM property 没有对应的 attribute，如 textContent。
		//4.大量 HTML attribute 看起来映射到了 property…… 但却不像你想的那样！
```
==angular中模板绑定是通过 property 和事件来工作的，而不是 attribute==

**特殊的attribute 绑定**
```html
[attr.aria-label]="actionName"
<td [attr.colspan]="1 + 1">
```

### 指令

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

<ng-template ngFor let-hero [ngForOf]="heroes" let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
  <div [class.odd]="odd">({{i}}) {{hero.name}}</div>
</ng-template>
```
 ==ng-template 会将内部包裹的元素变成注释==

##### ng-container
 ==ng-template 会无副作用的包裹内部元素==

#### 组件（拥有模板的指令）

```
ng g c components/A 创建组件
```
##### 组件通信
######  1.输入属性 @Input()
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
###### 2.输出属性 @Output()
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

###### 3.中间人模式（兄弟组件通过公共的父组件传值）

###### 4.父组件获得子组件引用 #child（只可以在组件模板中使用）

###### 5. @ViewChild()父组件类插入子组件 （可以在类中使用）
1. 被注入的计时器组件只有在 Angular 显示了父组件视图之后才能访问
2. Angular 的单向数据流规则会阻止在同一个周期内更新父组件视图。应用在显示秒数之前会被迫再等一轮。
3. 使用 setTimeout() 来等下一轮
```javascript
	@ViewChild(CountdownTimerComponent)
    private timerComponent: CountdownTimerComponent;
	
	ngAfterViewInit() {
    // Redefine `seconds()` to get from the `CountdownTimerComponent.seconds` ...
    // but wait a tick first to avoid one-time devMode
    // unidirectional-data-flow-violation error
    setTimeout(() => this.seconds = () => this.timerComponent.seconds, 0);
  }
```

###### 6.通过服务传递数据



#### 自定义指令
```
ng g d myDirective/demo
```
1.属性型指令
```javascript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDemo]'
})
export class DemoDirective {

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
2.结构型指令

```javascript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Add the template content to the DOM unless the condition is true.
 */
@Directive({ selector: '[appUnless]'})
export class UnlessDirective {
  //第一次传入true时不执行任何if分支
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```




## 目录结构

## 依赖注入
### angular实现控制反转的手段就是依赖注入
### 依赖注入的好处：依赖注入会让你用一种松耦合的方式去写代码，易于调试

### 注入器：
```javascript
//只有加入@injectable()才能注入其他
construct(private productService:ProductService){...};
```
### 提供器 作用域与优先级 
```javascript
provider:[ProductService]
provider:[{provide:ProductService,useClass:ProductService}]
provider:[{provide:ProductService,useClass:AnotherProductService}]
provider:[{provide:ProductService,useFactory:(参数A)=>{return ob},deps:[参数A]}]
provider:[{provide:"IS_DEV_ENV",useValue:{isDev:true}}]
```


## @angular/router路由
```html
<!--index.html中的head标签中加入<base href="/">来告诉路由器该如何合成导航用的 URL-->
<base href="/">
```


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
7. canActivate canActivate:[PermissionGuard]
8. canDeactivate  canDeactivate:[FocusGuard]
9. outlet 辅助路由
10. resolve resolve:{Stock:StockResolve}


### Router可调用navigate与navigateByUrl()
### RouterLink
```html
<a [routerLink]="['/path']">routelink</a>
<a [routerLink]="['./path']">routelink</a>
<a [routerLink]="['{outlets:{aux:'aaa'}}']">routelink</a> 辅助路由 
http://localhost:4200/a(aux:aaa)
```
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


## 响应式编程：

```javascript
import {Observable} from "rxjs";
Observable.from([1,2,3,4])
  .filter(e => e%2 == 0)
  .map(e => e*e)
  .subscribe(
      e => console.log(e),
      err => console.error(err),
      () => console.log("结束啦")
      )
 //4，16，结束啦
```



### 生命周期钩子
#### 初始化阶段
```javascript
//1.constructor 
//2.ngOnChanges父组件初始化子组件输入属性时被调用 (不可变对象的改变)
ngOnChanges(changes:SimpleChanges):void{
    
}
//3.ngOnInit
//4.ngDoCheck 一定要判断一下你想要的变化发生时
//5.ngAfterContentInit
//6.ngAfterContentChecked
//7.ngAfterViewInit
//8.ngAfterViewChecked
```
#### 变化阶段
```javascript
//1.ngOnChanges
//2.ngDoCheck
//3.ngAfterContentChecked
//4.ngAfterViewChecked
```
#### 组件销毁阶段
```javascript
//1.ngOnDestroy
// 在路由变更时改变
```
##### ngAfterViewInit,ngAfterViewChecked
```javascript
//1.子组件组装好父组件才会组装
//2.组件是在试图组装完毕调用
//3.再此方法中不可以更改视图数据

//s.component.ts
greeting(name:string){
    ...
}
//f.component.html
<app-child #child1></app-child>
<app-child #child2></app-child>
//f.component.ts
@viewChild("child1")
child1:sCompenent;

this.child1.greeting(...);
```
##### ngAfterContentInit,ngAfterContentChecked
###### 投影
```html
1.子组件
<div>
  <ng-content></ng-content>
</div>
2.父组件
<SComponent>
.......
</SComponent>
```

## 表单
```javascript
// 在imports中：
// ReactiveFormsModule响应式表单
// FormsModule模板式表单
```
### 模板式表单
```javascript
// 在angular中会自动加上ngForm来处理表单，如果不用angular来处理则加上ngNoForm
//在表单中加上#myForm="ngForm",则可以在页面使用{{myForm.value | json}}去检测表单中有ngModule的value 对象名为name值
//(ngSubmit)="..."
 
```
#### NgForm => FormGroup
#### ngModel=>  
#### ngModelGroup
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
### 模板式表单校验

### 指令：
```javascript
// ng g directive f/s
@Directive({
providers:[{provide:NG_VALIDATORS,useValue:mobileValidator,multi:true}]
})
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
#### FormGroup
#### FormArray
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
#### 异步校验
### 状态字段：