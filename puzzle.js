/**
 * puzzle
 * author:yan.yan
 * createTime:2017.03.22
 */
//every one Image
var perImg;
//horizontal input
var horArea;
//vertical input
var verArea;
//average height
var perHeight;
//average width
var perWidth;
//the clientRect of puzzle area
var mainRect;
//counter
var count;
//timer to display
var timer
/**
 * funcLoad
 *  onload function
 *  1.bind change listener on input(file) "puzzle" to get a picture from computer
 *  2.preview the selected picture
 *  3.bind keyup listener on input(text) to prevent letters
 *  4.bind click listener on button "puzzle" to start puzzle
 *  5.copy the selected picture and make clones
 *  6.disorganize the puzzlearea
 *  7.bind drag listener on clones
 */
function funcLoad() {
	window.resizeTo(880,790);
	document.getElementById("upload").onchange = function() {
		var srcvalue = document.getElementById("upload").value;
		var file = this.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file)
		reader.onload = function(e) {
			//make a preview/reference
			document.getElementById("imgSide").src = e.target.result;
		}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
	};
	var recrParam = document.getElementById("rectParam").getElementsByTagName("input");
	for(var i = 0; i < recrParam.length; i++) {
		recrParam[i].onclick = function() {
			this.select();	
		};
        recrParam[i].onkeyup = function() {
        this.value = this.value.replace(/[^\d]/g,'');	
        }
	}
	document.getElementById("start").onclick = function() {	
		timer.innerHTML = "0";
		//clear puzzle area
		document.getElementById("mainpuzzle").innerHTML = "";
		var presrc = document.getElementById("imgSide").src;
		horArea = document.getElementById("hor");
		verArea = document.getElementById("ver");
		document.getElementById("upload").setAttribute("disabled","disabled");
		horArea.setAttribute("disabled","disabled");
		verArea.setAttribute("disabled","disabled");
		//create clones from the selected picture
		if(createImgs(presrc) === false) {
			return false;
		};
		//disorganize the puzzle area
		createMess(horArea.value,verArea.value);
		//bind drag listener
		createDrag();
		window.clearInterval(count);
	    count = setInterval("counter()",1000);
	};
	var hideArea = document.createElement("div");
	document.getElementById("stop").onclick = function() {
		window.clearInterval(count);
		hideArea.setAttribute("id","hideArea");
		mainpuzzle.appendChild(hideArea);
		enabledItems();
	}
    timer = document.getElementById("timer");
	document.getElementById("resume").onclick = function() {
		if (timer.innerHTML != "0") {
		window.clearInterval(count);
		horArea.setAttribute("disabled","disabled");
		verArea.setAttribute("disabled","disabled");
		mainpuzzle.removeChild(hideArea);
		count = setInterval("counter()",1000);
		}
	}
}
/**
 * counter
 */
function counter() {
	timer.innerHTML = parseInt(timer.innerHTML) + 1;
}
/**
 * createImgs
 *  1.Calculate out average height/width
 *  2.check everything
 *  3.generate picture clones
 * @param presrc 
 *   selected picture src
 */
