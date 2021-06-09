const container = document.getElementById("maincontainer");
function createOnBoarding() {
  const apiURL = "https://demo-api.incodesmile.com/";
  const apiKey = "8960bab90f04847dcfbc78a01f1c0d15de767f92";
  
  return window.OnBoarding.create({
    apiKey: apiKey,
    apiURL: apiURL,
    lang: "es",
    theme: {
      main: "black",
      mainButton: {
        borderRadius: "20px",
        color: "red",
        border: "4px solid gray"
      }
    },
    translations: {
      tutorial: {
        front1: "Alinea tu teléfono paralelamente a tu ID 0.4",
        front2: "La foto se tomará automáticamente",
        back1: "Now scan the",
        back2: "back side ",
        back3: "of your ID",
        selfie1: "Let's take a selfie",
        selfie2: "Keep a neutral expression, find balanced",
        selfie3: "light and remove any glasses and hats",
        passport1: "Align your passport to the frame and take a photo",
        passport2: "Position just the page with the photo"
      }
    }
  });
}

function createSession() {
  return onBoarding.createSession("ALL");
}
 

async function GetApiData(url,apikey,session)
{
 
var myHeaders = new Headers();
myHeaders.append("api-version", "1.0");
myHeaders.append("x-api-key", apikey);
myHeaders.append("X-Incode-Hardware-Id", session.token);
myHeaders.append("Content-Type", "application/json");
 
 
var requestOptions = {
  method: 'GET',
  headers: myHeaders
};

let dataresponse=fetch(url, requestOptions)
  .then(response => { return response.json()})
  .catch(error => container.innerHTML = 'error: ' + error); 
return await dataresponse;
}
async function getocrdata(){
 
  Urltosend='https://demo-api.incodesmile.com/omni/get/ocr-data';
   var apikeycibanco= '8960bab90f04847dcfbc78a01f1c0d15de767f92'
  var ocrdatos= await GetApiData(Urltosend,apikeycibanco,session);
 
 return await ocrdatos;
} 

function formatdate(datevalue) {
  var date = new Date(datevalue);
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate()+1;
  
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  
  return formattedDate = day + '/' + month + '/' + year
  }
  
function showError() {
  alert("error");
}
 
function renderFrontTutorial() {
  document.body.style.backgroundColor = "white";
  onBoarding.renderFrontTutorial(container, {
    onSuccess: renderFrontIDCamera,
    noWait: true
  });
}
  function renderFrontIDCamera() {
    onBoarding.renderCamera("front", container, {
      onSuccess: (result) => GetIDData(),
      onError: showError,
      token: session,
      numberOfTries: -1,
      noWait: true
    });
  }
  
 async function  GetIDData() {
  container.innerHTML = "<p>Procesando Informacion...</p>";
  var info=await getocrdata();

  var { name,birthDate,gender, curp,address,expirationDate,claveDeElector} = info; 
  var lexpiro=false;
  var nombrecompleto= name.fullName;
  var nombre=name.firstName;
  var apellidopaterno= name.paternalLastName;
  var apellidomaterno= name.maternalLastName;
 
  if (gender=="M")
  gender="H";
  else
  gender="M"

  var fechanacimiento =formatdate(parseInt(birthDate));

 
  
   if (expirationDate === null || expirationDate === "" || typeof expirationDate === "undefined")
  {
      lexpiro=false;
     // lexpiro= validarexpiracion(expirationDate);
  
   }
   else
   {
    lexpiro= validarexpiracion(expirationDate);
  }
   
 
  if (!lexpiro)
  {
  
   // sessionStorage.setItem("curp",curp);
        if (curp === null || curp === "" || typeof curp === "undefined")
        {
          container.innerHTML = "<p>Generando CURP con tu informacion de la credencial...<br></br> por favor espere el proceso</p>";  
         // var curpgenerado= await generarCURP('ACLPSL68051909H900','SALVADOR','ACEVEDO','LOPEZ','19/05/1968','H');
          var curpgenerado=  await generarCURP(claveDeElector,nombre,apellidopaterno,apellidomaterno,fechanacimiento,gender); 
           
            container.innerHTML = "<p>curp generado:.</p>"+curpgenerado.success;
       if (curpgenerado.success)
            {
   
              container.innerHTML = "curp obtenido:"+curpgenerado.curp  ;  
        
             // renderBackIDCamera();   
            }
        else
            {
            sessionStorage.setItem("curpgenerado","no se pudo generar"); 
          } 
        sessionStorage.setItem("curp","Identificacion no tiene curp");  
      }  
  } 
} 

