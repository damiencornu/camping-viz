$(function() {
  var ds = new Miso.Dataset({
    url : 'data/camping.csv',
    delimiter : ';'
  });

  ds.fetch({
    success : function() {
      console.log("Available Columns:" + this.columnNames());
      console.log("There are " + this.length + " rows");
      console.log(this.groupBy('REG', ['CPGE12']))
    }
  });
});