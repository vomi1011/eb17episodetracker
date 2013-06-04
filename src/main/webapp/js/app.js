$(document).on( "pageinit", "#home", function() {
	/** token for trakt api */
	var token = "9cff985e69115c385d612802a214d976/";
	/** root url for RESTService */
	var baseUrl = document.location.protocol + "//" + document.location.host + "/eb17episodetracker/rest/";
	
	/** initialize the home view */
	home();
	
	/**
	 * searches for a serie by it's title
	 */
	$("#seriesSearch").on("listviewbeforefilter", function (e, data) {
		var $ul = $(this),
		$input = $(data.input),
		value = $input.val().replace(/ /g, '+'),
		html = "";
		$ul.html("");
		
		if (value && value.length > 2) {
			$ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
			$ul.listview("refresh");
			$.ajax({
				url: "http://api.trakt.tv/search/shows.json/" + token + value,
				dataType: "jsonp",
				crossDomain: true,
			})
			.then(function (response) {
				$.each(response, function (i, val) {
					// filter empty titles
					if (val.title.length == 0) {
						return;
					}
					
					console.debug(val);
					imgUrl = val.images.poster;
					// get the smaller version if an image is available
					if (!(imgUrl.indexOf("poster-dark.jpg") >= 0)) {
						imgUrl = imgUrl.substring(0, imgUrl.length-4) + "-138.jpg";
					}
					img = "<img src='" + imgUrl + "'>";
					serieUrl = val.url.substring(21, val.url.length); // get only the title's url
					airs = "<p data-url='" + serieUrl + "' style='margin-top: 4px;'>" + (val.air_day ? val.air_day + " at ":"At ") + val.air_time + " on " + val.network + "</p>";
					html += "<li><a class='serie' data-url='" + serieUrl + "' href='#serieDetails'>" + val.title + img + airs + "</a></li>";
				});
				$ul.html(html);
				$ul.listview("refresh");
				$ul.trigger("updatelayout");
			});
		}
	});
	
	
	/**
	 * inits the upcomming and trend listview
	 */
	function home() {
		var url = "http://api.trakt.tv/shows/trending.json/" + token;
		
		// show trends
		$.ajax({
			url: url,
			dataType: "jsonp",
			crossDomain: true,
		})
		.then(function (response) {
			console.debug(response);
			var html = "<li data-role='list-divider'>Trends</li>";
			var count = 0;
			
			$.each(response, function(i, val) {
				if (count >= 10) {
					return;
				}
				
				// filter empty titles
				if (val.title.length == 0) {
					return;
				}
				
				console.debug(val);
				imgUrl = val.images.poster;
				// get the smaller version if an image is available
				if (!(imgUrl.indexOf("poster-dark.jpg") >= 0)) {
					imgUrl = imgUrl.substring(0, imgUrl.length-4) + "-138.jpg";
				}
				img = "<img src='" + imgUrl + "'>";
				serieUrl = val.url.substring(21, val.url.length); // get only the title's url
				airs = "<p data-url='" + serieUrl + "' style='margin-top: 4px;'>" + (val.air_day ? val.air_day + " at ":"At ") + val.air_time + " on " + val.network + "</p>";
				html += "<li><a class='serie' data-url='" + serieUrl + "' href='#serieDetails'>" + val.title + img + airs + "</a></li>";
				
				count++;
			});
			
			$("#trend").html(html);
			$("#trend").listview("refresh");
			$("#trend").trigger("updatelayout");
		});
		
		trackedSeries();
	}
	
	/**
	 * shows tracked series
	 */
	function trackedSeries() {
		var userId = localStorage.userId;
		
		// show tracked series
		if (userId) {
			$.ajax({
				url:  baseUrl + "members/" + userId,
				dataType: "json",
			})
			.then(function (response) {
				console.debug(response);
				window.user = response;

				var week = ["Sonnday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				var html = "<li data-role='list-divider'>Upcomming</li>";
				
				if (response.track.length > 0) {
					var noSeries = "<li>No upcomming series</li>";
					
					$.each(response.track, function(i, val) {
						console.debug(val);
						
						var airDay = val.air_day;
						var today = new Date().getDay();
						
						// check for upcomming
						if (airDay == week[today] || airDay == week[today+1]) {
							noSeries = "";
							
							// get the smaller version if an image is available
							imgUrl = val.poster;
							if (!(imgUrl.indexOf("poster-dark.jpg") >= 0)) {
								imgUrl = imgUrl.substring(0, imgUrl.length-4) + "-138.jpg";
							}
							img = "<img src='" + imgUrl + "'>";
							serieUrl = val.url;
							airs = "<p data-url='" + serieUrl + "' style='margin-top: 4px;'>" + (val.air_day ? val.air_day + " at ":"At ") + val.air_time + " on " + val.network + "</p>";
							
							html += "<li><a class='serie' data-url='" + serieUrl + "' href='#serieDetails'>" + val.title + img + airs + "</a></li>";
						}
					});
					
					html += noSeries;
				}
				else {
					html += "<li>You don't track any series yet</li>";
				}
				
				$("#upcomming").html(html);
				$("#upcomming").listview("refresh");
				$("#upcomming").trigger("updatelayout");
			});
		}
	}
	
	/**
	 * tracks a selected serie
	 */
	$("#addSerie").click(function() {
		var userId = localStorage.userId;
		
		// get the url
		var title = $("#addSerie").val();
		
		$.ajax({
			url: baseUrl + "track?url=" + title + "&id=" + userId,
			dataType: "json"
		})
		.then( function (response) {
			console.debug(response);
		});
	});
	
	/**
	 * shows detailed information about a serie
	 */
	$("#seriesSearch, #trend, #upcomming").click(function(event) {
		// get the url
		var title = $(event.target).data("url");
		if (!title) {
			title = $(event.target).children().data("url");
		}
		
		$.mobile.changePage("#serieDetails", { transition: "slide" });
		
		console.debug($(event.target));
		console.debug(title);
		
		// clear previous values
		$("#title").text("");
		$("#banner").attr("src", "");
		$("#episode").html("<p>pending</p>");
		$("#desc").text("");
		
		// set url for tracking
		$("#addSerie").val(title);

		// get the latest episodes from the serie
		$.ajax({
			url: "http://api.trakt.tv/show/seasons.json/" + token + title,
			dataType: "jsonp",
			crossDomain: true,
			success: function(data) {
				season = data[0].season;
				console.debug(season);

				$.ajax({
					url: "http://api.trakt.tv/show/season.json/" + token + title + "/" + season,
					dataType: "jsonp",
					crossDomain: true,
					success: function(episodes) {
						console.debug(episodes);
						var now = (new Date()).getTime();
						
						$.each(episodes, function(i, ep) {
							if((ep.first_aired * 1000) > now) {
								var firstAired = new Date(ep.first_aired * 1000);
								var airs = (firstAired.getMonth() + 1) + "." + firstAired.getDate() + "." + firstAired.getFullYear();
								$("#episode").html("");
								$("#episode").append("<strong>" + airs + "</strong>");
								$("#episode").append("<p>Season " + ep.season + ", Episode " + ep.episode + "</p>");
								$("#episode").append("<p>" + ep.overview + "</p>");
								
								return false;
							}
						});
					}
				});
			}
		});
		
		// fetch data and build the listview
		$.ajax({
			url: "http://api.trakt.tv/show/summary.json/" + token + title,
			dataType: "jsonp",
			crossDomain: true,
		})
		.then( function (response) {
			console.debug(response);

			$("#title").text(response.title);
			var img = response.images.fanart;
			// get the smaller version if an image is available
			if (!(img.indexOf("fanart-dark.jpg") >= 0)) {
				img = img.substring(0, img.length-4) + "-218.jpg";
				$("#banner").attr("src", img);
			}
			
			$("#genres").text(response.genres.join(", "));
			$("#airs").text("Airs: " + (response.air_day ? response.air_day + " at ":"At ") + response.air_time + " on " + response.network);
			
			var desc = response.overview;
			if (desc) {
				$("#desc").text(desc);
			}
			else {
				$("#desc").text("No describtion available");
			}
		});
	});
	
	/**
	 * shows the profile view
	 */
	$("#profile").on("pageshow", function() {

		// redirect to signin page, if not authentificated
		if (typeof localStorage.userId === 'undefined' || localStorage.userId == null) {
			$.mobile.changePage("#signin");
			
		}
		else {
			userId = localStorage.userId;
			console.debug(userId);
			
			// fetch the user
			$.ajax({
				url: baseUrl + "members/" + userId,
				dataType: "json",
				crossDomain: true,
			})
			.done(function(user) {
				console.debug(user);

				$("#updateData").find("input[name=forename]").val(user.forename);
				$("#updateData").find("input[name=surname]").val(user.surname);
				$("#updateData").find("input[name=location]").val(user.home);
				$("#updateData").find("input[name=email]").val(user.email);
				$("#updateData").find("input[name=password]").val(user.password);
				$("#updateData").find("input[name=passwordConf]").val(user.password);
			});
		}
			
		// bind logout to clear user data
		$("#logout").click(function() {
			userId = null;
			window.user = null;
			delete localStorage.userId;

			$("#updateData").find("input[name=forename]").val("");
			$("#updateData").find("input[name=surname]").val("");
			$("#updateData").find("input[name=location]").val("");
			$("#updateData").find("input[name=email]").val("");
			$("#updateData").find("input[name=password]").val("");
			$("#updateData").find("input[name=passwordConf]").val("");
		});
	});
	
	/**
	 * signin with email and password without encryption,
	 * only for developement purposes
	 */
	$("#signinData").submit(function(e) {
		var email = $("#email").val();
		var password = $("#password").val();
		e.preventDefault();
		
		$.ajax({
			url: baseUrl + "members/signin?email=" + email +"&password=" + password,
			dataType: "json",
		})
		.done(function(user) {
			console.debug(user);
			window.user = user;
			
			// save the fetched user
			localStorage.userId = user.id;
			
			// remove credentials
			$("#email").val("");
			$("#password").val("");

			// redirect to profile
			$.mobile.changePage("#home");
		});
	});
	
	
	/**
	 * Loading screen for ajax calls
	 */
	$(document).ajaxSend(function() {
	    $.mobile.loading( 'show', {
	    	text: 'Loading',
	    	textVisible: true,
	    	theme: 'c',
	    	html: ""
	    });
	    
	    $("#details").css("display", "none");
	});
	$(document).ajaxStop(function() {
	    $.mobile.loading( 'hide');
	    
	    $("#details").css("display", "");
	});
});