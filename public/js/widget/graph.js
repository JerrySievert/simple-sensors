class DataGraph {
  constructor (id, options) {
    this.id = id;
    this.data = [ ];

    if (options == null) {
      options = { };
    }

    let default_options = {
      min_y: 0,
      max_x: 100,
      height: 200,
      left: 30,
      right: 10,
      top: 50,
      type: 'avg'
    };

    this.options = { ...default_options, ...options };
    if (this.options.data) {
      this.update(this.options.data);
    }
  }

  update (data) {
    let y_accessor = this.options.y_accessor;

    let confidence = null;
    if (this.options.type == 'avg') {
      confidence = [ `${this.options.y_accessor}_min`, `${this.options.y_accessor}_max` ];
    }

    MG.data_graphic({
      title: this.options.title,
      data: data,
      full_width: true,
      height: this.options.height,
      left: this.options.left,
      right: this.options.right,
      top: this.options.top,
      area: false,
      target: this.id,
      show_secondary_x_label: false,
      x_extended_ticks: true,
      y_accessor: y_accessor,
      show_confidence_band: confidence,
      yax_format: d3.format('2'),
      yax_units: this.options.y_units,
      yax_units_append: true,
      x_label: this.options.x_label,
      max_y: this.options.max_y,
      min_y:this.options.min_y
    });
  }
}
