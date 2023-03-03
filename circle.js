const series = [30, 40, 100, 100];

const drawChart = (series) => {
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

  const drawCircle = () => {
    let degree = 0;

    convArr.forEach((value, i) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);

      const centerDegree = value - 90;

      if (i == 0) {
        ctx.arc(
          width / 2,
          height / 2,
          radius,
          (Math.PI / 180) * -90,
          (Math.PI / 180) * centerDegree,
          false
        );
        degree = centerDegree;
      } else {
        ctx.arc(
          width / 2,
          height / 2,
          radius,
          (Math.PI / 180) * degree,
          (Math.PI / 180) * (degree + value),
          false
        );
        degree = degree + value;
      }

      console.log(degree);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });
  };

  canvas.addEventListener("click", (event) => {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    const isIn = isInsideArc(x, y);
    console.log(isIn);
  });

  function isInsideArc(x, y) {
    const chartX = width / 2 - x;
    const chartY = height / 2 - y;
    const hypotenuse = Math.sqrt(
      Math.abs(chartX * chartX) + Math.abs(chartY * chartY)
    ); //피타고라스의 정리

    if (radius >= hypotenuse) {
      //중심점으로부터 반지름 이내에 들어왔는지 확인!
      return true;
    }
    return false;
  }

  drawCircle();
};

drawChart(series);
