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

    insertScheduleRow(scheduleData);
  }

  /**
   * 插入数据到table中
   * @param data: title, detail, image_url, tags
   */
  function insertScheduleRow(data) {
    var $detailTable = $('#detail-table')[0];
    var days = "第" + $detailTable.rows.length + "天";
    var row = $detailTable.insertRow();
    var checkbox = row.insertCell();
    checkbox.innerHTML = '<div class="icheckbox_flat-green" style="position: relative;"><input type="checkbox" name="table_records" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>';
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

    $('.buttonNext').addClass('btn btn-success');
    $('.buttonPrevious').addClass('btn btn-primary');
    $('.buttonFinish').addClass('btn btn-default');
    $('#schedule-save-btn').on('click', saveSchedule);
  });
}(jQuery));