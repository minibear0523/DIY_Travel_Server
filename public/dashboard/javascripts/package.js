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
    var days = "第" + $detailTable.rows.length + "天";
    var row = $detailTable.insertRow();
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

    $('.buttonFinish').addClass('btn btn-default');
    $('#schedule-save-btn').on('click', saveSchedule);
  });
}(jQuery));