function contains(a, obj) {
    for (var i = 0; i < a.length; i++)
        if (a[i].pass == obj)
            return i;
    return -1;
}

function KeyCombPass(_type, _context) {
	KeyCombPass.prototype.setTimeBetween = function(time) {
		this.timeBetween = parseInt(time);
	}

	KeyCombPass.prototype.addPass = function(pass,func) {
		this.PassCode.push({
			'pass'   : pass,
			'handler': func
		});
	};

	KeyCombPass.prototype.keyDown = function(evt) {
		var character = String.fromCharCode(evt.which);
		var shifton = false;
		if (character.toUpperCase() === character 
			&& character.toLowerCase() !== character 
			&& !evt.shiftKey)
			character.toLowerCase();

		if(character != '') {
			that.temp = (that.temp === false 
				&& typeof that.temp !== "string") 
					? that.temp = character 
					: that.temp+character;

			that.setTimeout();
		}
	};

	KeyCombPass.prototype.setTimeout = function(){
		if(this.tempo !== false)
			clearTimeout(this.tempo);

		this.tempo = setTimeout(function(){
			that.testKeyPass();
		},this.timeBetween);
	}

	KeyCombPass.prototype.clearTemp = function(){
		this.temp = false;
	}

	KeyCombPass.prototype.testKeyPass = function(){
		if(this.validate()) {
			var ind = contains(this.PassCode,this.temp);
			console.log(this.PassCode[0].pass,this.temp);
			if(ind >= 0)
				this.PassCode[ind].handler();
			else 
				this.clearTemp();
		} else {
			window.close();
		}
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
			else cp += -35 + numBegin;
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
		this.uniqId = uid ? uid : this.getUniqId();
	}

	KeyCombPass.prototype.validate = function(){
		var stUid = this.getStoreUniqId();
		return (stUid !== false && stUid === this.getUniqId())
	}

	if(typeof _context !== 'undefined' && typeof _context !== 'object')
		throw new Error('The context must be a context object.');

	this.cookieName = 'keycombpass';

	this.setUniqId();

	var d = new Date();
	d.setTime(d.getTime()+3600*24*3);

	document.cookie=this.cookieName+"="+this.getUniqId()+"; expires="+d.toGMTString()+"; path=/";

	this.PassCode = [];
	this.context = (_context) ? _context : window;
	this.timeBetween = 350;

	this.temp = false;
	this.tempo = false;

	var that = this;

	this.context.onkeypress = this.keyDown;
}
