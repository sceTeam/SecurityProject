var mySvg = document.querySelector('#my-svg');
var snap = Snap(mySvg);
var w = mySvg.width.baseVal.value,h = mySvg.height.baseVal.value,cx = w / 2,cy = h / 2;

var radius = 100;
var perimeter = 2 * Math.PI * radius;
var color = '#007ac1';

var circle = snap.circle(cx, cy, radius);
var text = document.querySelector('.percent-text');
text.style.color = color;

function updateGraph(perc) {
  // Reset attributes
  circle.attr({
	fill: 'none',
	stroke: color,
	strokeWidth: '0.7cm',
	strokeDasharray: '0 ' + perimeter,
	strokeDashoffset: perimeter * .25 });


  // Animate
  Snap.animate(0, perc, val => {
	circle.attr({
	  strokeDasharray: perimeter * val + ' ' + perimeter * (1 - val) });
	text.innerHTML = Math.round(val * 100) + '%';
  }, 2500, mina.easeinout);
};

function compareLocalTime(result) {
  document.getElementById("percent4").innerHTML = '';
  var ipTime, systemTime, localHour, localMinutes, ipTimeSplit, ipHour, ipMinutes;

  ipTime = String(document.getElementById('localTime').innerHTML);

  systemTime = new Date();
  document.getElementById('date').innerHTML = systemTime;

  localHour = systemTime.getHours().toString();
  localHour = ("0" + localHour).slice(-2);

  localMinutes = systemTime.getMinutes().toString();
  localMinutes = ("0" + localMinutes).slice(-2);
  
  ipTimeSplit = ipTime.split(':');

  ipHour = ipTimeSplit[0];
  ipMinutes = ipTimeSplit[1];

  if(!ipTime || !systemTime){
    document.getElementById("check4").innerHTML = 'Checking Error';
  }
  else{
    if(localHour==ipHour && (localMinutes >= ipMinutes-2 && localMinutes <= ipMinutes+5)){
      //document.getElementById("test4").innerHTML = 'green';
      document.getElementById("check4").innerHTML = 'Succeed';
    }
    else{
      //document.getElementById("test4").innerHTML = 'red';
      document.getElementById("check4").innerHTML = 'Failed';
      document.getElementById("percent4").innerHTML = ' - 30%';
      result += 0.3;
    }
  }
  if(result >= 0.75){
    document.getElementById("using").innerHTML = 'Your Using VPN!';
  }
  else{
    document.getElementById("using").innerHTML = 'Your Not Using VPN.';
  }

  updateGraph(result);

};

jQuery(document).ready(function(){
  jQuery('.toast__close').click(function(e){
    e.preventDefault();
    var parent = $(this).parent('.toast');
    parent.fadeOut("slow", function() { $(this).remove(); } );
  });
});