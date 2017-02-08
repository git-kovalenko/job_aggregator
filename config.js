module.exports = {
	mysql:{
		host: 'localhost',
		database: 'test',
		user: 'root',
		password: 'testuser',
		connectionLimit : 10
	},
	herokuMysql:{
		host: 'us-cdbr-iron-east-04.cleardb.net/heroku_1594ba350a299e7?reconnect=true',
		database: 'heroku_1594ba350a299e7',
		user: 'b4ebf7ecb812b7',
		password: '3290c246',
		connectionLimit : 10
	}
}