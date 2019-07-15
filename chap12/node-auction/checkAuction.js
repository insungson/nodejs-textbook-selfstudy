const { Good, Auction, User, sequelize } = require('./models');

module.exports = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targets = await Good.findAll({
      where: {
        soldId: null,
        createdAt: { [sequelize.Op.lte]: yesterday }, //sequelize.Op.lte 는 ~보다 이하라는 뜻이다.
      },                  //http://docs.sequelizejs.com/manual/querying.html  여기 자세한 사항이 나와있다.
    });
    //console.log('어제날짜는 나올까?',yesterday);
    //console.log('상품목록이 나올까?',targets);
    targets.forEach(async (target) => {
      const success = await Auction.find({
        where: { goodId: target.id },
        order: [['bid', 'DESC']],
      });
      console.log('최고가가 나올까?',success);
      await Good.update({ soldId: success.userId }, { where: { id: target.id } });
      await User.update({
        money: sequelize.literal(`money - ${success.bid}`),
      }, {
        where: { id: success.userId },
      });
    });
  } catch (error) {
    console.error(error);
  }
};