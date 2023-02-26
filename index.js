const values = [
  { name: "name", data: [90, 50, 40, 90, 100] },
  { name: "name", data: [40, 30, 20, 50, 100] },
];

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

  const barWidth = position.max_x / values[0].data.length - position.min_x;

  const getCurrentBarPosition = (valueIdx, dataIdx, data) => {
    const divide = dataIdx / values[0].data.length;
    const ratio = 1 - data / 100;

    const x = position.min_x + position.max_x * divide + valueIdx * barWidth;
    const y = position.max_y * ratio;

    return { x, y };
  };

  const writeText = (data, x, y) => {
    const centerPosition = barWidth / 2 - ctx.measureText(data).width / 2;
    ctx.strokeText(data, x + centerPosition, y);
  };

  const drawBar = (x, y) => {
    ctx.strokeRect(x, y, barWidth, position.max_y - y);
  };

  const getCurrentBar = (currentX, currentY) => {
    return values
      .map((value, valueIdx) => {
        const currentBar = value.data.reduce((acc, cur, idx) => {
          const { x: startX, y: startY } = getCurrentBarPosition(
            valueIdx,
            idx,
            cur
          );

          const endX = startX + barWidth;
          const endY = position.max_y;

          const isInX = currentX <= endX && currentX >= startX;
          const isInY = currentX <= endY && currentY >= startY;

          if (isInX && isInY) {
            acc.push({
              data: cur,
              idx,
              position: {
                x: startX,
                y: startY,
              },
            });
          }

          return acc;
        }, []);

        return currentBar[0];
      })
      .filter((value) => value)[0];
  };

  const toolTipMaker = (text, pos_x, pos_y, onOff) => {
    const hover = document.getElementById("im_hover");
    if (!onOff) {
      hover.style.display = "none";
      hover.innerHTML = "";
    } else {
      hover.style.display = "block";
      hover.style.left = pos_x + pos_x * 0.02; // 커서와 툴팁 사이 간격
      hover.style.top = pos_y + pos_y * 0.02; // 커서와 툴팁 사이 간격
      hover.innerHTML = text;
    }
  };

  const handleHoverEvent = () => {
    let before;
    return function (event) {
      const { clientX, clientY } = event;
      const x = clientX - canvas.offsetLeft;
      const y = clientY - canvas.offsetTop;
      const currentBar = getCurrentBar(x, y);

      if (before) {
        ctx.save();
        const { x, y } = before.position;

        ctx.clearRect(x - 1, y - 1, barWidth + 2, position.max_y - y + 2);

        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y, barWidth, position.max_y - y);
        toolTipMaker(0, 0, 0, false);
        before = null;
      }
      if (currentBar) {
        before = currentBar;
        ctx.save();

        const { x, y } = currentBar.position;

        ctx.clearRect(x - 1, y - 1, barWidth + 2, position.max_y - y + 2);

        ctx.strokeStyle = "red";
        ctx.strokeRect(x, y, barWidth, position.max_y - y);
        toolTipMaker(currentBar.data, clientX, clientY, true);
      }
    };
  };

  const animate = () => {
    let currentHeight = 0;

    ctx.beginPath();

    return function () {
      const interval = setInterval(() => {
        currentHeight++;

        ctx.clearRect(0, 0, width, height);
        values.forEach((value, valueIdx) => {
          value.data.forEach((data, idx) => {
            const { x: currentX, y: currentY } = getCurrentBarPosition(
              valueIdx,
              idx,
              data
            );

            if (data > currentHeight) {
              const { y: currentY } = getCurrentBarPosition(
                valueIdx,
                idx,
                currentHeight
              );
              return drawBar(currentX, currentY);
            }

            drawBar(currentX, currentY);

            if (currentHeight >= Math.max(...value.data)) {
              writeText(data, currentX, position.max_y + 20);

              if (idx === value.data.length - 1) {
                canvas.addEventListener("mousemove", handleHoverEvent());
              }
              return clearInterval(interval);
            }
          });
        });
      }, 10);
      isLoaded = true;
    };
  };

  const draw = animate();
  draw();
};

drawChart(values);
