/*
git remote add origin https://github.com/hollowdoor/auger.git
git push -u origin master
*/
module.exports = function(rl){
    return new Auger(rl);
};
/*
Setup readline in the parent file.
var auger = require('auger');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
Pass readline to the auger constructor.
var aug = auger(rl);
aug.ask('How about this?').then(function(){});
*/
function Auger(rl, options){
    options = options || {};
    this.rl = rl;
    this.translate = typeof options.translate === 'boolean' ? options.translate : true;
}

Auger.prototype.ask = function(question){
    var self = this;
    return new Promise(function(resolve, reject){
        self.rl.question(question, function(answer){

            if(self.translate){
                if(typeof self.translate === 'function'){
                    answer = self.translate(answer);
                }else{
                    answer = translateValue(answer);
                }
            }
            resolve(answer);
        });
    });
};

['close', 'pause', 'prompt', 'setPrompt', 'resume', 'write', 'on'].forEach(function(name){
    Auger.prototype[name] = (function(name){
        return function(){
            if(!this.rl[name]) return;
            this.rl[name].apply(this.rl, arguments);
        };
    }(name));
});



function translateValue(value){
    var temp;
    if(typeof value === 'string'){
        if(value === ''){
            return '';
        }else if(!isNaN(value)){
            return Number(value);
        }else if(value === 'y' || value === 'true'){
            return true;
        }else if(value === 'n' || value === 'false'){
            return false;
        }

        temp = value.split(',');
        if(typeof temp !== 'string' && temp.length > 1){
            for(var i=0; i<temp.length; i++){
                temp[i] = translateValue(temp[i].trim());
            }
            return temp;
        }
    }

    return value;
}

Auger.isType = function(value, type){
    return Object(value) instanceof type;
};
