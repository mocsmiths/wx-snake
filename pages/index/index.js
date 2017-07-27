var startX = 0;
var startY = 0;
var moveX = 0;
var moveY = 0;
var X = 0;
var Y = 0;
var snakeHead = {
  x:0,
  y:0,
  color:"#ff0000",
  w:20,
  h:20
}

var snakeBodys = [];
var foods = [];
var windowWidth = 0;
var windowHeight = 0;
var collideBol = true;
var direction = null;
var snakeDirection = "right";
Page({
  
  canvasStart:function(e){
    startX = e.touches[0].x;
    startY = e.touches[0].y;
    //Console.log(e);
  },
  canvasMove:function(e){
    moveX = e.touches[0].x;
    moveY = e.touches[0].y;

    X = moveX - startX;
    Y = moveY - startY;

    if(Math.abs(X)>Math.abs(Y) && X>0){
      direction="right";
    } else if (Math.abs(X) > Math.abs(Y) && X < 0){
      direction="left";
    } else if (Math.abs(Y) > Math.abs(X) && Y > 0){
      direction="down";
    } else if (Math.abs(Y) > Math.abs(X) && Y < 0){
      direction="top";
    }
  },
  canvasEnd:function(){
    snakeDirection=direction;
  },
  onReady:function(){
    var context = wx.createContext();

    var frameNum = 0;

    function draw(obj){
      context.setFillStyle(obj.color);
      context.beginPath();
      context.rect(obj.x,obj.y,obj.w,obj.h);
      context.closePath();
      context.fill();
    }

    function collide(obj1,obj2){
      var l1 = obj1.x;
      var r1 = l1=obj1.w;
      var t1 = obj1.y;
      var b1 = t1+obj1.h;

      var l2 = obj2.x;
      var r2 = l2+obj2.w;
      var t2 = obj2.y;
      var b2 = t2+obj2.h;

      if(r1>l2&&l1<r2&&b1>t2&&t1<b2){
        return true;
      }else{
        return false;
      }
    }



    function animate(){
        frameNum++;
        if (frameNum %20 ==0){
          snakeBodys.push({
        x:snakeHead.x,
        y:snakeHead.y,
        w:20,
        h:20,
        color:"#00ff00"
      });
      if (snakeBodys.length > 4) {
        if(collideBol){
          snakeBodys.shift();
        }else{
          collideBol=true;
        }
        
      }
          switch (snakeDirection){
        case "left":
          snakeHead.x -= snakeHead.w;
        break;
        case "right":
          snakeHead.x += snakeHead.w;
        break;
        case "top":
          snakeHead.y -= snakeHead.h;
        break;
        case "down":
          snakeHead.y += snakeHead.h;
        break;
      }

      
  }
     draw(snakeHead);
      
      for(var i=0;i<snakeBodys.length;i++){
        var snakeBody = snakeBodys[i];
        draw(snakeBody);
      }

      for(var i=0;i<foods.length;i++){
        var foodObj = foods[i];
        draw(foodObj);
        if(collide(snakeHead,foodObj)){
          //console.log("撞上了");
          collideBol = false;
          foodObj.reset();
        }
      }
      wx.drawCanvas({
        canvasId:"snakeCanvas",
        actions:context.getActions()
      });
      requestAnimationFrame(animate);
    } 
    function rand(min,max){
        return parseInt(Math.random()*(max-min))+min;
    }
    function Food(){
      this.x = rand(0,windowWidth);
      this.y = rand(0,windowHeight);
      var w = rand(10,20);
      this.w = w;
      this.h = w;

      this.color="rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";

      this.reset = function(){
        this.x = rand(0,windowWidth);
        this.y = rand(0,windowHeight); 
        this.color="rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";
      }
    }
    wx.getSystemInfo({
            success: function(res) {
              console.log(res);
            windowWidth = res.windowWidth;
            windowHeight = res.windowHeight;
            for(var i=0;i<20;i++){
              var foodObj = new Food();
              foods.push(foodObj);
            }
            animate();
          }
        })
    

    
  }
})
