const DevProcess = require("./dev");
const contentProvider = require("./contentProvider");

const contentJson = JSON.stringify(contentProvider.getContent());
console.log(contentJson)

const dev = async () => {
  devProcess = new DevProcess();
  devProcess.start();
  return;
}

dev();
