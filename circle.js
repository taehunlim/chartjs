const series = [30, 40, 100, 100];

const drawChart = (series) => {
  let angleArr = [];
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

  const isInsideArc = (x, y) => {
    const chartX = width / 2 - x;
    const chartY = height / 2 - y;
    const hypotenuse = Math.sqrt(
      Math.abs(chartX * chartX) + Math.abs(chartY * chartY)
    ); //피타고라스의 정리

    if (radius >= hypotenuse) {
      const atan2 = Math.atan2(chartY, chartX);
      const currentRadius = (atan2 * 180) / Math.PI + 180;

      angleArr.forEach((arr, idx) => {
        if (currentRadius >= arr[0] && currentRadius <= arr[1]) {
          console.log(idx);
        }
      });
      return true;
    }
    return false;
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

  canvas.addEventListener("click", (event) => {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    const isIn = isInsideArc(x, y);
  });

  drawCircle();
};

drawChart(series);
