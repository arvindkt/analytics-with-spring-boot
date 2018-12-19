$(document).ready(function () {
	$('#searchResult').hide();
	var length = 0;
	var word = '';
	$('#addInputWords').click(function(){
		var inputWord = $('#inputword').val().toUpperCase();
			if(inputWord == ''){
				msgs("Please enter input words");
				return false;
			}
			if(/^[a-zA-Z- ]*$/.test(inputWord) == false){
				msgs("Please enter alphabets only");
				return false;
			}
			if(word ==''){
				word = inputWord;
				length = inputWord.length;
				$('#inputword').val('');
			}else{
				if(inputWord.length != length){
					msgs("Please enter the same length of word or Refresh and try again");
					return false;
				}else{
					word = word +','+inputWord;
					$('#inputword').val('');
					length = inputWord.length;
				}
				
			}
			$('#words').html(word);
	});
	
	$("#findValidWords").click(function(){
		var inputWords = $('#words').text();
		if(inputWords =='' || inputWords == undefined){
			msgs("Please enter input words");
			return false;
		}
		
		var words = inputWords.split(",");
		console.log(typeof words);
		console.log(typeof words.length);
		var p_objWord = {
				"words" : inputWords,
				"row" : words.length.toString(),
				"col" : words[0].length.toString()
		}
		 $.ajax({
             type: "POST",
             url: "/findValidWords",
             dataType: "json",
             data:p_objWord,
             success: function (data) {
            	obj = data.output;
                 var result="";
                 $.each(obj, function(i){
                 			if(result==''){
                 				result=obj[i];
                 			}else{
                 				result = result+' , '+obj[i]; 
                 			}
 						});
            	
            	 $('#output').html(result);
             },
             error: function (error) {
                 console.log(error);
             },
             complete: function () {},
         });
		
		console.log(words);
	});
	
	$('#searchWords').click(function(){
		var searchWord = $('#wordsearch').val().toUpperCase();
		if(searchWord ==''){
			msgs("Please enter word to search");
			return false;
		}
		if(/^[a-zA-Z- ]*$/.test(searchWord) == false){
			msgs("Please enter alphabets only");
			return false;
		}
	
		$.ajax({
            type: "POST",
            url: "/searchWords",
            dataType: "json",
            data:{'searchWord':searchWord},
            success: function (data) {
            	$('#searchResult').show();
                console.log(data);
                $('#wordsearch').val('');
                obj = data.searchWords;
                var result="";
                $.each(obj, function(i){
                			if(result==''){
                				result=obj[i];
                			}else{
                				result = result+' , '+obj[i]; 
                			}
						});
                $('#search').html(result);
                
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {},
        });
		
	});
	
	function msgs(msg)
	{
		$("#notifyMsg").html("");
		$("#notifyMsg").append(msg);
		$("#notifyMsg").show();				
		$("#notifyMsg").fadeOut(4500);	
	}
	
});