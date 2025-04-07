// 在 themes/redefine/source/js/mouse-effect.js
(function() {
    console.log("爱心点击特效已加载");
    
    // 创建样式
    var styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
      .heart {
        position: fixed;
        font-size: 20px;
        color: #ff0000;
        transform: translateZ(0);
        pointer-events: none;
        animation: heartFade 1s ease-out forwards;
      }
      
      @keyframes heartFade {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-100px); opacity: 0; }
      }
    `;
    document.head.appendChild(styleElement);
    
    // 点击事件
    document.addEventListener('click', function(e) {
      var heart = document.createElement('div');
      heart.className = 'heart';
      heart.innerHTML = '❤️';
      heart.style.left = (e.clientX - 10) + 'px';
      heart.style.top = (e.clientY - 10) + 'px';
      heart.style.zIndex = '999';
      document.body.appendChild(heart);
      
      setTimeout(function() {
        document.body.removeChild(heart);
      }, 1000);
      
      console.log("创建爱心：", e.clientX, e.clientY);
    });
    
    console.log("爱心点击特效初始化完成");
  })();