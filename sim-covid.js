dataLayer = window.dataLayer || [];

var language;

    $( function() {
        
                if ( $("#language-cont .ui-selectmenu-text" ).text() == "IT") language = IT;
                if ( $("#language-cont .ui-selectmenu-text" ).text() == "EN") language = EN;        

    });

//---------------------
var peopleNum;
var recoveryDays;
var infectedAtBeginning;
var daysOut;
var speedCoeff;
var lethality;
var infectionProb;
var division;
var R0;
var R0Tot;
var numInfTot;
var R0Max;





var speed = 1;
var ballRadius = 2;

//---------------------


var canvas = document.getElementById("city");
var ctx = canvas.getContext("2d");
var refreshRate = 10;

var canvasChart = document.getElementById("chart");
var ctxChart = canvasChart.getContext("2d");


var people = [];
var animationId;
var stopControl = false;

var cont, dec, contPrev;
var rec;
var susc;
var day, hour;

function initializePopulation() {
    
    
    peopleNum = Number($('#population').text());
    recoveryDays = Number($('#recoveryDays').text());
    infectedAtBeginning = Number($('#infectedAtBeginning').text()); 
    lethality = Number($('#lethality').text());    
    infectionProb = Number($('#infectionProb').text());    
    division = Number($('#division').text());


    inf = infectedAtBeginning;
    cont = inf;
    rec = 0;
    dec = 0;    
    susc = peopleNum - inf;
    day = 0;
    hour = 0;
    R0Max = 0;

    for(var p=0; p<peopleNum; p++) {
        people[p] = { x: Math.random()*canvas.width , y: Math.random()*canvas.height, speed: speed, speedCoeff:1, dir: Math.random() * Math.PI*2, status: "s" , dx:0, dy:0, infectedDays:0, peopleInfected:0, daysFromRecovery:0};
    }

    for(var p=0; p<inf; p++) {
        people[p].status = "i";
    }


    if (language == "IT") $('#title').text('avviata'); else $('#title').text('started');
    $('#control').text('Stop'); 
    $('.finalResults').css('display','none');


    dataLayer.push({'event':'avvio'});

}

// score


function drawBall() {

	for(var p=0; p<peopleNum; p++) {

    	ctx.beginPath();
    	ctx.arc(people[p].x, people[p].y, ballRadius, 0, Math.PI*2);
    	
    	if (people[p].status == "i") {

    		ctx.fillStyle = "red";
    		if (hour >= 23) {

    			people[p].infectedDays++;                

    		}

    		if (people[p].infectedDays > recoveryDays) {

                var random = Math.random();
                //console.log('random: ' + random);

                if ((random * 100) > lethality) {

                     rec++;
                     inf--;
                     people[p].status = "r";
                     ctx.fillStyle = "#02e402";


                } else {

                     dec++;
                     inf--;
                     people[p].status = "d";
                     ctx.fillStyle = "black";

                     people[p].speedCoeff = 0;


                }





    		}


    	}

    		 else if (people[p].status == "r") ctx.fillStyle = "#02e402";
             else if (people[p].status == "d") ctx.fillStyle = "black"; 
    		 else ctx.fillStyle = "#0095DD";

    	ctx.fill();
    	ctx.closePath();

        if (hour >= 23 && people[p].status != "d" ) {
            var dayRand=Math.random() * 100;
            if (dayRand >= daysOut-1) people[p].speedCoeff = 0; else people[p].speedCoeff = 1;

        }

    	people[p].dx = people[p].speed * people[p].speedCoeff * Math.cos(people[p].dir);
    	people[p].dy = people[p].speed * people[p].speedCoeff * Math.sin(people[p].dir);
    	people[p].x += people[p].dx;
    	people[p].y += people[p].dy;


    	if(people[p].x + people[p].dx > canvas.width - ballRadius || people[p].x + people[p].dx < ballRadius) {
    		people[p].dir = Math.PI - people[p].dir; 		
		}


		if(people[p].y + people[p].dy > canvas.height - ballRadius || people[p].y + people[p].dy < ballRadius) {
    		people[p].dir = +2*Math.PI - people[p].dir;
		}

        if (division == 1) {

            if((people[p].y + people[p].dy < canvas.height/2-10 || people[p].y + people[p].dy > canvas.height/2+10) 
                && (people[p].x + people[p].dx > canvas.width/2-1 && people[p].x + people[p].dx < canvas.width/2+1)) {

                people[p].dir = Math.PI - people[p].dir;

            }


        }

	}
}


function drawChart() {

    //console.log('inf ' + inf);
    //console.log('susc ' + susc);
    //console.log('rec ' + rec);    
    //console.log('dec ' + dec);

    //console.log('peopleNum ' + peopleNum);  
    //console.log('canvas heigh: ' + canvasChart.height);  

    //console.log(inf+rec+susc+dec);
    //console.log(1-inf/peopleNum);  
    //console.log ((1-inf/peopleNum)*canvasChart.height);
    //console.log ((1-(inf+susc)/peopleNum)*canvasChart.height);    
    //console.log ((1-(inf+rec+susc)/peopleNum)*canvasChart.height);
    //console.log ((1-(inf+rec+susc+dec)/peopleNum)*canvasChart.height);

    //console.log ((1-(inf+susc)/peopleNum)*canvasChart.height) + susc/peopleNum*canvasChart.height;    
    //console.log(canvasChart.height);

	ctxChart.beginPath();		

	ctxChart.rect(day*2, (1-inf/peopleNum)*canvasChart.height, 2, inf/peopleNum*canvasChart.height);	
	ctxChart.fillStyle = "red";	
    ctxChart.fill();
    ctxChart.closePath();  

	ctxChart.beginPath();

	ctxChart.rect(day*2, (1-(inf+susc)/peopleNum)*canvasChart.height, 2, susc/peopleNum*canvasChart.height);
	ctxChart.fillStyle = "#0095DD";	
    ctxChart.fill();
    ctxChart.closePath();  

	ctxChart.beginPath();	
	ctxChart.rect(day*2, (1-(inf+rec+susc)/peopleNum)*canvasChart.height, 2, rec/peopleNum*canvasChart.height);	
	ctxChart.fillStyle = "#02e402";	
    ctxChart.fill();
    ctxChart.closePath();

    ctxChart.beginPath();   
    ctxChart.rect(day*2, (1-(inf+rec+susc+dec)/peopleNum)*canvasChart.height, 2, dec/peopleNum*canvasChart.height); 
    ctxChart.fillStyle = "black"; 
    ctxChart.fill();
    ctxChart.closePath();   


    //ctxChart.beginPath();   
    //ctxChart.rect(day*2, (1-(cont)/peopleNum)*canvasChart.height, 2, 2); 
    //ctxChart.fillStyle = "orange"; 
    //ctxChart.fill();
    //ctxChart.closePath();     



}


