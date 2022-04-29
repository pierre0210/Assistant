module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_table', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		timestamps: false
	});
}