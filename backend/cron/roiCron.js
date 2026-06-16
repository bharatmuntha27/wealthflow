const cron = require("node-cron");
const { processDailyROI } = require("../services/roiService");

cron.schedule("0 0 * * *", async () => {
  console.log("Daily ROI cron started");
  await processDailyROI();
});

console.log("ROI cron scheduler initialized");