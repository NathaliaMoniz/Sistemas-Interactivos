function capitalize(str){
    let capitalizedString = str.charAt(0).capitalize;	
    
    for (let i = 1; i < str.length; i++){
        if (str.charAt(i - 1) == " "){
            capitalizedString += str.charAt(i).toUpperCase(); 
        }
        else{
            capitalizedString += str.charAt(i).toLowerCase();
        }
    }
    return capitalizedString;
  }
    
const capitalized = capitalize("pensar incomoda como andar bajo la lluvia");
console.log(capitalized);