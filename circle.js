const series = [30, 40, 100, 100];

const drawChart = (series) => {
  let degree = 0;

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
    convArr.forEach((value, i) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      if (i == 0) {
        ctx.arc(
          width / 2,
          height / 2,
          radius,
          (Math.PI / 180) * 0,
          (Math.PI / 180) * value,
          false
        );
        degree = value;
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

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });
  };

  drawCircle();
};

drawChart(series);
