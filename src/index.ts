import "./index.less"

//食物
class Food {
    element: HTMLElement
    viev: HTMLElement = document.querySelector(".viev")

    constructor() {
        this.element = document.querySelector('.food')
    }

    get X() {
        return this.element.offsetLeft
    }

    get Y() {
        return this.element.offsetTop
    }

    create() {
        const vievBorderWidth = parseInt(getComputedStyle(this.viev, null).borderWidth)
        const vievWidth = parseInt(getComputedStyle(this.viev, null).width) - vievBorderWidth * 2
        const elementWidth = parseInt(getComputedStyle(this.element, null).width)
        //除以10 除以蛇的步长
        const width = (vievWidth - elementWidth) / 10
        const left = Math.round(Math.random() * width) * 10
        const top = Math.round(Math.random() * width) * 10
        this.element.style.left = left + "px"
        this.element.style.top = top + "px"
    }
}

//计分器
class scoringDevice {
    scoreEl: HTMLElement
    levelEl: HTMLElement
    score = 0
    level = 1
    //等级上限
    maxLevel: number
    //多少分升一级
    update: number

    constructor(maxLevel: number = 10, update: number = 5) {
        this.scoreEl = document.querySelector("#score")
        this.levelEl = document.querySelector("#level")
        this.maxLevel = maxLevel
        this.update = update
    }

    addScore() {
        this.scoreEl.innerHTML = `${++this.score}`
        if (this.score % this.update == 0) {
            this.addLevel()
        }
    }

    addLevel() {
        if (this.level < this.maxLevel) {
            this.levelEl.innerHTML = `${++this.level}`
        }
    }
}

//蛇
class snake {
    head: HTMLElement
    body: HTMLCollectionOf<HTMLElement>
    element: HTMLElement

    constructor() {
        this.element = document.querySelector(".snake")
        this.head = document.querySelector(".snake>div")
        this.body = this.element.getElementsByTagName("div")
    }

    //获取蛇头坐标
    get X() {
        return this.head.offsetLeft
    }

    get Y() {
        return this.head.offsetTop
    }

    //设置蛇头的坐标
    set X(val) {
        if (this.X == val) {
            return
        }
        if (val < 0 || val >= parseInt(getComputedStyle(document.querySelector(".viev"), null).width)) {
            throw new Error("蛇撞墙了")
        }
        if(this.body[1]&&this.body[1].offsetLeft===val) {
            throw new Error("蛇撞到自己了")
        }
        this.moveBody()
        this.head.style.left = `${val}px`
        this.snakeCrash()
    }

    set Y(val) {
        if (this.Y == val) {
            return
        }
        if (val < 0 || val >= parseInt(getComputedStyle(document.querySelector(".viev"), null).height)) {
            throw new Error("蛇撞墙了")
        }
        if (this.body[1] && this.body[1].offsetTop === val) {
            throw new Error("蛇撞到自己了")
        }
        this.moveBody()
        this.head.style.top = `${val}px`
        this.snakeCrash()
    }

    //添加蛇
    addSnake() {
        this.element.insertAdjacentHTML("beforeend", "<div></div>")
    }
    // 移动身体
    moveBody(){
        for (let i = this.body.length-1; i >0;i--){
            let left=this.body[i-1].offsetLeft;
            let top = this.body[i - 1].offsetTop;
            this.body[i].style.left=`${left}px`;
            this.body[i].style.top = `${top}px`
        }
    }
    // 监测是否发生碰撞
    snakeCrash() {
        for (let i =1;i<this.body.length;i++){
            if(this.X===this.body[i].offsetLeft&&this.Y===this.body[i].offsetTop){
                throw new Error("蛇撞到自己了")
            }
        }
    }
}

//游戏
class Game {
    //食物
    food: Food
    //积分器
    scoringDevice: scoringDevice
    //蛇
    snake: snake
    //方向
    keyBay: string = "ArrowRight"

    flag: boolean = true
    // 开始游戏
    begin:HTMLElement
    // off
    off=true
    constructor() {
        this.food = new Food()
        this.scoringDevice = new scoringDevice(10,3)
        this.snake = new snake()
        // this.flag&&this.init()
        this.begin=document.querySelector("#begin")
        this.go()

    }

    //绑定键盘事件
    init() {
        document.addEventListener("keydown", this.keydownH.bind(this))
        this.move()

    }
    // 开始游戏
    go(){
        this.begin.addEventListener("click",()=>{
            if (this.off){
                this.begin.innerHTML="按下 p 键暂停"
                for(let j=1;j<this.snake.body.length;){
                    this.snake.body[j].remove()
                }
                // 积分器归零
                this.scoringDevice.score = 0
                this.scoringDevice.level = 1
                this.scoringDevice.scoreEl.innerHTML = `${this.scoringDevice.score}`
                this.scoringDevice.levelEl.innerHTML = `${this.scoringDevice.level}`
                // 回到起点
                this.snake.X = 0
                this.snake.Y = 0
                // 删除自身
                this.flag=true
                this.keyBay = "ArrowRight"
                this.init()
                this.off = false
            }
        })
    }

    keydownH(event: KeyboardEvent) {
        const key = ["ArrowUp", "w", "ArrowDown", "s", "ArrowRight", "d", "ArrowLeft", "a",'p']
        key.forEach((item) => {
            if(event.key==item){
                this.keyBay = event.key
            }

        })


    }

    //ArrowUp
    // ArrowDown
    // ArrowRight
    // ArrowLeft
    move() {
        //读取蛇的x、y值
        let x = this.snake.X
        let y = this.snake.Y
        switch (this.keyBay) {
            case "ArrowUp":
            case "w":
                y -= 10
                break;
            case "ArrowDown":
            case "s":
                y += 10
                break;
            case "ArrowRight":
            case "d":
                x += 10
                break;
            case "ArrowLeft":
            case "a":
                x -= 10
                break;
            case "p":
                this.keyBay=""
                document.body.style.backgroundColor = "#bfa"
                document.getElementById("end").innerHTML = "游戏暂停"
                break;
        }
        if (this.keyBay != ""){
            document.body.style.backgroundColor = "#fff"
            document.getElementById("end").innerHTML = ""
        }
        this.eatFoot(x,y)
        //    修改蛇的x、y值
        try {
            this.snake.X = x
            this.snake.Y = y
        } catch(err) {
            document.body.style.backgroundColor = "red"
            this.begin.innerHTML="重新开始"
            // alert(err.message)
            document.getElementById("end").innerHTML = `${err.message}  GameOver`
            this.off=true
            this.flag=false
        }
        // console.log(y,x)
        this.flag&&setTimeout(this.move.bind(this), 250 - (this.scoringDevice.level - 1) * 25)
    }
    // 检查蛇是否吃到食物
    eatFoot(x:number, y:number){
        if(x===this.food.X && y===this.food.Y){
            this.snake.addSnake()
            this.food.create()
            this.scoringDevice.addScore()
        }
    }

}

new Game()
