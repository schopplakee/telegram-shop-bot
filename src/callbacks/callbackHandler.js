module.exports = async (ctx) => {

  const data = ctx.callbackQuery.data;

  console.log(data);

  await ctx.answerCbQuery();

};