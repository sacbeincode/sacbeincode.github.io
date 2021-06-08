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
        front1: "Alinea tu teléfono paralelamente a tu ID",
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

 
  sessionStorage.setItem("direccionine",address);   
   if (expirationDate === null || expirationDate === "" || typeof expirationDate === "undefined")
  {
      lexpiro=false;
     // lexpiro= validarexpiracion(expirationDate);
  
   }else
   {
    lexpiro= validarexpiracion(expirationDate);
  }
   
 
  if (!lexpiro)
  {
  
       // sessionStorage.setItem("curp",curp);
        if (curp === null || curp === "" || typeof curp === "undefined")
        {
          container.innerHTML = "<p>Generando CURP con tu informacion de la credencial...<br></br> por favor espere el proceso</p>";  
          //var curpgenerado= await generarCURP('ACLPSL68051909H900','SALVADOR','ACEVEDO','LOPEZ','19/05/1968','H');
           var curpgenerado=  await generarCURP(claveDeElector,nombre,apellidopaterno,apellidomaterno,fechanacimiento,gender); 
           
            container.innerHTML = "<p>curp generado:.</p>"+curpgenerado.curp;
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
        
  
        var curpobtenido= await  PostApiData(Urltosend,sendrawdata,apikeycibanco,session,5000);
      alert(curpobtenido.curp)
         sessionStorage.setItem("curpgenerado",curpobtenido.curp);
        
       // var curpobtenido= await generarCURP(nombre,paterno,materno,fechanacimiento,estadodenacimiento,gender);
        
        return await curpobtenido;
} 

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
//setTimeout(() => resolve(number * 2 + increase), 100))
const dataresponse=  await fetch(url, requestOptions)
  .then(response =>{ return response.json()} )
  .catch(error => container.innerHTML = 'error: ' + error);
  return Promise.resolve(dataresponse);
 
}
}



}

async function StartOnboarding() {
container.innerHTML = '<p  style="color:black;" >Cargando...</p>';
onBoarding = createOnBoarding(); // initialize the instance
await onBoarding.warmup();
session = await createSession();
sessionStorage.clear();
renderFrontTutorial();

   
}
 

StartOnboarding();