(function () {
	var Routine;
	if (!Routine) {
	  Routine = this.Routine = {};
	}
	
	var $ = this.jQuery;
	Routine.VERSION = "1.0.0.2";
	
	//enums
	Routine.CallType = {
	  Create: "POST",
	  Update: "PUT",
	  Delete: "DELETE",
	  Read: "GET"
	};
	
	Routine.DataType = {
	  Json: "Json",
	  QueryString: "QueryString"
	}

	//routine behaviors
	Routine.Model = function(obj){
		this.Object = obj;
		
		this.get = function(field){
		    return this.Object[field];
		}
		
		this.set = function(field, value){
		    this.Object[field] = value;
		}
		
		this.parseToObject = function(){
		    return this.Object;
		}
		
		this.showJson = function(){
		    return JSON.stringify(this.Object);
		}
	
		this.getDefault = function(){
			return function(){};
		}		
	}

	Routine.Factory = function(obj){		
		this.save = function (key, value) {
		    if (this.supportsLocalStorage()) {
		        localStorage[key] = (typeof value == 'object') ? JSON.stringify(value) : value;
		    }
		    else {
		        throw new Error("Storage not supported in browser");
		    }
		}
		
		this.show = function (key) {
		    try {
		        return JSON.parse(localStorage[key]);
		    }
		    catch (e) {
		        return localStorage[key];
		    }
		}
		
		this.supportsStorage = function () {
		    try {}	
		    catch (e) {
		        return 'localStorage' in window && window['localStorage'] !== null;
		    }
		    return false;            
		}
	}
	
	Routine.Utilities = function(obj){
		this.Object = obj;
		
		this.showMessage = function(){
			return "test";
		}
		
		this.queryString = function(){		
			var name = arguments[0];
			name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + name + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(window.location.href);
			
			if (results == null)
				return "";
			else
				return results[1];		
		}
		
		this.appendString = function(){
			for (var i = 1; i < arguments.length; i++) {
				var exp = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
				arguments[0] = arguments[0].replace(exp, arguments[i]);
			}
			
			return arguments[0];
		}
		
		this.escapeHtml = function(param){
			return string.replace(/&(?!\w+;)/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;');
		}
	}

	Routine.Sync = function (obj) {
	  if (obj != undefined && obj != null) {
	      var type = obj.method;
	      var contentType = (obj.dataType == Routine.DataType.Json) ? "application/json" : "";
	      var param = (obj.method == Routine.CallType.Create ||
					obj.method == Routine.CallType.Update) ? JSON.stringify(obj.model) : obj.model;			
	
	      var params = {
	          url: obj.url,
	          type: type,
	          data: param,
	          async: true,
	          success: obj.success,
	          error: obj.error
	      }
	      
	      if(obj.timeout > 0){
			window.setTimeout(function(){ $.ajax(params); }, obj.timeout);
		}
		else{
			$.ajax(params);
		}
	  }
	}
	
	Routine.List = function () {
		this.ObjectList = [];
		
		this.add = function (param) {
		    this.ObjectList.push(param);
		}
		
		this.remove = function (param) {
		    for (var i = 0; i < this.ObjectList.length; i++) {
		        if (this.compare(this.ObjectList[i], param)) {
		            this.ObjectList.splice(i, 1);
		        }
		    }
		}
		
		this.contains = function (param) {
		    var output = false;
		    for (var i = 0; i < this.ObjectList.length; i++) {
		        if (typeof this.ObjectList[i] != 'object') {
		            if (this.ObjectList[i] == param) {
		                output = true;
		            }
		        }
		        else {
		            if (this.compare(this.ObjectList[i], param)) {
		                output = true;
		            }
		        }
		    }
		
		    return output;
		}
		
		this.each = function () {
		    return JSON.stringify(this.ObjectList);
		}
		
		this.pluck = function (param) {
		    return this.ObjectList[param];
		}
		
		this.count = function () {
		    return this.ObjectList.length;
		}
		
		this.fetch = function () {
		    return this.ObjectList;
		}
		
		this.compare = function (obj1, obj2) {
		    for (var i in obj1) {
		        if (obj1.hasOwnProperty(i)) {
		            if (!obj2.hasOwnProperty(i)) {
		                return false;
		            }
		            if (obj1[i] != obj2[i]) {
		                return false;
		            }
		        }
		    }
		
		    for (var i in obj2) {
		        if (obj2.hasOwnProperty(i)) {
		            if (!obj1.hasOwnProperty(i)) {
		                return false;
		            }
		            if (obj1[i] != obj2[i]) {
		                return false;
		            }
		        }
		    }
		    return true;
		}
	}

	//construct routine
	var getInstance = function(protoProperty, classProperty){
		var child = inherits(this, protoProperty, classProperty);
		var instance = new child();		
		
		this.call(instance, protoProperty);
		return instance;
	}	
	
	inherits = function (childConstructor, parentConstructor) {
	  function tempConstructor() { };
	  tempConstructor.prototype = parentConstructor.prototype;
	  childConstructor.superClass_ = parentConstructor.prototype;
	  childConstructor.prototype = new tempConstructor();
	  childConstructor.prototype.constructor = childConstructor;
	
	  return childConstructor;
	}
    
	Routine.Utilities.extend = Routine.Model.extend 
		= Routine.List.extend = Routine.Sync.extend 
		= Routine.Factory.extend = getInstance;    
}).call(this);