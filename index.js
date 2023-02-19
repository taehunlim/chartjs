const drawChart = () => {
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

  const values = [90, 50, 40, 90, 100];
  const wid = position.max_x / values.length - position.min_x;

  let number = 0;

  const writeText = (data, x, y) => {
    const centerPosition = wid / 2 - ctx.measureText(data).width / 2;

    ctx.strokeText(data, x + centerPosition, y);
  };

  ctx.beginPath();

  const interval = setInterval(() => {
    number++;

    ctx.clearRect(0, 0, width, height);
    values.forEach((data, idx) => {
      const divide = idx / values.length;
      const ratio = 1 - number / 100;

      if (data > number) {
        return ctx.strokeRect(
          position.min_x + position.max_x * divide,
          position.max_y * ratio,
          wid,
          position.max_y - position.max_y * ratio
        );
      }

      ctx.strokeRect(
        position.min_x + position.max_x * divide,
        position.max_y * (1 - data / 100),
        wid,
        position.max_y - position.max_y * (1 - data / 100)
      );

      if (number >= Math.max(...values)) {
        writeText(
          data,
          position.min_x + position.max_x * divide,
          position.max_y + 20
        );

        return clearInterval(interval);
      }
    });
  }, 10);
};

drawChart();
