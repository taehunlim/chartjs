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

let wid = 50;
let values = [90, 50, 60, 20];

ctx.beginPath();

let virtualVal = values.slice().map((_arg) => 1);
let interval = setInterval(() => {
  virtualVal.forEach((data, idx) => {
    if (values[idx] > data) {
      let devide = idx / values.length;
      let ratio = 1 - data / 100;

      data++;
      virtualVal[idx] = data;
      ctx.strokeRect(
        position.min_x + position.max_x * devide,
        position.max_y * ratio,
        wid,
        position.max_y - position.max_y * ratio
      );
    }
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
