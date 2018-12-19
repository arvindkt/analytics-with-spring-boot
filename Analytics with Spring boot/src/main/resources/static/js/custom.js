
$(document).ready(function(){
	
	$('#addInputWords').click(function(){
        sp.track('Clicked Add Words Button', {
            button: $(this).data('type'),
            words:$('#words').text()
        });
    });
	  $('#findValidWords').click(function(){
          sp.track('Clicked Find Valid Words Button', {
              button: $(this).data('type'),
              words:$('#output').text()
          });
      });
	  
	  $('#searchWords').click(function(){
          sp.track('Clicked Search Button', {
              button: $(this).data('type'),
              words:$('#search').text()
          });
      });
});
