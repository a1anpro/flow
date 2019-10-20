class StaticShape{
  constructor(canvas, type, x, y){
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')

    // 根据不同的type画不同的图形
    this.type = type

    this.x = x
    this.y = y
    this.w = 40
    this.h = 40
  }

  static new(...args){
    return new this(...args)
  }
  draw(){
    if (this.type == 'rectangle'){
      this.context.beginPath()
      this.context.moveTo(this.x, this.y)
      this.context.lineTo(this.x+this.w, this.y)
      this.context.lineTo(this.x+this.w, this.y+this.h)
      this.context.lineTo(this.x, this.y+this.h)
      this.context.lineTo(this.x, this.y)
      this.context.stroke()
    }
    if (this.type == 'circle'){
      this.context.beginPath()
      var radius = this.w/2
      this.context.arc(this.x+radius, this.y+radius, radius, 0,2*Math.PI)
      this.context.stroke()
    }
    if (this.type == 'diamond'){
      // 菱形
      this.h -= 10
      this.y += 5
      this.context.beginPath()
      this.context.moveTo(this.x, this.y+this.h/2)
      this.context.lineTo(this.x+this.w/2, this.y)
      this.context.lineTo(this.x+this.w, this.y+this.h/2)
      this.context.lineTo(this.x+this.w/2, this.y+this.h)
      this.context.lineTo(this.x, this.y+this.h/2)
      this.context.stroke();
    }
  }
  update(){

  }
}