function createImgs(presrc) {
	var horNo = horArea.value;
	var verNo = verArea.value;
	var displayArea = document.getElementById("mainpuzzle");
	var displayHeight = displayArea.getClientRects()[0].height;
	var displayWidth = displayArea.getClientRects()[0].width;
	perHeight = parseInt(displayHeight / verNo);
	perWidth = parseInt(displayWidth / horNo);
	//valid img check
	if (presrc.indexOf("data:image") < 0) {
		alert("you have to upload an image instead of this ***");
		document.getElementById("upload").style.backgroundColor = "red";
		enabledItems();
		return false;
	}
    //empty img check
	if(document.getElementById("upload").value === "") {
		alert("you have to select your puzzle picture first");
		document.getElementById("upload").style.backgroundColor = "red";
		enabledItems();
		return false;
	} else {
		cleanErr();
	}
	//horizontal input empty check
	if(horNo === "" || horNo === "0") {
		alert("you have to input a meaningful number");
		horArea.focus();
		horArea.style.border = "1px solid red";
		enabledItems();
		return false;
	} else {
		cleanErr();
	}
	//vertical input empty check
	if(verNo === "" || verNo === "0") {
		alert("you have to input a meaningful number");
		verArea.focus();
		verArea.style.border = "1px solid red";
		enabledItems();
		return false;
	} else {
		cleanErr();
	}
	//to prevent collapse
	if(horNo * verNo > 81) {
		alert("it will be tough, make the total count less than 25");
		enabledItems();
		return false;
	}
	var counter = 1;
	var oldClass = "";
	//generate clones
	for(var i = 1; i <= horNo; i++) {
		for(var j = 1; j <= verNo; j++) {
			var imgDiv = document.createElement("div");
			imgDiv.setAttribute("id", "imgDiv" + counter)
			imgDiv.style.position = "absolute";
			imgDiv.style.width = perWidth + "px";
			imgDiv.style.height = perHeight + "px";
			imgDiv.style.overflow = "hidden";
			imgDiv.style.border = "1px solid yellow";
			var imgInside = document.createElement("img");
			imgInside.setAttribute("id", "puzzleImg" + counter);
			imgInside.src = presrc;
			imgInside.setAttribute("class", "hor" + j + " ver" + i + " imgAttr");
			imgInside.style.height = displayHeight + "px";
			imgInside.style.width = displayWidth + "px";
			imgDiv.appendChild(imgInside);
			document.getElementById("mainpuzzle").appendChild(imgDiv);
			counter++;
		}
	}
	//get every picture's clip value
	perImg = document.getElementsByClassName("imgAttr");
	for(var n = 1; n <= verNo; n++) {
		//get every picture in a horizontal line
		var horImg = document.getElementsByClassName("hor" + n);
		for(var o = 0; o <= horImg.length; o++) {
			if(horImg[o]) {
				horImg[o].style.left = "0px";
				horImg[o].clipleft = parseInt(perWidth * o) + "px";
				horImg[o].parentElement.style.left = parseInt(perWidth * o) + "px";
			}
		}
	}
	for(var p = 1; p <= horNo; p++) {
		//get every picture in a vertical line
		var verImg = document.getElementsByClassName("ver" + p);
		for(var q = 0; q <= verImg.length; q++) {
			if(verImg[q]) {
				verImg[q].style.top = "0px";
				verImg[q].clipTop = parseInt(perHeight * q) + "px";
				verImg[q].parentElement.style.top = parseInt(perHeight * q) + "px";
			}
		}
	}
	//clip every picture
	for(var m = 0; m < perImg.length; m++) {
		var parentHeight = document.getElementById("mainpuzzle").clientHeight;
		var parentWidth = document.getElementById("mainpuzzle").clientWidth;
		var clipTop = perImg[m].clipTop.split("px")[0];
		var clipLeft = perImg[m].clipleft.split("px")[0];
		var clipBottom = parseInt(clipTop) + parseInt(perHeight);
		var clipRight = parseInt(clipLeft) + parseInt(perWidth);
		//sorry for tha just ignore it
		perImg[m].style.position = "absolute";                                                                                                                                                                                                                                                                                                                                                                                                                               
		perImg[m].style.top = -clipTop + "px";
		perImg[m].style.left = -clipLeft + "px";
		//pictures should stay in containers
		perImg[m].setAttribute("draggable", false);
		perImg[m].style.cursor = "pointer";
		//used to exchange classname
        perImg[m].initClassName = perImg[m].className;
        //used to check if finished
		perImg[m].initPosition = { top: "", left: "" };
		perImg[m].initPosition.top = perImg[m].parentElement.style.top.split("px")[0];
		perImg[m].initPosition.left = perImg[m].parentElement.style.left.split("px")[0];
        //containers can be dragged
		perImg[m].parentElement.setAttribute("draggable", true);
		perImg[m].parentElement.initPosition = { top: "", left: "" };
		perImg[m].parentElement.initPosition.top = parseInt(perImg[m].initPosition.top);
		perImg[m].parentElement.initPosition.left = parseInt(perImg[m].initPosition.left);
		//used to exchange
		perImg[m].parentElement.newPosition = perImg[m].parentElement.initPosition;
	}
}
/**
 * createMess
 *  disorganize
 * @param  h horizontal number
 * @param  v vertical number
 */
