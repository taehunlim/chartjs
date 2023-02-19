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

let virtualVal = values.slice().map((_arg) => 1);
let interval = setInterval(() => {
  ctx.clearRect(0, 0, width, height);
  virtualVal.forEach((data, idx) => {
    let divide = idx / values.length;
    let ratio = 1 - data / 100;

    if (values[idx] > data) {
      data++;
      virtualVal[idx] = data;
      return ctx.strokeRect(
        position.min_x + position.max_x * divide,
        position.max_y * ratio,
        wid,
        position.max_y - position.max_y * ratio
      );
    }
    return ctx.strokeRect(
      position.min_x + position.max_x * divide,
      position.max_y * ratio,
      wid,
      position.max_y - position.max_y * ratio
    );
  });
  let checker = values.slice().map((_arg) => false);
  virtualVal.forEach((virtualData, virtualIdx) => {
    values.forEach((data, idx) => {
      if (virtualData >= data && virtualIdx === idx) {
        checker[idx] = true;
      }
    });
  });
  let breaker = true;
  checker.forEach((arg) => {
    if (!arg) {
      breaker = false;
    }
  });

  if (breaker) {
    clearInterval(interval);
  }
}, 10);