function obtenerentidadfederativa(estado) {
  var StatesCodes = [
    {  "SEPOMEX": 1,    "CURP": "AS",    "Estado": "AGUASCALIENTES"
    },  { "SEPOMEX": 2,   "CURP": "BC",    "Estado": "BAJA CALIFORNIA"
    },  { "SEPOMEX": 3,   "CURP": "BS",    "Estado": "BAJA CALIFORNIA SUR"
    },  {    "SEPOMEX": 4,    "CURP": "CC",    "Estado": "CAMPECHE"
    },  {    "CURP": "CL",    "Estado": "COAHUILA DE ZARAGOZA"
    },  {   "SEPOMEX": 6,    "CURP": "CM",    "Estado": "COLIMA"
    },  {    "SEPOMEX": 7,    "CURP": "CS",    "Estado": "CHIAPAS"
    },  {    "SEPOMEX": 8,    "CURP": "CH",    "Estado": "CHIHUAHUA"
    },  {    "SEPOMEX": 9,    "CURP": "DF",    "Estado": "DISTRITO FEDERAL"
    },  {    "SEPOMEX": 10,    "CURP": "DG",    "Estado": "DURANGO"
    },  {    "SEPOEX": 11,    "CURP": "GT",    "Estado": "GUANAJUATO"
    },  {    "SEPOMEX": 12,    "CURP": "GR",    "Estado": "GUERRERO"
    },  {    "SEPOMEX": 13,    "CURP": "HG",    "Estado": "HIDALGO"
    },  {    "SEPOMEX": 14,    "CURP": "JC",    "Estado": "JALISCO"
    },  {    "SEPOMEX": 15,    "CURP": "MC",    "Estado": "MEXICO"
    },  {    "SEPOMEX": 16,    "CURP": "MN",    "Estado": "MICHOACAN DE OCAMPO"
    },  {    "SEPOMEX": 17,    "CURP": "MS",    "Estado": "MORELOS" 
    },  {    "SEPOMEX": 18,    "CURP": "NT",    "Estado": "NAYARIT"
    },  {    "SEPOMEX": 19,    "CURP": "NL",    "Estado": "NUEVO LEON"
    },  {    "SEPOMEX": 20,    "CURP": "OC",    "Estado": "OAXACA"
    },  {    "SEPOMEX": 21,    "CURP": "PL",    "Estado": "PUEBLA"
    },  {    "SEPOMEX": 22,    "CURP": "QT",    "Estado": "QUERETARO DE ARTEAGA"
    },  {    "SEPOMEX": 23,    "CURP": "QR",    "Estado": "QUINTANA ROO"
    },  {    "SEPOMEX": 24,    "CURP": "SP",    "Estado": "SAN LUIS POTOSI"
    },  {    "SEPOMEX": 25,    "CURP": "SL",    "Estado": "SINALOA"
    },  {    "SEPOMEX": 26,    "CURP": "SR",    "Estado": "SONORA"
    },  {    "SEPOMEX": 27,    "CURP": "TC",    "Estado": "TABASCO"
    },  {    "SEPOMEX": 28,    "CURP": "TS",    "Estado": "TAMAULIPAS"
    },  {    "SEPOMEX": 29,    "CURP": "TL",    "Estado": "TLAXCALA"
    },  {    "SEPOMEX": 30,    "CURP": "VZ",    "Estado": "VERACRUZ"
    },  {    "SEPOMEX": 31,    "CURP": "YN",    "Estado": "YUCATAN"
    },  {    "SEPOMEX": 32,    "CURP": "ZS",    "Estado": "ZACATECAS"
    },  {    "SEPOMEX": null,    "CURP": "NE",    "Estado": "NACIDO EN EL EXTRANJERO"  },
   ];
 
  estadorecibido=validateEstado(estado,StatesCodes)
  return estadorecibido;
}  

