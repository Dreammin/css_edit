
//设置运动属性初始值
var translate3d = {
	name:'translate3d',
	property:{X:200,Y:200,Z:0}
};

var scale3d = {
	name:'scale3d',
	property:{X:1.2,Y:1.2,Z:1.2}
};

var skew = {
	name:'skew',
	property:{X_angle:30,Y_angle:30}
};


var rotate3d = {
	name:'rotate3d',
	property:{X:1,Y:1,Z:1,angle:45}
};

var rotateX = {
	name:'rotateX',
	property:{angle:30}
};

var rotateY = {
	name:'rotateY',
	property:{angle:30}
};

var rotateZ = {
	name:'rotateZ',
	property:{angle:30}
};

//定义浏览器前缀
var prefix = ['-webkit-','-o-','-ms-','-moz-'];

//定义常用属性值
var fomalTimeFunction={"ease":[.25,.1,.25,1],
"linear":[0,0,1,1],
"ease-in":[.42,0,1,1],
"ease-out":[0,0,.58,1],
"ease-in-out":[.42,0,.58,1],
"custom":[0.5,0.25,0.5,0.75]};

var transformStr = "";
var transitionStr = "";
var cubic_bezierStr = "";
var showCssStr="";
var moveObject = null;

window.onload = function(){
	
	var ctx , drag = null, dPoint;
	moveObject = document.getElementById('moveBox');
	var canvas = document.getElementById("canvas");
	var code = document.getElementById("code");
	var cubic = document.getElementById("cubic");
	var coordinate = document.getElementById("coordinate-plane");
	if (canvas.getContext) {
		ctx = canvas.getContext("2d");
	}

	//初始化canvas对象中的四个点
	var point = {
		p1: { x:0, y:200 },
		p2: { x:200, y:0 },
		cp1: { x: 0, y: 0 },
		cp2: { x: 0, y: 0 },
	};

	//初始化canvas对象中的样式
	var style = {
		curve:	{ width: 6, color: "#ccc" },
		cpline:	{ width: 2, color: "#888" },
		point: { radius: 10, width: 2, color: "#333", fill: "#999", arc1: 0, arc2: 2 * Math.PI }
	}

	var defaultRunProperty = [];
	$(".runPropertyBox input:checkbox").each(function(){
		if($(this).prop('checked')){
			if (this.value=='translate3d') {
				addBox(translate3d);
				defaultRunProperty.push(translate3d);
			}
			else if (this.value=='scale3d') {
				addBox(scale3d);
				defaultRunProperty.push(scale3d);
			}
			else if (this.value=='skew') {
				addBox(skew);
				defaultRunProperty.push(skew);
			}
			else if (this.value=='rotateX') {
				addBox(rotateX);
				defaultRunProperty.push(rotateX);
			}
			else if (this.value=='rotateY') {
				addBox(rotateY);
				defaultRunProperty.push(rotateY);
			}
			else if (this.value=='rotateZ') {
				addBox(rotateZ);
				defaultRunProperty.push(rotateZ);
			}
			else if (this.value=='rotate3d') {
				addBox(rotate3d);
				defaultRunProperty.push(rotate3d);
			}
		}

		$(this).change(function() {
			if($(this).prop('checked')){
				if (this.value=='translate3d') {
					addBox(translate3d);
				}
				else if (this.value=='scale3d') {
					addBox(scale3d);
				}
				else if (this.value=='skew') {
					addBox(skew);
				}
				else if (this.value=='rotateX') {
					addBox(rotateX);
				}
				else if (this.value=='rotateY') {
					addBox(rotateY);
				}
				else if (this.value=='rotateZ') {
					addBox(rotateZ);
				}
				else if (this.value=='rotate3d') {
					addBox(rotate3d);
				}
			}
			if(!$(this).prop('checked')){
				$('#'+this.value+'Box').remove();
			}
		})
	});


$(".timeFunctionBox input:radio").each(function(){
	if($(this).prop('checked')){
		point = changeToPoint(fomalTimeFunction[this.value]);
		if (this.value=='custom') {
			drawCanvas(canvas,style,point);
			canvas.onmousedown = DragStart;
			canvas.onmousemove = Dragging;
			canvas.onmouseup = canvas.onmouseout = DragEnd;

		}
		else {
			drawCanvasWithoutControl(canvas,style,point);
		}

	}
	$(this).change(function() {
		if($(this).prop('checked')){
			point = changeToPoint(fomalTimeFunction[this.value]);
			if (this.value=='custom') {
				drawCanvas(canvas,style,point);
				canvas.onmousedown = DragStart;
				canvas.onmousemove = Dragging;
				canvas.onmouseup = canvas.onmouseout = DragEnd;
				console.log("a");

			}
			else {
				drawCanvasWithoutControl(canvas,style,point);
				canvas.onmouseout = canvas.onmousedown = canvas.onmousemove = canvas.onmouseup = null;
				console.log("b")
			}
		}

	})
	cubic_bezierStr = getCubicBezierCode(point);
	ShowCode(cubic,cubic_bezierStr);
});




var timeLine = document.getElementById("timeLine");
var outPut = document.getElementById("timeValue");
var timeValue = timeLine.value;	
outPut.value = timeValue+"s";
timeLine.onmousemove = function(){
	timeValue = timeLine.value;
	outPut.value = timeValue+"s";
	transitionStr = "transform " + timeValue +"s "+cubic_bezierStr;
	showCssStr = "#moveBox{\n"+getPrefixCss("transform",transformStr)+"\n\n"+getPrefixCss("transition",transitionStr)+"\n}"
	ShowCode(code,getHightLightCssCode(showCssStr));
}


transitionStr = "transform " + timeValue +"s "+cubic_bezierStr;
transformStr = getTransformStr(defaultRunProperty);
showCssStr = "#moveBox{\n"+getPrefixCss("transform",transformStr)+"\n\n"+getPrefixCss("transition",transitionStr)+"\n}"
ShowCode(code,getHightLightCssCode(showCssStr));


$(".runPropertyBox").on('change',' :input',function(){
	var runProperty = [];
	$(".runPropertyBox input:checkbox").each(function(){
		if($(this).prop('checked')){
			if (this.value=='translate3d') {
				translate3d.property.X=$("#"+translate3d.name+"Box .property:nth-child(2) input").val();
				translate3d.property.Y=$("#"+translate3d.name+"Box .property:nth-child(3) input").val();
				translate3d.property.Z=$("#"+translate3d.name+"Box .property:nth-child(4) input").val();
				runProperty.push(translate3d);
				console.log(translate3d.property["X"]);
			}
			else if (this.value=='scale3d') {
				scale3d.property.X=$("#"+scale3d.name+"Box .property:nth-child(2) input").val();
				scale3d.property.Y=$("#"+scale3d.name+"Box .property:nth-child(3) input").val();
				scale3d.property.Z=$("#"+scale3d.name+"Box .property:nth-child(4) input").val();
				runProperty.push(scale3d);
			}
			else if (this.value=='skew') {
				skew.property.X_angle=$("#"+skew.name+"Box .property:nth-child(2) input").val();
				skew.property.Y_angle=$("#"+skew.name+"Box .property:nth-child(3) input").val();
				runProperty.push(skew);
			}
			else if (this.value=='rotateX') {
				rotateX.property.angle=$("#"+rotateX.name+"Box .property:nth-child(2) input").val();
				runProperty.push(rotateX);
			}
			else if (this.value=='rotateY') {
				rotateY.property.angle=$("#"+rotateY.name+"Box .property:nth-child(2) input").val();
				runProperty.push(rotateY);
			}
			else if (this.value=='rotateZ') {
				rotateZ.property.angle=$("#"+rotateZ.name+"Box .property:nth-child(2) input").val();
				runProperty.push(rotateZ);
			}
			else if (this.value=='rotate3d') {
				rotate3d.property.X=$("#"+rotate3d.name+"Box .property:nth-child(2) input").val();
				rotate3d.property.Y=$("#"+rotate3d.name+"Box .property:nth-child(3) input").val();
				rotate3d.property.Z=$("#"+rotate3d.name+"Box .property:nth-child(4) input").val();
				rotate3d.property.angle=$("#"+rotate3d.name+"Box .property:nth-child(5) input").val();
				runProperty.push(rotate3d);
			}
		}
	})

transformStr = getTransformStr(runProperty);

timeValue = document.getElementById("timeLine").value;
cubic_bezierStr = getCubicBezierCode(point);
transitionStr = "transform " + timeValue +"s "+cubic_bezierStr;

showCssStr = "#moveBox{\n"+getPrefixCss("transform",transformStr)+"\n\n"+getPrefixCss("transition",transitionStr)+"\n}"
ShowCode(code,getHightLightCssCode(showCssStr));
ShowCode(cubic,cubic_bezierStr);
console.log(transformStr+transitionStr);
});

	//定义canvas中控制点开始方法
	function DragStart(e) {
		e = MousePos(e);
		var dx, dy;
		for (var p in point) {
			dx = point[p].x - e.x;
			dy = point[p].y - e.y;
			if ((dx * dx) + (dy * dy) < style.point.radius * style.point.radius) {
				drag = p;
				dPoint = e;
				canvas.style.cursor = "move";
				return;
			}
		}
	}


	// 定义canvas中控制点移动方法
	function Dragging(e) {
		if (drag) {
			e = MousePos(e);
			point[drag].x += e.x - dPoint.x;
			point[drag].y += e.y - dPoint.y;
			dPoint = e;
			
			drawCanvas(canvas,style,point);
			cubic_bezierStr = getCubicBezierCode(point);
			transitionStr = "transform " + timeValue+"s "+cubic_bezierStr;
			
			showCssStr = "#moveBox{\n"+getPrefixCss("transform",transformStr)+"\n\n"+getPrefixCss("transition",transitionStr)+"\n}"
			ShowCode(code,getHightLightCssCode(showCssStr));
			ShowCode(cubic,cubic_bezierStr);
		}
	}
	
	
	// 定义canvas中控制点移动方法
	function DragEnd(e) {
		drag = null;
		canvas.style.cursor = "default";
		drawCanvas(canvas,style,point);
		cubic_bezierStr = getCubicBezierCode(point);
		transitionStr = "transform " + timeValue+"s "+cubic_bezierStr;

		showCssStr = "#moveBox{\n"+getPrefixCss("transform",transformStr)+"\n\n"+getPrefixCss("transition",transitionStr)+"\n}"
		ShowCode(code,getHightLightCssCode(showCssStr));
		ShowCode(cubic,cubic_bezierStr);
	}

	
	//设置事件坐标点
	function MousePos(event) {
		event = (event ? event : window.event);
		return {
			x: event.pageX - coordinate.offsetLeft - canvas.offsetLeft,
			y: event.pageY - coordinate.offsetTop - canvas.offsetTop
		}
	}

	//为滑块添加事件监听，完成transition后回到初始位置状态
	moveObject.addEventListener("transitionend", function(){ 
		moveObject.style.transform="translate3d(0px,0px,0px) scale3d(1,1,1) skew(0deg,0deg) rotateX(0deg) rotateY(0deg) rotateZ(0deg) rotate3d(0,0,0,0deg)";
		moveObject.style.transition="transform 1ms 0.5s";
		$('#run').removeAttr("disabled");
	}, false); 


}