function collisionDetection() {

	for(var i=0; i<peopleNum; i++) {

		for(var j=0; j<peopleNum; j++) {

			if(people[i].x > people[j].x - ballRadius && people[i].x < people[j].x + ballRadius && people[i].y > people[j].y - ballRadius && people[i].y < people[j].y + ballRadius && i!=j ){
    				
    				people[i].dir = -people[i].dir;


                var random2 = Math.random();
                //console.log('random: ' + random2);

               

    				if ((random2 * 100) <= infectionProb && (people[i].status == "s" && people[j].status == "i" || people[j].status == "s" && people[i].status == "i")){

    					people[i].status = people[j].status = "i";
                        if (people[i].status == "i") people[i].peopleInfected++; else people[j].peopleInfected++;

    					susc--;
    					inf++;                        
    					cont++;

    				}
                }

		}


	}

 
}



function drawZones() {

    ctx.beginPath();       
    ctx.rect(canvas.width/2, 0, 5, canvas.height/2-10);    
    //ctx.rect(10, 30, 10, 20);    
    ctx.fillStyle = "#bebebe"; 
    ctx.fill();
    ctx.closePath(); 

    ctx.beginPath();       
    ctx.rect(canvas.width/2, canvas.height/2+10, 5, canvas.height/2-10);    
    //ctx.rect(10, 30, 10, 20);    
    ctx.fillStyle = "#bebebe"; 
    ctx.fill();
    ctx.closePath(); 

}

function drawScore() {

	$('#pop').text(peopleNum);
	$('#susc').text(susc);
	$('#inf').text(inf);
	$('#rec').text(rec);
	$('#cont').text(cont);	
    $('#dec').text(dec);      
	$('#day').text(day);
	//$('#hour').text(hour.toFixed(0));		
 	
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hour += (refreshRate / 5);

    drawBall();
    drawScore();

    if (division == 1) {
        drawZones();   
    }
  
	collisionDetection();
	drawChart();

    if (hour >= 23) { 
    	hour = 0; 
    	day = day + 1;    

        daysOut = $('#daysOut').text();

        $('.data table tr:last').after('<tr class="dynamic"><td>'+day+'</td><td>'+daysOut+'</td><td>'+susc+'</td><td>'+inf+'</td><td>'+rec+'</td><td>'+dec+'</td><td>'+cont+'</td></tr>');
        
        R0 = 0;
        R0Tot = 0;
        numInfTot = 0;

        for (var i=0; i<peopleNum; i++) {

            if (people[i].status == "r" || people[i].status == "d") {

                if (people[i].daysFromRecovery < 4) {

                    R0 += people[i].peopleInfected;

                    numInfTot++;

                    people[i].daysFromRecovery++;

                } 

            }

        }

        R0Tot = R0 / numInfTot;


        if (numInfTot > 4 ) {

                    if(R0Tot > R0Max) R0Max = R0Tot;

                    $('#R0').text(R0Tot.toFixed(1)); //else $('#R0').text('estimating...');
        }
    }

    animationId = requestAnimationFrame(draw);
    if ( (rec + dec == peopleNum - susc) || stopControl == true) {

        cancelAnimationFrame(animationId);
        if (language == "IT") $('#title').text('finita'); else $('#title').text('ended');

            var contPerc = cont / peopleNum *100;
            var decPerc = dec / peopleNum * 100;
            $('.finalResults').css('display','block');
            $('#totalDays').text(day);
            $('#contPerc').text(contPerc.toFixed(1));
            $('#decPerc').text(decPerc.toFixed(1));
            $('#R0').text('0.0');
            $('#R0Max').text(R0Max.toFixed(1));            

            dataLayer.push({'event':'fine'});

    }



}

//if ( rec > 2 ) cancelAnimationFrame(animationId);


//var interval = setInterval(draw, refreshRate);

var controlStatus = "start";
$('#control').on("click", function() {

    switch (controlStatus) {

        case "start": 
            stopControl = false; 

            initializePopulation();            
            draw();
            controlStatus = "stop";
            $('.data').css('display','block');
            $('.finalResults').css('display','none');

        break;


        case "stop": 
            $('#control').text('Restart'); 
            controlStatus = "restart";
            stopControl = true;
        break;
        

        case "restart":
            //$('#control').text('Riavvia epidemia');             
            $('#title').text('finita');        
            controlStatus = "stop";
            $('.dynamic').remove();

            initializePopulation ();
            drawScore();          
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctxChart.clearRect(0, 0, canvasChart.width, canvasChart.height); 
            stopControl = false;                       
            draw();            
        break;
      
    }

});
    