function createMess(h, v) {
	var tempDivWidth;
	var tempDivHeight;
	var clipArr = new Array();
	var transformAngle = new Array(
		"90","180","270","360"
	);
	for(var z = 0; z < perImg.length; z++) {
		clipArr.push(perImg[z]);
	}
	clipArr.sort(function() { return 0.5 - Math.random() });
	for(var h = 0; h < perImg.length; h++) {
		perImg[h].parentElement.style.top = parseInt(clipArr[h].parentElement.initPosition.top) + "px";
		perImg[h].parentElement.style.left = parseInt(clipArr[h].parentElement.initPosition.left) + "px";
		perImg[h].setAttribute("class", clipArr[h].initClassName);
		perImg[h].parentElement.newPosition = clipArr[h].parentElement.initPosition;
		tempDivWidth = perImg[h].parentElement.style.width.split("px")[0];
		tempDivHeight = perImg[h].parentElement.style.height.split("px")[0];
		perImg[h].parentElement.style.transform = "rotate("+ transformAngle[parseInt(3*Math.random())]+"deg)";
		var angle = perImg[h].parentElement.style.transform.split("rotate(")[1].split("deg")[0];
		if (parseInt(angle)%180 !== 0) {
			perImg[h].parentElement.style.transform = perImg[h].parentElement.style.transform + "scale(" + tempDivHeight/tempDivWidth + "," + tempDivWidth/tempDivHeight +")";			
		}
	}
	//if disorganize failed,redisorganize except there should be only one clone
	if(completeCheck() && h * v !== 1) {
		createMess();
	}
	//bind doubleClick on divs
	//make a closure
	var clickDiv= function(m) {
         return function(){
            var	tempDivWidth = perImg[m].parentElement.style.width.split("px")[0];
		    var tempDivHeight = perImg[m].parentElement.style.height.split("px")[0];
			var angle = parseInt(perImg[m].parentElement.style.transform.split("rotate(")[1].split("deg")[0]) + 90;
			perImg[m].parentElement.style.transform = "rotate("+ angle + "deg)";
			if (parseInt(angle)%180 !== 0) {				
			    perImg[m].parentElement.style.transform = perImg[m].parentElement.style.transform + "scale(" + tempDivHeight/tempDivWidth + "," + tempDivWidth/tempDivHeight +")";
			}
			if(completeCheck()){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
			    alert("congratulations");
			    enabledItems();
			    window.clearInterval(count);
			   } 
         };
    };
	for (var l = 0; l < perImg.length; l++) {
		perImg[l].parentElement.ondblclick = clickDiv(l);		
	}
}
/**
 * completeCheck
 *  check if puzzle finished
 */
function completeCheck() {
	var rtn = true;
	for(var v = 0; v < perImg.length; v++) {
		var parentDiv = perImg[v].parentElement;
		var angle = parentDiv.style.transform.split("rotate(")[1].split("deg")[0];
		if(parentDiv.newPosition.left !== parentDiv.initPosition.left ||
		   parentDiv.newPosition.top !== parentDiv.initPosition.top ||
		   parseInt(angle)%360 !== 0) {
		   rtn = false;
		   break;
		} 
	}
	return rtn;
}
/**
 * cleanErr
 *   reset the err color
 */
function cleanErr() {
	document.getElementById("upload").style.backgroundColor = "";
	horArea.style.border = "";
	verArea.style.border = "";
}
/**
 * createDrag
 *  bind drag listener on clones
 */
