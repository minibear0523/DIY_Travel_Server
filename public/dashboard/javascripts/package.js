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
    // 插入完成之后, 进行重置
    $detailForm.reset();
    // tagsInput需要额外处理
    var $scheduleInclusionTagsInput = $('#schedule-inclusion-tags');
    scheduleData['attractions'].split(',').forEach(function(tag) {
      $scheduleInclusionTagsInput.removeTag(tag);
    });
    scheduleData['restaurants'].split(',').forEach(function(restaurant) {
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
   * 插入数据到table中
   * @param data: title, detail, image_url, tags
   */
  function insertScheduleRow(data) {
    var $detailTable = $('#detail-table')[0];
    var $detailTableBody = $detailTable.getElementsByTagName('tbody')[0];
    var days = "第" + data['date'] + "天";
    var row = $detailTableBody.insertRow();
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
      rank = -1
      return;
    }
    var data = new Object();
    var $detailTable = $('#detail-table')[0];
    var detail = $detailTable.rows[rank].cells;
    data['title'] = detail[1].innerHTML;
    data['detail'] = detail[2].innerHTML;
    data['tags'] = detail[3].innerHTML;
    data['thumbnails'] = detail[4].innerHTML;
    data['restaurants'] = detail[5].innerHTML;
    insertDataToForm(data);
  }

  /**
   *
   */
  function insertDataToForm(data) {

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
    $('#schedule-inclusion-tags').tagsInput({
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
    };
  });
}(jQuery));