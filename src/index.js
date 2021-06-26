const {LocalStorage} = require('node-localstorage');
const express = require('express');
const app = express();
const chalk = require('chalk');

class database {
	constructor(route){
		this.route = route;
		this.local = new LocalStorage(this.route ? this.route : './')
		this.data = {
			name: "database.fd",
			route: route ? route : './',
			files: this.local._keys
		}
	}
	setName(name){
		let data = this.local.getItem(this.data.name);
		if(!data){
			return;
		}else {
			let db = this.local.setItem(this.data.name, data);
		}
		this.name = name ? name : "database.fd";
		return this.data.name;
	}
	set(data){
		this.local.setItem(this.data.name, JSON.stringify(data));
		return JSON.parse(this.local.getItem(this.data.name));
	}
	start(){
		let data = this.local.getItem(this.data.name);
		if(!data){
			return [];
		}else {
			return JSON.parse(this.local.getItem(this.data.name));
		}
	}
	logs(){
		let logsname = "logs.fd";
		let logs = this.local.getItem(logsname);
		if(!logs){
			this.local.setItem(logsname, JSON.stringify([]))
			return JSON.parse(this.local.getItem(logsname));
		}else {
			return JSON.parse(this.local.getItem(logsname));
		}
	}
	server(port){
		let realport = port ? port : 9000;
		app.get('/', (req, res) => {
			res.send({
				description: "here is your database", 
				database: this.start(), 
				extra: "You can use this routes for your database and logs: ",
				route_database: "/database",
				route_logs: "/logs"
			})
		})
		app.get('/database', (req, res) => {
			res.send(this.start());
		})
		app.get('/logs', (req, res) => {
			res.send(this.logs())
		})

		app.listen(realport, () => {
			console.log(chalk.blue(`[Server] this server is on port ${realport}`));
		})
	}
}