const slider= document.querySelector(".slider-container")
const arrayDeSlides= Array.from(document.querySelectorAll(".slide"))
/* Array.from => crea un array de obj iterables  */
/* PROPIEDADES INICIales  */

let isDragging = false; /* si esta agarrando el slide  */
let startPos=0;         /* posicion antes de agarrar slide */
let currentTranslate=0; /* diferencia de posicion ini y fin  */
let prevTranslate =0;   /*  */
let animationID=0;      /* animacion obtenida por metodo  */
let currentIndex=0;     /* index del slide actual, como es array inicia en 0 */

arrayDeSlides.forEach((slide,index)=>{
    /* sacar efecto por defecto de mover img en navegador 
    const slideImage = slide.querySelectorAll("img")
    slideImage.addEvenListener("dragstart", (e)=> e.preventDefault())
    */

    /* eventos touch  inicio fin y movimiento*/
    slide.addEventListener("touchstar", touchStart(index))
    slide.addEventListener("touchend", touchEnd)
    slide.addEventListener("touchmove", touchMove)

    /* eventos mouse  inicio click, suelta click, sale de ventana y movimiento*/
    slide.addEventListener("mousedown", touchStart(index))
    slide.addEventListener("mouseup", touchEnd)
    slide.addEventListener("mouseleave", touchEnd)
    slide.addEventListener("mousemove", touchMove)
    
})
/*  evita el menu de boton derecho en la pagina*/
window.oncontextmenu = function (event){
    event.preventDefault()
   /* event-stopPropagation() */
    return false;
}

function touchStart(index){
    return function (event){
        currentIndex=index
        startPos=event.type.includes("mouse")? event.pageX : event.touches[0].clientX
        isDragging=true;
        /* obtenemos id de animacion para luego poder 
        cancenlar la animacion con ese ID  */
        animationID = requestAnimationFrame(animation)
        slider.classList.add("grabbing")
    }
}

function animation(){
    setSliderPos()
    if(isDragging){
        requestAnimationFrame(animation)
    }
}

function setSliderPos(){
    /* pasa la cantidad de px que se movio a la animacion translate*/
    slider.style.transform = "translateX("+currentTranslate+"px)"
}

/*
function getPosX(event){
    Ternario que obtiene true, si el evento es disparado por un mouse, 
 o false si es touch... en caulquiera de los casos, obtiene las cordenadas X,
 de donde hizo click o touch 
    event.type.includes("mouse")? event.pageX : event.touches[0].clientX
}*/

function touchEnd(){
    isDragging=false;
    cancelAnimationFrame(animationID)
    slider.classList.remove("grabbing")
    const movedBy=currentTranslate - prevTranslate
    console.log(currentIndex)
    console.log(arrayDeSlides.length-1)
    if(movedBy < -100 && currentIndex < arrayDeSlides.length-1){
        currentIndex+=1;
        console.log("entre a la izqu")
    }
    if (movedBy > 100 && currentIndex>0){
        currentIndex-=1;
        console.log("entre a la der")
    }
    setPosByIndex()
}

function setPosByIndex(){
    /* multiplica el numero de slide actual, por el 
    ancho de la ventana, y luego lo asigna a movimiento actual*/
    currentTranslate = currentIndex * -window.innerWidth

    prevTranslate=currentTranslate
    setSliderPos()
}

function touchMove(event){
    if(isDragging){
        const currentPosition = event.type.includes("mouse")? event.pageX : event.touches[0].clientX
        currentTranslate = prevTranslate + currentPosition - startPos

    }

}