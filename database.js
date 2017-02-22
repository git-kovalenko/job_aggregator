var c = console;
module.exports = function(pool){
	var Database ={
		createTable: function(callback) {
			pool.query("CREATE TABLE IF NOT EXISTS vacancies1\
			    ( id VARCHAR(250),\
					title TEXT,\
					url TEXT,\
					short_info TEXT,\
					full_info TEXT,\
					company VARCHAR(500),\
					zp VARCHAR(20),\
					hot BOOL,\
					readed BOOL,\
					chosen BOOL,\
					date_from DATETIME,\
					date TIMESTAMP,\
					PRIMARY KEY(id)\
		)", function(err, rows, fields){
				console.log('rows = >>>>>>'+rows)
				if (err) throw err;
			});
		},
		add: function(newJob, callback){
			var duplicateJob = Object.assign({}, newJob);
			delete duplicateJob.date_from;
			pool.query("INSERT INTO vacancies1 SET ? ON DUPLICATE KEY UPDATE `date`=CURRENT_TIMESTAMP, ?", [newJob, duplicateJob], function(err, rows, fields){
				if (rows != undefined){
					console.log('               affectedRows : '+ rows.affectedRows)
				}
			    callback(null);
				if (err) throw err;
			});
		},
		getAll: function(callback){
			pool.query("SELECT * FROM vacancies1", function(err, rows, fields){
				if (rows != undefined){
					console.log('AllRows = '+ rows.length)
					// console.log('solution = '+ JSON.stringify( rows[0], null, 4)  )
				}
				if (err){ 
					throw err;
				}else{
					callback(rows);
				}
			});
		}
	}
	return Database;
}