function createDrag() {
	mainRect = document.getElementById("mainpuzzle").getClientRects()[0];
	for(var p = 0; p < perImg.length; p++) {
		var dragDiv = perImg[p].parentElement;
		dragDiv.isDown = true;
		dragDiv.initx = "";
		dragDiv.inity = "";
		dragDiv.divInitx = "";
		dragDiv.divInity = "";
		dragDiv.ondragstart = function(e) {
			this.style.border = "none";
			this.initx = e.clientX;
			this.inity = e.clientY;
			this.divInitx = parseInt(this.style.left.split("px")[0]);
			this.divInity = parseInt(this.style.top.split("px")[0]);
			//get the exposition
			this.horClsOld = ((Math.ceil((e.clientY - mainRect.top)/ perHeight)) > verArea.value) ? verArea.value : (Math.ceil((e.clientY - mainRect.top) / perHeight));
	        this.verClsOld = ((Math.ceil((e.clientX - mainRect.left)/ perWidth)) > horArea.value) ? horArea.value : (Math.ceil((e.clientX - mainRect.left) / perWidth));
		}
		dragDiv.ondrag = function(e) {
			//let's move
			this.style.left = this.divInitx + e.clientX - this.initx + "px";
			this.style.top = this.divInity + e.clientY - this.inity + "px";                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
		}
		dragDiv.ondragend = function(e) {
			//check two rect should be exchange or not
			if(collisionDetection(this, e)){
				//check puzzle finished or not
			    if(completeCheck()){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
			       alert("congratulations");
			       enabledItems();
			       window.clearInterval(count);
			    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
			}
			this.isDown = false;
			this.style.border = "1px solid yellow";
		}
	}
}
/**
 * collisionDetection
 *  1.get the new mouse position
 *  2.check everything
 *  3.exchange or not
 * @param imgDiv
 *   dragged container
 * @param  e
 *   dragend event
 */
function collisionDetection(imgDiv, e) {
	var imgRect = imgDiv.newPosition;
	var checkInMain = false;
	var checknInInit = true;
	var checkMoveToNext = false;
	imgRect.right = imgRect.left + perWidth;
	imgRect.bottom = imgRect.top + perHeight;
	//get new element on new position
	var horCls = ((Math.ceil((e.clientY - mainRect.top)/ perHeight)) > verArea.value) ? verArea.value : (Math.ceil((e.clientY - mainRect.top) / perHeight));
	var verCls = ((Math.ceil((e.clientX - mainRect.left)/ perWidth)) > horArea.value) ? horArea.value : (Math.ceil((e.clientX - mainRect.left) / perWidth));
	var imgNewCollection = document.getElementsByClassName("hor" + horCls);
	for (var t = 0; t < imgNewCollection.length; t++) {
		if(imgNewCollection[t].getAttribute("class").indexOf("ver" + verCls) > 0) {
			var divNew = imgNewCollection[t].parentElement;
		}		
	}
	//check if mouse is in the puzzle area
	if(e.clientX > mainRect.left && e.clientX < mainRect.right &&
		e.clientY > mainRect.top && e.clientY < mainRect.bottom) {
		checkInMain = true;
	}
    //check if mouse is on the dragged div
	if(e.clientX > imgRect.left && e.clientX < imgRect.right &&
		e.clientY > imgRect.top + mainRect.top && e.clientY < imgRect.bottom + mainRect.top) {
		checknInInit = false;
	}
	//container should be not exchange too far
	if((Math.abs(horCls - imgDiv.horClsOld) <= 1) &&
		(Math.abs(verCls - imgDiv.verClsOld) <= 1)) {
		checkMoveToNext = true;
	}
	//check failed and go back
	if (divNew == undefined || divNew == imgDiv || !checkMoveToNext || (imgDiv.newPosition.left !== divNew.newPosition.left && imgDiv.newPosition.top !== divNew.newPosition.top)) {
		imgDiv.style.left = imgDiv.newPosition.left + "px";
		imgDiv.style.top = imgDiv.newPosition.top + "px";
		return false;
	}
	//check passed and exchange
	if(checkInMain && checknInInit && checkMoveToNext) {
		imgDiv.style.top = divNew.style.top;
		imgDiv.style.left = divNew.style.left;
		divNew.style.top = imgDiv.newPosition.top + "px";
		divNew.style.left = imgDiv.newPosition.left + "px";
		var temp1 = imgDiv.newPosition;
		var temp2 = divNew.newPosition;
		var classTemp1 = imgDiv.children[0].getAttribute("class");
		var classTemp2 = divNew.children[0].getAttribute("class");
		imgDiv.newPosition = temp2;
		divNew.newPosition = temp1;
		imgDiv.children[0].setAttribute("class", classTemp2);
		divNew.children[0].setAttribute("class", classTemp1);
	}
	return true;
}/**
  * enabledItems
  */
function enabledItems() {
		document.getElementById("upload").removeAttribute("disabled");
		horArea.removeAttribute("disabled");
		verArea.removeAttribute("disabled");
}
