var Terminal = function(elem, options){
    var self = {
        autoFocus: true,
        bindClick: true,

        inputClass: 'input',
        outputClass: 'output',

        notFound: 'Command not found',
        css: '* { margin: 0; padding: 0; background: #000; color: #fff; font-family: monospace; }' +
             '.output { max-height: 90%; width: 100%; overflow: auto; }' +
             '.output p + p.cmd { margin-top: 10px; }' +
             '.input { width: 100%; height: 10%; border: 0; outline: none; }',

        output: null,
        input: null,

        commands: {},

        init: function init(elem){
            if(elem){
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = self.css;
                elem.appendChild(style);

                self.output = document.createElement('div');
                self.output.className = self.outputClass;
                elem.appendChild(self.output);

                self.input = document.createElement('input');
                self.input.className = 'input';
                self.input.addEventListener('keyup', self.handleInput);
                elem.appendChild(self.input);

                if(self.bindClick){
                    self.output.addEventListener('click', self.focusInput);
                    elem.addEventListener('click', self.focusInput);
                }

                self.input.addEventListener('keyup', self.handleKeyEvent);

                if(self.autoFocus){
                    self.input.focus();
                }
            }
        },

        appendContent: function appendContent(message, cmd){
            var cssClass = cmd ? 'class="cmd"' : ''
            self.output.innerHTML = self.output.innerHTML + '<p ' + cssClass + '>' + message + '</p>';
            self.output.scrollTop = self.output.clientHeight;
        },

        focusInput: function focusInput(e){
            e.preventDefault();
            self.input.focus();
        },

        handleKeyEvent: function handleKeyEvent(e){
            e.preventDefault();
            if(e.keyCode != 13){
                return;
            }

            var cmdString = e.target.value;
            if(cmdString){
                self.runCommand(cmdString);
                self.input.value = '';
            }
        },

        runCommand: function runCommand(cmdString){
            self.appendContent(cmdString, true);

            var cmdArguments = cmdString.split(' '),
            cmd = self.commands ? self.commands[cmdArguments.shift()] : null,
            output = self.notFound;

            if(cmd){
                output = cmd.apply(self, cmdArguments);
            }

            self.appendContent(output);
        }
    };

    if(options){
        for(var key in options){
            self[key] = options[key];
        }
    }

    self.init(elem);

    return self;
};
