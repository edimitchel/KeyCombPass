'use strict';

function KeyCombPass(_type, _context) {
	KeyCombPass.prototype.setTimeBetween = function(time) {
		this.timeBetween = parseInt(time);
	}

	KeyCombPass.prototype.addPass = function(_pass, _func, _once, _preventDefault) {
		this.PassCode.push({
			'pass'   : _pass,
			'handler': _func,
			'once'	 : typeof _once != "undefined" ? _once : true,
			'pvtDef' : typeof _preventDefault != "undefined" ? _preventDefault : false
		});
	};

	KeyCombPass.prototype.removePass = function(_pass) {
		this.PassCode = this.PassCode.filter(function(passCode){
			return passCode.pass !== _pass;
		});
	};

	KeyCombPass.prototype.keyDown = function(evt) {
		var character = String.fromCharCode(evt.which);
		var shifton = false;
		if (character.toUpperCase() === character 
			&& character.toLowerCase() !== character 
			&& !evt.shiftKey)
			character.toLowerCase();

		if(character !== '') {
			that.temp = (that.temp === false 
				&& typeof that.temp !== "string") 
					? that.temp = character 
					: that.temp+character;
			that.testKeyPass();
			that.setTimeout();
			if(that.pvtDef === true)
				evt.preventDefault();
		}
		return;
	};

	KeyCombPass.prototype.setTimeout = function(){
		if(this.tempo !== false)
			clearTimeout(this.tempo);

		this.tempo = setTimeout(function(){
			that.clearTemp();
		},this.timeBetween);
	}

	KeyCombPass.prototype.clearTemp = function(){
		this.temp = false;
		this.count++;
		this.countLetter = 0;
	}

	KeyCombPass.prototype.testKeyPass = function(){
		var val = this.validate();
		this.countLetter++;
		if(val === true || val === -1) {
			var ind = this.contains(this.temp);
			if(ind >= 0) {
				this.PassCode[ind].handler();
				if(this.PassCode[ind].once === true)
					this.removePass(this.PassCode[ind].pass);
				this.clearTemp();
			}
		}
	}

	KeyCombPass.prototype.contains = function(obj) {
	    for (var i = 0; i < this.PassCode.length; i++)
	        if (this.PassCode[i].pass == obj)
	            return i;
	    return -1;
	}

	/** Uniq Id **/

	KeyCombPass.prototype.generateUniqId = function(){
		var numBegin = 48, upCharBegin = 65, loCharBegin = 97;
		var date = new Date().getTime().toString(), uid = '';
		for(var i in date) {
			var c = date[i];
			var cp = parseInt(parseInt(c)+Math.random()*(61-parseInt(c)));
			// Lower character (+97)
			if(cp < 26) cp += loCharBegin;
			// Upper character (cp-26 + 65)
			else if(cp < 52) cp += -26 + upCharBegin;
			// Number ( cp-36 + 48)
			else cp += -52 + numBegin;
			uid += String.fromCharCode(cp);
		}
		return uid;
	}

	KeyCombPass.prototype.getUniqId = function(){
		return this.uniqId;
	}

	KeyCombPass.prototype.getStoreUniqId = function(){
		var name = this.cookieName+"=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++)
		{
			var c = ca[i].trim();
			if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return false;
	}

	KeyCombPass.prototype.setUniqId = function(uid){
		this.uniqId = uid != null ? uid : this.generateUniqId();
	}

	KeyCombPass.prototype.validate = function(){
		var stUid = this.getStoreUniqId();
		if(document.cookie === "")
		{
			if(this.count === 0 && this.countLetter === 1)
				console.warn("Security is not activated.");
			return -1;
		}
		return (stUid !== false && stUid === this.getUniqId())
	}

	if(typeof _type !== 'undefined' && typeof _type !== 'string')
		throw new Error('The type must be a string.');
	if(typeof _context !== 'undefined' && typeof _context !== 'object')
		throw new Error('The context must be a context object.');

	this.cookieName = 'keycombpass';

	this.setUniqId();

	var d = new Date();
	d.setTime(d.getTime()+3600*1000*24);

	document.cookie=this.cookieName+"="+escape(this.getUniqId())+"; expires="+escape(d.toUTCString())+"; path=/";

	KeyCombPass.types = [ 'STRING', 'KEYCODE' ];

	this.PassCode = [];
	this.context = (_context) ? _context : window;
	this.timeBetween = 350;

	this.type = (_type) ? _type.toUpperCase() : KeyCombPass.types[0];

	this.temp = false;
	this.count = 0;
	this.countLetter = 0;
	this.tempo = false;

	var that = this;

	this.context.onkeypress = this.keyDown;
}
