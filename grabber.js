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
			paginator: 'pg',
			params:{
				regionId: cityCodes[grabOptions.city]['rabota_ua'],
				keyWords: grabOptions.searchString,
				parentId: categories[grabOptions.category]['rabota_ua'],
			}
		}
	};
	// console.log(links)
}catch(e){
	console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
}
//https://jobs.dou.ua/vacancies/?category=Front+End&search=nodejs&city=%D0%9A%D0%B8%D0%B5%D0%B2
module.exports = function(database, request, moment, cheerio){
	var Grabber = {
		grabe: function(){
			
			function Job(opt){
				this.title = opt.title? opt.title: '';
				this.url = opt.url? opt.url: '';
				this.company = opt.company? opt.company: '';
				this.short_info = opt.full_info? opt.full_info: '';
				this.full_info = opt.full_info? opt.full_info: '';
				this.zp = opt.zp? opt.zp: '';
				this.hot = opt.hot? opt.hot: null;
				this.read = opt.read? opt.read: null;
				this.chosen = opt.chosen? opt.chosen: null;
				this.date_from = moment().format("YYYY-MM-DD HH:MM:SS");
			}

			for(key in links){
				var link = links[key];
				var reqUrl = link.url + '?';
				var paginator = parseInt(link.params[link.paginator]);
				for(param in link.params){
					if(Object.keys(link.params)[Object.keys(link.params).length - 1] == param){
						var lastKey = true;
					}
					reqUrl = reqUrl + param + '=' + link.params[param] + ((lastKey == true)? '':'&');
				}
console.log(reqUrl);
console.log(paginator);

				request.get(
					// 'http://rabota.ua/jobsearch/vacancy_list?regionId=1&keyWords=Front-end&parentId=1&pg=3',
					reqUrl,
					function(error,response,body){
						if(error){
							console.error(error);
						}else{
							
							try{
								var $ = cheerio.load(body);
								$('.vv .v').each(function(i, tr){
									var newJob = new Job ({
										hot: $(tr).hasClass('h'),
										title: $(tr).find('.t')[0].children[0].data,
										url: $(tr).find('.t').prop('href'),
										short_info: $(tr).find('div.d').text(),
										zp: ''
									});
									console.log(link.domain + newJob.url);
									// console.log(  i   );	
								});
							}catch(e){
								console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
							}
							
							// console.log(Object.keys(response));
							// console.log(Object.keys(arguments));
							// console.log(response.url);
						}
					}
				);

				// database.add(newJob);
				
			}
		}
	}
	return Grabber;
}