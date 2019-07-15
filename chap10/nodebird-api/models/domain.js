module.exports = (sequelize, DataTypes) => (
    sequelize.define('domain', {        //domain 모델에는 인터넷주소(host),도메인종류(type),
      host: {                           // 클라이언트 비밀키(clientSecret)가 들어가고 
        type: DataTypes.STRING(80),     // clientSecret는 API 사용시 쓴다.
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      clientSecret: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    }, {
      validate: {               //데이터를 추가로 검증하는 속성이다. 
        unknownType() {         //unknownType는 검증기로 free,premium 둘중 하나를 선택하고 어길때 에러발생한다.
          console.log(this.type, this.type !== 'free', this.type !== 'premium');
          if (this.type !== 'free' && this.type !== 'premium') {
            throw new Error('type 컬럼은 free나 premium이어야 합니다.');
          }
        },
      },
      timestamps: true,
      paranoid: true,
    })
  );