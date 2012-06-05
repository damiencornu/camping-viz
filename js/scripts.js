$(function() {
  
  // Loading 
  var ds = new Miso.Dataset({
    url : 'data/camping.csv',
    delimiter : ';',
    resetOnFetch : true
  });
  
  
  // Préparation de Raphael.js
  /*var r = Raphael('main_right_star', 600, 600),
  param = {stroke: "#fff", "stroke-width": 30};
  
  var pathTemp = "M150,200 a150,150 0 1,0 150,-150"
  var star1 = r.path(pathTemp);
  */
  // Fin de l'initialisation de Raphael.js
  
  var year = 2012;
  initDataviz();
  
  function initDataviz(){
    updateMap(year);
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
          document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).addEventListener("click",function(){updateContextual(this.id)},false);
        });
      }
    });
  }
  
  function updateContextual(divId){
    var id = divId.split('-')[1];
    ds.fetch({
      success : function() {
        var datas = this.where({
          columns: ['CPG12','CPGE12'],
          rows: function(row) {
            return row.ANNEE == year && row.REG == id;
          }
        });
        datas = datas.toJSON()[0];
        // init hauteur à 0 ?
        // $('#main_center span').css({height:0});
        $('#main_center #nbe-campings').stop().animate({height :  datas.CPG12 * 450 / 900}, 1000);
        $('#main_center #nbe-emplacements').stop().animate({height :  datas.CPGE12 * 450 / 130000}, 1000);
      }
    });
  }
});