function validateEstado(val,code){
  result = false;
  for(let i=0;i<code.length;i++){
      if(val==code[i].SEPOMEX){
          result = code[i].CURP;
          break;
      }
  }
  return result;
}
async function generarCURP(cveelector,nombre,paterno,materno,fechanacimiento,gender){
        var apikeycibanco= '8960bab90f04847dcfbc78a01f1c0d15de767f92'
        var Urltosend='https://demo-api.incodesmile.com/omni/add/curp/v2';
        var codigoestado=  cveelector.substr(12,2);
        var estadodenacimiento= obtenerentidadfederativa(codigoestado);
        sessionStorage.setItem("estadodenacimiento",estadodenacimiento); 
        var sendrawdata = JSON.stringify({
        "name": nombre,
          "firstLastName": paterno,
          "secondLastName": materno,
          "gender": gender,
          "birthDate": fechanacimiento,
          "state": estadodenacimiento
        });
        

        var curpobtenido= await  PostApiData(Urltosend,sendrawdata,apikeycibanco,session,10000);
 /*         sessionStorage.setItem("curpgenerado",curpobtenido.curp);
         alert("generarcurp funcion"+curpobtenido.curp); */
       // var curpobtenido= await generarCURP(nombre,paterno,materno,fechanacimiento,estadodenacimiento,gender);
        
        return await curpobtenido;
} 
 
/* async function PostApiData(url,rawdata,apikey,session,miliseconds)
{
 
var myHeaders = new Headers();
myHeaders.append("api-version", "1.0");
myHeaders.append("x-api-key", apikey);
myHeaders.append("X-Incode-Hardware-Id", session.token);
myHeaders.append("Content-Type", "application/json");
 
 
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: rawdata
};
//setTimeout(() => resolve(number * 2 + increase), 100))
const dataresponse=  await fetch(url, requestOptions)
  .then(response =>{ return response.json()} )
  .catch(error => container.innerHTML = 'error: ' + error);
  return Promise.resolve(dataresponse);
 
}
}

 */

async function PostApiData(url,rawdata,apikey,session,miliseconds)
{
 
var myHeaders = new Headers();
myHeaders.append("api-version", "1.0");
myHeaders.append("x-api-key", apikey);
myHeaders.append("X-Incode-Hardware-Id", session.token);
myHeaders.append("Content-Type", "application/json");
 
 
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: rawdata
};
/* const fetchCourses = async() => {
  const res = await fetch(url, requestOptions);
  const body = await res.json();
  console.log("coursesbody is:", body)
  return body;
};

// here is how you call this function
const data = await fetchCourses();
 return data;
}  */
/* const finalresponse= async()=>{
const dataresponse=  await fetch(url, requestOptions)
  .then(response =>{ return response.json()} )
  .catch(error => container.innerHTML = 'error: ' + error);
} 
};
const data = await finalresponse(); */
//setTimeout(() => resolve(number * 2 + increase), 100))
/* const dataresponse=  await fetch(url, requestOptions)
  .then(response =>{new Promise(resolve => setTimeout(() => resolve(response), 1000))} )
  .catch(error => container.innerHTML = 'error: ' + error);
  alert(dataresponse);
  return dataresponse; */
//   if (miliseconds>0)
//     return new Promise(resolve => setTimeout(() => resolve(dataresponse), miliseconds));
//  else
//     return dataresponse

    const dataresponse=  await fetch(url, requestOptions)
  .then(response =>{ return response.json()} )
  .catch(error => container.innerHTML = 'error: ' + error);
  if (miliseconds>0)
    return new Promise(resolve => setTimeout(() => resolve(dataresponse), miliseconds));
 else
    return dataresponse; 

}  

/* const fetchCourses = async() => {
              const res = await fetch(url, requestOptions);
              const body = await res.json();
              console.log("coursesbody is:", body)
              return body;
            };

            // here is how you call this function
            const data = await fetchCourses(); 
           
            };
 */
 

async function StartOnboarding() {
container.innerHTML = '<p  style="color:black;" >Cargando...</p>';
onBoarding = createOnBoarding(); // initialize the instance
await onBoarding.warmup();
session = await createSession();
sessionStorage.clear();
renderFrontTutorial();
//var curpgenerado= await generarCURP('ACLPSL68051909H900','SALVADOR','ACEVEDO','LOPEZ','19/05/1968','H');
//container.innerHTML = 'se genero'+curpgenerado.curp;
//GetIDData();
  
} 
 

StartOnboarding();