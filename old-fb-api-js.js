		<script>
		  window.fbAsyncInit = function() {
		    // init the FB JS SDK
		    FB.init({
		      appId      : '616961244997733', // App ID from the App Dashboard
		      channelUrl : 'http://www.julia-t.com/weekviz/channel.html', // Channel File for x-domain communication
		      status     : true, // check the login status upon init?
		      cookie     : true, // set sessions cookies to allow your server to access the session?
		      xfbml      : true  // parse XFBML tags on this page?
		    });

		    // Additional initialization code such as adding Event Listeners goes here
			FB.getLoginStatus(function(response) {
			    if (response.status === 'connected') {
			        // connected
			        testAPI();
			    } else if (response.status === 'not_authorized') {
			        // not_authorized
			        login();
			    } else {
			        // not_logged_in
			        login();
			    }
			});

		  };

	    function login() {
		    FB.login(function(response) {
		        if (response.authResponse) {
		            // connected
		            testAPI();
		        } else {
		            // cancelled
		        }
		    },  {scope: 'read_mailbox'});
		}

		function testAPI() {
		    console.log('Welcome!  Fetching your information.... ');
		    FB.api('/me', function(response) {
		        console.log('Good to see you, ' + response.name + '.');
		    });
		    getMessages();
		}

		function getPosts() {
			FB.api('/me/posts', function(response) {
				console.log('got posts');
			});
		}

		function getMessages() {
			FB.api('me/inbox?limit=200', function(response) {
				console.log(response)
				drawChart(response);
			});
		}

		  // Load the SDK's source Asynchronously
		  // Note that the debug version is being actively developed and might 
		  // contain some type checks that are overly strict. 
		  // Please report such bugs using the bugs tool.
		  (function(d, debug){
		     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		     if (d.getElementById(id)) {return;}
		     js = d.createElement('script'); js.id = id; js.async = true;
		     js.src = "http://connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
		     ref.parentNode.insertBefore(js, ref);
		   }(document, /*debug*/ false));
		</script>