config = {
    ticking: false,
    isMobile: false,
    init: function(){
        let self = this;//存储this指针
        this.isMobilePhone(this);//判断是否为移动设备
        this.header = document.getElementById('header');//获得导航条
        this.sections = document.getElementsByClassName('section');//获得每页容器
        this.poetry = document.getElementById('poetry');//获得诗句dom
        this.oneSay = document.getElementById('oneSay');//获得一句dom
        this.oneSayAuthor = document.getElementById('oneSayAuthor');//获得一句作者dom
        this.oneImg = document.getElementById('oneImg');//获得一句图片dom
        this.winHeight = window.innerHeight;//获得窗口高度
        this.myNavMenu = document.getElementById('myNav').children;//获得导航元素
        this.workDot = document.getElementsByClassName("work-dot");//获得作品导航元素
        this.workWrapper = document.getElementById("workWrapper");//获得作品总容器
        this.workContainer = document.getElementsByClassName("workWrapper-dot");//获得作品分容器
        this.myAge = document.getElementById("myAge");
        //调用 api 更新网页一句和诗词
        this.getThePoetry();
        this.getOneSay();
        this.setAge(this);
        this.setWorkData(this);
        this.showWork(this);
        window.addEventListener('scroll', self.throtle(self.scrollHandle,100,50,self), false);
    },
    isMobilePhone: function(self) {
        var ua = navigator.userAgent;
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid;
        //判断
        if(isMobile){
            self.isMobile = true;
        }else{
            self.isMobile = false;
        }
    },
    // 滚动节流
    throtle: function(func, wait, mustRun) {
      var timer,startTime = new Date();
      return function() {
        var curTime = new Date();
        clearTimeout(timer);
        //如果达到规定间隔时间，触发handler
        if(curTime - startTime >= mustRun) {
          func();
          startTime = curTime;
        } else {
          timer = setTimeout(func, wait);
        }
      }
    },
    scrollHandle: function() {
        let self = config;
        let top = document.body.scrollTop + document.documentElement.scrollTop;
        if(top > 50) {
            self.header.classList.add('active');
        } else {
            self.header.classList.remove('active');
        }
        // if(top > 200) {
        //     self.sections[1].classList.add('active');
        // } else {
        //     self.sections[1].classList.remove('active');
        // }
        let disTop = self.sections[0].getBoundingClientRect();
        //如果时移动端则不更新导航栏
        if(!self.isMobile) {
            // let index = Math.floor(top/(self.winHeight-200));
            for(let i = 0;i < self.myNavMenu.length; i++) {
                let rect = self.sections[i].getBoundingClientRect();
                if(rect.top < self.winHeight/2 && rect.top>self.winHeight/2-rect.height) {
                    self.myNavMenu[i].classList.add('active');
                    self.sections[i].classList.add('active');
                } else {
                    self.myNavMenu[i].classList.remove('active');
                    self.sections[i].classList.remove('active');
                }
            }
        } else {
          for(let i = 0;i < self.sections.length; i++) {
              let rect = self.sections[i].getBoundingClientRect();
              if(rect.top < self.winHeight/2 && rect.top>self.winHeight/2-rect.height) {
                  self.sections[i].classList.add('active');
              } else {
                  self.sections[i].classList.remove('active');
              }
          }
        }
    },
    getOneSay: function() {
        let url = 'http://api.youngam.cn/api/one.php';
        let type = 'GET';
        this.ajax(url,type,null,(res)=>{
        	console.log(res)
            let data = res.data[0];
            self.oneImg.style.backgroundImage = `url('${data.src}')`;
            self.oneSay.innerText = data.text;
            // self.oneSayAuthor.innerText = data.word_from;
        })
    },
    getThePoetry: function() {
        jinrishici.load(function(result) {
            // 自己的处理逻辑
            let data = result.data;
            let title = `${data.origin.title} --【${data.origin.dynasty}】${data.origin.author}`;
            self.poetry.innerText = '↓ '+ data.content +' ↓';
            self.poetry.title = title;
          });
    },
    showWork: function(self) {
      let workDot = this.workDot;
      for(let i = 0; i< workDot.length; i++) {
        workDot[i].addEventListener('click',function(){
          self.workWrapper.style.marginLeft = -i * 100 + "%";
          for(let k = 0; k < workDot.length; k++) {
            k === i ? workDot[k].classList.add('active') : workDot[k].classList.remove('active')
          }
        })
      }
    },
    setWorkData: function(self) {
      let workContainer = self.workContainer;
      for(let i = 0; i < workContainer.length; i++) {
        workData[i].forEach(item => {
          //依次传入父容器、标题、介绍、图片地址、图片类型、开发环境
          self.createElement(workContainer[i],item.url,item.title,item.intro,item.imgUrl,item.imgType,item.env);
        })
      }
    },
    setAge: function(self) {
      let date = new Date();
      let year = date.getFullYear();
      let age = year - 1997;
      self.myAge.innerText = age;
    },
    createElement: function(container,url,title,intro,imgUrl,type,env) {
      let ele = document.createElement("div");
      ele.className = "work-wrapper";
      ele.innerHTML = `
          <div class="work-left ${type}">
            <a href="${url}"><img src="${imgUrl}" alt=""></a>
          </div>
          <div class="work-right">
            <h3>项目名称: ${title}</h3>
            <p>
              <em>项目描述：</em>
              ${intro}
            </p>
            <strong>开发环境：${env}</strong>
          </div>`;
      container.appendChild(ele);
    },
    ajax: function(url,type,param,calback) {
        let xml;
        let res;
        param = param instanceof Object ? param : {};
        if(window.XMLHttpRequest) {
            xml = new XMLHttpRequest();
        }
        else {
            xml = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xml.onreadystatechange = function() {
            if(xml.readyState == 4 && xml.status == 200) {
                res = xml.responseText;
                calback(JSON.parse(res));
            }
        }
        //改变传入的param
        let par = '';
        for(let item in param) {
            par = `${par}${item}=${param[item]}&`;
        }
        xml.open(type, url, true);
        //xml.setRequestHeader("X-User-Token","RgU1rBKtLym/MhhYIXs42WNoqLyZeXY3EkAcDNrcfKkzj8ILIsAP1Hx0NGhdOO1I");
        xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xml.send(par);
    }
}

config.init();