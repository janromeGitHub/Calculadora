var calculadora = {
  numero1:'',
  numero2:'',
  operacion:'',
  resultado:'',
  estado:0, //0-inicial, 1-primer numero, 2-operación, 3-segudo numero, 4-igual
  CONST_LOG: true,//true: muestra en la consola los valores
  seguimientoCalculadora: function(parm){
    if(parm.verLog){
      console.clear();
      console.log('valor[estado]: ' + calculadora.estado);
      console.log('valor[operacion]: ' + calculadora.operacion);
      console.log('valor[numero1]: ' + calculadora.numero1);
      console.log('valor[numero2]: ' + calculadora.numero2);
      console.log('valor[resultado]: ' + calculadora.resultado);
    }
  },
  borrar: function(){
    calculadora.numero1 = '0', calculadora.numero2 = '',
    calculadora.operacion = '', calculadora.resultado = '',
    calculadora.estado = 0;
    calculadora.muestraValor({display:calculadora.numero1});
  },
  suma: function(parm) {
    return parm.num1 + parm.num2;
  },
  resta:function(parm) {
    return parm.num1 - parm.num2;
  },
    multiplicacion: function(parm) {
    return parm.num1 * parm.num2;
  },
  division: function(parm) {
    if (parm.num2 == 0) {
      return 'ERROR';
    }
    return parm.num1 / parm.num2
  },
  raiz: function(parm){
    return Math.sqrt(parm.num)
  },
  signo: function(parm) {
    if(parm.numero == '0' || calculadora.estado == '0'){
      return '0';
    }
    if(parm.numero == '') {
      return '';
    }
    if(parm.numero.indexOf('-') != -1){
      return parm.numero.replace('-','');
    }
    return '-'.concat(parm.numero);
  },
  esNumero: function(parm) {
    if (!isNaN(parm.valor) || parm.valor.toLowerCase() == 'punto'){
      return true;
    }
    return false;
  },
  muestraValor: function(parm) {
    document.getElementById('display').innerHTML = parm.display;
  },
  validaPunto: function(parm) {
    if(parm.variable.indexOf('.') == -1
            && parm.digito.toLowerCase() == 'punto'){
      return true;
    }
    return false;
  },
  validaNumero: function(parm) {
    if(parm.variable.length < 8 ||
      (parm.variable.indexOf('-') != -1 && parm.variable.length < 9)){
        if(calculadora.estado == 0){
          if(calculadora.validaPunto(parm)){
            parm.variable = parm.variable.concat('.');
            calculadora.estado++;
          }else if(parm.digito != parm.variable){
            parm.variable = parm.digito;
            calculadora.estado++;
          }else{
            calculadora.estado++;
          }
        }else if(calculadora.validaPunto(parm)){
          if(parm.variable.length == 0 || parm.variable == '-'){
            parm.variable = parm.variable.concat('0.');
          }else{
            parm.variable = parm.variable.concat('.');
          }
        }else if(!isNaN(parm.digito)) {
          if(parm.variable != '0'){
            if(parm.variable != '-0'){
                parm.variable = parm.variable.concat(parm.digito);
            }
          }else{
            parm.variable = parm.digito;
          }
        }
        if (calculadora.estado == 2){
          calculadora.estado++;
        }
    }
    return parm.variable;
  },
  guardaNumero: function(parm) {
    switch(calculadora.estado){
      case 0:
      case 1:
        calculadora.numero1 = calculadora.validaNumero({
          variable: calculadora.numero1,
          digito: parm.numero
        });
        calculadora.muestraValor({display:calculadora.numero1});
        break;
      case 2:
      case 3:
        calculadora.numero2 = calculadora.validaNumero({
          variable: calculadora.numero2,
          digito: parm.numero
        });
        calculadora.muestraValor({display:calculadora.numero2});
        break;
      case 4:
        calculadora.borrar();
        calculadora.numero1 = calculadora.validaNumero({
          variable: calculadora.numero1,
          digito: parm.numero
        });
        calculadora.muestraValor({display:calculadora.numero1});
        break;
    }
  },
  truncaNumero: function(parm) {
    var strNum = parm.numero.toString();
    if(strNum.indexOf('-') != -1){
      return strNum.substring(0,9);
    }
    return strNum.substring(0,8);
  },
  realizaOperacion: function(parm) {
    var valOper = 0;
    var valNum1 = Number(parm.num1);
    var valNum2 = Number(parm.num2);
    switch(parm.signo){
      case 'raiz':
        valOper = calculadora.raiz({num: valNum1});
        break;
      case 'dividido':
        valOper = calculadora.division({num1: valNum1, num2: valNum2});
        break;
      case 'por':
        valOper = calculadora.multiplicacion({num1: valNum1, num2: valNum2});
        break;
      case 'menos':
        valOper = calculadora.resta({num1: valNum1, num2: valNum2});
        break;
      case 'mas':
        valOper = calculadora.suma({num1: valNum1, num2: valNum2});
        break;
    }
    return calculadora.truncaNumero({numero: valOper});
  },
  validaOperacion: function(parm) {
    switch(parm.operacion){
      case 'sign':
        if(calculadora.estado==0 || calculadora.estado == 1){
          calculadora.numero1 = calculadora.signo({numero:calculadora.numero1});
          calculadora.muestraValor({display:calculadora.numero1});
        }else if(calculadora.estado != 4){
          calculadora.numero2 = calculadora.signo({numero:calculadora.numero2});
          calculadora.muestraValor({display:calculadora.numero2});
        }
        break;
      case 'on':
        calculadora.borrar();
        break;
      case 'igual':
        switch(calculadora.estado){
          case 0:
          case 1:
          case 2:
            calculadora.resultado = calculadora.numero1;
            calculadora.numero1 = '0';
            calculadora.operacion = '';
            calculadora.estado = 0;
          break;
          case 3:
            calculadora.resultado = calculadora.realizaOperacion({
              signo: calculadora.operacion,
              num1: calculadora.numero1,
              num2:calculadora.numero2
            });
            calculadora.estado++;
            break;
          default:
            calculadora.resultado = calculadora.realizaOperacion({
              signo: calculadora.operacion,
              num1: calculadora.resultado,
              num2:calculadora.numero2
            });
            break;
        }
        calculadora.muestraValor({display:calculadora.resultado});
        break;
      case 'por':
      case 'mas':
      case 'menos':
      case 'dividido':
        if(calculadora.estado > 0 && calculadora.estado < 3){
          if(calculadora.estado == 1){
            calculadora.estado++;
          }
          calculadora.operacion = parm.operacion;
          calculadora.muestraValor({display:calculadora.numero2});
        }else if(calculadora.estado > 0 && calculadora.estado != 4){
          calculadora.numero1 = calculadora.realizaOperacion({
            signo: calculadora.operacion,
            num1: calculadora.numero1,
            num2:calculadora.numero2
          });
          calculadora.numero2 = '';
          calculadora.operacion = parm.operacion;
          calculadora.muestraValor({display:calculadora.numero2});
        }
        break;
    }
  },
  teclaValor: function(parm) {
    if (calculadora.esNumero({valor: parm.tecla.id})) {
      if(calculadora.estado == 2){
        calculadora.estado++;
      }
      calculadora.guardaNumero({numero: parm.tecla.id});
    } else {
      calculadora.validaOperacion({operacion: parm.tecla.id});
    }
    calculadora.seguimientoCalculadora({verLog: true});
  },
  agregaEvento: function() {
    var style = document.createElement('style');
    var clases = '.teclado img:active { width: 20% !important; height: 60.91px !important; }';
    var teclas = document.getElementsByClassName('tecla');
    clases += '.teclado .row .col1 img:active { width: 27% !important; height: 60.91px !important; }';
    clases += '#mas:active { width: 88% !important; height: 98% !important; }';
    style.type = 'text/css';
    style.innerHTML = clases;
    for (i = 0; i < teclas.length; i++) {
      teclas[i].addEventListener('click', function(e) {
        calculadora.teclaValor({event:e, tecla:this});
      });
    }
    document.getElementsByTagName('head')[0].appendChild(style);
  },
  inicia:function(){
    calculadora.borrar();
    calculadora.agregaEvento();
    calculadora.seguimientoCalculadora({verLog: calculadora.CONST_LOG});
  }
}
//Inicializa el objeto y funciones.
calculadora.inicia();
