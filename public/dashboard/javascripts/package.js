(function ($) {
  'use strict';

  /*
   * 保存单日行程
   */
  function saveSchedule(e) {
    e.preventDefault();
    var $detailForm = $('#detail-form')[0];
    var scheduleData = new Object();
    scheduleData['title'] = $detailForm.elements[0].value;
    scheduleData['detail'] = $detailForm.elements[1].value;
    scheduleData['tags'] = $detailForm.elements[2].value;
    // TODO: 获取上传的图片

    // 将数据插入到table中.
    insertScheduleRow(scheduleData);
    // 插入完成之后, 进行重置
    $detailForm.reset();
    // tagsInput需要额外处理
    var $scheduleInclusionTagsInput = $('#schedule-inclusion-tags');
    scheduleData['tags'].split(',').forEach(function(tag) {
      $scheduleInclusionTagsInput.removeTag(tag);
    });
  }

  /**
   * 插入数据到table中
   * @param data: title, detail, image_url, tags
   */
  function insertScheduleRow(data) {
    var $detailTable = $('#detail-table')[0];
    var $detailTableBody = $detailTable.getElementsByTagName('tbody')[0];
    var days = "第" + $detailTable.rows.length + "天";
    var row = $detailTableBody.insertRow();
    var scheduleDay = row.insertCell();
    scheduleDay.innerHTML = days;
    var scheduleTitle = row.insertCell();
    scheduleTitle.innerHTML = data['title'];
    var scheduleDetail = row.insertCell();
    scheduleDetail.innerHTML = data['detail'];
    var scheduleTags = row.insertCell();
    scheduleTags.innerHTML = data['tags'];
    var scheduleThumbnail = row.insertCell();
    scheduleThumbnail.innerHTML = '<img src="/dashboard/images/img.jpg">'
    var scheduleView = row.insertCell();
    scheduleView.innerHTML = '<a href="#">View</a>';
    scheduleView.setAttribute('class', 'last');
  }

  /**
   * 保存酒店数据
   */
  function saveHotel(e) {
    e.preventDefault();
    var $hotelForm = $('#hotels-form')[0];
    var hotelData = new Object();
    hotelData['title'] = $hotelForm.elements[0].value;
    hotelData['duration'] = $hotelForm.elements[1].value;
    insertHotelRow(hotelData);
    $hotelForm.reset();
  }

  function insertHotelRow(data) {
    var $hotelsTable = $('#hotels-table > tbody')[0];
    var row = $hotelsTable.insertRow();
    var title = row.insertCell();
    title.innerHTML = data['title'];
    var duration = row.insertCell();
    duration.innerHTML = data['duration'];
    var hotelView = row.insertCell();
    hotelView.innerHTML = '<a href="#">View</a>';
    hotelView.setAttribute('class', 'last');
  }

  // TODO: View And Delete Btn Callback

  /**
   * Finish Button Event Callback
   */
  function onFinishButtonClicked(e) {
    e.preventDefault();
    // 1: Collect all data from forms and tables
    var data = new Object();
    // 1.1 Basic Info Form
    var $basicForm = $('#basic-info-form')[0];
    data['package_title'] = $basicForm.elements[0].value;
    data['package_price'] = $basicForm.elements[1].value;
    data['package_abstract'] = $basicForm.elements[2].value;
    data['package_tags'] = $basicForm.elements[3].value;
    // TODO: Package Thumbnail
    // 1.2 Schedule Detail
    var scheduleData = new Array();
    var $detailTable = $('#detail-table')[0];
    for (var i = 1; i < $detailTable.rows.length; i++) {
      var $detail = $detailTable.rows[i].cells;
      var schedule = new Object();
      schedule['day'] = $detail[0].innerHTML;
      schedule['title'] = $detail[1].innerHTML;
      schedule['detail'] = $detail[2].innerHTML;
      schedule['inclusion'] = $detail[3].innerHTML.split(',').map(function(str){
        return str.trim();
      });
      // TODO: Package Schedule Thumbnail

      scheduleData.push(schedule);
    }
    data['schedule'] = scheduleData;
    // 1.3 Hotel Detail
    var hotelsData = new Array();
    var $hotelTable = $('#hotels-table')[0];
    for (var i = 1; i < $hotelTable.rows.length; i++) {
      var $detail = $hotelTable.rows[i].cells;
      var hotel = new Object();
      hotel['name'] = $detail[0].innerHTML;
      hotel['duration'] = $detail[1].innerHTML;
      hotelsData.push(hotel);
    }
    data['hotels'] = hotelsData;
    // 1.4 Inclusion And Exclusion Detail
    var $inclusionExclusionForm = $('#inclusion-exclusion-form')[0];
    var inclusionData = $inclusionExclusionForm.elements[0].value.split(',').map(function(str) {return str.trim();});
    var exclusionData = $inclusionExclusionForm.elements[2].value.split(',').map(function(str) {return str.trim();});
    data['inclusion'] = inclusionData;
    data['exclusion'] = exclusionData;
    console.log(data);
    // Step2: Upload all data to server
  }

  /**
   * 设置parentContainer的高度
   */
  function resetFormHeight($form) {
    $form.find('.stepContainer').css('height', 'auto');
  }

  $(function () {
    $('#package-tags').tagsInput({
      width: 'auto'
    });
    $('.tags').tagsInput({
      'width': 'auto'
    });
    var formWizard = $('#wizard');
    formWizard.smartWizard();
    formWizard.find('.stepContainer').css('height', 'auto');

    $('.buttonNext')
      .addClass('btn btn-success')
      .on('click', function () {
        resetFormHeight(formWizard);
      });

    $('.buttonPrevious')
      .addClass('btn btn-primary')
      .on('click', function () {
        resetFormHeight(formWizard);
      });

    $('.buttonFinish').addClass('btn btn-default').on('click', onFinishButtonClicked);
    $('#schedule-save-btn').on('click', saveSchedule);
    $('#hotel-save-btn').on('click', saveHotel);
  });
}(jQuery));