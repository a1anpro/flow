// 画布对象，包含其他对象
var Canvas = function(cvs){
  var obj = {}
  obj.mouseX = 0
  obj.mouseY = 0
  obj.canvas = cvs
  obj.context = obj.canvas.getContext('2d')

  obj.enableDraw = false
  obj.enableDrag = false
  obj.enableResize = -1

  // 画图的起始位置
  obj.mousedownInitX = 0
  obj.mousedownInitY = 0
  // 拖动时的偏移
  obj.dragInitOffsetX = 0
  obj.dragInitOffsetY = 0

  // 所有图形
  obj.shape = []
  // 当前焦点
  obj.focus = null

  // canvas 拥有事件注册


  obj.keyOptions = []

  obj.keydowns = {}
  obj.keyboardActions = {}

  obj.mouses = {}
  obj.mouseActions = {}

  //////
  //注册
  //////

  // 如果直接是删除则执行，如果是ctrl则需要等待下一个操作
  // 注册键盘事件
  obj.registerKeyEvent = function(key, callback){
    obj.keyboardActions[key] = callback
  }
  // 注册鼠标事件
  obj.registerMouseEvent = function(mouse, callback){
    obj.mouseActions[mouse] = callback
  }

  // 注册所有键盘事件
  obj.registerKeyboard = function(){
    // 按键对应的操作都注册在这里
    obj.registerKeyEvent('Backspace', function(){
      if (obj.focus != null){
        for (var i = 0; i < obj.shape.length; i++) {
          var s = obj.shape[i]
          if (s == obj.focus){
            obj.shape.splice(i, 1)
            obj.focus = null
            return
          }
        }
      }
    })
  }

  /////////////////////////////////////
  // 鼠标响应事件
  /////////////////////////////////////
  obj.mouseDownEvent = function(event){

    /*
      鼠标按下的响应：
        1）按在空画布，则新建shape（改成拖动）
        2）按在shape内，则可以整体拖动
        3）按在dot内，则可以缩放
        4）设计normal状态画线功能dot（圆形）
    */
    var x = event.offsetX
    var y = event.offsetY

    // 每次down发生的位置，用来做拖动相对坐标判断
    obj.mousedownInitX = x
    obj.mousedownInitY = y


    // 如果是焦点shape先获得，就使用焦点
    if (obj.focus && obj.focus.hasHit(x, y) == true){
      obj.enableDrag = true
      // 选中则不重新画图, 拖动
      obj.dragInitOffsetX = x - obj.focus.x1
      obj.dragInitOffsetY = y - obj.focus.y1
      return
    }

    // 判断是哪个shape获得了焦点
    for (var i = 0; i < obj.shape.length; i++) {
      var s = obj.shape[i]

      // 先点到吸盘就先改变大小
      // 只有吸盘可以改变shape的大小，所以是判断哪个吸盘被拖动了
      var dot = s.hasHitDot(x, y)
      // 如果s的dot被点到了，它也是被激活的
      if (dot != -1){
          obj.focus = s
          obj.enableResize = dot
          return
      }

      var hit = s.hasHit(x, y)
      if (hit == true){
          // 命中了这个图形
          // cur用来存储焦点
          obj.focus = s

          obj.enableDrag = true
          // 选中则不重新画图, 拖动
          obj.dragInitOffsetX = x - obj.focus.x1
          obj.dragInitOffsetY = y - obj.focus.y1
          log('拖动', i)
          return
      }
    }
    // 如果都没有获得焦点，则新建rect
    log('新建, 总数', obj.shape.length+1)

    obj.enableDraw = true
    obj.focus = new rect(obj.canvas, x, y)
    // obj.focus = new circle(obj.canvas, x, y)
  }
  obj.mouseMoveEvent = function(event){
    obj.mouseX = event.offsetX
    obj.mouseY = event.offsetY

    // 拖动改变大小
    if (obj.enableResize != -1){
      // 根据拖动的点改变大小
      // 先用resize==1来测试
      obj.focus.updateByDot(obj.enableResize, obj.mouseX, obj.mouseY)
    }

    // 画时更新， 不带偏移
    if (obj.enableDraw == true){
      // obj.focus.update(obj.mousedownInit, obj.mousedownInitY, obj.mouseX-obj.mousedownInitX, obj.mouseY-obj.mousedownInitY)
    }

    // 拖动时更新，带偏移
    if (obj.enableDrag == true && obj.enableResize == -1){
      // 拖动时w、h都不变,只用改变原点即可
      obj.focus.update(obj.mouseX-obj.dragInitOffsetX, obj.mouseY-obj.dragInitOffsetY, obj.focus.w, obj.focus.h)
    }
  }
  obj.mouseUpEvent = function(event){
    // 鼠标弹起之后恢复状态
    obj.enableDrag = false
    obj.enableResize = -1
    if (obj.enableDraw == true){
      // 画了才改状态
      obj.enableDraw = false
      obj.shape.push(obj.focus)
    }
  }
  // 双击 切换状态 (仍需修改)
  obj.doubleClickEvent = function(event){
    for (var i = 0; i < obj.shape.length; i++) {
      var s = obj.shape[i]
      var hit = s.hasHit(event.offsetX, event.offsetY)
      if (hit == true){
          s.swithMode()
      }
    }
  }

  //  设置鼠标事件响应
  obj.registerMouse = function(){
    obj.registerMouseEvent('dblclick', obj.doubleClickEvent)
    obj.registerMouseEvent('mousedown', obj.mouseDownEvent)
    obj.registerMouseEvent('mouseup', obj.mouseUpEvent)
    obj.registerMouseEvent('mousemove', obj.mouseMoveEvent)
  }


  // 设置监听：键盘监听 和 鼠标监听
  obj.setListener = function(){
    // 键盘监听
    window.addEventListener('keydown', event=>{
      var key = event.key
      // 注册过，则执行
      obj.keyboardActions[key] && obj.keyboardActions[key]()
    })

    var arr = [
      'dblclick',
      'mousedown',
      'mouseup',
      'mousemove',
    ]
    // 鼠标监听
    for (var i = 0; i < arr.length; i++) {
      var action = arr[i]
      obj.canvas.addEventListener(action, event=>{
        var type = event.type
        obj.mouseActions[type] && obj.mouseActions[type](event)
      })
    }
  }


  obj.clear = function(){
    obj.context.clearRect(0, 0, obj.canvas.width, obj.canvas.height)
  }

  //画布的update调用所有元素的update

  //画布的draw调用所有元素的draw
  obj.draw = function(){
    obj.clear()

    if (obj.focus != null){
      obj.focus.draw()
    }

    for (var i = 0; i < obj.shape.length; i++) {
      var s = obj.shape[i]
      // if (s!=obj.focus){
      //   s.changeMode('normal')
      // } else{
      //   s.changeMode('active')
      // }
      s.draw()
    }
  }

  obj.run = function(){
    // 先设置监听
    obj.setListener()

    // 注册鼠标事件
    obj.registerMouse()
    // 注册键盘事件
    obj.registerKeyboard()

    setInterval(()=>{
      obj.draw()
    }, 1000/30)
  }


  return obj
}
