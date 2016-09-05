var c = console;
try{
	var grabOptions = {
			city: 'kiev',
			category: 'it',
			searchString: 'Front-end'
		};
	var cityCodes = {
			kiev:{
				rabota_ua: '1'
			}
		};
	var categories = {
			it:{
				rabota_ua: '1'
			}
		};
	var links = {
		rabota_ua:{
			domain: 'http://rabota.ua',
			url: 'http://rabota.ua/jobsearch/vacancy_list',
			paginatorName: 'pg',
			pageStep: 1,
			params:{
				regionId: cityCodes[grabOptions.city]['rabota_ua'],
				keyWords: grabOptions.searchString,
				parentId: categories[grabOptions.category]['rabota_ua'],
				pg: 1
			},
			tableRowsSelector: '.vv .v',
			cheerioGetters: function(tr){
				return{
					hot: tr.hasClass('h'),
					title: tr.find('.t')[0].children[0].data.trim(),
					url: tr.find('.t').prop('href'),
					short_info: tr.find('div.d').text(),
					zp: tr.find('.s b').text(),
					company: tr.find('.s a').text().trim(),
				}
			}
		}
	};
	// console.log(links)
}catch(e){
	console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
}
//https://jobs.dou.ua/vacancies/?category=Front+End&search=nodejs&city=%D0%9A%D0%B8%D0%B5%D0%B2
module.exports = function(database, browser, moment, cheerio, async){
	var Scrapper = {
		scrape: function(){
			
			function Job(options){
				this.date_from = moment().format("YYYY-MM-DD HH:mm:ss");
				for(var key in options){
					if (options.hasOwnProperty(key)) {
						this[key] = options[key];
					}
				}
			}
			Job.prototype = {
				constructor: Job, 
				hot: null,
				read: null,
				chosen: null
			}

			for(key in links){
				var link = links[key];
				var reqUrl = link.url + '?';
				var paginator = link.params[link.paginatorName];

				
				async.doWhilst(
					function(callback){
						for(param in link.params){
							var value = link.params[param];
							if(link.paginatorName == param){
								value = paginator;
							}
							if(Object.keys(link.params)[Object.keys(link.params).length - 1] == param){
								var lastKey = true;
							}
							reqUrl = reqUrl + param + '=' + value + ((lastKey == true)? '':'&');
						}
		console.log(reqUrl);
						browser.visit(reqUrl, function (e, browser) {
						var injectedScript = browser.document.createElement("script");
						injectedScript.setAttribute("type","text/javascript");
						injectedScript.setAttribute("src", "http://code.jquery.com/jquery-1.11.0.min.js");
						browser.body.appendChild(injectedScript);    
						browser.wait(function(window) {
								return ( browser.evaluate("typeof $") == "function" )
							}, 
							function() {
c.log('try')								
								try{
									var $ = cheerio.load(browser.html());
									var tableRows = $(link.tableRowsSelector);
c.log(tableRows)									
									tableRows.each(function(i, tr){
										var newJob = new Job (link.cheerioGetters( $(tr) ));
										if(!/^http/.test(newJob.url)){
											newJob.url = link.domain + newJob.url;
										}
										console.log(  newJob.url   );	
									});
								}catch(e){
									console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
								}
c.log('tableRows.length= '+tableRows.length);
								// callback(null, tableRows.length)

								
							}
						);
					},
					function(tableRowsLength){
c.log(tableRowsLength)						
						if(tableRowsLength > 0){
							paginator = paginator + link.pagestep;
						}
c.log('paginator = ' +paginator)						
						return (tableRowsLength > 0);
					},
					function (err, n) {
						if(err){
							c.log(err);
						}else{
							c.log('-------> done!')
						}
					}
				);


			});





				// database.add(newJob);
				
			}
		}
	}
	return Scrapper;
}