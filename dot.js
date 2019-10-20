// 给出shape的起始点即可画出所有dot，用dots来管理
var dots = function(cvs, x, y, w, h){
  let obj = {}
  obj.canvas = cvs
  obj.ctx = obj.canvas.getContext('2d')
  obj.x = x
  obj.y = y
  obj.w = w
  obj.h = h
  obj.dotSize = 5

  obj.dots = []

  obj.init = function(x, y, w, h){
    var arr = [
      [x-obj.dotSize/2, y-obj.dotSize/2],
      [x+w/2-obj.dotSize/2, y-obj.dotSize/2],
      [x+w-obj.dotSize/2, y-obj.dotSize/2],
      [x+w-obj.dotSize/2, y+h/2-obj.dotSize/2],
      [x+w-obj.dotSize/2, y+h-obj.dotSize/2],
      [x+w/2-obj.dotSize/2, y+h-obj.dotSize/2],
      [x-obj.dotSize/2, y+h-obj.dotSize/2],
      [x-obj.dotSize/2, y+h/2-obj.dotSize/2],
    ]

    for (var i = 0; i < arr.length; i++) {
      var p = arr[i]
      var d = new dot(obj.canvas, p[0], p[1], obj.dotSize)
      obj.dots.push(d)
    }
  }

  obj.hitDot = function(x, y){
    var ret = -1
    for (var i = 0; i < obj.dots.length; i++) {
      var d = obj.dots[i]
      if (d.hasHit(x, y)){
        ret = i + 1
      }
    }
    return ret
  }

  obj.update = function(x, y, w, h){
    var arr = [
      [x-obj.dotSize/2, y-obj.dotSize/2],
      [x+w/2-obj.dotSize/2, y-obj.dotSize/2],
      [x+w-obj.dotSize/2, y-obj.dotSize/2],
      [x+w-obj.dotSize/2, y+h/2-obj.dotSize/2],
      [x+w-obj.dotSize/2, y+h-obj.dotSize/2],
      [x+w/2-obj.dotSize/2, y+h-obj.dotSize/2],
      [x-obj.dotSize/2, y+h-obj.dotSize/2],
      [x-obj.dotSize/2, y+h/2-obj.dotSize/2],
    ]
    for (var i = 0; i < obj.dots.length; i++) {
      var d = obj.dots[i]
      d.update(arr[i][0], arr[i][1])
    }
  }
  obj.draw = function(){
    for (var i = 0; i < obj.dots.length; i++) {
      var d = obj.dots[i]
      d.draw()
    }
  }

  obj.init(obj.x, obj.y, obj.w, obj.h)
  return obj
}

// 拖动点
var dot = function(cvs, x, y, size){
  let obj = {}
  obj.size = size

  obj.x = x
  obj.y = y

  obj.canvas = cvs
  obj.ctx = obj.canvas.getContext('2d')

  obj.draw = function(){
    obj.ctx.beginPath()

    obj.ctx.setLineDash([0, 0])
    obj.ctx.lineWidth = 1
    obj.ctx.strokeStyle = 'black'

    obj.ctx.moveTo(obj.x, obj.y)
    obj.ctx.lineTo(obj.x+obj.size, obj.y)
    obj.ctx.lineTo(obj.x+obj.size, obj.y+obj.size)
    obj.ctx.lineTo(obj.x, obj.y+obj.size)
    obj.ctx.lineTo(obj.x, obj.y)

    obj.ctx.stroke()
  }
  obj.update = function(x, y){
    obj.x = x
    obj.y = y
  }
  obj.hasHit = function(x, y){
    if (x > obj.x && x < obj.x+obj.size){
      if (y > obj.y && y < obj.y+obj.size){
        return true
      }
    }
    return false
  }
  return obj
}
