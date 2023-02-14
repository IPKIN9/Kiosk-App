export default {
  rupiahValue(number) {
    let rupiah = "";
    let numberrev = number.toString().split("").reverse().join("");
    for (let i = 0; i < numberrev.length; i++) if (i % 3 == 0) rupiah += numberrev.substr(i, 3) + ".";
    return rupiah.split("", rupiah.length - 1).reverse().join("");
  },
  unformat(number){
    let rupiah = "";
    let numberrev = number.toString().split("").reverse().join("");
    for (let i = 0; i < numberrev.length; i++) if (i % 3 == 0) rupiah += numberrev.substr(i, 3) + ".";
    rupiah = rupiah.split("", rupiah.length - 1).reverse().join("");
    return parseInt(rupiah.split(".").join(""));
  }
};