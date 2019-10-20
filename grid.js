class Line{
  constructor(canvas, start, end){
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')

    this.x1 = start[0]
    this.y1 = start[1]
    this.x2 = end[0]
    this.y2 = end[1]
  }
  static new(...args){
    return new this(...args)
  }
  draw(){
    this.context.moveTo(this.x1, this.y1)
    this.context.lineTo(this.x2, this.y2);
    this.context.stroke();
  }
}

// 网格
class Grid{
  constructor(canvas){
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')

    this.gridSize = 15
  }

  static new(...args){
    return new this(...args)
  }
  draw(){
    var w = this.canvas.width/this.gridSize
    var h = this.canvas.height/this.gridSize

    this.context.setLineDash([0,0])
    this.context.lineWidth = 1
    this.context.strokeStyle = '#F1F1F1'

    var size = this.gridSize
    for (var i = 0; i < w; i++) {
      this.context.moveTo(size*i, 0)
      this.context.lineTo(size*i, this.canvas.height)

      this.context.stroke()
    }

    this.context.setLineDash([0,0])
    this.context.lineWidth = 1

    for (var i = 0; i < h; i++) {
      this.context.moveTo(0, size*i)
      this.context.lineTo(this.canvas.width, size*i)
      this.context.stroke()
    }
  }
  update(){

  }
}