//滑块运动方法
function run(){	
	moveObject.style.transition=transitionStr;
	moveObject.style.webkitTransform=transformStr;
	moveObject.style.transform=transformStr;
	$("#run").attr('disabled',"true");
}


//动态添加动画属性参数输入框
function addBox(propertyObj){
	var html = "";
	var width = 100/Object.getOwnPropertyNames(propertyObj.property).length+'%';
	var step = 1;
	if (propertyObj.name=='scale3d') {
		step = 0.1;
	};
	if (propertyObj.name=='translate3d') {
		step = 50;
	};
	if (propertyObj.name=='rotate3d') {
		width = "22%";
	};
	for(var pro in propertyObj.property){
		if (propertyObj.name=='rotate3d' && pro=='angle') {
			width = "30%";
		};
		html += "<div class='property' style='width:"+width+"'>"
		+"<label>"
		+"<span>"+pro+":</span>"
		+"<input value="+propertyObj.property[pro]+" step="+step+" type='number'>"
		+"</label>"
		+"</div>"

	}
	$('#'+propertyObj.name).append("<div id='"+propertyObj.name+"Box' class='propertyBox'>"
		+"<div class='property'>"
		+"</div>"
		+html+"</div>");

}

	//在canvas中绘制bezier曲线和控制点
	function drawCanvas(canvas,style,point) {
		ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//绘制控制线
		ctx.lineWidth = style.cpline.width;
		ctx.strokeStyle = style.cpline.color;
		ctx.beginPath();
		ctx.moveTo(point.p1.x, point.p1.y);
		ctx.lineTo(point.cp1.x, point.cp1.y);
		
		ctx.moveTo(point.p2.x, point.p2.y);
		ctx.lineTo(point.cp2.x, point.cp2.y);
		
		ctx.stroke();
		
		//绘制bezier曲线
		ctx.lineWidth = style.curve.width;
		ctx.strokeStyle = style.curve.color;
		ctx.beginPath();
		ctx.moveTo(point.p1.x, point.p1.y);
		ctx.bezierCurveTo(point.cp1.x, point.cp1.y, point.cp2.x, point.cp2.y, point.p2.x, point.p2.y);
		ctx.stroke();

		//绘制控制点
		ctx.lineWidth = style.point.width;
		ctx.strokeStyle = style.point.color;
		ctx.fillStyle = style.point.fill;
		ctx.beginPath();
		ctx.arc(point.cp1.x, point.cp1.y, style.point.radius, style.point.arc1, style.point.arc2, true);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(point.cp2.x, point.cp2.y, style.point.radius, style.point.arc1, style.point.arc2, true);
		ctx.fill();
		ctx.stroke();
		
	}

	//在canvas中绘制bezier曲线
	function drawCanvasWithoutControl(canvas,style,point) {
		ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// 绘制bezier曲线
		ctx.lineWidth = style.curve.width;
		ctx.strokeStyle = style.curve.color;
		ctx.beginPath();
		ctx.moveTo(point.p1.x, point.p1.y);
		ctx.bezierCurveTo(point.cp1.x, point.cp1.y, point.cp2.x, point.cp2.y, point.p2.x, point.p2.y);
		
		ctx.stroke();

	}

	//输出css代码
	function ShowCode(shoowBox,codeStr) {
		if (shoowBox) {
			shoowBox.innerHTML=codeStr+"\n";
		}
	}

	//将添加的属性转换成css中transform代码
	function getTransformStr(runProperty){
		var transformStr='';
		for(var i = 0;i<runProperty.length;i++){
			if (runProperty[i].name=='translate3d') {
				transformStr += "translate3d("+runProperty[i].property.X+"px,"+runProperty[i].property.Y+"px,"+runProperty[i].property.Z+"px) ";
			}
			else if (runProperty[i].name=='scale3d') {
				transformStr += "scale3d("+runProperty[i].property.X+","+runProperty[i].property.Y+","+runProperty[i].property.Z+") ";
			}
			else if (runProperty[i].name=='skew') {
				transformStr += "skew("+runProperty[i].property.X_angle+"deg,"+runProperty[i].property.Y_angle+"deg) ";
			}
			else if (runProperty[i].name=='rotateX') {
				transformStr += "rotateX("+runProperty[i].property.angle+"deg) ";
			}
			else if (runProperty[i].name=='rotateY') {
				transformStr += "rotateY("+runProperty[i].property.angle+"deg) ";
			}
			else if (runProperty[i].name=='rotateZ') {
				transformStr += "rotateZ("+runProperty[i].property.angle+"deg) ";
			}
			else if (runProperty[i].name=='rotate3d') {
				transformStr += "rotate3d("+runProperty[i].property.X+","+runProperty[i].property.Y+","+runProperty[i].property.Z+","+runProperty[i].property.angle+"deg) ";
			}


		}
		return transformStr;
	}


	//将cubic-bezier中的参数值转换成控制点坐标
	function changeToPoint(arr){
		point = {
			p1: { x:0, y:200 },
			p2: { x:200, y:0 }
		};

		point.cp1 = { x: arr[0]*200, y: 200-arr[1]*200 };
		point.cp2 = { x: arr[2]*200, y: 200-arr[3]*200 };
		return point;
	}

	//将控制点坐标转换成cubic-bezier中的参数值
	function getCubicBezierCode(point){
		var cp1xValue = point.cp1.x<0?0:(point.cp1.x>200?1:(point.cp1.x/200).toFixed(2));
		var cp1yValue = point.cp1.y>200?0:(point.cp1.y<0?1:((200-point.cp1.y)/200).toFixed(2));
		var cp2xValue = point.cp2.x<0?0:(point.cp2.x>200?1:(point.cp2.x/200).toFixed(2));
		var cp2yValue = point.cp2.y>200?0:(point.cp2.y<0?1:((200-point.cp2.y)/200).toFixed(2));
		return "cubic-bezier("+cp1xValue+","+cp1yValue+", "+cp2xValue+", "+cp2yValue+")";
	} 

	//添加浏览器前缀
	function getPrefixCss(type,value){
		var resultStr="";
		for(var i = 0; i<prefix.length; i++)
		{
			resultStr += '&#9' + prefix[i] + type +":"+value+";\n";
		}
		resultStr += '&#9' + type +":"+value+";";
		return resultStr;
	}

	//为css代码添加高亮
	function getHightLightCssCode(code){

		var startIdx=endIndex=-1; 
		var at=0; 
		var commentList=[]; 
		while(true){ 
			startIndex=code.indexOf("/*",at); 
			if(startIndex==-1)break; 
			endIndex=code.indexOf("*/",startIndex); 
			if(endIndex==-1)break; 

			at=endIndex+2; 
			commentList.push(code.substring(startIndex,at)); 
			code=code.replace(commentList[commentList.length-1],"_"+(commentList.length-1)+"_"); 
		} 

    	//字符串 
    	code=code.replace(/(['"]).*\1/g,function(m){return "<span style=\"color:#fff;\">"+m+"</span>"}); 
    	//CSS样式值 
    	code=code.replace(/:(.+);/g,function(m,n){return ":<span style=\"color:#00f6ff;\">"+n+"</span>;"}); 
    	//CSS样式名称 
    	code=code.replace(/[{}]/g,function(m){ 
    		if(m=="{"){ 
    			return "{<span style=\"color:#fff;\">"; 
    		}else{ 
    			return "</span>}"; 
    		} 
    }); 

    	//注释 
    	code=code.replace(/_(\d+)_/g,function(m,n){return "<span style=\"color:#fff;\">"+commentList[n]+"</span>"}); 
    	//处理\t 
    	code=code.replace(/^(\t+)/gm,function(m){ 
    		return (new Array(m.length+1)).join("    ");                                     
    	}); 
    	//处理空格 
    	code=code.replace(/^( +)/gm, function(m) { 
    		return (new Array(m.length + 1)).join(" "); 
    	}); 
    	//处理换行 
    	code=code.replace(/\r?\n/g,"<br>");
    	return code;
}



