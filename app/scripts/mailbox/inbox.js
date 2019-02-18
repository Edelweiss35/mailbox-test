$(document).ready(function () {
$('.dataTables_length').addClass('bs-select');

$.get('/getInbox',function(result){
    var dataSet = [];
    for( var i in result ){
      var row = [];
      var ele = result[i];
  
      row.push(ele.snippet);
      row.push(ele.date);
      dataSet.push(row);
      i++;
      $("#tablePreview tbody").append('<tr><th scope="row">'+ i +'</th><td>'+ ele.snippet +'</td><td>'+ ele.date +'</td></tr>');

      $("#tablePreview tbody tr").click(function () {
          var index = $(this).index();
          $("#exampleFormControlTextarea6").text(dataSet[index][0]);
      })
    }
  
    
  });

});