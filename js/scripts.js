$(function() {
  
  // Load map
  
  
  var ds = new Miso.Dataset({
    url : 'data/camping.csv',
    delimiter : ';',
    resetOnFetch : true
  });

  ds.fetch({
    success : function() {
      console.log(this.groupBy('REG', ['CPGE12']))
    }
  });
});