
$(document).ready(function () {
    // Animations initialization
    new WOW().init();
    
    $.get('/getAccount',function(result){
        var dataSet = [];
        for( var i in result ){
          var row = [];
          var ele = result[i];
      
          row.push(ele.name);
          row.push(ele.email);
          dataSet.push(row);
          i++;
          $("#account-table tbody").append('<tr><td class="td1_width" style="float:left;">'+ ele.name + '-' + ele.email + '<img src = "/../img/svg/google-icon.svg" class="google-icon"></img></td><td class="td2_width" style="width: 15%"><div class="progress"><div class="progress-bar" role="progressbar" style="width: 55%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div></td><td class="td3_width" style="width:30px"><button type="button" class="btn btn-teal btn-rounded btn-sm m-0"><i class="fas fa-edit"></i></button></td><td class="td4_width" style="width:30px"><button type="button" class="btn btn-teal btn-rounded btn-sm m-0"><i class="far fa-trash-alt"></i></button></td></tr>');
    
        }
      
        
      });
    
    });