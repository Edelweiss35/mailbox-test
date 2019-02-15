$(document).ready(function () {

  // Hide Spinner
  $('#spinner').removeClass('hide-opacity');

  // Setup - add a text input to each header cell
  $('#dtBasicExample thead tr:eq(0) th').each( function (i) {
    
    if(i == 0){
      // check all
      $(this).html('<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="checkAll"><label class="custom-control-label" for="checkAll" ></label></div>');
    }
    else if( i == 1 || i > 2)
      $(this).html('<div class="md-form"><input placeholder="&#xf002;" type="text" class="form-control"></div>');

    $( 'input', this ).on( 'keyup change', function () {
      if ( i > 0 && table.column(i).search() !== this.value ) {
        table
          .column(i)
          .search( this.value )
          .draw();
      }
    });
  });
  
  // Init Datatable
  var table = $('#dtBasicExample').DataTable({
    "drawCallback": function( settings ) {
      $('.selectpicker').selectpicker();
    },
    "lengthMenu": [ 25, 50, 100 ],
    select: {
      style:    'single'
    },
    'createdRow': function(row, data, dataIndex){
      // $('td:eq(0)', row).css('min-width', '70px');
      // $('td:eq(1)', row).css('min-width', '150px');
      // $('td:eq(3)', row).css('min-width', '80px');
      // $('td:eq(4)', row).css('min-width', '80px');
      // $('td:eq(8)', row).css('min-width', '80px');
      // $('td:eq(9)', row).css('min-width', '80px');
      // $('td:eq(10)', row).css('min-width', '80px');
    },
    "columnDefs": [ {
      "targets": 8,     //website
      "render": function ( data, type, full, meta ) {
        return '<a target="_blank" rel="noopener noreferrer" href="'+data+'">'+data+'</a>';
      }
    },{
      "targets": 1,     //status
      "render": function ( data, type, full, meta ) {
        switch(data){
          case 'NEW':
            return '<select fromblack="false" class="selectpicker" data-width="130px" data-style="btn-primary"><option value="NEW" selected>New</option><option value="FOLLOW UP">Follow Up</option><option value="WARM LEAD">Warm Lead</option><option value="HOT LEAD">Hot Lead</option><option value="CLOSED DEAL">Closed Deal</option><option value="UNSUBSCRIBE">Unsubscribe</option><option value="BLACKLIST">Blacklist</option></select>';
            break;
          case 'FOLLOW UP':
            return '<select fromblack="false" class="selectpicker" data-width="130px" data-style="btn-primary"><option value="NEW">New</option><option value="FOLLOW UP" selected>Follow Up</option><option value="WARM LEAD">Warm Lead</option><option value="HOT LEAD">Hot Lead</option><option value="CLOSED DEAL">Closed Deal</option><option value="UNSUBSCRIBE">Unsubscribe</option><option value="BLACKLIST">Blacklist</option></select>';
            break;
          case 'WARM LEAD':
            return '<select fromblack="false" class="selectpicker" data-width="130px" data-style="btn-primary"><option value="NEW">New</option><option value="FOLLOW UP">Follow Up</option><option value="WARM LEAD" selected>Warm Lead</option><option value="HOT LEAD">Hot Lead</option><option value="CLOSED DEAL">Closed Deal</option><option value="UNSUBSCRIBE">Unsubscribe</option><option value="BLACKLIST">Blacklist</option></select>';
            break;
          case 'HOT LEAD':
            return '<select fromblack="false" class="selectpicker" data-width="130px" data-style="btn-primary"><option value="NEW">New</option><option value="FOLLOW UP">Follow Up</option><option value="WARM LEAD">Warm Lead</option><option value="HOT LEAD" selected>Hot Lead</option><option value="CLOSED DEAL">Closed Deal</option><option value="UNSUBSCRIBE">Unsubscribe</option><option value="BLACKLIST">Blacklist</option></select>';
            break;
          case 'CLOSED DEAL':
            return '<select fromblack="false" class="selectpicker" data-width="130px" data-style="btn-primary"><option value="NEW">New</option><option value="FOLLOW UP">Follow Up</option><option value="WARM LEAD">Warm Lead</option><option value="HOT LEAD">Hot Lead</option><option value="CLOSED DEAL" selected>Closed Deal</option><option value="UNSUBSCRIBE">Unsubscribe</option><option value="BLACKLIST">Blacklist</option></select>';
            break;
          case 'UNSUBSCRIBE':
            return '<select fromblack="false" class="selectpicker" data-width="130px" data-style="btn-primary"><option value="NEW">New</option><option value="FOLLOW UP">Follow Up</option><option value="WARM LEAD">Warm Lead</option><option value="HOT LEAD">Hot Lead</option><option value="CLOSED DEAL">Closed Deal</option><option value="UNSUBSCRIBE" selected>Unsubscribe</option><option value="BLACKLIST">Blacklist</option></select>';
            break;
          case 'BLACKLIST':
            return '<select fromblack="false" class="selectpicker" data-width="130px" data-style="btn-primary"><option value="NEW">New</option><option value="FOLLOW UP">Follow Up</option><option value="WARM LEAD">Warm Lead</option><option value="HOT LEAD">Hot Lead</option><option value="CLOSED DEAL">Closed Deal</option><option value="UNSUBSCRIBE">Unsubscribe</option><option value="BLACKLIST" selected>Blacklist</option></select>';
            break;
          default:
            return '<select fromblack="false" class="selectpicker" data-width="130px" data-style="btn-primary"><option value="NEW" selected>New</option><option value="FOLLOW UP">Follow Up</option><option value="WARM LEAD">Warm Lead</option><option value="HOT LEAD">Hot Lead</option><option value="CLOSED DEAL">Closed Deal</option><option value="UNSUBSCRIBE">Unsubscribe</option><option value="BLACKLIST">Blacklist</option></select>';
            break;
        }
      }
    }
    ,{
      "targets": 14,    //thumbnail
      "render": function ( data, type, full, meta ) {
        var isSSCaptured = data.isSSCaptured;
        var mobileFileName = data.mobileFileName;
        if(data.SS404)
          return '<span>404 Error</span>';
        else{
          if(!data.isSSCaptured)
            return '<div class="spinner-border text-danger" role="status"><span class="sr-only">Loading...</span></div>';
          else
            return '<img src="img/SS/'+mobileFileName+'" style="width:115px">';
        }
      }
    },{
      "targets": 0,
      'searchable': false,
      'orderable': false,
      "render": function ( data, type, full, meta ) {
        var id = data.id;
        var checked = data.Send;
        if(checked)
          return '<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="'+id+'" for="select" checked><label class="custom-control-label" for="'+id+'" ></label></div>';
        else
          return '<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="'+id+'" for="select"><label class="custom-control-label" for="'+id+'" ></label></div>';
      }
    },{
      "targets": 2,
      'searchable': false,
      'orderable': false,
      "render": function ( data, type, full, meta ) {
        var id = data.id;
        var checked = data.Called;
        if(checked)
          return '<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="_'+id+'" for="called" checked><label class="custom-control-label" for="_'+id+'" ></label></div>';
        else
          return '<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="_'+id+'" for="called"><label class="custom-control-label" for="_'+id+'" ></label></div>';
      }
    }]
  });
  
  $('.dataTables_length').addClass('bs-select');
  
  // Get CSV data from server
  $.get('/getCSVData',function(result){
    var dataSet = [];
    for( var i in result ){
      var row = [];
      var ele = result[i];
      var website = ele.Website;
      var isSSCaptured = ele.SSCaptured;
      var SS404 = ele.SS404;
      var Send = ele.Send;
      var Called = ele.Called;
      var domain = website.slice(website.indexOf('//') + 2);
      domain = domain.replace('www.', '');

      var fileName = website.slice(website.indexOf('//') + 2);
      fileName = fileName.replace('www.', '');
      fileName = fileName.replace(/\//g, '>');
      var desktopFileName = fileName + '-desktop.jpg';
      var mobileFileName = fileName + '-mobile.jpg';

      row.push({'id':ele._id, Send});
      row.push(ele.Status);
      row.push({'id':ele._id, Called});
      row.push(ele.Company);
      row.push(ele.City);
      row.push(ele.Region);
      row.push(ele.Phone);
      row.push(ele.Contact);
      row.push(domain);
      row.push(ele.GoogleRank);
      row.push(ele.MapRank);
      row.push(ele.Query);
      row.push(ele.Email);
      row.push(ele.Mail);
      row.push({isSSCaptured, desktopFileName, SS404, mobileFileName});
      dataSet.push(row);
    }
    table.clear();
    table.rows.add(dataSet);
    table.draw();

    $('#spinner').addClass('hide-opacity');
    
  });

  var selectedRowData = [];
  // Table cell click event
  $('#dtBasicExample tbody').on( 'click', 'td:nth-child(4), td:nth-child(5), td:nth-child(6), td:nth-child(7), td:nth-child(8), td:nth-child(9), td:nth-child(10), td:nth-child(11), td:nth-child(12), td:nth-child(13), td:nth-child(14)' , function () {
    var parent = $(this).parent();
    if ( !parent.hasClass('selected') ) {
      selectedRowData = table.row( parent ).data();

      var isSSCaptured = selectedRowData[14].isSSCaptured;
      var desktopFileName = selectedRowData[14].desktopFileName;
      var SS404 = selectedRowData[14].SS404;

      $('#info_company').html(selectedRowData[3]);
      $('#info_city').html(selectedRowData[4]);
      $('#info_region').html(selectedRowData[5]);
      $('#info_phone').html(selectedRowData[6]);
      $('#info_contact').html(selectedRowData[7]);
      $('#info_website').html(selectedRowData[8]);
      $('#info_googlerank').html(selectedRowData[9]);
      $('#info_query').html(selectedRowData[10]);
      $('#info_email').html(selectedRowData[11]);
      
      $('div#img_info_container').empty();
      if(SS404){  
        $('div#img_info_container').append('<div><span>404 Error</span></div>');
      }else{
        if(isSSCaptured){
          $('div#img_info_container').append('<img class="card-img-top" src="img/SS/'+desktopFileName+'" alt="'+desktopFileName+'">');
        }else{
          $('div#img_info_container').append('<div class="spinner-border text-danger" role="status"><span class="sr-only">Loading...</span></div>');
        }
      }

      $('#rowViewfullHeightModalRight').modal();
    }
  } );
  // Checkbox / Select All link
  $('div#dtBasicExample_wrapper div.row:nth-child(1) div.col-md-6').removeClass('col-md-6').addClass('col-md-4');
  $('div#dtBasicExample_wrapper div.row:nth-child(1)').prepend('<div class="col-sm-12 col-md-4" style="padding-top:10px"><div id="linkContainer"><div><span id="sel_cnt">0 records selected</span></div><div><span id="check_all">Select all records</span></div></div></div>');
  $('span#check_all').on('click', function(){
    checkAll(true);
  });
  $('input#checkAll').on('change', function(){
    var checked = $(this).prop('checked');
    checkAll(checked);
  });
  
  function checkAll(checked){
    // Get all rows with search applied
    var nodes = table.rows({ 'search': 'applied' }).nodes();
    // Check/uncheck checkboxes for all rows in the table
    $('input[type="checkbox"][for="select"]', nodes).prop('checked', checked);
    $('input#checkAll').prop('checked', checked);
    updateSelectedCount();
    
    var rowIndexs = table.rows({ 'search': 'applied' })[0];
    var idAry = [];
    for( var i in rowIndexs){
      var data = table.row(rowIndexs[i]).data();
      var _id = data[0].id;
      idAry.push(_id);
    }
    // $.post('/saveSelectStatus', {idAry, 'checked': checked}, function(){});
  }

  $(document).on('change', 'input[type="checkbox"][for="select"]', function() {
    var checked = $(this).prop('checked');
    var id = $(this).attr('id');
    updateSelectedCount();
    // $.post('/saveSelectStatus', {'idAry':[id], checked}, function(){});
  });
  // Called checkbox
  $(document).on('change', 'input[type="checkbox"][for="called"]', function() {
    var checked = $(this).prop('checked');
    var id = $(this).attr('id').substring(1);
    $.post('/saveCalled', {id, checked}, function(){});
  });

  function updateSelectedCount(){
    var n = 0;
    var len = table.rows().count();
    for( var i = 0; i < len; i++){
      var row = table.rows(i).nodes();
      var checked = $('input[type="checkbox"][for="select"]', row).prop('checked');
      console.log(checked);
      if(checked){
        n++;
      }
    }
    $('span#sel_cnt').text(n + ' records selected');
  }
  updateSelectedCount();
  // status onchange
  $(document).on('change', 'select', function() {
    var value = ($(this).find(":selected").text()).toUpperCase();
    var parent = $(this).parent().parent().parent();
    selectedRowData = table.row( parent ).data();
    var id = selectedRowData[0].id;
    var fromblack = $(this).attr('fromblack');
    if(value == "BLACKLIST" && fromblack == "false"){
      var domain = selectedRowData[8];
      $('span#blacklistModalDomainSpan').text(domain);
      $('#blackListModal').modal();
      $('button#btn_blacklist').attr('domain', domain);
    }
    if(fromblack == "true")
      $(this).attr('fromblack', 'false');
    $.post('/saveStatusChange', {id, value}, function(){});
  });
  // Blacklist yes button
  $('button#btn_blacklist').on('click', function(){
    var blacklistDomain = $(this).attr('domain');
    var len = table.rows().count();
    for( var i = 0; i < len; i++){
      var row = table.rows(i).nodes();
      var data = table.row(i).data();
      var domain = data[8];
      if(domain == blacklistDomain){
        $('.selectpicker', row).attr('fromblack', 'true');
        $('.selectpicker', row).selectpicker('val', 'BLACKLIST');
      }
    }
  });
  // Send/Delete button
  $('div#dtBasicExample_wrapper div.row:nth-child(3) div.col-sm-12').removeClass('col-md-5').removeClass('col-md-7').addClass('col-md-4');
  $('div#dtBasicExample_wrapper div.row:nth-child(3)').prepend('<div class="col-sm-12 col-md-4 text-left"><button type="button" class="btn btn-primary" id="sendBtn">Send</button><button type="button" class="btn btn-danger" id="delBtn">Delete</button></div>');

  // $('button#sendBtn').on('click', function(){
  //   var len = table.rows().count();
  //   var idAry = [];
  //   for( var i = 0; i < len; i++){
  //     var row = table.rows(i).nodes();
  //     var checked = $('input[type="checkbox"]', row).prop('checked');
  //     if(checked){
  //       var data = table.row(i).data();
  //       var _id = data[0];
  //       idAry.push(_id);
  //     }
  //   }
  //   $.post('/saveSendStatus', {idAry}, function(){});
  // });

  // $('button#delBtn').on('click', function(){
  //   var len = table.rows().count();
  //   var idAry = [];
  //   for( var i = 0; i < len; i++){
  //     var row = table.rows(i).nodes();
  //     var checked = $('input[type="checkbox"]', row).prop('checked');
  //     if(checked){
  //       var data = table.row(i).data();
  //       var _id = data[0];
  //       idAry.push(_id);
  //       $(row).addClass('delClass');
  //     }
  //   }
  //   $.post('/saveDelStatus', {idAry}, function(){});
  // });
  // Screenshot carousel
  $('#dtBasicExample tbody').on( 'click', 'tr>td:nth-child(15)', function(){
    var parent = $(this).parent();
    
    selectedRowData = table.row( parent ).data();

    var isSSCaptured = selectedRowData[14].isSSCaptured;
    var desktopFileName = selectedRowData[14].desktopFileName;
    var mobileFileName = selectedRowData[14].mobileFileName;
    var SS404 = selectedRowData[14].SS404;
    var mapfilename = selectedRowData[10] + '-map.jpg';
    $('div#carousel_img_container').empty();
    if(SS404){  
      $('div#carousel_img_container').append('<div class="carousel-item active" style="padding: 45px;"><span>404 Error</span></div>');
    }else{
      if(isSSCaptured){
        $('div#carousel_img_container').append('<div class="carousel-item active"><img class="d-block w-100" src="img/SS/'+mobileFileName+'" alt="Mobile SS slide"></div><div class="carousel-item"><img class="d-block w-100" src="img/SS/'+desktopFileName+'" alt="desktop SS slide"></div><div class="carousel-item"><img class="d-block w-100" src="img/SS/'+mapfilename +'" alt="Map Rank slide"></div>');
      }else{
        $('div#carousel_img_container').append('<div class="carousel-item active" style="padding: 45px;"><div class="spinner-border text-danger" role="status"><span class="sr-only">Loading...</span></div></div>');
      }
    }

    $('#screenshotModal').modal();
  });
  updateThumbnail();
  function updateThumbnail() {
    var idAry = [];
    var rows = table.rows({ page: 'current' })[0];
    for( var i in rows ){
      var rowIdx = rows[i];
      var data = table.row(rowIdx).data();
      var _id = data[0].id;
      var isSSCaptured = data[14].isSSCaptured;
      if( !isSSCaptured )
        idAry.push({rowIdx, _id});
    }
    $.post('/getSSStatus', {idAry}, function(response){
      
      for( var j in response){
        var SS404 = response[j].SS404;
        var SSCaptured = response[j].SSCaptured;
        var rowIdx = response[j].rowIdx;
        if( !SS404 ){
          if(SSCaptured){
            var newData = table.row(rowIdx).data();
            newData[14].isSSCaptured = true;
            table.row(rowIdx).data(newData).invalidate();
            $('.selectpicker').selectpicker();
          }
        }
        else{
          var newData = table.row(rowIdx).data();
          newData[14].SS404 = true;
          table.row(rowIdx).data(newData).invalidate();
          $('.selectpicker').selectpicker();
        }
      }
      setTimeout(function() {
        updateThumbnail();
      }, 1000);
    });
  }
  updateGoogleRank();
  function updateGoogleRank() {
    var idAry = [];
    var rows = table.rows({ page: 'current' })[0];
    for( var i in rows ){
      var rowIdx = rows[i];
      var data = table.row(rowIdx).data();
      var _id = data[0].id;
      var googleRank = data[8];
      var query = data[10];
      if( googleRank == '0' && query == '-')
        idAry.push({rowIdx, _id});
    }
    $.post('/getGoogleRank', {idAry}, function(response){
      // console.log(response);
      for( var j in response){
        var Query = response[j].Query;
        var GoogleRank = response[j].GoogleRank;
        var rowIdx = response[j].rowIdx;
        
        if( GoogleRank != '0' && Query != '-'){
          var newData = table.row(rowIdx).data();
          newData[8] = GoogleRank;
          newData[10] = Query;
          table.row(rowIdx).data(newData).invalidate();
          $('.selectpicker').selectpicker();
        }
      }
      setTimeout(function() {
        updateGoogleRank();
      }, 1000);
    });
  };

  updateMapRank();
  function updateMapRank() {
    var idAry = [];
    var rows = table.rows({ page: 'current' })[0];
    for( var i in rows ){
      var rowIdx = rows[i];
      var data = table.row(rowIdx).data();
      var _id = data[0].id;
      var mapRank = data[9];
      if( mapRank == '0')
        idAry.push({rowIdx, _id});
    }
    $.post('/getMapRank', {idAry}, function(response){
      // console.log(response);
      for( var j in response){
        var Query = response[j].Query;
        var mapRank = response[j].MapRank;
        var rowIdx = response[j].rowIdx;
        
        if( mapRank != '0'){
          var newData = table.row(rowIdx).data();
          newData[9] = mapRank;
          table.row(rowIdx).data(newData).invalidate();
          $('.selectpicker').selectpicker();
        }
      }
      setTimeout(function() {
        updateMapRank();
      }, 1000);
    });
  };
});

