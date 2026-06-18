const { Markup } = require("telegraf");

module.exports = (plans) => {
  const rows = plans.map((plan) => [
    Markup.button.callback(
      `${plan.name} | ${plan.days} روز | ${plan.traffic}GB`,

      `admin_plan:${plan.id}`,
    ),
  ]);

  rows.push([
    Markup.button.callback(
      "⬅️ بازگشت",

      "admin_plan_back",
    ),
  ]);

  return Markup.inlineKeyboard(rows);
};
