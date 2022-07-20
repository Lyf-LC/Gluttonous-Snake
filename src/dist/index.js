"use strict";
exports.__esModule = true;
require("./index.less");
//食物
var Food = /** @class */ (function () {
    function Food() {
        this.viev = document.querySelector(".viev");
        this.element = document.querySelector('.food');
    }
    Object.defineProperty(Food.prototype, "X", {
        get: function () {
            return this.element.offsetLeft;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Food.prototype, "Y", {
        get: function () {
            return this.element.offsetTop;
        },
        enumerable: false,
        configurable: true
    });
    Food.prototype.create = function () {
        var vievBorderWidth = parseInt(getComputedStyle(this.viev, null).borderWidth);
        var vievWidth = parseInt(getComputedStyle(this.viev, null).width) - vievBorderWidth * 2;
        var elementWidth = parseInt(getComputedStyle(this.element, null).width);
        //除以10 除以蛇的步长
        var width = (vievWidth - elementWidth) / 10;
        var left = Math.round(Math.random() * width) * 10;
        var top = Math.round(Math.random() * width) * 10;
        this.element.style.left = left + "px";
        this.element.style.top = top + "px";
    };
    return Food;
}());
//计分器
var scoringDevice = /** @class */ (function () {
    function scoringDevice(maxLevel, update) {
        if (maxLevel === void 0) { maxLevel = 10; }
        if (update === void 0) { update = 5; }
        this.score = 0;
        this.level = 1;
        this.scoreEl = document.querySelector("#score");
        this.levelEl = document.querySelector("#level");
        this.maxLevel = maxLevel;
        this.update = update;
    }
    scoringDevice.prototype.addScore = function () {
        this.scoreEl.innerHTML = "" + ++this.score;
        if (this.score % this.update == 0) {
            this.addLevel();
        }
    };
    scoringDevice.prototype.addLevel = function () {
        if (this.level < this.maxLevel) {
            this.levelEl.innerHTML = "" + ++this.level;
        }
    };
    return scoringDevice;
}());
//蛇
var snake = /** @class */ (function () {
    function snake() {
        this.element = document.querySelector(".snake");
        this.head = document.querySelector(".snake>div");
        this.body = this.element.getElementsByTagName("div");
    }
    Object.defineProperty(snake.prototype, "X", {
        //获取蛇头坐标
        get: function () {
            return this.head.offsetLeft;
        },
        //设置蛇头的坐标
        set: function (val) {
            if (this.X == val) {
                return;
            }
            if (val < 0 || val >= parseInt(getComputedStyle(document.querySelector(".viev"), null).width)) {
                throw new Error("蛇撞墙了");
            }
            if (this.body[1] && this.body[1].offsetLeft === val) {
                throw new Error("蛇撞到自己了");
            }
            this.moveBody();
            this.head.style.left = val + "px";
            this.snakeCrash();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(snake.prototype, "Y", {
        get: function () {
            return this.head.offsetTop;
        },
        set: function (val) {
            if (this.Y == val) {
                return;
            }
            if (val < 0 || val >= parseInt(getComputedStyle(document.querySelector(".viev"), null).height)) {
                throw new Error("蛇撞墙了");
            }
            if (this.body[1] && this.body[1].offsetTop === val) {
                throw new Error("蛇撞到自己了");
            }
            this.moveBody();
            this.head.style.top = val + "px";
            this.snakeCrash();
        },
        enumerable: false,
        configurable: true
    });
    //添加蛇
    snake.prototype.addSnake = function () {
        this.element.insertAdjacentHTML("beforeend", "<div></div>");
    };
    // 移动身体
    snake.prototype.moveBody = function () {
        for (var i = this.body.length - 1; i > 0; i--) {
            var left = this.body[i - 1].offsetLeft;
            var top = this.body[i - 1].offsetTop;
            this.body[i].style.left = left + "px";
            this.body[i].style.top = top + "px";
        }
    };
    // 监测是否发生碰撞
    snake.prototype.snakeCrash = function () {
        for (var i = 1; i < this.body.length; i++) {
            if (this.X === this.body[i].offsetLeft && this.Y === this.body[i].offsetTop) {
                throw new Error("蛇撞到自己了");
            }
        }
    };
    return snake;
}());
//游戏
var Game = /** @class */ (function () {
    function Game() {
        //方向
        this.keyBay = "ArrowRight";
        this.flag = true;
        // off
        this.off = true;
        this.food = new Food();
        this.scoringDevice = new scoringDevice(10, 3);
        this.snake = new snake();
        // this.flag&&this.init()
        this.begin = document.querySelector("#begin");
        this.go();
    }
    //绑定键盘事件
    Game.prototype.init = function () {
        document.addEventListener("keydown", this.keydownH.bind(this));
        this.move();
    };
    // 开始游戏
    Game.prototype.go = function () {
        var _this = this;
        this.begin.addEventListener("click", function () {
            if (_this.off) {
                _this.begin.innerHTML = "按下 p 键暂停";
                for (var j = 1; j < _this.snake.body.length;) {
                    _this.snake.body[j].remove();
                }
                // 积分器归零
                _this.scoringDevice.score = 0;
                _this.scoringDevice.level = 1;
                _this.scoringDevice.scoreEl.innerHTML = "" + _this.scoringDevice.score;
                _this.scoringDevice.levelEl.innerHTML = "" + _this.scoringDevice.level;
                // 回到起点
                _this.snake.X = 0;
                _this.snake.Y = 0;
                // 删除自身
                _this.flag = true;
                _this.keyBay = "ArrowRight";
                _this.init();
                _this.off = false;
            }
        });
    };
    Game.prototype.keydownH = function (event) {
        var _this = this;
        var key = ["ArrowUp", "w", "ArrowDown", "s", "ArrowRight", "d", "ArrowLeft", "a", 'p'];
        key.forEach(function (item) {
            if (event.key == item) {
                _this.keyBay = event.key;
            }
        });
    };
    //ArrowUp
    // ArrowDown
    // ArrowRight
    // ArrowLeft
    Game.prototype.move = function () {
        //读取蛇的x、y值
        var x = this.snake.X;
        var y = this.snake.Y;
        switch (this.keyBay) {
            case "ArrowUp":
            case "w":
                y -= 10;
                break;
            case "ArrowDown":
            case "s":
                y += 10;
                break;
            case "ArrowRight":
            case "d":
                x += 10;
                break;
            case "ArrowLeft":
            case "a":
                x -= 10;
                break;
            case "p":
                this.keyBay = "";
                document.body.style.backgroundColor = "#bfa";
                document.getElementById("end").innerHTML = "游戏暂停";
                break;
        }
        if (this.keyBay != "") {
            document.body.style.backgroundColor = "#fff";
            document.getElementById("end").innerHTML = "";
        }
        this.eatFoot(x, y);
        //    修改蛇的x、y值
        try {
            this.snake.X = x;
            this.snake.Y = y;
        }
        catch (err) {
            document.body.style.backgroundColor = "red";
            this.begin.innerHTML = "重新开始";
            // alert(err.message)
            document.getElementById("end").innerHTML = err.message + "  GameOver";
            this.off = true;
            this.flag = false;
        }
        // console.log(y,x)
        this.flag && setTimeout(this.move.bind(this), 250 - (this.scoringDevice.level - 1) * 25);
    };
    // 检查蛇是否吃到食物
    Game.prototype.eatFoot = function (x, y) {
        if (x === this.food.X && y === this.food.Y) {
            this.snake.addSnake();
            this.food.create();
            this.scoringDevice.addScore();
        }
    };
    return Game;
}());
new Game();
