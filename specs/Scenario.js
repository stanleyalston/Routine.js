describe("Model Controller", function(){
	it("can get object property", function(){
		var model = Routine.Model.extend({
			name: "john",
			age: 45
		});
		expect(model.get("name")).toBe("john");
	});	
});

describe("Model Controller", function(){
	it("can simulate fake model", function(){
		var fakeModel = Routine.Model.extend({
			name: "john",
			age: 45,
		});			
		
		var pluckedModel = fakeModel.pluck();		
		var mockClass = fakeModel.tap();
		
		console.log(String);
		console.log(fakeModel);
		console.log(pluckedModel);
		
		console.log(fakeModel.age);
		console.log(mockClass);
		
		if(!mockClass.helloSomeone){
			mockClass.helloSomeone = function(name){
				return "Hello " + name;
			}
		}	
		
		expect(mockClass.helloSomeone("toy")).toBe("hello toy2");
		
		// spyOn(fakeModel, "sayHello");
		// fakeModel.helloSomeone("world");
		// expect(fakeModel.sayHello).toHaveBeenCalled();
	});
});

describe("List Controller", function(){
	it("can make list", function(){
		var list = Routine.List.extend({});
		list.add(Routine.Model.extend({ name: "test", age: 25 }));
		list.add(Routine.Model.extend({ name: "jake", age: 26 }));
		console.log(list.each());    
		console.log(list.count());
	});
});
