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
  
  window.setTimeout(initDataviz, 1000);
  
  function initDataviz(){
    updateMap();
  }
  
  $('#prevYear:not(.disabled)').live('click', function(event){
    year = parseInt($('#year').text()) - 1;
    if (year <= 2003) { $('#prevYear').addClass('disabled'); }
    if (year < 2012) { $('#nextYear').removeClass('disabled'); }
    $('#year').text(year);
    updateMap();
    updateContextual();
    event.preventDefault();
  });
  $('#nextYear:not(.disabled)').live('click', function(event){
    year = parseInt($('#year').text()) + 1;
    if (year >= 2012) { $('#nextYear').addClass('disabled'); }
    if (year > 2003) { $('#prevYear').removeClass('disabled'); }
    $('#year').text(parseInt($('#year').text()) + 1);
    updateMap();
    updateContextual();
    event.preventDefault();
  });
  
  $('#openInfoBulle').live('click',function(event){
    $('#info-bg').css('display','block');
    $('#info-bulle').slideDown(300);
    event.preventDefault();
  });
  $('#info-bg').live('click', function(event){
    $('#info-bulle').slideUp(300, function(){
      $('#info-bg').css('display','none');
    });
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
          $div = '<div id="header_left">';
          $div+= '<img src="css/img/tente_nom_region.png">';
          $div+= '<p><span>'+associatedCounties[curReg]+'</span></p><ul><li>&nbsp;-&nbsp;<span>'+datas.CPG+'</span> campings</li><li>&nbsp;-&nbsp;<span>'+datas.CPG_E+'</span> emplacements</li></ul>';
          $div+= '</div>';
        $('#header_left').html($div);
        // init hauteur à 0 ?
        // $('#main_center span').css({height:0});
        $('#main_center #nbe-campings').stop().animate({height :  datas.CPG * 450 / 900}, 1000);
        $('#main_center #nbe-emplacements').stop().animate({height :  datas.CPG_E * 450 / 130000}, 1000);
          r.clear();
          // 1 étoile
          var sizeCamp = 12 + 60 * (datas.CPG_1 / datas.CPG);
              sizeLoca = sizeCamp + 10 + 90 * (datas.CPG_E_1 / datas.CPG_E);
          r.pieChart(100, 180, sizeLoca, [datas.CPG_EO_1, datas.CPG_EL_1], [datas.CPG_EO_1, datas.CPG_EL_1]);
          r.circle(100,180,sizeCamp).attr({fill:"#989e5a", "stroke-width":0});
          r.text(100,180,'★');
          // 2 étoiles
            sizeCamp = 12 + 60 * (datas.CPG_2 / datas.CPG);
            sizeLoca = sizeCamp + 10 + 90 * (datas.CPG_E_2 / datas.CPG_E);
          r.pieChart(310, 180, sizeLoca, [datas.CPG_EO_2, datas.CPG_EL_2], [datas.CPG_EO_2, datas.CPG_EL_2]);
          r.circle(310,180,sizeCamp).attr({fill:"#989e5a", "stroke-width":0});
          r.text(310,180,'★★');
          // 3 étoiles
            sizeCamp = 12 + 60 * (datas.CPG_3 / datas.CPG);
            sizeLoca = sizeCamp + 10 + 90 * (datas.CPG_E_3 / datas.CPG_E);
          r.pieChart(100, 360, sizeLoca, [datas.CPG_EO_3, datas.CPG_EL_3], [datas.CPG_EO_3, datas.CPG_EL_3]);
          r.circle(100,360,sizeCamp).attr({fill:"#989e5a", "stroke-width":0});
          r.text(100,355,'★');
          r.text(100,365,'★★');
          // 4 étoiles
            sizeCamp = 12 + 60 * (datas.CPG_4 / datas.CPG);
            sizeLoca = sizeCamp + 10 + 90 * (datas.CPG_E_4 / datas.CPG_E);
          r.pieChart(310, 360, sizeLoca, [datas.CPG_EO_4, datas.CPG_EL_4], [datas.CPG_EO_4, datas.CPG_EL_4]);
          r.circle(310,360,sizeCamp).attr({fill:"#989e5a", "stroke-width":0});
          r.text(310,355,'★★');
          r.text(310,365,'★★');
      }
    });
  }
  
  var associatedCounties = {
    '11':'Île-de-France',
    '21':'Champagne-Ardenne',
    '22':'Picardie',
    '23':'Haute Normandie',
    '24':'Centre',
    '25':'Basse Normandie',
    '26':'Bourgogne',
    '31':'Nord-Pas-de_Calais',
    '41':'Lorraine',
    '42':'Alsace',
    '43':'Franche-Comté',
    '52':'Pays de la Loire',
    '53':'Bretagne',
    '54':'Poitou-Charentes',
    '72':'Aquitaine',
    '73':'Midi-Pyrénées',
    '74':'Limousin',
    '82':'Rhônes Alpes',
    '83':'Auvergne',
    '91':'Languedoc Roussillon',
    '93':'Provences Alpes Côtes d\'Azur',
    '94':'Corse'
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