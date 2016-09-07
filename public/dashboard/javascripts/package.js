(function ($) {
  'use strict';

  /*
   * 保存单日行程
   */
  function saveSchedule(e) {
    e.preventDefault();
    var $detailForm = $('#detail-form')[0];
    var $detailTable = $('#detail-table')[0];
    var scheduleData = new Object();
    scheduleData['date'] = $detailForm.elements[0].value || $detailTable.rows.length;
    scheduleData['title'] = $detailForm.elements[1].value;
    scheduleData['detail'] = $detailForm.elements[2].value;
    scheduleData['attractions'] = $detailForm.elements[3].value;
    scheduleData['restaurants'] = $detailForm.elements[5].value;
    // 将数据插入到table中.
    insertScheduleRow(scheduleData);
    resetScheduleForm(e);
  }

  /**
   * 更新单日行程
   */
  function updateSchedule(e) {
    e.preventDefault();
    var $detailForm = $('#detail-form')[0];
    var $detailTable = $('#detail-table')[0];
    var scheduleData = new Object();
    scheduleData['date'] = $detailForm.elements[0].value;
    scheduleData['title'] = $detailForm.elements[1].value;
    scheduleData['detail'] = $detailForm.elements[2].value;
    scheduleData['attractions'] = $detailForm.elements[3].value;
    scheduleData['restaurants'] = $detailForm.elements[5].value;
    insertScheduleRow(scheduleData);
    resetScheduleForm(e);
  }

  /**
   * 重置单日行程的表单
   * @param e
   */
  function resetScheduleForm(e) {
    if (e) {
      e.preventDefault();
    }
    var $detailForm = $('#detail-form')[0];
    // 插入完成之后, 进行重置
    $detailForm.reset();
    // tagsInput需要额外处理
    var $scheduleAttractions = $('#schedule-attractions');
    $detailForm.elements[3].value.split(',').forEach(function(tag) {
      $scheduleAttractions.removeTag(tag);
    });
    var $scheduleRestaurants = $('#schedule-restaurants');
    $detailForm.elements[5].value.split(',').forEach(function(restaurant) {
      $scheduleRestaurants.removeTag(restaurant);
    });
    // Dropzone需要额外处理, destory and re-create a new dropzone.
    var $scheduleThumbnailContainer = $('#schedule-thumbnail-container');
    $scheduleThumbnailContainer.empty();
    $scheduleThumbnailContainer.append('<div id="schedule-thumbnail" class="dropzone" action="/uploads/package">');
    $scheduleThumbnailContainer.find('#schedule-thumbnail').dropzone({
      paramName: 'thumbnail',
      method: 'POST',
      maxFilesize: 5,
      maxFiles: 1,
      dictDefaultMessage: '拖拽或点击上传图片, 最多一张, 分辨率为560*460',
      addRemoveLinks: true,
      init: function() {
        this.on('success', function (file, res) {
          file._removeLink = res.delete_url;
          file.url = res.url;
        });
        this.on('removedfile', function (file) {
          $.ajax({
            url: file._removeLink,
            method: 'DELETE'
          }).error(function(_, status, err) {
            console.log(err);
          });
        });
      }
    });
  }

  /**
   * 删除单日行程
   */
  function deleteScheduleRow(location) {
    var $detailTable = $('#detail-table')[0];
    var $detailTableBody = $detailTable.getElementsByTagName('tbody')[0];
    $detailTableBody.deleteRow(location);
  }

  /**
   * 插入数据到table中, 其中插入的location就是date-1, 例如第一天就在第一行, insertRow(0), 第二天就在第二行, insertRow(1)
   * @param data: title, detail, image_url, tags
   */
  function insertScheduleRow(data) {
    var $detailTable = $('#detail-table')[0];
    var $detailTableBody = $detailTable.getElementsByTagName('tbody')[0];
    var days = "第" + data['date'] + "天";
    // 进行插入位置的判断
    var row = $detailTableBody.insertRow(data['date']-1);
    var scheduleDay = row.insertCell();
    scheduleDay.innerHTML = days;
    scheduleDay.setAttribute('class', 'td_date');
    var scheduleTitle = row.insertCell();
    scheduleTitle.innerHTML = data['title'];
    scheduleTitle.setAttribute('class', 'td_title');
    var scheduleDetail = row.insertCell();
    scheduleDetail.innerHTML = data['detail'];
    scheduleDetail.setAttribute('class', 'td_detail');
    var scheduleAttractions = row.insertCell();
    scheduleAttractions.innerHTML = data['attractions'];
    scheduleAttractions.setAttribute('class', 'td_attraction');
    var scheduleRestaurants = row.insertCell();
    scheduleRestaurants.innerHTML = data['restaurants'];
    var scheduleThumbnail = row.insertCell();
    var scheduleThumbnailDropzone = Dropzone.forElement('div#schedule-thumbnail');
    scheduleThumbnail.innerHTML = '<img class="schedule_thumbnail" src="' + scheduleThumbnailDropzone.files[0].url + '">';
    var scheduleView = row.insertCell();
    var viewBtnNode = document.createElement('button');
    viewBtnNode.setAttribute('class', 'btn btn-default view-btn');
    viewBtnNode.setAttribute('data-data', '#schedule-' + ($detailTable.rows.length - 1));
    viewBtnNode.innerHTML = '编辑';
    viewBtnNode.addEventListener('click', viewBtnClicked);
    scheduleView.setAttribute('class', 'last td_action');
    scheduleView.appendChild(viewBtnNode);
  }

  /**
   * view button callback
   */
  function viewBtnClicked(e) {
    e.preventDefault();
    var dataHref = e.target.dataset['data'];
    var scheduleRankReg = /#schedule-(\d+)/;
    var rank = undefined;
    if (scheduleRankReg.test(dataHref)) {
      rank = Number.parseInt(scheduleRankReg.exec(dataHref)[1]);
    } else {
      rank = -1;
      return;
    }
    var data = new Object();
    var $detailTable = $('#detail-table')[0];
    var detail = $detailTable.rows[rank].cells;
    data['date'] = detail[0].innerHTML;
    data['title'] = detail[1].innerHTML;
    data['detail'] = detail[2].innerHTML;
    data['attractions'] = detail[3].innerHTML;
    data['restaurants'] = detail[4].innerHTML;
    data['thumbnails'] = detail[5].innerHTML;
    insertDataToForm(data, rank);
    // 将表单状态修改为只能更新
    changeScheduleFormDisabledStatus(false, rank);
  }

  /**
   * 修改行程表单的状态
   * @param status: 状态, true为保存, false为只能修改
   */
  function changeScheduleFormDisabledStatus (status, location) {
    if (status) {
      $('#schedule-update-btn').attr('disabled', 'true');
      $('#schedule-cancel-btn').attr('disabled', 'true');
      $('#schedule-delete-btn').attr('disabled', 'true');
      $('#schedule-save-btn').removeAttr('disabled');
    } else {
      $('#schedule-update-btn').removeAttr('disabled');
      $('#schedule-cancel-btn').removeAttr('disabled');
      $('#schedule-delete-btn').removeAttr('disabled');
      $('#schedule-save-btn').attr('disabled', 'true');
    }
  }

  /**
   * 将已有数据插入到form表单中进行修改
   * @param data: 已有数据
   * @param location: 数据行所在位置, 便于修改保存
   */
  function insertDataToForm(data, location) {
    var $scheduleForm = $('#detail-form');
    // date parse
    var dateReg = /(\d+)/;
    var date = dateReg.exec(data['date'])[0];
    $scheduleForm.find('input[name="schedule-date"]').val(date);
    $scheduleForm.find('input[name="schedule-title"]').val(data['title']);
    $scheduleForm.find('input[name="schedule-detail"]').val(data['detail']);
    $scheduleForm.find('input[name="schedule-attractions"]').importTags(data['attractions']);
    $scheduleForm.find('input[name="schedule-restaurants"]').importTags(data['restaurants']);
    var scheduleThumbnailDropzone = Dropzone.forElement('div#schedule-thumbnail');
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
    var hotelViewBtn = document.createElement('button');
    hotelViewBtn.setAttribute('class', 'btn btn-default view-btn');
    hotelViewBtn.setAttribute('data-data', '#hotel-' + $hotelsTable.rows.length - 1);
    hotelViewBtn.innerHTML = '编辑';
    hotelViewBtn.addEventListener('click', hotelViewBtnClicked);
    hotelView.appendChild(hotelViewBtn);
    hotelView.setAttribute('class', 'last');
  }

  /**
   * 编辑hotel按钮的callback
   */
  function hotelViewBtnClicked (e) {
    e.preventDefault();
    var dataHref = e.target.dataset['data'];
    var rankReg = /(\d+)/;
    var rank = rankReg.exec(dataHref)[0];
    var $hotelTable = $('#hotels-table')[0];
    var data = new Object();
    data['title'] = $hotelTable.rows[rank].cells[0].innerHTML;
    data['duration'] = $hotelTable.rows[rank].cells[1].innerHTML;
    insertHotelDataToForm(data, rank);
  };

  function insertHotelDataToForm(data, location) {
    var $hotelForm = $('#hotels-form');
    $hotelForm.find('input#package-hotels-title').val(data['title']);
    $hotelForm.find('input#package-hotels-duration').val(data['duration']);
  }

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
    data['package_duration'] = $basicForm.elements[1].value;
    data['package_department'] = $basicForm.elements[2].value;
    data['package_destination'] = $basicForm.elements[3].value;
    data['package_price'] = $basicForm.elements[5].value;
    data['package_abstract'] = $basicForm.elements[6].value;
    data['package_tags'] = $basicForm.elements[7].value;
    // Package Thumbnail
    var packageThumbnailsDropzone = Dropzone.forElement('div#package-thumbnails');
    var packageThumbnails = packageThumbnailsDropzone.files;
    var thumbnailsUrls = new Array();
    packageThumbnails.forEach(function(file) {
      thumbnailsUrls.push(file.url);
    });
    data['package_thumbnails'] = thumbnailsUrls;

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
      schedule['thumbnail'] = $detail[4].getElementsByTagName('img')[0].getAttribute('src');
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
    // Step2: Upload all data to server
    var postUrl = '/packages/package';
    $.ajax({
      url: postUrl,
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json'
    }).success(function(data, status, _) {
        if (status == 'success') {
          var packageId = data;
          location.href = '/packages/package/' + data;
        }
      })
      .error(function(_, status, err) {
        console.log(err);
      });
  }

  /**
   * 设置parentContainer的高度
   */
  function resetFormHeight($form) {
    $form.find('.stepContainer').css('height', 'auto');
  }

  $(function () {
    $('#package-destination').tagsInput({
      width: 'auto',
      defaultText: '城市(天数)'
    });
    $('#package-tags').tagsInput({
      width: 'auto',
      defaultText: '线路标签'
    });
    $('#schedule-attractions').tagsInput({
      width: 'auto',
      defaultText: '景点名称'
    });
    $('#schedule-restaurants').tagsInput({
      width: 'auto',
      defaultText: '当日推荐'
    });
    // $('.tags').tagsInput({
    //   'width': 'auto'
    // });
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
    $('#schedule-cancel-btn').on('click', resetScheduleForm);
    $('#hotel-save-btn').on('click', saveHotel);
    // Configure Dropzone.js Programmatically for package thumbnails
    Dropzone.options.packageThumbnails = {
      paramName: 'thumbnail',
      method: 'POST',
      maxFilesize: 5,
      maxFiles: 3,
      dictDefaultMessage: '拖拽或点击上传图片, 最多3张, 分辨率为1920*1080',
      addRemoveLinks: true,
      init: function() {
        this.on('success', function(file, res) {
          file._removeLink = res.delete_url;
          file.url = res.url;
        });
        this.on('removedfile', function(file) {
          $.ajax({
            url: file._removeLink,
            method: 'DELETE'
          }).error(function(_, status, err) {
            console.log(err);
          });
        })
      }
    };
    // configure Dropzone.js Programmatically for schedule thumbnails
    Dropzone.options.scheduleThumbnail = {
      paramName: 'thumbnail',
      method: 'POST',
      maxFilesize: 5,
      maxFiles: 1,
      dictDefaultMessage: '拖拽或点击上传新图片, 最多一张, 分辨率为560*460',
      addRemoveLinks: true,
      init: function() {
        this.on('success', function (file, res) {
          file._removeLink = res.delete_url;
          file.url = res.url;
        });
        this.on('removedfile', function (file) {
          $.ajax({
            url: file._removeLink,
            method: 'DELETE'
          }).error(function(_, status, err) {
            console.log(err);
          });
        });
      }
    };
  });
}(jQuery));