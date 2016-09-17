/*import Cubic from '../components/cubic.vue';*/
var vm = new Vue({
	el:".main",
/*	components:{Cubic},*/
	data:{
		runTime:"",
		timeFunctionModel:"custom",
		timeFunctionArr:[
			{
				name:"custom",
				cubic_bezier:[0.5,0.25,0.5,0.75]
			},
			{
				name:"ease",
				cubic_bezier:[0.25,0.1,0.25,1]
			},
			{
				name:"linear",
				cubic_bezier:[0,0,1,1]
			},
			{
				name:"ease-in",
				cubic_bezier:[.42,0,1,1]
			},
			{
				name:"ease-out",
				cubic_bezier:[0,0,.58,1]
			},
			{
				name:"ease-in-out",
				cubic_bezier:[.42,0,.58,1]
			}
		],
		runPropertys:[
			{
				name:"translate3d",
				width:"width:"+100/3+"%",
				options:[
					{
						name:"X",
						value:200,
						step:50
					},
					{
						name:"Y",
						value:200,
						step:50
					},
					{
						name:"Z",
						value:200,
						step:50
					}
				],
				display:true
			},
			{
				name:"scale3d",
				width:"width:"+100/3+"%",
				options:[
					{
						name:"X",
						value:1.2,
						step:0.1
					},
					{
						name:"Y",
						value:1.2,
						step:0.1
					},
					{
						name:"Z",
						value:1.2,
						step:0.1
					}
				],
				display:false
		    },
		    {
				name:"skew",
				width:"width:"+100/2+"%",
				options:[
					{
						name:"X_angle",
						value:30,
						step:1
					},
					{
						name:"Y_angle",
						value:30,
						step:1
					}
				],
				display:false
		    },
		    {
				name:"rotateX",
				width:"width:"+100+"%",
				options:[
					{
						name:"angle",
						value:30,
						step:1
					}
				],
				display:false
		    },
		    {
				name:"rotateY",
				width:"width:"+100+"%",
				options:[
					{
						name:"angle",
						value:30,
						step:1
					}
				],
				display:false
		    },
		    {
				name:"rotateZ",
				width:"width:"+100+"%",
				options:[
					{
						name:"angle",
						value:30,
						step:1
					}
				],
				display:false
		    },
		    {
				name:"rotate3d",	
				options:[
					{
						name:"X",
						width:"width:"+22+"%",
						value:1,
						step:1
					},
					{
						name:"Y",
						width:"width:"+22+"%",
						value:1,
						step:1
					},
					{
						name:"Z",
						width:"width:"+22+"%",
						value:1,
						step:1
					},
					{
						name:"angle",
						width:"width:"+30+"%",
						value:45,
						step:1
					}
				],
				display:false
		    },
		],
		timeFunctionModel:"custom",
			/*point:[0.5,0.25,0.5,0.75],*/
		timeFunctionArr:[
			{
				name:"custom",
				cubic_bezier:[0.5,0.25,0.5,0.75]
			},
			{
				name:"ease",
				cubic_bezier:[0.25,0.1,0.25,1]
			},
			{
				name:"linear",
				cubic_bezier:[0,0,1,1]
			},
			{
				name:"ease-in",
				cubic_bezier:[0.42,0,1,1]
			},
			{
				name:"ease-out",
				cubic_bezier:[0,0,0.58,1]
			},
			{
				name:"ease-in-out",
				cubic_bezier:[0.42,0,0.58,1]
			}
		],
		//canvas: document.getElementById("canvas"),
		canvas:null,
		moveObject:null,
		ctx : "",
		drag: null,
		dPoint:null,
		point : {
			p1: { x:0, y:200 },
			p2: { x:200, y:0 },
			cp1: { x: 100, y: 150 },
			cp2: { x: 100, y: 50 },
		},
		pointStyle:{
			curve:	{ width: 6, color: "#ccc" },
			cpline:	{ width: 2, color: "#888" },
			point: { radius: 10, width: 2, color: "#333", fill: "#999", arc1: 0, arc2: 2 * Math.PI }
		},
		cubicBezier:"cubic-bezier(0.50,0.25, 0.50, 0.75)",
		prefix:['-webkit-','-o-','-ms-','-moz-'],
	},
	ready:function(){
		this.canvas = document.getElementById("canvas");
		this.moveObject = document.getElementById("moveBox");
		console.log("ready:"+this.moveObject); 
		if (this.canvas.getContext) {
			this.ctx = this.canvas.getContext("2d");
		}

		if (this.timeFunctionModel=='custom') {
			this.point = this.changeToPoint(this.cubic_bezier);
			this.drawCanvas(this.canvas,this.pointStyle,this.point);
			this.canvas.onmousedown = this.DragStart;
			this.canvas.onmousemove = this.Dragging;
			this.canvas.onmouseup = this.canvas.onmouseout = this.DragEnd;
		}
		else {
			this.point = this.changeToPoint(this.cubic_bezier);
			this.drawCanvasWithoutControl(this.canvas,this.pointStyle,this.point);
		}
		this.moveObject.addEventListener("transitionend", function(){ 
			this.style.transform="translate3d(0px,0px,0px) scale3d(1,1,1) skew(0deg,0deg) rotateX(0deg) rotateY(0deg) rotateZ(0deg) rotate3d(0,0,0,0deg)";
			this.style.transition="transform 1ms 0.5s";
		}, false); 
	},
	computed:{
		code:function(){
			return "#moveBox{\n"+this.getHightLightCssCode(this.getPrefixCss("transform",this.transformStr)+"\n\n"+this.getPrefixCss("transition",this.transitionStr)+"\n}");
		},
		transformStr:function(){
			return this.getTransformPropertys();
		},
		transitionStr:function(){
			return this.getTransition();
		},
		cubic_bezier:function(){
			if(this.timeFunctionModel == "custom"){
				return this.getCubicBezierCode(this.point);
			}
			else{
				for (var i = 0; i < this.timeFunctionArr.length; i++) {
					if(this.timeFunctionModel == this.timeFunctionArr[i].name){
						return this.timeFunctionArr[i].cubic_bezier;
					}
				}
			}
		},
		cubicStr:function(){
			var tempCubicStr = "cubic_bezier(";
			for (var i = 0; i < this.cubic_bezier.length; i++) {
				if (i==this.cubic_bezier.length-1) {
					tempCubicStr += this.cubic_bezier[i];
				}
				else{
					tempCubicStr += this.cubic_bezier[i] + ",";
				}
			}
			tempCubicStr += ")";
			return tempCubicStr; 
		}
	},
	methods:{
		startRun:function(){
			this.moveObject.style.transition=this.transitionStr;
			this.moveObject.style.webkitTransform=this.transformStr;
			this.moveObject.style.transform=this.transformStr;
		},
		DragStart:function(e){
			e = this.MousePos(e);
			var dx, dy;
			for (var p in this.point) {
				dx = this.point[p].x - e.x;
				dy = this.point[p].y - e.y;
				if ((dx * dx) + (dy * dy) < this.pointStyle.point.radius * this.pointStyle.point.radius) {
					this.drag = p;
					this.dPoint = e;
					this.canvas.style.cursor = "move";
					var b= p + "aa";
					return;
				}
			}
		},
		Dragging:function(e){
			if (this.drag) {
				e = this.MousePos(e);
				this.point[this.drag].x += e.x - this.dPoint.x;
				this.point[this.drag].y += e.y - this.dPoint.y;
				this.dPoint = e;
				this.cubic_bezier = this.getCubicBezierCode(this.point);
				this.drawCanvas(this.canvas,this.pointStyle,this.point);
			}
		},
		DragEnd:function(e) {
			this.drag = null;
			this.canvas.style.cursor = "default";
			this.drawCanvas(this.canvas,this.pointStyle,this.point);
		},
		MousePos:function(event) {
			event = (event ? event : window.event);
			return {
				x: event.pageX - this.canvas.getBoundingClientRect().left,
				y: event.pageY - this.canvas.getBoundingClientRect().top
			}
		},
		//在canvas中绘制bezier曲线和控制点
	 	drawCanvas: function (canvas,style,point) {
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
		},
		//在canvas中绘制bezier曲线
		drawCanvasWithoutControl:function(canvas,style,point) {
			ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// 绘制bezier曲线
			ctx.lineWidth = style.curve.width;
			ctx.strokeStyle = style.curve.color;
			ctx.beginPath();
			ctx.moveTo(point.p1.x, point.p1.y);
			ctx.bezierCurveTo(point.cp1.x, point.cp1.y, point.cp2.x, point.cp2.y, point.p2.x, point.p2.y);		
			ctx.stroke();
		},
		//将cubic-bezier中的参数值转换成控制点坐标
	    changeToPoint: function(arr){
			var point = {
				p1: { x:0, y:200 },
				p2: { x:200, y:0 }
			};

			point.cp1 = { x: arr[0]*200, y: 200-arr[1]*200 };
			point.cp2 = { x: arr[2]*200, y: 200-arr[3]*200 };
			return point;
		},
	    //将控制点坐标转换成cubic-bezier中的参数值
		getCubicBezierCode:function(point){
			var cp1xValue = point.cp1.x<0?0:(point.cp1.x>200?1:(point.cp1.x/200).toFixed(2));
			var cp1yValue = point.cp1.y>200?0:(point.cp1.y<0?1:((200-point.cp1.y)/200).toFixed(2));
			var cp2xValue = point.cp2.x<0?0:(point.cp2.x>200?1:(point.cp2.x/200).toFixed(2));
			var cp2yValue = point.cp2.y>200?0:(point.cp2.y<0?1:((200-point.cp2.y)/200).toFixed(2));
			//return "cubic-bezier("+cp1xValue+","+cp1yValue+", "+cp2xValue+", "+cp2yValue+")";
			return [cp1xValue,cp1yValue,cp2xValue,cp2yValue];
		},
		getTransformPropertys:function(){
			var tempTransformStr = "";
			for (var i = 0; i < this.runPropertys.length; i++) {
				if(this.runPropertys[i].display){
					if (this.runPropertys[i].name=='translate3d') {
						tempTransformStr += "translate3d("+this.runPropertys[i].options[0].value+"px,"+this.runPropertys[i].options[1].value+"px,"+this.runPropertys[i].options[2].value+"px) ";
					}
					else if (this.runPropertys[i].name=='scale3d') {
						tempTransformStr += "scale3d("+this.runPropertys[i].options[0].value+","+this.runPropertys[i].options[1].value+","+this.runPropertys[i].options[2].value+") ";
					}
					else if (this.runPropertys[i].name=='skew') {
						tempTransformStr += "skew("+this.runPropertys[i].options[0].value+"deg,"+this.runPropertys[i].options[1].value+"deg) ";
					}
					else if (this.runPropertys[i].name=='rotateX') {
						tempTransformStr += "rotateX("+this.runPropertys[i].options[0].value+"deg) ";
					}
					else if (this.runPropertys[i].name=='rotateY') {
						tempTransformStr += "rotateY("+this.runPropertys[i].options[0].value+"deg) ";
					}
					else if (this.runPropertys[i].name=='rotateZ') {
						tempTransformStr += "rotateZ("+this.runPropertys[i].options[0].value+"deg) ";
					}
					else if (this.runPropertys[i].name=='rotate3d') {
						tempTransformStr += "rotate3d("+this.runPropertys[i].options[0].value+","+this.runPropertys[i].options[1].value+","+this.runPropertys[i].options[2].value+","+this.runPropertys[i].options[3].value+"deg) ";
					}
				}
			}
			return tempTransformStr;
		},
		getTransition:function(){
			return "transform " + this.runTime + "s " + this.cubicBezier;
		},
		getPrefixCss:function(type,value){
			var resultStr="";
			for(var i = 0; i<this.prefix.length; i++)
			{
				resultStr += '&#9' + this.prefix[i] + type +":"+value+";\n";
			}
			resultStr += '&#9' + type +":"+value+";";
			return resultStr;
		},
		getHightLightCssCode:function(code){
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
	}
});

vm.$watch("timeFunctionModel",function(newValue,oldValue){
	if (newValue=='custom') {
		//this.cubic_bezier = [0.5,0.25,0.5,0.75];
		this.point = this.changeToPoint([0.5,0.25,0.5,0.75]);
		this.drawCanvas(this.canvas,this.pointStyle,this.point);
		this.canvas.onmousedown = this.DragStart;
		this.canvas.onmousemove = this.Dragging;
		this.canvas.onmouseup = this.canvas.onmouseout = this.DragEnd;
	}
	else {
		this.point = this.changeToPoint(this.cubic_bezier);
		this.canvas.onmouseout = this.canvas.onmousedown = this.canvas.onmousemove = this.canvas.onmouseup = null;
		this.drawCanvasWithoutControl(this.canvas,this.pointStyle,this.point);
	}
});


