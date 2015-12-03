auger
=====

Install
-------

`npm install --save auger`

Usage
-----

```javascript
var auger = require('auger'),
    readline = require('readline'),
    fs = require('fs'),
    rl = readline.createInterface(process.stdin, process.stdout),
    aug = auger(rl);

rl.setPrompt('OHAI> ');
rl.prompt();

aug.ask('copy src.js? (y/n) ').then(function(bool){
    if(bool){
        console.log('Copying src.js to dest.js');
        var rs = fs.createReadStream('src.js'),
            ws = fs.createWriteStream('dest.js');

        rs.pipe(ws).on('finish', function(){
            rl.close();
        });
    }
});
```

About
-----

It's pretty self explanatory. Pass an interface of readline to auger, and get an object that has an `ask` method. The `ask` method is almost exactly like `rl.question` except for this difference:

### Normal readline

```javascript
rl.question('question?', function(result){

});
```

### auger readline

```javascript
aug.ask('question?').then(function(result){

});
```

Readline input
--------------

`auger` translates input into it's respective javascript types where it can.

These are the type translations from a string to a javascript primitive:

-	true/true/n/y -> Boolean
-	integers/string -> Number
-	comma seperated list -> Array
-	everything else -> String

Translation
-----------

Call the `auger` function with options:

```javascript
aug = auger(rl, {
    translate: false //No translation.
});
```

```javascript
aug = auger(rl, {
    //Translate with a function.
    translate: function(answer){
        if(answer === 'y'){
            return true;
        }
        return false;
    }
});
```

The `translate` option can be a boolean, or a function. The default is a boolean value of `true`.

If `translate` is a boolean the default transform is used.

If `translate` is a function then that function will be called so you can return an appropriate value on each readline input.

If you want to translate some values, and not others that is fine too.

```javascript
aug1 = auger(rl, {
    translate: false //No translation.
});

aug2 = auger(rl, {
    translate: true //Use translation.
});
```

More than one instance of `auger` is fine because they will all share the same `readline` interface.

Use auger with [penumbra](https://www.npmjs.com/package/penumbra)
-----------------------------------------------------------------

```javascript
var pen = require('penumbra')(),
    auger = require('auger'),
    rl = require('readline').createInterface(process.stdin, process.stdout),
    aug = auger(rl);
    fs = require('vinyl-fs');


pen.task('move', function * (){
    var answer;
    while(true){
        //Keep asking if the input is not a boolean.
        if(typeof (answer = yield aug.ask('Move files? (y/n) ')) === 'boolean'){
            //The answer is boolean.
            break;
        }
    }

    if(!answer){
        return aug.close();
    }
    console.log('moving files');
    yield [
        fs.src(['./*.js']),
        fs.dest('./output')
    ];
    aug.close();
});
```

If you save the file as **move.js** then you'd run the command:

`node move.js move`

Consistency?
------------

`auger` also has all the methods of [readline](https://nodejs.org/api/readline.html#readline_class_interface) interface. There's no requirement to use them. You can still command `readline` from an `rl` instance.

Happy coding!
