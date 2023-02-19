const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = canvas.clientWidth;
let height = canvas.clientHeight;

let position = {
  min_x: width * 0.1,
  max_x: width * 0.9,
  min_y: height * 0.1,
  max_y: height * 0.9,
};

let values = [90, 50, 40, 90, 100, 20, 10];
let wid = position.max_x / values.length - position.min_x;

ctx.beginPath();

let number = 0;
let interval = setInterval(() => {
  number++;

  ctx.clearRect(0, 0, width, height);
  values.forEach((data, idx) => {
    let divide = idx / values.length;
    let ratio = 1 - number / 100;

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

    if (number >= Math.max(...values)) clearInterval(interval);
  });
}, 10);
