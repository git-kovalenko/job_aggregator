
//https://jobs.dou.ua/vacancies/?category=Front+End&search=nodejs&city=%D0%9A%D0%B8%D0%B5%D0%B2
module.exports.scrape = function(database, async, moment, eventEmitter){
	var c = console;
	try{
		var grabOptions = {
				city: 'kiev',
				category: 'it',
				searchString: 'Front-end, angular, nodejs, javascript'
			};
		var cityCodes = {
				kiev:{
					rabota_ua: '1',
					dou_ua:     '%D0%9A%D0%B8%D0%B5%D0%B2',
					jooble_org: '%D0%9A%D0%B8%D0%B5%D0%B2'
				}
			};
		var categories = {
				it:{
					rabota_ua: '1',
					dou_ua: 'Front%20End',
					jooble_org: ''
				}
			};
	// https://ua.jooble.org/%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0-angular-node-javascript/%D0%9A%D0%B8%D0%B5%D0%B2?date=3&p=2
		var links = {
			jooble_org:{
				domain: 'https://ua.jooble.org',
				url: 'https://ua.jooble.org/%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0-' + grabOptions.searchString.trim().replace(/-/g, '+').replace(/[\s]+/g, '-'),
				paginatorName: 'p',
				pageStep: 1,
				params:{
					city: cityCodes[grabOptions.city]['jooble_org'],
					date: '0',
					p: 1
				},
				tableRowsSelector: '#serp_table_wrapper .vacancy_wrapper',
				cheerioGetters: function(tr){
					var title = tr.find('#h2Position').text().trim();
					var url = tr.find('.top-wr a').prop('href');
					return{
						id: title + url.match(/^.+\?|^.+\//),
						title: title,
						url: url,
						short_info: tr.find('.description').text(),
						zp: tr.find('.salary').text(),
						company: tr.find('.company-name').text(),
					}
				}
			},
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
				tableRowsSelector: '#content_vacancyList_gridList .f-vacancylist-vacancyblock',
				cheerioGetters: function(tr){
					var title = tr.find('h3').text().trim();
					var url = tr.find('h3 a').prop('href');
					return{
						id: title + url.match(/^.+\?|^.+\//),
						hot: tr.find('h3 i').hasClass('fi-hot'),
						title: title,
						url: url,
						short_info: tr.find('.f-vacancylist-shortdescr').text(),
						zp: tr.find('.-price').text(),
						company: tr.find('.f-vacancylist-companyname').text().trim(),
					}
				}
			}
		};
		// console.log(links)
	}catch(e){
		console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
	}



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
		readed: null,
		chosen: null
	}
			
			async.eachSeries(links, function(link, callbackEachLink){
			//.eachSeries for non parallel
c.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% - '+Object.keys(links).filter(function(key) {return links[key] === link})[0])
				var paginator = link.params[link.paginatorName];

				
				async.doWhilst(
					function(callbackDoWhilst){
						var reqUrl = link.url;

						for(param in link.params){
							var value = link.params[param];
							if(link.paginatorName == param){
								value = paginator;
							}
							var firstKey = Object.keys(link.params)[0] == param;
							var lastKey = Object.keys(link.params)[Object.keys(link.params).length - 1] == param;
							var linkKey = Object.keys(links).filter(function(key) {return links[key] === link})[0];
							if(linkKey == 'jooble_org'){
								if(param == 'city'){
									 reqUrl = reqUrl +'/'+ value + '?'
								}else{
									reqUrl = reqUrl + param + '=' + value + ((lastKey == true)? '':'&');	
								}
							}else{
								reqUrl = reqUrl + ((firstKey == true)? '?':'') + param + '=' + value + ((lastKey == true)? '':'&');
							}
						}

						c.log(reqUrl);
						c.log('paginator = '+paginator)

						const Browser = require('zombie');
						const browser = new Browser();

						if (process.env.USERDOMAIN == 'ALFA'){
							browser.proxy = 'http://wsproxy.alfa.bank.int:3128';
						}


						browser.visit(reqUrl, function () {
									var cheerio = require('cheerio');
									var $ = cheerio.load(browser.html());
									var tableRows = $(link.tableRowsSelector);

c.log('tableRows.length'+  tableRows.length)									
								
									try{

										var jobArray = [];
										var i;
										for (i = 0; i < tableRows.length; i++){
											var tr = tableRows[i]
											var newJob = new Job (link.cheerioGetters( $(tr) ));
											if(!/^http/.test(newJob.url)){
												newJob.url = link.domain + newJob.url;
											}
											console.log(i+" "+  newJob.title  );
											jobArray.push(newJob);
										}
										database.addArray(jobArray);
										jobArray = null;
										callbackDoWhilst(null, tableRows.length)


									}catch(e){
										console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
									}
									
									
									cheerio = null;
									$ = null;
									browser.tabs.closeAll();
							
									//use key: --expose-gc   
									if(typeof global.gc == 'function'){
										global.gc();
										c.log('################################ erised GC')
										console.log(process.memoryUsage().heapUsed / 1000000);
									}
						});
										
	// console.log("\n");
    console.log(process.memoryUsage().heapUsed / 1000000);
    // console.log("\n ");
    if(typeof global.gc == 'function'){
		global.gc();
		c.log('################################ erised GC')
		console.log(process.memoryUsage().heapUsed / 1000000);
	}

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
							c.log('-------> done doWhilst!');
						}
						callbackEachLink(null);
					}
				);


			},
			function (err) {
				if(err){
					c.log(err);
				}else{
					c.log('-------> done eachSeriesLink!')
				}
				
				function getRandomIntMinutes(min, max) {
					return 60000 * (Math.floor(Math.random() * (max - min)) + min);
				}
			    
			    // var timeout = getRandomIntMinutes(500, 800);
			    var timeout = 3000;
				c.log("************-----------------------------------******  "+timeout + '  (' + timeout/60000 + ' minutes )')
				var timeoutId = setTimeout(function() {
					eventEmitter.emit('scrapped');
				}, timeout);
				
			});

		
			


	
}