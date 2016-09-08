var c = console;
try{
	var grabOptions = {
			city: 'kiev',
			category: 'it',
			searchString: 'Front-end'
		};
	var cityCodes = {
			kiev:{
				rabota_ua: '1',
				dou_ua: 'Киев'
			}
		};
	var categories = {
			it:{
				rabota_ua: '1',
				dou_ua: 'Front%20End'
			}
		};
// https://jobs.dou.ua/vacancies/?city=%D0%9A%D0%B8%D0%B5%D0%B2&category=Front%20End		
	var links = {
		dou_ua:{
			domain: 'http://jobs.dou.ua',
			url: 'http://jobs.dou.ua/vacancies/',
			paginatorTrigger: "$('.more-btn a').trigger('mousedown').trigger('mouseup')",
			params:{
				city: cityCodes[grabOptions.city]['dou_ua'],
				// keyWords: grabOptions.searchString,
				category: categories[grabOptions.category]['dou_ua']
			},
			tableRowsSelector: '.lt li',
			cheerioGetters: function(tr){
				return{
					hot: tr.find('a.vt[href*="list_hot"]').length ? true : false,
					title: tr.find('a.vt').text().trim(),
					url: tr.find('a.vt').prop('href'),
					short_info: tr.find('.sh-info').text().trim(),
					zp: tr.find('.salary').text().trim(),
					company: tr.find('.company').text().trim(),
				}
			}
		}
		/*,
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
		}*/
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
				var paginator = link.params[link.paginatorName];

				
				async.doWhilst(
					function(callbackDoWhilst){
						var reqUrl = link.url + '?';
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
									var $ = cheerio.load(browser.html());
c.log(browser.html())									
									var tableRows = $(link.tableRowsSelector);
c.log(tableRows.length)									
									if (link.paginatorTrigger){
										browser.click('.more-btn a', function(){
											$ = cheerio.load(browser.html());
											tableRows = $(link.tableRowsSelector);
c.log(tableRows.length)									

										});
									}
									

									try{
										
										async.eachSeries(tableRows, function(tr, callbackEach){
												var newJob = new Job (link.cheerioGetters( $(tr) ));
												if(!/^http/.test(newJob.url)){
													newJob.url = link.domain + newJob.url;
												}
												console.log(  newJob.url   );	

												database.add(newJob, callbackEach);
											},
											function (err) {
												if(err){
													c.log(err);
												}else{
													c.log('-------> done eachSeries!')
												}
											}
										);

									}catch(e){
										console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
									}
									callbackDoWhilst(null, tableRows.length)
								}
							);
						});
					},
					function(tableRowsLength){
						c.log("tableRowsLength = "+ tableRowsLength)						
						if(tableRowsLength > 0){
							paginator = parseInt(paginator) + parseInt(link.pageStep);
						}
						return (tableRowsLength > 0);
					},
					function (err, n) {
						if(err){
							c.log(err);
						}else{
							c.log('-------> done doWhilst!')
						}
					}
				);



				
			}
		}
	}
	return Scrapper;
}