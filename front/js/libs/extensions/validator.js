import { Validator } from "vee-validate";

function form_isCNPJ_Num(cnpj) {
  if (cnpj == null) {
    return false;
  }
  if (cnpj == undefined) {
    return false;
  }
  if (cnpj == "") {
    return false;
  }
  var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
  if (cnpj.length != 14) {
    return false;
  }
  digitos_iguais = true;
  for (i = 0; i < cnpj.length - 1; i++) {
    if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
      digitos_iguais = false;
      break;
    }
  }
  if (digitos_iguais) {
    return false;
  }
  tamanho = cnpj.length - 2;
  numeros = cnpj.substring(0, tamanho);
  digitos = cnpj.substring(tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) {
    return false;
  }
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) {
    return false;
  }
  return true;
}

function form_isCNPJ(cnpj) {
  if (cnpj == null) {
    return false;
  }
  if (cnpj == undefined) {
    return false;
  }
  if (cnpj == "") {
    return false;
  }
  if (cnpj.length != 18) {
    return false;
  }
  var regex = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;
  if (!regex.test(cnpj)) {
    return false;
  }
  regex = /[\.\-\/]/g; //eslint-disable-line no-useless-escape
  return form_isCNPJ_Num(cnpj.replace(regex, ""));
}

function form_isCPF_Num(cpf) {
  if (cpf == null) {
    return false;
  }
  if (cpf == undefined) {
    return false;
  }
  if (cpf == "") {
    return false;
  }
  if (
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  ) {
    return false;
  }
  var add = 0;
  var i;
  var rev;
  for (i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }
  if (rev != parseInt(cpf.charAt(9))) {
    return false;
  }
  add = 0;
  for (i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }
  if (rev != parseInt(cpf.charAt(10))) {
    return false;
  }
  return true;
}

function form_isCPF(cpf) {
  if (cpf == null) {
    return false;
  }
  if (cpf == undefined) {
    return false;
  }
  if (cpf == "") {
    return false;
  }
  if (cpf.length != 14) {
    return false;
  }
  var regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/g; //eslint-disable-line no-useless-escape
  if (!regex.test(cpf)) {
    return false;
  }
  regex = /[.-]/g;
  return form_isCPF_Num(cpf.replace(regex, ""));
}

function form_isCPFCNPJ(str) {
  if (form_isCNPJ(str)) {
    return true;
  }
  return form_isCPF(str);
}

function form_isCPFCNPJ_Num(str) {
  if (form_isCNPJ_Num(str)) {
    return true;
  }
  return form_isCPF_Num(str);
}

export default {
  initialize() {
    Validator.extend("cpf", {
      getMessage: (field) => "Digite um CPF válido",
      validate: form_isCPF,
    });

    Validator.extend("cpf-num", {
      getMessage: (field) => "Digite um CPF válido",
      validate: form_isCPF_Num,
    });

    Validator.extend("cnpj", {
      getMessage: (field) => "Digite um CNPJ válido",
      validate: form_isCNPJ,
    });

    Validator.extend("cnpj-num", {
      getMessage: (field) => "Digite um CNPJ válido",
      validate: form_isCNPJ_Num,
    });

    Validator.extend("cpfcnpj", {
      getMessage: (field) => "Digite um CPF ou CNPJ válido",
      validate: form_isCPFCNPJ,
    });

    Validator.extend("cpfcnpj-num", {
      getMessage: (field) => "Digite um CPF ou CNPJ válido",
      validate: form_isCPFCNPJ_Num,
    });
  },
  form_isCNPJ: form_isCNPJ,
  form_isCNPJ_Num: form_isCNPJ_Num,
  form_isCPF: form_isCPF,
  form_isCPF_Num: form_isCPF_Num,
  form_isCPFCNPJ: form_isCPFCNPJ,
  form_isCPFCNPJ_Num: form_isCPFCNPJ_Num,
};
