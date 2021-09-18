class DataGauge {
  constructor (id, options) {
    this.id = id;
    this.value = 0;

    if (options == null) {
      options = { };
    }

    let default_options = {
      minimum: 0,
      maximum: 100,
      titleFontFamily: 'Lato',
      titlePosition: 'below',
      valueFontColor: '#fffefe',
      labelFontColor: '#fffefe',
      titleFontColor: '#dddcdc',
      gaugeColor: '#434141',
      symbol: '',
      modes: {
        ok: {
          color: '#00ff00',
          message: 'OK'
        },
        error: {
          color: '#ff0000',
          message: 'ERROR'
        },
        default: {
          color: '#303030'
        }
      }
    };

    this.options = $.extend(default_options, options);

    // create a gauge div
    let parent = $('<div>');
    let gauge_id = `${id}_gauge`;
    let message_id = `${id}_message`;
    let gauge = $('<div>').attr('id', gauge_id);
    let message = $('<div>').attr('id', message_id).addClass('gauge-hidden');
    $(parent).append(gauge);
    $(parent).append(message);
    $(`#${id}`).append(parent);


    this.gauge_id = `#${gauge_id}`;
    this.message_id = `#${message_id}`;


    // also create an error/information div
    this.gauge = new JustGage({
      id: gauge_id,
      value: this.value,
      min: this.options.minimum,
      max: this.options.maximum,
      title: this.options.name,
      titleFontFamily: this.options.titleFontFamily,
      titlePosition: this.options.titlePosition,
      valueFontColor: this.options.valueFontColor,
      labelFontColor: this.options.labelFontColor,
      titleFontColor: this.options.titleFontColor,
      gaugeColor: this.options.gaugeColor,
      symbol: this.options.symbol
    });
  }

  update (value) {
    this.value = value;

    $(this.message_id).width($(this.gauge_id).width());
    $(this.message_id).height($(this.gauge_id).height());
    if (typeof value == 'string') {
      if (this.options.modes[value]) {
        if (this.options.modes[value].message) {
          $(this.message_id).text(this.options.modes[value].message);
        } else {
          $(this.message_id).text(value);
        }

        $(this.message_id).css('background-color', this.options.modes[value].color);
      } else {
        $(this.message_id).text(value);
        $(this.message_id).css('background-color', this.options.modes.default.color);
      }

      $(this.message_id).css('visibility', 'visible');
      $(this.message_id).css('display', 'block');
      $(this.gauge_id).css('visibility', 'hidden');
      $(this.gauge_id).css('display', 'none');
    } else {
      this.gauge.refresh(value);
      $(this.gauge_id).css('visibility', 'visible');
      $(this.gauge_id).css('display', 'block');
      $(this.message_id).css('visibility', 'hidden');
      $(this.message_id).css('display', 'none');
    }
  }
}
