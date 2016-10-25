(function ($) {
  'use strict';

  /**
   * 插入数据到Model中, 并且调用sort函数进行排序, 方便更新view
   * @param data: 要插入的数据: date, title, detail, attractions, restaurants, thumbnail; title, duration;
   * @param type: 数据的类型, 与DataModel中的数据类型相同: schedule, hotel.
   * @return: 插入成功返回true, 失败返回false
   */
  var dataModelInsert = function (data, type) {
    if (type == 'inclusion_exclusion') {
      var dataType = data['type'];
      this.data[type][dataType].push(data);
    } else {
      this.data[type].push(data);
      if (type == 'schedules') {
        this.sort();
      }
    }
  };

  /**
   * 更新数据Model
   * @param data: 更新之后的数据, 同上
   * @param type: 同上
   * @param index: 表示更新数据在Model的位置
   */
  var dataModelUpdate = function (data, type, index) {
    if (index > this.data[type].length) {
      return false;
    } else if (type == 'inclusion_exclusion') {
      var dataType = data['type'];
      this.data[type][dataType][index] = data;
    } else {
      this.data[type][index] = data;
      if (type == 'schedules') {
        this.sort();
      }
    }
  };

  /**
   * 删除model中的数据
   * @param type: 同上
   * @param index: 位置
   */
  var dataModelDelete = function (type, index, inclusionOrExclusionType) {
    if (type == 'inclusion_exclusion') {
      this.data[type][inclusionOrExclusionType].splice(index, 1);
    } else {
      this.data[type].splice(index, 1);
    }
  };

  /**
   * 对DataModel进行排序, 基本上只排序Schedules对象即可, 按照其中的date进行排序.
   */
  var by = function(name) {
    return function(o, p) {
      var a, b;
      if (typeof o === 'object' && typeof p === 'object' && o && p) {
        a = o[name];
        b = p[name];
        if (a === b) {
          return 0;
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
      } else {
        throw('error');
      }
    }
  };
  var dataModelSort = function () {
    this.data['schedules'].sort(by('date'));
  };

  /**
   * 获取对应的数据, 根据type和index区分即可, index可为-1
   * @param type: 同上, all表示所有的数据, 即this.data
   * @param index: -1时表示获取全部数据, >=0时表示对应单体数据
   */
  var dataModelGet = function (type, index, inclusion_exclusion) {
    if (type == 'all') {
      return this.data;
    } else if (type == 'inclusion_exclusion') {
      if (index == -1) {
        return this.data[type];
      } else {
        return this.data[type][inclusion_exclusion][index];
      }
    } else {
      if (index == -1) {
        return this.data[type];
      } else {
        return this.data[type][index];
      }
    }
  };
  /**
   * 数据Model, 通过上述定义的函数, 实现DataModel的增删改除以及排序功能.
   * DataModel包括的内容有Schedule, Hotel等数据, 所以使用Object的方式保存.
   */
  var DataModel = function () {
    var obj = {
      data: {'schedules': [], 'hotels': [], 'inclusion_exclusion': {'inclusion': [], 'exclusion': []}},
      insert: dataModelInsert,
      update: dataModelUpdate,
      delete: dataModelDelete,
      sort: dataModelSort,
      get: dataModelGet
    };
    return obj;
  };

  var dataModel = DataModel();

  /**
   * 更新前端表格显示
   * @param type: schedules, hotels
   */
  function updateTableView (type) {
    var data = dataModel.get(type, -1, undefined);
    if (type == 'schedules') {
      // 1. Clean the table body
      var $detailTable = $('#detail-table');
      var $detailTableBody = $detailTable.find('tbody');
      $detailTableBody.empty();
      // 2. Add elements into table
      for (var i = 0; i < data.length; i++) {
        var element = data[i];
        var day = "第" + element['date'] + "天";
        var dayElement = $('<td class="td_date"></td>').text(day);
        var titleElement = $('<td class="td_title"></td>').text(element['title']);
        var detailElement = $('<td class="td_detail"></td>').text(element['detail']);
        var attractionsElement = $('<td class="td_attraction"></td>').text(element['attractions']);
        var restaurantsElement = $('<td></td>').text(element['restaurants']);
        var thumbnailElement = $('<td></td>');
        var imgElement = $('<img class="schedule_thumbnail"></img>').attr('src', (element['thumbnail']));
        thumbnailElement.append(imgElement);
        var scheduleViewElement = $('<td class="last td_action"></td>');
        var viewBtnElement = $('<button class="btn btn-default view-btn"></button>').attr('data-data', '#schedule-' + i).text('编辑');
        scheduleViewElement.append(viewBtnElement);
        viewBtnElement.click(viewBtnClicked);
        var trElement = $('<tr></tr>').append(dayElement, titleElement, detailElement, attractionsElement,
          restaurantsElement, thumbnailElement, scheduleViewElement);
        $detailTableBody.append(trElement);
      }

    } else if (type == 'inclusion_exclusion') {
      // 1. clean the table body
      var $inclusionExclusionTable = $('#inclusion-exclusion-table');
      var $inclusionExclusionTableBody = $inclusionExclusionTable.find('tbody');
      $inclusionExclusionTableBody.empty();

      // 2. add elements into table
      // 2.1 inclusion elements
      for (var i = 0; i < data['inclusion'].length; i++) {
        var element = data['inclusion'][i];
        var typeElement = $('<td class="tag_type"></td>').text('包含');
        var contentElement = $('<td class="tag_content"></td>').text(element['content']);
        var viewBtnElement = $('<td class="last"></td>');
        var viewBtn = $('<button class="btn btn-default view-btn"></button>').attr('data-data', '#inclusion-' + i).text('编辑');
        viewBtn.click(inclusionExclusionViewBtnClicked);
        viewBtnElement.append(viewBtn);
        var trElement = $('<tr></tr>').append(typeElement, contentElement, viewBtnElement);
        $inclusionExclusionTableBody.append(trElement);
      }
      // 2.2 exclusion elements
      for (var i = 0; i < data['exclusion'].length; i++) {
        var element = data['exclusion'][i];
        var typeElement = $('<td class="tag_type"></td>').text('不包含');
        var contentElement = $('<td class="tag_content"></td>').text(element['content']);
        var viewBtnElement = $('<td class="last"></td>');
        var viewBtn = $('<button class="btn btn-default view-btn"></button>').attr('data-data', '#exclusion-' + i).text('编辑');
        viewBtn.click(inclusionExclusionViewBtnClicked);
        viewBtnElement.append(viewBtn);
        var trElement = $('<tr></tr>').append(typeElement, contentElement, viewBtnElement);
        $inclusionExclusionTableBody.append(trElement);
      }

    } else if (type == 'hotels') {
      // 1. clean hotel table view
      var $hotelTable = $('#hotels-table');
      var $hotelTableBody = $hotelTable.find('tbody');
      $hotelTableBody.empty();
      // 2. add elements into table
      for (var i = 0; i < data.length; i++) {
        var element = data[i];
        var titleElement = $('<td></td>').text(element['title']);
        var durationElement = $('<td></td>').text(element['duration']);
        var viewBtnElement = $('<td class="last"></td>');
        var viewBtn = $('<button class="btn btn-default view-btn"></button>').attr('data-data', '#hotel-' + i).text('编辑');
        viewBtn.click(hotelViewBtnClicked);
        viewBtnElement.append(viewBtn);
        var trElement = $('<tr></tr>').append(titleElement, durationElement, viewBtnElement);
        $hotelTableBody.append(trElement);
      }
    }
  }

  /*
   * 保存单日行程
   * Collect data -> Insert to model -> update front-end view display -> reset schedule form.
   */
  function saveSchedule(e) {
    e.preventDefault();
    // 1. Collect data from form.
    var $detailForm = $('#detail-form')[0];
    var $detailTable = $('#detail-table')[0];
    var scheduleThumbnailDropzone = Dropzone.forElement('div#schedule-thumbnail');
    var scheduleData = new Object();
    scheduleData['date'] = $detailForm.elements[0].value || $detailTable.rows.length;
    scheduleData['title'] = $detailForm.elements[1].value;
    scheduleData['detail'] = $detailForm.elements[2].value;
    scheduleData['attractions'] = $detailForm.elements[3].value;
    scheduleData['restaurants'] = $detailForm.elements[5].value;
    scheduleData['thumbnail'] = scheduleThumbnailDropzone.files[0].url;
    // 2. Insert data to dataModel
    dataModel.insert(scheduleData, 'schedules');
    // 3. Update front-end view display.
    updateTableView('schedules');
    // 4. reset schedule form.
    resetScheduleForm(e);
  }

  /**
   * 更新单日行程, 更新时需要注意日期的修改.
   * 需要判断日期是否相同, 如果相同可以直接修改数据
   * 不同的情况需要删除旧的输入之后插入新数据.
   */
  function updateSchedule(e) {
    e.preventDefault();
    var $detailForm = $('#detail-form')[0];
    var $detailTable = $('#detail-table')[0];
    var row = e.target.dataset['data'];
    var scheduleData = new Object();
    scheduleData['date'] = $detailForm.elements[0].value;
    scheduleData['title'] = $detailForm.elements[1].value;
    scheduleData['detail'] = $detailForm.elements[2].value;
    scheduleData['attractions'] = $detailForm.elements[3].value;
    scheduleData['restaurants'] = $detailForm.elements[5].value;
    // 判断是否上传了新图片
    var scheduleThumbnailDropzone = Dropzone.forElement('div#schedule-thumbnail');
    if (scheduleThumbnailDropzone.files.length > 0) {
      scheduleData['thumbnail'] - scheduleThumbnailDropzone.files[0].url;
    } else {
      scheduleData['thumbnail'] = dataModel.get('schedules', row, undefined)['thumbnail'];
    }
    dataModel.update(scheduleData, 'schedules', row);
    updateTableView('schedules');
    resetScheduleForm(e);
  }

  /**
   * 更新按钮, viewBtn的data-data属性对应的是行数, 而不是row数
   */
  function refreshScheduleViewBtnData() {
    var $detailTable = $('#detail-table')[0];
    for (var i = 1; i < $detailTable.rows.length; i++) {
      $detailTable.rows[i].cells[6].getElementsByTagName('button')[0].setAttribute('data-data', '#schedule-' + i);
    }
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
    changeScheduleFormDisabledStatus(true, undefined);
  }

  /**
   * 删除单日行程, 删除时location就是所在位置
   */
  function deleteScheduleRow(e) {
    e.preventDefault();
    // 1. parse data index
    var dataIndex = e.target.dataset['data'];
    // 2. delete image from model.
    var data = dataModel.get('schedules', dataIndex, undefined);
    var imageSrc = data['thumbnail'];
    $.ajax({
      url: '/uploads' + imageSrc,
      method: 'DELETE'
    }).error(function(_, status, err) {
      console.error(err);
    });
    // 3. delete data from model.
    dataModel.delete('schedules', dataIndex, undefined);
    // 4. update table view.
    updateTableView('schedules');
    resetScheduleForm(e);
  }

  /**
   * view button callback,
   */
  function viewBtnClicked(e) {
    e.preventDefault();
    // parse data index
    var dataHref = e.target.dataset['data'];
    var scheduleRankReg = /#schedule-(\d+)/;
    var rank = undefined;
    if (scheduleRankReg.test(dataHref)) {
      rank = Number.parseInt(scheduleRankReg.exec(dataHref)[1]);
    } else {
      rank = -1;
      return;
    }
    // get data from model
    var data = dataModel.get('schedules', rank, undefined);
    insertDataToForm(data, rank);
    // 将表单状态修改为只能更新
    changeScheduleFormDisabledStatus(false, rank);
    // 为更新, 取消和删除按钮添加data属性, 便于定位location
    $('#schedule-update-btn').attr('data-data', rank);
    $('#schedule-delete-btn').attr('data-data', rank);
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
    $scheduleForm.find('textarea[name="schedule-detail"]').val(data['detail']);
    $scheduleForm.find('input[name="schedule-attractions"]').importTags(data['attractions']);
    $scheduleForm.find('input[name="schedule-restaurants"]').importTags(data['restaurants']);
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
    dataModel.insert(hotelData, 'hotels');
    updateTableView('hotels');
    resetHotelForm(e);
  }

  function updateHotel(e) {
    e.preventDefault();
    var dataIndex = e.target.dataset['data'];
    var $hotelForm = $('#hotels-form')[0];
    var hotelData = new Object();
    hotelData['title'] = $hotelForm.elements[0].value;
    hotelData['duration'] = $hotelForm.elements[1].value;
    dataModel.update(hotelData, 'hotels', dataIndex);
    updateTableView('hotels');
    resetHotelForm(e);
  };

  function deleteHotel(e) {
    e.preventDefault();
    var $hotelForm = $('#hotels-form')[0];
    var dataIndex = e.target.dataset['data'];
    dataModel.delete('hotels', dataIndex, undefined);
    updateTableView('hotels');
    resetHotelForm(e);
  };

  function resetHotelForm(e) {
    e.preventDefault();
    var $hotelForm = $('#hotels-form')[0];
    $hotelForm.reset();
    changeHotelFormDisabledStatus(true, undefined);
  };

  /**
   * 编辑hotel按钮的callback
   */
  function hotelViewBtnClicked (e) {
    e.preventDefault();
    var dataHref = e.target.dataset['data'];
    var rankReg = /#hotel-(\d+)/;
    var rank = undefined;
    if (rankReg.test(dataHref)) {
      rank = rankReg.exec(dataHref)[1];
    } else {
      rank = -1;
      return;
    }
    var data = dataModel.get('hotels', rank, undefined);
    insertHotelDataToForm(data, rank);
    changeHotelFormDisabledStatus(false, rank);

    $('#hotel-update-btn').attr('data-data', rank);
    $('#hotel-delete-btn').attr('data-data', rank);
  };

  function insertHotelDataToForm(data, location) {
    var $hotelForm = $('#hotels-form');
    $hotelForm.find('input#package-hotels-title').val(data['title']);
    $hotelForm.find('input#package-hotels-duration').val(data['duration']);
  }

  function changeHotelFormDisabledStatus(status, location) {
    if (status) {
      $('#hotel-update-btn').attr('disabled', 'true');
      $('#hotel-cancel-btn').attr('disabled', 'true');
      $('#hotel-delete-btn').attr('disabled', 'true');
      $('#hotel-save-btn').removeAttr('disabled');
    } else {
      $('#hotel-update-btn').removeAttr('disabled');
      $('#hotel-cancel-btn').removeAttr('disabled');
      $('#hotel-delete-btn').removeAttr('disabled');
      $('#hotel-save-btn').attr('disabled', 'true');
    }
  }

  function resetInclusionExclusionForm(e) {
    e.preventDefault();
    var $inclusionExclusionForm = $('#inclusion-exclusion-form')[0];
    $inclusionExclusionForm.reset();
    changeInclusionExclusionFormDisabledStatus(true);
  }

  function insertInclusionExclusionDataToForm(data, dataIndex) {
    var $inclusionExclusionForm = $('#inclusion-exclusion-form');
    $inclusionExclusionForm.find('select#package-inclusion-exclusion-type').val(data['type']);
    $inclusionExclusionForm.find('textarea#package-inclusion-exclusion-content').val(data['content']);
  }

  function changeInclusionExclusionFormDisabledStatus(status) {
    if (status) {
      $('#inclusion-exclusion-update-btn').attr('disabled', 'true');
      $('#inclusion-exclusion-cancel-btn').attr('disabled', 'true');
      $('#inclusion-exclusion-delete-btn').attr('disabled', 'true');
      $('#inclusion-exclusion-save-btn').removeAttr('disabled');
    } else {
      $('#inclusion-exclusion-update-btn').removeAttr('disabled');
      $('#inclusion-exclusion-cancel-btn').removeAttr('disabled');
      $('#inclusion-exclusion-delete-btn').removeAttr('disabled');
      $('#inclusion-exclusion-save-btn').attr('disabled', 'true');
    }
  }

  function saveInclusionExclusion(e) {
    e.preventDefault();
    var $inclusionExclusionForm = $('#inclusion-exclusion-form')[0];
    var inclusionExclusionData = new Object();
    inclusionExclusionData['type'] = $inclusionExclusionForm.elements[0].value;
    inclusionExclusionData['content'] = $inclusionExclusionForm.elements[1].value;
    dataModel.insert(inclusionExclusionData, 'inclusion_exclusion');
    updateTableView('inclusion_exclusion');
    resetInclusionExclusionForm(e);
  };

  function updateInclusionExclusion(e) {
    e.preventDefault();
    var dataIndex = e.target.dataset['data'];
    var dataType = e.target.dataset['type'];
    var $inclusionExclusionForm = $('#inclusion-exclusion-form')[0];
    var inclusionExclusionData = new Object();
    inclusionExclusionData['type'] = $inclusionExclusionForm.elements[0].value;
    inclusionExclusionData['content'] = $inclusionExclusionForm.elements[1].value;
    if (dataType == inclusionExclusionData['type']) {
      // 相同类型
      dataModel.update(inclusionExclusionData, 'inclusion_exclusion', dataIndex);
    } else {
      // 不同类型
      dataModel.delete('inclusion_exclusion', dataIndex, dataType);
      dataModel.insert(inclusionExclusionData, 'inclusion_exclusion');
    }
    updateTableView('inclusion_exclusion');
    resetInclusionExclusionForm(e);
  };

  function deleteInclusionExclusion(e) {
    e.preventDefault();
    var $inclusionExclusionForm = $('#inclusion-exclusion-form')[0];
    var dataIndex = e.target.dataset['data'];
    var dataType = e.target.dataset['type'];
    dataModel.delete('inclusion_exclusion', dataIndex, dataType);
    updateTableView('inclusion_exclusion');
    resetInclusionExclusionForm(e);
  };

  function inclusionExclusionViewBtnClicked(e) {
    e.preventDefault();
    var dataHref = e.target.dataset['data'];
    var inclusionExclusionReg = /#([a-z]*)-(\d+)/;
    var dataType = undefined;
    var dataIndex = undefined;
    if (inclusionExclusionReg.test(dataHref)) {
      dataType = inclusionExclusionReg.exec(dataHref)[1];
      dataIndex = inclusionExclusionReg.exec(dataHref)[2];
    } else {
      dataType = undefined;
      dataIndex = undefined;
      return;
    }
    var data = dataModel.get('inclusion_exclusion', dataIndex, dataType);
    insertInclusionExclusionDataToForm(data, dataIndex);
    changeInclusionExclusionFormDisabledStatus(false);
    $('#inclusion-exclusion-update-btn').attr('data-data', dataIndex);
    $('#inclusion-exclusion-update-btn').attr('data-type', dataType);
    $('#inclusion-exclusion-delete-btn').attr('data-data', dataIndex);
    $('#inclusion-exclusion-delete-btn').attr('data-type', dataType);
  };

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
    data['schedules'] = dataModel.get('schedules', -1, undefined);
    data['schedules'].forEach(function(schedule) {
      schedule['attractions'] = schedule['attractions'].split(',').map(function(str) {
        return str.trim();
      });
      schedule['restaurants'] = schedule['restaurants'].split(',').map(function(str) {
        return str.trim();
      });
    });

    // 1.3 Hotel Detail
    data['hotels'] = dataModel.get('hotels', -1, undefined);

    // 1.4 Inclusion And Exclusion Detail
    var inclusionDataList = dataModel.get('inclusion_exclusion', -1, undefined)['inclusion'];
    var exclusionDataList = dataModel.get('inclusion_exclusion', -1, undefined)['exclusion'];
    var inclusionData = new Array();
    var exclusionData = new Array();
    for (var i = 0; i < inclusionDataList.length; i++) {
      inclusionData.push(inclusionDataList[i]['content']);
    }
    for (var i = 0; i < exclusionDataList.length; i++) {
      exclusionData.push(exclusionDataList[i]['content']);
    }
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
          var packageId = data['_id'];
          location.href = '/packages/detail/' + packageId;
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
    $('#package-inclusion').tagsInput({
      width: 'auto',
      defaultText: '包含内容'
    });
    $('#package-exclusion').tagsInput({
      width: 'auto',
      defaultText: '不包含内容'
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
    $('#schedule-delete-btn').on('click', deleteScheduleRow);
    $('#schedule-update-btn').on('click', updateSchedule);
    $('#hotel-save-btn').on('click', saveHotel);
    $('#hotel-update-btn').on('click', updateHotel);
    $('#hotel-delete-btn').on('click', deleteHotel);
    $('#hotel-cancel-btn').on('click', resetHotelForm);
    $('#inclusion-exclusion-save-btn').on('click', saveInclusionExclusion);
    $('#inclusion-exclusion-update-btn').on('click', updateInclusionExclusion);
    $('#inclusion-exclusion-delete-btn').on('click', deleteInclusionExclusion);
    $('#inclusion-exclusion-cancel-btn').on('click', resetInclusionExclusionForm);
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