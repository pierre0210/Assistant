module.exports = (sequelize, DataTypes) => {
	return sequelize.define('task_table', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		time: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		event: {
			type: DataTypes.STRING,
			allowNull: false
		},
		channel_id: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		timestamps: false
	});
}