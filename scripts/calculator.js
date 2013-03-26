(function() {"use strict";
    var com = {};
    com.widgets = {};
    com.widgets.Utils = {
        // Define reusable helper methods
    };
    com.widgets.UI = {
        operators : {
            "add" : '+',
            "sub" : ' -',
            "multiply" : '*',
            "divide" : "/",
            "modulo" : '%',
            'clear' : 'c',
            'equal' : '=',
            'space'   : '<-'
        },
        MIN_VAL : 0,
        MAX_VAL : 9,
        targetElement : null,
        init : function(options) {
            var count, form, docFragObj,breakLine=0;
            this.targetElement = options.targetElement || document.body;
            docFragObj = document.createDocumentFragment();
            form = this.createElement('form', {
                'name' : 'calculator',
                'id' : 'calculator'
            });
            docFragObj.appendChild(this.createElement("input", {
                "name" : 'result',
                "id" : 'result',
                "value" : 0,
                "type" : 'text'
            }));
            docFragObj.appendChild(this.createElement("br"));
            docFragObj.appendChild(this.createElement("br"));
            for (count = this.MIN_VAL; count <= this.MAX_VAL; breakLine = count,count = count + 1) {
                docFragObj.appendChild(this.createElement("input", {
                    "name" : 'num_' + count,
                    "id" : 'num_' + count,
                    "value" : count,
                    "type" : 'button'
                }));                
                
                if (breakLine % 3 === 1 ) {                    
                        docFragObj.appendChild(this.createElement("br"));
                }
            }
            breakLine = 1;
            for (count in this.operators) {
                docFragObj.appendChild(this.createElement("input", {
                    "name" : count,
                    "id" : count,
                    "value" : this.operators[count],
                    "type" : 'button'
                }));
                breakLine = breakLine + 1;
                if (breakLine % 3 === 0) {
                     docFragObj.appendChild(this.createElement("br"));
                }
            }
            form.appendChild(docFragObj);
            this.targetElement.insertBefore(form, this.targetElement.lastChild);
        },
        createElement : function(htmlTag, attributes) {
            var elVar, ind;
            elVar = document.createElement(htmlTag);
            if(attributes) {
                for (ind in attributes) {
                    elVar[ind] = attributes[ind];
                }
            }
            return elVar;
        }        
       
    };
    com.widgets.Events = {
        handleEvent : function(e) {
            var el = e.srcElement || e.target, result, previousChar,previousOperator,inputValue;
            result = document.getElementById('result');
            previousChar = result.value.charAt(result.value.length - 1);
            previousOperator = result.value.charAt(result.value.length - 2);
            if (el && el.type === "button" && el.value.match(/\d/)) {
                if (result.value.match(/^0/)) {
                    result.value = el.value;
                } else {
                    result.value += el.value;
                }
            }
            
           if (el && el.value && el.value.match(/[+*-/%]/)) {
                if (el.value !== previousChar && previousChar.match(/[^+*-/%]/)) {
                    result.value += el.value;                    
                }
                
                if(el.value.match(/[+*-/%]/) && previousOperator.match(/[+*-/%]/)){
                    com.widgets.calculations.compute();
                }
            }
           
            if (el.value === 'c') {
                result.value = 0;
            }
            if (el.value === '=') {
                com.widgets.calculations.compute('eq');
            }
            if (el.value === '<-') {
                inputValue = result.value.slice(0,-1);
                if (isNaN(inputValue)) {
                    result.value = result.value.slice(0,-3);
                }
                else {
                   result.value = result.value.slice(0,-1);
                }
                //result.value = result.value.slice(0,-1);
            }
        },
        initEvent : function() {
            var element = document.getElementById('calculator');
            if (window.attachEvent) {
                element.attachEvent("click", this.handleEvent);
            } else {
                element.addEventListener("click", this.handleEvent, false);
            }
        }
        
    };
    
    com.widgets.calculations = {

    '+':function (a, b) {
        return a + b;
    },

    '-':function (a, b) {
        return a - b;
    },

    '*':function (a, b) {
        return a * b;
    },

    '/':function (a, b) {
        return a / b;
    },

    '%':function (a, b) {
        return a % b;
    },
    
    getOperator:function (input) {
        var inputOperators = '', operatorsString = "+-*/%",i,array;
        array = input.split('');

        for ( i in array) {
            if (operatorsString.search("\\" + array[i]) !== -1) {
                inputOperators += array[i];
            }
        }
        return inputOperators;

    },

    validateExpression:function (expression) {

        if ((this.getOperator(expression)).length > 1) {
            return false;
        }
        return true;

    },

    evaluate:function (expression) {
        var inputOperator,inputs;
        inputOperator = this.getOperator(expression);
        inputs = expression.split(inputOperator);
        return this[inputOperator](parseInt(inputs[0], 10), parseInt(inputs[1], 10));
    },

    compute:function (st) {
        var inputElement,lastOperator='',expression;
        inputElement = document.getElementById('result');
        if (st === 'eq') {
            expression = inputElement.value;
        } 
        else {
            expression = inputElement.value.slice(0,-1);
            lastOperator = inputElement.value.charAt(inputElement.value.length-1);
        }            
        if (!this.validateExpression(expression)) {
            inputElement.value = "Malformed expression";
            return;
        }
        
        inputElement.value = this.evaluate(expression)+lastOperator;
    }
};
    com.widgets.Calculator = {
        init : function() {
            var widget;
            widget = document.querySelector('#calculatorWidget'); 
            com.widgets.UI.init({targetElement : widget});
            com.widgets.Events.initEvent();
        }
    };
    com.widgets.Calculator.init();
})();
