export default function initMouseEffect() {
  // 检查是否已存在心形轨迹 Canvas
  if (document.getElementById('heart-trail-canvas')) {
    const oldCanvas = document.getElementById('heart-trail-canvas');
    if (oldCanvas.cleanup) {
      oldCanvas.cleanup();
    } else {
      oldCanvas.parentNode.removeChild(oldCanvas);
    }
  }
  
  // 创建 Canvas
  var canvas = document.createElement('canvas');
  canvas.id = 'heart-trail-canvas';
  var c = canvas.getContext("2d");
  
  // 设置 Canvas 样式
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '999999';
  canvas.style.pointerEvents = 'none';
  
  // 将 Canvas 添加到 body
  document.body.appendChild(canvas);
  
  // 设置 Canvas 尺寸为全视口
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Variables
  var mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2 - 80,
  };

  var colors = [
    "#FF9999", // 浅红色
    "#FFBE99", // 浅橙色
    "#FFFF00", // 黄色
    "#00FF00", // 绿色
    "#0000FF", // 蓝色
    "#B799C2", // 浅靛色
    "#D499FF"  // 浅紫色
  ];
  var particles = [];
  var particleHistory = []; // 存储轨迹历史
  const MAX_HISTORY = 50; // 最多保留的历史点数
  
  // 事件监听器
  const mouseMoveHandler = function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  };
  
  const resizeHandler = function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  };

  window.addEventListener("mousemove", mouseMoveHandler);
  window.addEventListener("resize", resizeHandler);

  // Utility Functions
  function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Particle 对象修改版 - 调整参数让爱心变小
  function Particle(x, y, radius, color) {
    var _this = this;

    // 减小距离范围使爱心变小
    var distance = randomIntFromRange(20, 60); // 原来是 50-120，现在减小
    this.x = x;
    this.y = y;
    this.radius = radius * 0.8; // 减小线条粗细
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.05;
    this.distanceFromCenter = {
      x: distance,
      y: distance,
    };
    this.prevDistanceFromCenter = {
      x: distance,
      y: distance,
    };
    this.lastMouse = { x: x, y: y };
    this.path = []; // 存储粒子的路径
    this.maxPathLength = 30; // 减少路径长度，原来是40

    this.update = function () {
      // 保存当前位置到路径
      this.path.unshift({ x: this.x, y: this.y });
      
      // 限制路径长度
      if (this.path.length > this.maxPathLength) {
        this.path.pop();
      }
      
      // Move points over time
      _this.radians += _this.velocity;

      // Drag effect
      _this.lastMouse.x += (mouse.x - _this.lastMouse.x) * 0.05;
      _this.lastMouse.y += (mouse.y - _this.lastMouse.y) * 0.05;

      // Circular Motion - 减小运动幅度让爱心变小
      _this.distanceFromCenter.x =
        _this.prevDistanceFromCenter.x + Math.sin(_this.radians) * 50; // 原来是100
      _this.distanceFromCenter.y =
        _this.prevDistanceFromCenter.x + Math.sin(_this.radians) * 50; // 原来是100

      _this.x =
        _this.lastMouse.x +
        Math.cos(_this.radians) * _this.distanceFromCenter.x;
      _this.y =
        _this.lastMouse.y +
        Math.sin(_this.radians) * _this.distanceFromCenter.y;

      _this.draw();
    };

    this.draw = function () {
      if (this.path.length < 2) return;
      
      c.beginPath();
      c.moveTo(this.path[0].x, this.path[0].y);
      
      // 绘制路径
      for (let i = 1; i < this.path.length; i++) {
        c.lineTo(this.path[i].x, this.path[i].y);
      }
      
      c.strokeStyle = this.color;
      c.lineWidth = this.radius;
      c.stroke();
      c.closePath();
    };
  }

  // 初始化粒子
  function init() {
    particles = [];

    for (var i = 0; i < 40; i++) { // 减少粒子数量，原来是50
      var radius = (Math.random() * 1.5 + 0.8); // 调整半径范围
      particles.push(
        new Particle(
          canvas.width / 2,
          canvas.height / 2,
          radius,
          randomColor(colors)
        )
      );
    }
  }

  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // 完全清除 Canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制所有粒子
    particles.forEach(function (particle) {
      particle.update();
    });
  }

  // 初始化并启动动画
  init();
  animate();
  
  // 添加清理方法
  canvas.cleanup = function() {
    window.removeEventListener("mousemove", mouseMoveHandler);
    window.removeEventListener("resize", resizeHandler);
    cancelAnimationFrame(animationId);
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };
  
  return canvas; // 返回创建的Canvas，方便外部引用
}

// 处理页面切换和初始加载
try {
  if (typeof swup !== 'undefined') {
    swup.hooks.on("page:view", function() {
      const oldCanvas = document.getElementById('heart-trail-canvas');
      if (oldCanvas && oldCanvas.cleanup) {
        oldCanvas.cleanup();
      }
      
      // 延迟一下再初始化新的效果，避免与页面过渡动画冲突
      setTimeout(initMouseEffect, 100);
    });
  }
} catch (e) {
  // Swup 可能不存在，忽略错误
}

// 在页面加载完成时初始化
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initMouseEffect);
} else {
  // 如果DOM已经加载完成，直接初始化
  initMouseEffect();
}