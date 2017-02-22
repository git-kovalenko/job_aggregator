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
				var title = tr.find('.h2Position').text();
				var url = tr.find('.serp_vacancy-top a').prop('href');
				return{
					id: title + url.match(/^.+\?|^.+\//),
					title: title,
					url: url,
					short_info: tr.find('.description').text(),
					zp: tr.find('.salary').text(),
					company: tr.find('.company-name').text(),
				}
			}
		}/*,
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
					key: title + url.match(/^.+\?|^.+\//),
					hot: tr.find('h3 i').hasClass('fi-hot'),
					title: title,
					url: url,
					short_info: tr.find('.f-vacancylist-shortdescr').text(),
					zp: tr.find('.-price').text(),
					company: tr.find('.f-vacancylist-companyname').text().trim(),
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
		scrape: function(timeoutMin, timeoutMax){
			
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
						browser.visit(reqUrl, function (e, browser) {
							// var injectedScript = browser.document.createElement("script");
							// injectedScript.setAttribute("type","text/javascript");
							// injectedScript.setAttribute("src", "http://code.jquery.com/jquery-1.11.0.min.js");
							// browser.body.appendChild(injectedScript);    
							/*browser.wait( function(window){
									c.log( browser.evaluate("typeof $") == "function" )
									return ( browser.evaluate("typeof $") == "function" )
								}, 
								function() {*/
									var $ = cheerio.load(browser.html());
									var tableRows = $(link.tableRowsSelector);
c.log('tableRows.length'+tableRows.length)									
									/*if (link.paginatorTrigger){
										
										browser.fire('.more-btn a', 'mousedown', function(){
											browser.evaluate("$('.more-btn a').mousedown()");											
											browser.fire('.more-btn a', 'mouseup', function(){
												browser.evaluate("$('.more-btn a').mouseup()");
												$ = cheerio.load(browser.html());
												c.log('after mouseup =  '+ $(link.tableRowsSelector).length)		
												tableRows = $(link.tableRowsSelector);
											});
										});

										// browser.evaluate("$('.more-btn a').mousedown()");
										// browser.evaluate("$('.more-btn a').mouseup()");
										$ = cheerio.load(browser.html());
										c.log('after all =  '+ $(link.tableRowsSelector).length)		
										tableRows = $(link.tableRowsSelector);

										// browser.wait(
										// 	function(window) {
										// 		$ = cheerio.load(browser.html());
										// 		c.log('after click =  '+ $(link.tableRowsSelector).length)		
										// 		return ( $(link.tableRowsSelector).length > tableRows.length )
										// 	}, 
										// 	function() {
										// 		c.log('after wait =  '+ $(link.tableRowsSelector).length)		
										// 		tableRows = $(link.tableRowsSelector);
										// 	}
										// );


										
									}*/
									

									try{
										var serieIndex = 0;
										async.each(tableRows, function(tr, callbackEach){
												serieIndex = ++serieIndex;
												var newJob = new Job (link.cheerioGetters( $(tr) ));
												if(!/^http/.test(newJob.url)){
													newJob.url = link.domain + newJob.url;
												}
console.log(serieIndex +" "+  newJob.title  );	


												database.add(newJob, callbackEach);
											},
											function (err) {
												if(err){
													c.log(err);
												}else{
c.log('-------> done eachSeries!')
													if(tableRows.length == serieIndex){
														callbackDoWhilst(null, tableRows.length)
													}
												}
											}
										);

									}catch(e){
										console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
									}
									
								

							// 	}
							// );


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
				

				var timeout = Scrapper.getRandomIntMinutes(timeoutMin, timeoutMax);
c.log("******************  "+timeout + '  (' + timeout/60000 + ' minutes )')
				var timeoutId = setTimeout(function() {
					Scrapper.scrape(timeoutMin, timeoutMax);
				}, timeout);
			});

		},
		getRandomIntMinutes: function(min, max) {
			return 60000 * (Math.floor(Math.random() * (max - min)) + min);
		}
	}
	return Scrapper;
}