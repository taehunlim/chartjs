const series = [30, 40, 100, 100];

const drawChart = (series) => {
  let angleArr = [];
  let before = null;

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const radius = 50;
  const sum = series.reduce((a, b) => a + b);

  const convArr = series.map((data) => {
    //convArr는 비율이 담긴 배열
    const rate = data / sum; //값을 총합계로 나누어 비율을 구함
    return 360 * rate; //비율을 360을(degree) 곱해 비율에 따른 도(degree)를 구함.
  });

  const drawArc = (startAngle, endAngle, clock) => {
    ctx.arc(
      width / 2,
      height / 2,
      radius,
      (Math.PI / 180) * startAngle,
      (Math.PI / 180) * endAngle,
      clock || false
    );

    ctx.fillStyle = "red";
    ctx.fill();
  };

  const getCurrentAngle = (x, y) => {
    const chartX = width / 2 - x;
    const chartY = height / 2 - y;
    const hypotenuse = Math.sqrt(
      Math.abs(chartX * chartX) + Math.abs(chartY * chartY)
    ); //피타고라스의 정리

    if (radius >= hypotenuse) {
      const atan2 = Math.atan2(chartY, chartX);
      const currentRadius = (atan2 * 180) / Math.PI + 180;

      const currentAngle = angleArr.filter((angles) => {
        if (currentRadius >= angles[0] && currentRadius <= angles[1]) {
          return angles;
        }
      });

      return currentAngle[0];
    }
  };

  const degreesToRadians = (degrees) => {
    const pi = Math.PI;
    return degrees * (pi / 180);
  };

  const makeText = (x, y, idx) => {
    let half = (y - x) / 2;
    let degg = x + half;
    let xx = Math.cos(degreesToRadians(degg)) * radius * 0.7 + width / 2;
    let yy = Math.sin(degreesToRadians(degg)) * radius * 0.7 + height / 2;

    let txt = series[idx];
    let minus = ctx.measureText(txt).width / 2; //텍스트 절반길이
    ctx.save();

    ctx.fillStyle = "black";
    ctx.font = "normal 14px serif";

    ctx.fillText(txt, xx - minus, yy);
    ctx.restore();
  };

  const drawCircle = () => {
    let degree = 0;

    convArr.forEach((value, i) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);

      if (i == 0) {
        const endAngle = 270 + value;
        drawArc(270, endAngle);
        makeText(270, endAngle, i);
        angleArr[i] = [270, endAngle];

        degree = endAngle;
      } else {
        degree = degree > 360 ? degree - 360 : degree;
        const endAngle = degree + value;
        drawArc(degree, endAngle);
        makeText(degree, endAngle, i);

        angleArr[i] = [degree, endAngle];

        degree = endAngle;
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });
  };

  const handleHoverEvent = (event) => {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    const currentAngle = getCurrentAngle(x, y);

    if (before && JSON.stringify(before) !== JSON.stringify(currentAngle)) {
      ctx.clearRect(
        width / 2 - radius - 1,
        height / 2 - radius - 1,
        radius * 2 + 2,
        radius * 2 + 2
      );
      drawCircle();
      before = null;
    }

    if (currentAngle && !before) {
      ctx.clearRect(
        width / 2 - radius - 1,
        height / 2 - radius - 1,
        radius * 2 + 2,
        radius * 2 + 2
      );
      drawCircle();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);

      drawArc(currentAngle[0], currentAngle[1]);

      ctx.fillStyle = "blue";
      ctx.fill();

      ctx.closePath();
      ctx.stroke();

      before = currentAngle;
    }
  };

  canvas.addEventListener("mousemove", handleHoverEvent);

  drawCircle();
};

drawChart(series);
