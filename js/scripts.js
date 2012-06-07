$(function() {
  
  // Loading 
  var ds = new Miso.Dataset({
    url : 'data/camping.csv',
    delimiter : ';',
    resetOnFetch : true
  });
  
  
  // Préparation de Raphael.js
  var r = Raphael('main_right_star', 450, 480);
  
  var year = 2012,
      curReg = "";
  initDataviz();
  
  function initDataviz(){
    updateMap();
  }
  
  $('#prevYear').on('click', function(event){
    year = parseInt($('#year').text()) - 1;
    $('#year').text(year);
    updateMap();
    updateContextual();
    event.preventDefault();
  });
  $('#nextYear').on('click', function(event){
    year = parseInt($('#year').text()) + 1;
    $('#year').text(parseInt($('#year').text()) + 1);
    updateMap();
    updateContextual();
    event.preventDefault();
  });
  
  function updateMap(){
    ds.fetch({
      success : function() {
        var datas = this.where({
          columns: ['REG','CPG'],
          rows: function(row) {
            return row.ANNEE == year;
          }
        });
        _.each(datas.toJSON(), function(val){
          switch(true){
            case (val.CPG < 300):
              document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).style.fill="989e5a";
            break;
            case (val.CPG >= 300 && val.CPG < 600):
              document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).style.fill="696642";
            break;
            case (val.CPG >= 600):
              document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).style.fill="27341e";
            break;
            default:
              document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).style.fill="FFFFFF";
            break;
            }
          document.getElementById("mapsvg").contentDocument.getElementById("reg-"+val.REG).addEventListener("click",function(){curReg=this.id.split('-')[1]; updateContextual()},false);
          document.getElementById("mapsvg").contentDocument.getElementById("txt-"+val.REG).addEventListener("click",function(){curReg=this.id.split('-')[1]; updateContextual()},false);
        });
      }
    });
  }
  
  
  function updateContextual(){
    ds.fetch({
      success : function() {
        var datas = this.where({
          columns: ['CPG','CPG_E','CPG_1','CPG_E_1','CPG_EL_1','CPG_EO_1'
                                 ,'CPG_2','CPG_E_2','CPG_EL_2','CPG_EO_2'
                                 ,'CPG_3','CPG_E_3','CPG_EL_3','CPG_EO_3'
                                 ,'CPG_4','CPG_E_4','CPG_EL_4','CPG_EO_4'],
          rows: function(row) {
            return row.ANNEE == year && row.REG == curReg;
          }
        });
        datas = datas.toJSON()[0];
        // init hauteur à 0 ?
        // $('#main_center span').css({height:0});
        $('#main_center #nbe-campings').stop().animate({height :  datas.CPG * 450 / 900}, 1000);
        $('#main_center #nbe-emplacements').stop().animate({height :  datas.CPG_E * 450 / 130000}, 1000);
          r.clear();
          // 1 étoile
          var sizeCamp = 8 + 40 * (datas.CPG_1 / datas.CPG);
              sizeLoca = sizeCamp + 10 + 50 * (datas.CPG_E_1 / datas.CPG_E);
          r.pieChart(80, 150, sizeLoca, [datas.CPG_EO_1, datas.CPG_EL_1], [datas.CPG_EO_1, datas.CPG_EL_1]);
          r.circle(80,150,sizeCamp).attr({fill:"#FFF"});
          // 2 étoiles
            sizeCamp = 8 + 40 * (datas.CPG_2 / datas.CPG);
            sizeLoca = sizeCamp + 10 + 50 * (datas.CPG_E_2 / datas.CPG_E);
          r.pieChart(310, 150, sizeLoca, [datas.CPG_EO_2, datas.CPG_EL_2], [datas.CPG_EO_2, datas.CPG_EL_2]);
          r.circle(310,150,sizeCamp).attr({fill:"#FFF"});
          // 3 étoiles
            sizeCamp = 8 + 40 * (datas.CPG_3 / datas.CPG);
            sizeLoca = sizeCamp + 10 + 50 * (datas.CPG_E_3 / datas.CPG_E);
          r.pieChart(80, 360, sizeLoca, [datas.CPG_EO_3, datas.CPG_EL_3], [datas.CPG_EO_3, datas.CPG_EL_3]);
          r.circle(80,360,sizeCamp).attr({fill:"#FFF"});
          // 4 étoiles
            sizeCamp = 8 + 40 * (datas.CPG_4 / datas.CPG);
            sizeLoca = sizeCamp + 10 + 50 * (datas.CPG_E_4 / datas.CPG_E);
          r.pieChart(310, 360, sizeLoca, [datas.CPG_EO_4, datas.CPG_EL_4], [datas.CPG_EO_4, datas.CPG_EL_4]);
          r.circle(310,360,sizeCamp).attr({fill:"#FFF"});
      }
    });
  }
});


// Raphael Pie Chart integration
Raphael.fn.pieChart = function (cx, cy, r, values, labels) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = Raphael.hsb(start, .75, 1),
                ms = 250,
                delta = 0,
                bcolor;
                if(j==0){ bcolor = "#27341e" } else { bcolor ="#3b4f2e" }
            var p = sector(cx, cy, r, angle, angle + angleplus, {fill: bcolor, stroke: "#fff", "stroke-width": 0}),
                txt = paper.text(cx + (r + delta) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "linear");
                txt.stop().animate({opacity: 1}, ms, "linear");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "linear");
                txt.stop().animate({opacity: 0}, ms);
            });
            angle += angleplus;
            chart.push(p);
            chart.push(txt);
            start += .1;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    angle = 90 - (360 * values[0] / total) / 2;
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};