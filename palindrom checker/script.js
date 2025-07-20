const textInput = document.getElementById("text-input");
const checkBtn = document.getElementById("check-btn");
const resultDiv = document.getElementById("result");

function cleanText(str) {
  return str.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
}

function isPalindrome(str) {
  const cleaned = cleanText(str);
  return cleaned === cleaned.split("").reverse().join("");
}

checkBtn.addEventListener("click", () => {
  const inputValue = textInput.value;

  if (!inputValue.trim()) {
    alert("Please input a value.");
    return;
  }

  const palindromeCheck = isPalindrome(inputValue);
  if (palindromeCheck) {
    resultDiv.innerText = `${inputValue} is a palindrome.`;
  } else {
    resultDiv.innerText = `${inputValue} is not a palindrome.`;
  }
});
