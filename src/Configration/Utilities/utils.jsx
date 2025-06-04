export const numberWithCommas = (x) => {
  return parseFloat(x).toLocaleString("en-IN");
};

export const maskMobileNumber = (number) => {
  return "xxxxx" + number.slice(-5);
};

export const formatString = (input) => {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    let char = input[i];

    if (char !== "" && char !== ".") {
      if (char >= "A" && char <= "Z") {
        char = String.fromCharCode(char.charCodeAt(0) + 32);
      }
      result += char;
    }
  }
  return result;
};

export const formatYear_MonthName = (data) => {
  if (typeof data !== "string" || !/^\d{4}-\d{2}$/.test(data)) {
    return "";
  }
  const [year, month] = data.split("-");
  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) {
    return "";
  }
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${year}-${monthNames[monthIndex]}`;
};
