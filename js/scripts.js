$(function() {
  
  // Loading 
  var ds = new Miso.Dataset({
    url : 'data/camping.csv',
    delimiter : ';',
    resetOnFetch : true
  });
  
  initDataviz();
  
  function initDataviz(){
    updateMap(2012);
  }
  
  function updateMap(year){
    ds.fetch({
      success : function() {
        var datas = this.where({
          columns: ['REG','CPG12'],
          rows: function(row) {
            return row.ANNEE == year;
          }
        });
        _.each(datas.toJSON(), function(val){
          console.log("val.REG : ");
          console.log(val.REG);
          switch(true){
            case (val.CPG12 < 300):
              document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).style.fill="989e5a";
            break;
            case (val.CPG12 >= 300 && val.CPG12 < 600):
              document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).style.fill="696642";
            break;
            case (val.CPG12 >= 600):
              document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).style.fill="27341e";
            break;
            default:
              document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).style.fill="FFFFFF";
            break;
            }
          document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).addEventListener("mousedown",function(){alert(this.id)},false);
        });
      }
    });
  }
});