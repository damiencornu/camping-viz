$(function() {
  
  // Loading 
  var ds = new Miso.Dataset({
    url : 'data/camping.csv',
    delimiter : ';',
    resetOnFetch : true
  });
  
  
  // Préparation de Raphael.js
  var r = Raphael('contextual', 600, 600),
  param = {stroke: "#fff", "stroke-width": 30};
  
  var pathTemp = "M150,200 a150,150 0 1,0 150,-150"
  var star1 = r.path(pathTemp);
  
  // Fin de l'initialisation de Raphael.js
  
  
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
    // Get rid of the XXX- part before the id
    var id = divId.split('-')[1];
    console.log("id : ");
    console.log(id);
    
    var percent = 0.30,
        beginAngle = - Math.PI/2 + (percent * Math.PI),
        endAngle = - Math.PI/2 - (percent * Math.PI);
    
    console.log("beginAngle  + endAngle: ");
    console.log(beginAngle + ' ' + endAngle);
    
    var canvas = document.getElementById('contextual-1');
    var ctx = canvas.getContext('2d');
        ctx.lineWidth = 40;
    
    ctx.beginPath();
    ctx.arc(100,100,60,beginAngle,endAngle,true)
    ctx.stroke();
    
  }
});