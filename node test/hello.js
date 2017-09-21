function hello(name){
	console.log("hello "+ name);
}

// module.exports = hello;
module.exports = {
	hello : hello,
	person : {id:1,age:2}
}

