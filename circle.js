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

  const drawArc = (startAngle, endAngle) => {
    ctx.arc(
      width / 2,
      height / 2,
      radius,
      (Math.PI / 180) * startAngle,
      (Math.PI / 180) * endAngle,
      false
    );
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

  const drawCircle = () => {
    let degree = 0;

    convArr.forEach((value, i) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);

      if (i == 0) {
        const endAngle = 270 + value;
        drawArc(270, endAngle);
        angleArr[i] = [270, endAngle];

        degree = endAngle;
      } else {
        degree = degree > 360 ? degree - 360 : degree;
        const endAngle = degree + value;
        drawArc(degree, endAngle);
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

    if (before) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.strokeStyle = "black";
      ctx.globalCompositeOperation = "source-atop";

      drawArc(before[0], before[1]);

      ctx.closePath();
      ctx.stroke();

      before = null;
    }

    if (currentAngle) {
      before = currentAngle;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.strokeStyle = "red";

      drawArc(currentAngle[0], currentAngle[1]);

      ctx.closePath();
      ctx.stroke();
    }
  };

  canvas.addEventListener("mousemove", handleHoverEvent);

  drawCircle();
};

drawChart(series);
