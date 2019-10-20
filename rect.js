var rect = function(cvs, x, y){
  let obj = {}
  obj.name = 'rect'
  obj.canvas = cvs
  obj.ctx = obj.canvas.getContext('2d')
  obj.x1 = x
  obj.y1 = y
  obj.w = 30
  obj.h = 30
  //
  // obj.x2 = obj.x1
  // obj.y2 = obj.y1

  obj.dots = new dots(obj.canvas, obj.x1, obj.y1, obj.w, obj.h)

  obj.mode = 'active'

  obj.info = function(){
    log('原点:',obj.x1, obj.y1, ' 宽高:', obj.w , obj.h)
  }

  obj.swithMode = function(){
    if (obj.mode == 'normal'){
      obj.mode = 'active'
    } else {
      obj.mode = 'normal'
    }
  }

  obj.changeMode = function(mode){
    obj.mode = mode
  }

  obj.updateByDot = function(dot, x, y){
    // 根据dot序号和鼠标的坐标来改变rect大小
    var w = 0
    var h = 0
    if (dot == 1){
      w = obj.x1-x
      h = obj.y1-y
    }
    if (dot == 2){
      h = obj.y1-y
      x = obj.x1
    }
    if (dot == 3){
      w = x-obj.w-obj.x1
      h = obj.y1-y
      x = obj.x1
    }
    if (dot == 4){
      w = x-obj.x1-obj.w
      x = obj.x1
      y = obj.y1
    }
    if (dot == 5){
      w = x-obj.w-obj.x1
      h = y-obj.h-obj.y1
      x = obj.x1
      y = obj.y1
    }
    if (dot == 6){
      // 先改宽高
      h = y-obj.h-obj.y1
      x = obj.x1
      y = obj.y1
    }
    if (dot == 7){
      w = obj.x1 - x
      h = y-obj.y1-obj.h
      y = obj.y1
    }
    if (dot == 8){
      w = obj.x1-x
      y = obj.y1
    }
    obj.x1 = x
    obj.y1 = y
    obj.w += w
    obj.h += h
    // 不能反拉
    if (obj.w<30){
      obj.w=30
    }
    if (obj.h<30){
      obj.h=30
    }
    obj.dots.update(obj.x1, obj.y1, obj.w, obj.h)
  }
  // 在一个图形绘制的时候，要画两个东西：虚线、实线
  obj.update = function(x1, y1, w, h){
    if (x1 + w > obj.canvas.width || y1 + h > obj.canvas.height){
      return
    }
    if (x1 < 0 || y1 < 0){
      return
    }
    obj.x1 = x1
    obj.y1 = y1
    obj.w = w
    obj.h = h

    obj.dots.update(obj.x1, obj.y1, obj.w, obj.h)
  }

  obj.clear = function(){
    obj.ctx.clearRect(0, 0, obj.canvas.width, obj.canvas.height)
  }

  obj.drawText = function(){
    // 标出原点坐标和长款
    // log('rect:', obj.x1, obj.h, obj.w)
    var pos = '(' + obj.x1 + ',' + obj.y1 + ')'
    obj.ctx.fillText(pos, obj.x1-30, obj.y1-10)

    obj.ctx.fillText('w:'+obj.w, obj.x1+obj.w/2-20, obj.y1-10)
    obj.ctx.fillText('h:'+obj.h, obj.x1-30, obj.y1+obj.h/2)
  }

  obj.draw = function(){
    obj.drawText()
    obj.ctx.beginPath()

    if (obj.mode == 'active'){
      obj.ctx.setLineDash([5,5])
      obj.ctx.lineWidth = 1
      obj.ctx.strokeStyle = '#0997F7'
    } else if(obj.mode == 'normal'){
      obj.ctx.setLineDash([0,0])
      obj.ctx.lineWidth = 1
      obj.ctx.strokeStyle = 'black'
    }

    if (obj.h == 0 && obj.w == 0){
      return
    }

    obj.ctx.moveTo(obj.x1, obj.y1)
    obj.ctx.lineTo(obj.x1+obj.w, obj.y1);
    obj.ctx.lineTo(obj.x1+obj.w, obj.y1+obj.h);
    obj.ctx.lineTo(obj.x1, obj.y1+obj.h);
    obj.ctx.lineTo(obj.x1, obj.y1);

    obj.ctx.stroke();
    if (obj.mode == 'active'){
        obj.dots.draw()
    }
  }

  obj.hasHit = function(x, y){
    // 让吸盘来改变shape的大小，所以判断哪个吸盘获取了坐标
    if (x > obj.x1 && x < obj.x1+obj.w){
      if (y > obj.y1 && y < obj.y1+obj.h){
        return true
      }
    }
    return false
  }
  obj.hasHitDot = function(x, y){
    return obj.dots.hitDot(x, y)
  }
obj.info()
  return obj
}
