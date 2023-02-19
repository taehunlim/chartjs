const values = [90, 50, 40, 90, 100];

const drawChart = (values) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const position = {
    min_x: width * 0.1,
    max_x: width * 0.9,
    min_y: height * 0.1,
    max_y: height * 0.9,
  };

  const barWidth = position.max_x / values.length - position.min_x;

  let number = 0;

  const writeText = (data, x, y) => {
    const centerPosition = barWidth / 2 - ctx.measureText(data).width / 2;
    ctx.strokeText(data, x + centerPosition, y);
  };

  const drawBar = (x, y) => {
    ctx.strokeRect(x, y, barWidth, position.max_y - y);
  };

  ctx.beginPath();

  const interval = setInterval(() => {
    number++;

    ctx.clearRect(0, 0, width, height);
    values.forEach((data, idx) => {
      const divide = idx / values.length;
      const ratio = 1 - data / 100;
      const currentX = position.min_x + position.max_x * divide;
      const currentY = position.max_y * ratio;

      if (data > number) {
        const ratio = 1 - number / 100;
        const currentY = position.max_y * ratio;

        return drawBar(currentX, currentY);
      }

      drawBar(currentX, currentY);

      if (number >= Math.max(...values)) {
        writeText(data, currentX, position.max_y + 20);

        return clearInterval(interval);
      }
    });
  }, 10);
};

drawChart(values);
