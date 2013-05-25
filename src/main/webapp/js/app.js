$( document ).on( "pageinit", "#home", function() {
	/** token for trakt api */
	var token = "9cff985e69115c385d612802a214d976/";
	/** root url for RESTService */
	var baseUrl = "http://localhost:8080/eb17episodetracker/rest/";
	/** current user */
	
	// initialize the home view
	home();
	
	/**
	 * searches for a serie by it's title
	 */
	$( "#seriesSearch" ).on( "listviewbeforefilter", function ( e, data ) {
		var $ul = $( this ),
		$input = $( data.input ),
		value = $input.val().replace(/ /g, '+'),
		html = "";
		$ul.html( "" );
		
		if ( value && value.length > 2 ) {
			$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			$ul.listview( "refresh" );
			$.ajax({
				url: "http://api.trakt.tv/search/shows.json/" + token + value,
				dataType: "jsonp",
				crossDomain: true,
			})
			.then( function ( response ) {
				$.each( response, function ( i, val ) {
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
				$ul.html( html );
				$ul.listview( "refresh" );
				$ul.trigger( "updatelayout");
			});
		}
	});
	
	/**
	 * inits the trend listview
	 */
	function home() {
		var url = "http://api.trakt.tv/shows/trending.json/" + token;
		
		$.ajax({
			url: url,
			dataType: "jsonp",
			crossDomain: true,
		})
		.then( function ( response ) {
			console.debug(response);
			var html = "<li data-role='list-divider'>Trends</li>";
			var count = 0;
			
			$.each( response, function ( i, val ) {
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
			
			$("#trend").html( html );
			$("#trend").listview( "refresh" );
			$("#trend").trigger( "updatelayout");
		});
	}
	
	/**
	 * shows detailed information about a serie
	 */
	$("#seriesSearch, #trend").click(function(event) {
		// get the url
		var title = $(event.target).data("url");
		if (!title) {
			title = $(event.target).children().data("url");
		}
		
		$.mobile.changePage("#serieDetails");
		
		console.debug($(event.target));
		console.debug(title);
		
		// clear previous values
		$("#title").text("");
		$("#banner").attr("src", "");
		$("#episode").html("");
		$("#desc").text("");
		
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
								var airs = firstAired.getMonth() + "." + firstAired.getDate() + "." + firstAired.getFullYear();
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
		.then( function ( response ) {
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
		//console.debug(user);
		
		// redirect to signin page, if not authentificated
		if (typeof user === 'undefined' || user == null) {
			$.mobile.changePage("#signin");
		}
		else {
			$("#information").html("");
			$("#information").append("<p>" + user.forename + " " + user.surname + "</p>");
			$("#information").append("<p>" + user.email + "</p>");
		}
		
	});
	
	/**
	 * signin with email and password without encryption,
	 * only for developement purposes
	 */
	$("#signinData").submit(function() {
		var email = $("#email").val();
		var password = $("#password").val();
		
		var res = $.ajax({
				url: baseUrl + "members/signin?email=" + email +"&password=" + password,
				dataType: "json",
				crossDomain: true,
				success: function(data) {
					console.debug(data);
				}
			});
		
		res.done(function(data) {
			console.debug(data);
			
			// save the fetched user
			user = data;
		});
		
		console.debug(user);
	});
});