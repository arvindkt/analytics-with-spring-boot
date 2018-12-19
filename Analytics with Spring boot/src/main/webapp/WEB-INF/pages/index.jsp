<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" http-equiv="Content-Type" content="text/html">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Word Search Application</title>
<meta name="description" content="UI Framework">
<meta name="author" content="Arvind">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="css/bootstrap.css" rel="stylesheet">
<link href="css/custom.css" rel="stylesheet">
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/bootstrap.js"></script>
<script type="text/javascript" src="js/App.js"></script>
<script type="text/javascript">
	var sp = sp || [];
			(function() {
				var e = [ "init", "identify", "track", "trackLink", "pageview" ], t = function(
						e) {
					return function() {
						sp.push([ e ].concat(Array.prototype.slice.call(
								arguments, 0)))
					}
				};
				for (var n = 0; n < e.length; n++)
					sp[e[n]] = t(e[n])
			})(),
			sp.load = function(e, o) {
				sp._endpoint = e;
				if (o) {
					sp.init(o)
				}
				;
				var t = document.createElement("script");
						t.type = "text/javascript",
						t.async = !0,
						t.src = ("https:" === document.location.protocol ? "https://"
								: "http://")
								+ "d21ey8j28ejz92.cloudfront.net/analytics/v1/sp.min.js";
				var n = document.getElementsByTagName("script")[0];
				n.parentNode.insertBefore(t, n)
			};
	sp.load("http://localhost:8080"); // Data Collection Endpoint
</script>
<script type="text/javascript" src="js/custom.js"></script>
<body class="bg-image1">
	<div class="container">

		<div class="row">
			<div
				class="col-md-9 col-xs-9 bgWhite borderRadius10 marginX170px marginY130px indexHeight">
				<h2
					class="pull-center margin-bottom10px font-familySans fontSize18 col-md-offset-1 pad20px"
					title="Word Search">
					<b>Word Search Application</b>
				</h2>
				<div class="pull-center" id="notifyMsg"
					style="width: 40%; height: 4%; display: none; background-color: #ffcc66; color: black; font-size: 12px; padding: 0.2px 1px">
					<b></b>
				</div>
				<br>
				<div class="col-md-5  section" id="index">

					<form id="FindValidWordForm" name="FindValidWordForm" method="post"
						action="javascript:void(0)">
						<div class="col-md-12">
							<div class="form-group">
								<label title="inputword" aria-label="inputword">Enter
									the word<span class="required">*</span><a href="#"
									data-placement="top" data-toggle="tooltip"
									title="Please enter the input word"></a>
								</label> <input type="text" name="inputword" id="inputword"
									class="form-control" placeholder="Enter input words"
									aria-label="Enter input words" />
							</div>
							<div class="col-md-12 margin-top15px">
								<button class="btn btn-primary marginCenter" type="button"
									id="addInputWords">Add Words</button>
							</div>
						</div>
						<div class="col-md-12 margin-top15px">
							<br>
						</div>
						<div class="col-md-12 margin-top15px">
							List of given input words :<b><p id="words"></p></b>
						</div>
						<div class="col-md-12 margin-top15px">
							<br>
							<br>
						</div>


						<!-- Button -->
						<button class="btn btn-primary marginCenter" type="submit"
							id="findValidWords">Find Valid Words</button>
						<div class="col-md-12 margin-top15px">
							<br> <br> Valid words(Output): <b><p id="output"></p></b>
						</div>

					</form>
				</div>
				<div class="col-md-5 col-md-offset-1 pad20px">
					<form id="SearchWordForm" name="SearchWordForm" method="post"
						action="javascript:void(0)">
						<div class="col-md-12">
							<div class="form-group">
								<label title="wordsearch" aria-label="wordsearch">Search
									Valid Words<span class="required">*</span><a href="#"
									data-placement="top" data-toggle="tooltip"
									title="Please enter the input word"></a>
								</label> <input type="text" name="wordsearch" id="wordsearch"
									class="form-control" placeholder="Enter input search words"
									aria-label="Enter search words" />
							</div>
						</div>
						<div class="col-md-12 margin-top15px"></div>

						<!-- Button -->
						<button class="btn btn-primary marginCenter" type="submit"
							id="searchWords">Search</button>
						<div class="col-md-12 margin-top15px">
							<br> <br> Search words(Output):<b>
								<p id="search">
									<b></b>
								</p>
							</b>
						</div>

					</form>
				</div>

			</div>
		</div>
	</div>

</body>

</html>
