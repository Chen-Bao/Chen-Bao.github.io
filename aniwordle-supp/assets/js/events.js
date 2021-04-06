let frameName
let wordsArray
let numOfFrames
let Frames=[]
let imageSrc=[]
var minX=Number.MAX_VALUE
var minY=Number.MAX_VALUE
var maxX=Number.MIN_VALUE
var maxY=Number.MIN_VALUE

var GIFs
var GIFblock=false

var nowMouseOn=null

var smallAniBlock=false

var globalTransition

let aniTimeOut1
let aniTimeOutSmall
let isGenerate=false
let animationBlock=false

// let frameNameFontSize
let frameNameFontSize=-1
let frameNameFontSize2=50

let globalIndex=0

let clickFrame=0

let forcebool=false
let layoutMode="normal"
let phrasePack=false

let playing=false
let changeInterval=1000

let globalFont="Rubik"

function initDataSVG(){
    d3.selectAll(".item-wrapper").each(function(d,i){
        var thisminX=Number.MAX_VALUE
        var thisminY=Number.MAX_VALUE
        var thismaxX=Number.MIN_VALUE
        var thismaxY=Number.MIN_VALUE
        let thisnumofframe=-1



        let dataname=d3.select(this).attr("data-name")
        let dataFont=d3.select(this).attr("data-font")
        let data=dataJSON[dataname]

        console.log(data)
        if(typeof(data)!="undefined"){
            let thisframename=frameNameJSON[dataname]
            thisnumofframe=thisframename.length

            let thislayoutmode=dataname.split("_")[1]
            let thisforcebool=dataname.split("_")[2]
            let thisphrasepack=dataname.split("_")[3]


            d3.select(this).attr("numOfFrames",thisnumofframe)
            d3.select(this).attr("aniIndex",0)
            d3.select(this).attr("layoutMode",thislayoutmode)
            d3.select(this).attr("forcebool",thisforcebool)
            d3.select(this).attr("phrasePack",thisphrasepack)

            //find the min max x and y axis.
            for(let f=0;f<thisnumofframe;f++){
                for (let i=0;i<data.length;i++){
                    if(data[i].xArray[f]<thisminX){
                        thisminX=data[i].xArray[f]
                    }
                    if(data[i].yArray[f]-data[i].wordRealHeightArray[f]<thisminY){
                        thisminY=data[i].yArray[f]-data[i].wordRealHeightArray[f]
                    }
                    if (data[i].xArray[f]+data[i].widthArray[f]>thismaxX){
                        thismaxX=data[i].xArray[f]+data[i].widthArray[f]
                    }
                    if(data[i].yArray[f]>thismaxY){
                        thismaxY=data[i].yArray[f]
                    }

                }
            }

            //set the viewbox
            if((thisminX<0||thismaxX>333) && !(thisminY<0||thismaxY>233)){
                d3.select(this).select("svg").attr("viewBox",thisminX+" "+0+" "+(thismaxX-thisminX)+" "+233)
                // d3.select("#exportsvg").attr("viewBox",minX+" "+0+" "+(maxX-minX)+" "+700)
            }
            else if((thisminY<0||thismaxY>233) && !(thisminX<0||thismaxX>333)  ){
                d3.select(this).select("svg").attr("viewBox",0+" "+thisminY+" "+333+" "+(thismaxY-thisminY+20))
                // d3.select("#exportsvg").attr("viewBox",0+" "+minY+" "+1000+" "+(maxY-minY+20))
            }
            else if(thisminX<0||thismaxX>333||thisminY<0||thismaxY>233){
                d3.select(this).select("svg").attr("viewBox",thisminX+" "+thisminY+" "+(thismaxX-thisminX)+" "+(thismaxY-thisminY+20))
                // d3.select("#exportsvg").attr("viewBox",minX+" "+minY+" "+(maxX-minX)+" "+(maxY-minY+20))
            }
            else{
                d3.select(this).select("svg").attr("viewBox",0+" "+0+" "+333+" "+233)
            }

            d3.select(this).select("svg").selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .text(function(d){
                    return d.text;
                })
                .attr("style",function(d,i){
                    let styleStr="font-size:"+d.wordHeightArray[0]+"px;font-family:"+dataFont
                    return styleStr;
                })
                .attr("x",function(d,i){
                    return d.centerXArray[0]-d.widthArray[0]/2;
                })
                .attr("y",function(d,i){
                    return d.centerYArray[0]-d.offsetArray[0]+d.wordRealHeightArray[0]/2;
                })
                .attr("fill",function(d,i){
                    return d.color;
                })


        }
    })

    function changeSVG(){
        // smallAniBlock=true
        let el=nowMouseOn
        let thisFont=d3.select(el).attr("data-font")
        let thisIndex=parseInt(d3.select(el).attr("aniIndex"))
        let thisNumOfFrames=parseInt(d3.select(el).attr("numOfFrames"))
        console.log(thisIndex)
        let thisforcebool=d3.select(el).attr("forcebool")
        let thislayoutMode=d3.select(el).attr("layoutMode")
        let thisphrasePack=d3.select(el).attr("phrasePack")

        if(thisforcebool==='true')
            thisforcebool=true
        else
            thisforcebool=false


        if(thisphrasePack==='true')
            thisphrasePack=true
        else
            thisphrasePack=false


        if(thisIndex>=thisNumOfFrames-1||thisIndex==-1){
            console.log("max time!",thisIndex)
            // stopAnimation()
            clearTimeout(aniTimeOutSmall)
            d3.select(el).attr("aniIndex",0)
            // changeThumbBorder()
            d3.select(el).select("svg").selectAll("text")
                .attr("style",function(d,i){
                    let styleStr="font-size:"+d.wordHeightArray[0]+"px;font-family:"+thisFont
                    return styleStr;
                })
                .attr("x",function(d,i){
                    return d.centerXArray[0]-d.widthArray[0]/2;
                })
                .attr("y",function(d,i){
                    return d.centerYArray[0]-d.offsetArray[0]+d.wordRealHeightArray[0]/2;
                })
                .attr("fill",function(d,i){
                    return d.color;
                })

            //timeLine.stopAnimation();
            /*            globalIndex=0
                    changeThumbBorder()
                    switchFrame(0)*/
            // smallAniBlock=false
            return;
        }


        const t=d3.transition()
            .duration(changeInterval)
            .ease(d3.easeCubic)

        globalTransition=t



        if(thisforcebool||thislayoutMode=="nopackage"){

            d3.select(el).selectAll("text")
                .filter(function (d,i) {
                    return d.wordHeightArray[thisIndex]==0&&d.wordHeightArray[thisIndex+1]>0
                })
                .attr("x",function(d,i){
                    if(thisphrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[thisIndex+1]
                    else
                        return d.centerXArray[thisIndex+1]
                })
                .attr("y",function(d,i){
                    if(thisphrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[thisIndex+1]
                    else
                        return d.centerYArray[thisIndex+1]-d.offsetArray[thisIndex+1]
                })
        }

        d3.select(el).selectAll("text")
            .transition(t)
            .attr("x",function(d,i){
                if((thisforcebool||thislayoutMode=="nopackage")&&d.wordHeightArray[thisIndex+1]==0&&d.wordHeightArray[thisIndex]>0){
                    if(thisphrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[thisIndex]
                    else
                        return d.centerXArray[thisIndex]
                }
                return d.centerXArray[thisIndex+1]-d.widthArray[thisIndex+1]/2;
            })
            .attr("y",function(d,i){
                if((thisforcebool||thislayoutMode=="nopackage")&&d.wordHeightArray[thisIndex+1]==0&&d.wordHeightArray[thisIndex]>0){
                    if(thisphrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[thisIndex]
                    else
                        return d.centerYArray[thisIndex]-d.offsetArray[thisIndex]
                }

                return d.centerYArray[thisIndex+1]-d.offsetArray[thisIndex+1]+d.wordRealHeightArray[thisIndex+1]/2;
            })
            .attr("style",function(d,i){
                let styleStr="font-size:"+d.wordHeightArray[thisIndex+1]+"px;font-family:"+thisFont
                return styleStr;
            })
            .attr("fill",function(d,i){
                return d.color
            })
            .on("end",function(){
                // smallAniBlock=false
            })
        aniTimeOutSmall=setTimeout(changeSVG,2000+changeInterval);
        // aniTimeOut2=setTimeout(selected,1000+changeInterval);
        // clearInterval(output)
        thisIndex++;
        d3.select(el).attr("aniIndex",thisIndex)
        // console.log("++")
    }
    d3.selectAll(".item-wrapper").on("mouseenter",function(){
        // d3.event.sourceEvent.stopPropagation()
        if($(this).hasClass("DWC")){
            if(!GIFblock){
                let gifindex=$(this).attr("index")
                gifindex=parseInt(gifindex)
                // console.log(gifindex)
                d3.select(this).select("button").nodes()[0].click()
                // GIFs[gifindex].click()
                GIFblock=true
            }
        }
        else{
            nowMouseOn=this
            // console.log("mouse in!")
            changeSVG()
        }



    })

    d3.selectAll(".item-wrapper").on("mouseleave",function(){
        // d3.event.sourceEvent.stopPropagation()
        // console.log("mouse out!")
        // smallAniBlock=false
        // stopAnimation()
        // changeThumbBorder()

/*
        if(smallAniBlock){
            globalTransition=d3.transition()
                .duration(100)
                .ease(d3.easeCubic)

        }
*/
        if($(this).hasClass("DWC")){
            if(GIFblock){
                let gifindex=$(this).attr("index")
                gifindex=parseInt(gifindex)
                // console.log(gifindex)
                // GIFs[gifindex].click()
                d3.select(this).select("button").nodes()[0].click()
                GIFblock=false
            }
        }

        let thisFont=d3.select(this).attr("data-font")
        let t=d3.transition()
            .duration(100)
            .ease(d3.easeCubic)

        d3.select(nowMouseOn).select("svg").selectAll("text")
            .transition(t)
            .attr("style",function(d,i){
                let styleStr="font-size:"+d.wordHeightArray[0]+"px;font-family:"+thisFont
                return styleStr;
            })
            .attr("x",function(d,i){
                return d.centerXArray[0]-d.widthArray[0]/2;
            })
            .attr("y",function(d,i){
                return d.centerYArray[0]-d.offsetArray[0]+d.wordRealHeightArray[0]/2;
            })
            .attr("fill",function(d,i){
                return d.color;
            })
        clearTimeout(aniTimeOutSmall)
        d3.select(nowMouseOn).attr("aniIndex",0)



    })


}

function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}

function Frame(index,name){
    this.index=index
    this.name=name
    this.image_src=""
}
function stopAnimation(){
    console.log("stop animation!")
    // $("#record_scene_btn").attr("src","./assets/images/playing.png")
    clearTimeout(aniTimeOut1)
    // clearTimeout(aniTimeOut2)
    animationBlock=false
    playing=false
}

function changeThumbBorder(){
    for (let i=0;i<numOfFrames;i++){
        d3.select("#stepper_svg #frame"+i+" rect").style("stroke","rgb(204, 204, 204)")
    }
    if(playing)
        d3.select("#stepper_svg #frame"+(globalIndex+1)+" rect").style("stroke","rgb(255, 0, 0)")
    else
        d3.select("#stepper_svg #frame"+(globalIndex)+" rect").style("stroke","rgb(255, 0, 0)")
}
function switchFrame(index){
    if(animationBlock)
        return

    clickFrame=index
    // globalIndex=index

    stopAnimation()
    drawSingleFrame(index)

    if(playing){
            startAnimation()
    }



}

function nextFrame(isNext){
    stopAnimation()
    if(isNext){
        if(clickFrame==numOfFrames-1){
            clickFrame=0
        }
        else{
            clickFrame++

        }
    }
    else{
        if(clickFrame==0){
            clickFrame=numOfFrames-1
        }
        else{
            clickFrame--
        }
    }
    // clickFrame=globalIndex

    switchFrame(clickFrame)

}

function drawSingleFrame(frameNo){
    var nwidth=maxX-minX
    var nheight=maxY-minY
    var nameX=minX
    var nameY=minY


    var framename=d3.selectAll("#currentname")
        .text(frameName[frameNo])


    /*    var bbox=document.querySelector("#currentname").getBBox();
        //var bbox=framename.node().getBBox();
        var currentwidth=bbox.width;
        var currentheight=bbox.height;
        framename.attr("x",CanvasCenterX-currentwidth/2)
            .attr("y",CanvasCenterY+currentheight/2)*/
    frameNameFontSize=nheight/15
    if((minX<0||maxX>1000) && !(minY<0||maxY>700)){
        frameNameFontSize=nheight/15
        // var dx = (1000 - nwidth / nheight * 700) / 2
        // let newFontSize=nheight/15
        let canvasRealHeight=nheight/nwidth*1000
        let gap=(700-canvasRealHeight)/2
        gap=nwidth/1000*gap
        d3.selectAll("#currentname")
            .attr("x", minX)
            .attr("y", maxY+gap)//+gap
            .style("font-size", frameNameFontSize+"px")
            .style("font-family", globalFont)
        var bbox=document.querySelector("#currentname").getBBox();
        while(bbox.width>nwidth){
            frameNameFontSize-=10
            d3.selectAll("#currentname")
                .style("font-size", frameNameFontSize+"px")
                .style("font-family", globalFont)
            bbox=document.querySelector("#currentname").getBBox();
        }
    }
    else if((minY<0||maxY>700) && !(minX<0||maxX>1000)  ){
        // let newFontSize=nheight/15
        frameNameFontSize=nheight/15
        let canvasRealWidth=nwidth/nheight*700
        let gap=(1000-canvasRealWidth)/2
        gap=nheight/700*gap
        d3.selectAll("#currentname")
            .attr("x", minX-gap)
            .attr("y", maxY-10)
            .style("font-size", frameNameFontSize+"px")
            .style("font-family", globalFont)
        var bbox=document.querySelector("#currentname").getBBox();
        while(bbox.width>1000/700*nheight){
            frameNameFontSize-=10
            d3.selectAll("#currentname")
                .style("font-size", frameNameFontSize+"px")
                .style("font-family", globalFont)
            bbox=document.querySelector("#currentname").getBBox();
        }
    }
    else if((minX<0||maxX>1000)&&(minY<0||maxY>700)){
        frameNameFontSize=nheight/15
        // let newFontSize=nheight/15
        if(1000<nwidth/nheight*700){
            //nwidth变化为1000
            let canvasRealHeight=nheight/nwidth*1000
            let gap=(700-canvasRealHeight)/2
            gap=nwidth/1000*gap
            d3.selectAll("#currentname")
                .attr("x", minX)
                .attr("y", maxY+gap)
                .style("font-size", frameNameFontSize+"px")
                .style("font-family", globalFont)
            var bbox=document.querySelector("#currentname").getBBox();
            while(bbox.width>nwidth){
                frameNameFontSize-=10
                d3.selectAll("#currentname")
                    .style("font-size", frameNameFontSize+"px")
                    .style("font-family", globalFont)
                bbox=document.querySelector("#currentname").getBBox();
            }

        }
        else{
            frameNameFontSize=nheight/15
            let canvasRealWidth=nwidth/nheight*700
            let gap=(1000-canvasRealWidth)/2
            gap=nheight/700*gap
            d3.selectAll("#currentname")
                .attr("x", minX-gap)
                .attr("y", maxY-10)
                .style("font-size", frameNameFontSize+"px")
                .style("font-family", globalFont)
            var bbox=document.querySelector("#currentname").getBBox();
            while(bbox.width>1000/700*nheight){
                frameNameFontSize-=10
                d3.selectAll("#currentname")
                    .style("font-size", frameNameFontSize+"px")
                    .style("font-family", globalFont)
                bbox=document.querySelector("#currentname").getBBox();
            }
        }

    }
    else{
        frameNameFontSize2=50
        d3.selectAll("#currentname")
            .attr("x", 10)
            .attr("y", 690)
            .style("font-size", frameNameFontSize2+"px")
            .style("font-family", globalFont)
        var bbox=document.querySelector("#currentname").getBBox();
        while(bbox.width>1000){
            frameNameFontSize2-=5
            d3.selectAll("#currentname")
                .style("font-size", frameNameFontSize2+"px")
                .style("font-family", globalFont)
            bbox=document.querySelector("#currentname").getBBox();
        }
    }


    d3.selectAll("#word")
        .attr("fill-opacity",1)

    const t=d3.transition()
        .duration(500)
        .ease(d3.easeCubic)

    //change the red rect on the thumbnail

/*    for (let i=0;i<numOfFrames;i++){
        d3.select("#stepper_svg #frame"+i+" rect").style("stroke","rgb(204, 204, 204)")
    }

    d3.select("#stepper_svg #frame"+(frameNo)+" rect").style("stroke","rgb(255, 0, 0)")*/


        if(forcebool||layoutMode=="nopackage"){
            d3.selectAll(".textrec")
                .filter(function (d,i) {
                    return d.wordHeightArray[globalIndex]==0&&d.wordHeightArray[frameNo]>0
                })
                // .transition(t)
                .attr("x",function(d,i){
                    // console.log(globalIndex,frameNo)
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[frameNo]
                    else
                        return d.centerXArray[frameNo]
                })
                .attr("y",function(d,i){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[frameNo]
                    else
                        return d.centerYArray[frameNo]-d.offsetArray[frameNo]
                })


            d3.selectAll("#word")
                .filter(function (d,i) {
                    return d.wordHeightArray[globalIndex]==0&&d.wordHeightArray[frameNo]>0
                })
                .attr("x",function(d,i){
                    // console.log(globalIndex,frameNo)
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[frameNo]
                    else
                        return d.centerXArray[frameNo]
                })
                .attr("y",function(d,i){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[frameNo]
                    else
                        return d.centerYArray[frameNo]-d.offsetArray[frameNo]
                })
        }

        d3.selectAll(".textrec")
            .transition(t)
            .attr("x",function(d,i){
                if((forcebool||layoutMode=="nopackage")&&d.wordHeightArray[frameNo]==0&&d.wordHeightArray[globalIndex]>0){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[globalIndex]
                    else
                        return d.centerXArray[globalIndex]
                }
                return d.centerXArray[frameNo]-d.widthArray[frameNo]/2;
            })
            .attr("y",function(d,i){
                if((forcebool||layoutMode=="nopackage")&&d.wordHeightArray[frameNo]==0&&d.wordHeightArray[globalIndex]>0){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[globalIndex]
                    else
                        return d.centerYArray[globalIndex]
                }
                return d.centerYArray[frameNo]-d.wordRealHeightArray[frameNo]/2
            })
            .attr("width",function(d,i){
                return d.widthArray[frameNo];
            })
            .attr("height",function(d,i){
                return d.wordRealHeightArray[frameNo]
            })

        d3.selectAll("#word")
            .transition(t)
            .attr("x",function(d,i){

                if((forcebool||layoutMode=="nopackage")&&d.wordHeightArray[frameNo]==0&&d.wordHeightArray[globalIndex]>0){
                    // console.log(globalIndex,frameNo)
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[globalIndex]
                    else
                        return d.centerXArray[globalIndex]
                }
                // console.log(globalIndex,frameNo)
                return d.centerXArray[frameNo]-d.widthArray[frameNo]/2;
            })
            .attr("y",function(d,i){
                if((forcebool||layoutMode=="nopackage")&&d.wordHeightArray[frameNo]==0&&d.wordHeightArray[globalIndex]>0){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[globalIndex]
                    else
                        return d.centerYArray[globalIndex]-d.offsetArray[globalIndex]
                }
                /*                if(isNaN(d.centerYArray[frameNo]-d.offsetArray[frameNo]+d.wordRealHeightArray[frameNo]/2)){
                                    console.log(d)
                                }*/

                return d.centerYArray[frameNo]-d.offsetArray[frameNo]+d.wordRealHeightArray[frameNo]/2;
            })
            .attr("style",function(d,i){
                let styleStr="font-size:"+d.wordHeightArray[frameNo]+"px;font-family:"+globalFont;
                return styleStr;
            })
            .attr("fill",function(d){
                return d.color
            })
            .on("end",function(){
                globalIndex=frameNo
                clickFrame=frameNo

            })



    // drawPolygon(convexPack[frameNo])

}

function change3() {
    if(!playing||globalIndex>=numOfFrames-1||globalIndex==-1){
        console.log("max time!",globalIndex)
        stopAnimation()
        globalIndex=0
        animationBlock=false
        // changeThumbBorder()
        switchFrame(0)
        d3.select("#playicon").style("display","block")

        //timeLine.stopAnimation();
        /*            globalIndex=0
                changeThumbBorder()
                switchFrame(0)*/
        return;
    }


    //console.log("xxxxxxxxxxxxxxxxxx");
    d3.select("#svg").selectAll("rect")
        .filter(function(){
            return d3.select(this).attr("class")!="textrec"
        })
        .remove()
    // changeThumbBorder()

    /*
        var framename=d3.select("#svg").append("text")
            .text(frameName[globalIndex+1])
            .attr("id","framename")
            .attr("x", minX+10)
            .attr("y", 695)
            .attr("fill", "#D3D3D3")
            .style("font-size", "100px")
            .style("font-family", globalFont)

      */
    var framename=d3.selectAll("#currentname")
        .text(frameName[globalIndex+1])

    let nheight=maxY-minY
    let nwidth=maxX-minX
    frameNameFontSize=nheight/15
    if((minX<0||maxX>1000) && !(minY<0||maxY>700)){
        // var dx = (1000 - nwidth / nheight * 700) / 2
        // let newFontSize=nheight/15
        frameNameFontSize=nheight/15
        let canvasRealHeight=nheight/nwidth*1000
        let gap=(700-canvasRealHeight)/2
        gap=nwidth/1000*gap
        d3.selectAll("#currentname")
            .attr("x", minX)
            .attr("y", maxY+gap)
            .style("font-size", frameNameFontSize+"px")
            .style("font-family", globalFont)
        var bbox=document.querySelector("#currentname").getBBox();
        while(bbox.width>nwidth){
            frameNameFontSize-=10
            d3.selectAll("#currentname")
                .style("font-size", frameNameFontSize+"px")
                .style("font-family", globalFont)
            bbox=document.querySelector("#currentname").getBBox();
        }
    }
    else if((minY<0||maxY>700) && !(minX<0||maxX>1000)  ){
        // let newFontSize=nheight/15
        frameNameFontSize=nheight/15
        let canvasRealWidth=nwidth/nheight*700
        let gap=(1000-canvasRealWidth)/2
        gap=nheight/700*gap
        d3.selectAll("#currentname")
            .attr("x", minX-gap)
            .attr("y", maxY-10)
            .style("font-size", frameNameFontSize+"px")
            .style("font-family", globalFont)
        var bbox=document.querySelector("#currentname").getBBox();
        while(bbox.width>1000/700*nheight){
            frameNameFontSize-=10
            d3.selectAll("#currentname")
                .style("font-size", frameNameFontSize+"px")
                .style("font-family", globalFont)
            bbox=document.querySelector("#currentname").getBBox();
        }
    }
    else if((minX<0||maxX>1000)&&(minY<0||maxY>700)){
        frameNameFontSize=nheight/15
        // let newFontSize=nheight/15
        if(1000<nwidth/nheight*700){
            //nwidth变化为1000
            let canvasRealHeight=nheight/nwidth*1000
            let gap=(700-canvasRealHeight)/2
            gap=nwidth/1000*gap
            d3.selectAll("#currentname")
                .attr("x", minX)
                .attr("y", maxY+gap)
                .style("font-size", frameNameFontSize+"px")
                .style("font-family", globalFont)
            var bbox=document.querySelector("#currentname").getBBox();
            while(bbox.width>nwidth){
                frameNameFontSize-=10
                d3.selectAll("#currentname")
                    .style("font-size", frameNameFontSize+"px")
                    .style("font-family", globalFont)
                bbox=document.querySelector("#currentname").getBBox();
            }

        }
        else{
            frameNameFontSize=nheight/15
            let canvasRealWidth=nwidth/nheight*700
            let gap=(1000-canvasRealWidth)/2
            gap=nheight/700*gap
            d3.selectAll("#currentname")
                .attr("x", minX-gap)
                .attr("y", maxY-10)
                .style("font-size", frameNameFontSize+"px")
                .style("font-family", globalFont)
            var bbox=document.querySelector("#currentname").getBBox();
            while(bbox.width>1000/700*nheight){
                frameNameFontSize-=10
                d3.selectAll("#currentname")
                    .style("font-size", frameNameFontSize+"px")
                    .style("font-family", globalFont)
                bbox=document.querySelector("#currentname").getBBox();
            }
        }

    }
    else{
        // let fontsize=50
        frameNameFontSize2=50
        d3.selectAll("#currentname")
            .attr("x", 10)
            .attr("y", 690)
            .style("font-size", frameNameFontSize2+"px")
            .style("font-family", globalFont)
        var bbox=document.querySelector("#currentname").getBBox();
        while(bbox.width>1000){
            frameNameFontSize2-=5
            d3.selectAll("#currentname")
                .style("font-size", frameNameFontSize2+"px")
                .style("font-family", globalFont)
            bbox=document.querySelector("#currentname").getBBox();
        }
    }


        const t=d3.transition()
            .duration(changeInterval)
            .ease(d3.easeCubic)

        animationBlock=true



        if(forcebool||layoutMode=="nopackage"){
            d3.selectAll(".textrec")
                .filter(function (d,i) {
                    return d.wordHeightArray[globalIndex]==0&&d.wordHeightArray[globalIndex+1]>0
                })
                .attr("x",function(d,i){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[globalIndex+1]
                    else
                        return d.centerXArray[globalIndex+1]
                })
                .attr("y",function(d,i){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[globalIndex+1]
                    else
                        return d.centerYArray[globalIndex+1]
                })

            d3.selectAll("#word")
                .filter(function (d,i) {
                    return d.wordHeightArray[globalIndex]==0&&d.wordHeightArray[globalIndex+1]>0
                })
                .attr("x",function(d,i){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[globalIndex+1]
                    else
                        return d.centerXArray[globalIndex+1]
                })
                .attr("y",function(d,i){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[globalIndex+1]
                    else
                        return d.centerYArray[globalIndex+1]-d.offsetArray[globalIndex+1]
                })
        }
        d3.selectAll(".textrec")
            .transition(t)
            .attr("x",function(d,i){
                if((forcebool||layoutMode=="nopackage")&&d.wordHeightArray[globalIndex+1]==0&&d.wordHeightArray[globalIndex]>0){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[globalIndex]
                    else
                        return d.centerXArray[globalIndex]
                }
                else{
                    return d.centerXArray[globalIndex+1]-d.widthArray[globalIndex+1]/2;
                }
            })
            .attr("y",function(d,i){
                if((forcebool||layoutMode=="nopackage")&&d.wordHeightArray[globalIndex+1]==0&&d.wordHeightArray[globalIndex]>0){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[globalIndex]
                    else
                        return d.centerYArray[globalIndex]
                }
                else{
                    return d.centerYArray[globalIndex+1]-d.wordRealHeightArray[globalIndex+1]/2;
                }

            })
            .attr("width",function(d,i){
                return d.widthArray[globalIndex+1];
            })
            .attr("height",function(d,i){
                return d.wordRealHeightArray[globalIndex+1];
            })

        d3.selectAll("#word")
            .transition(t)
            .attr("x",function(d,i){

                if((forcebool||layoutMode=="nopackage")&&d.wordHeightArray[globalIndex+1]==0&&d.wordHeightArray[globalIndex]>0){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterXArray[globalIndex]
                    else
                        return d.centerXArray[globalIndex]
                }
                return d.centerXArray[globalIndex+1]-d.widthArray[globalIndex+1]/2;
            })
            .attr("y",function(d,i){
                if((forcebool||layoutMode=="nopackage")&&d.wordHeightArray[globalIndex+1]==0&&d.wordHeightArray[globalIndex]>0){
                    if(phrasePack&&d.isPhraseWord)
                        return d.phraseCenterYArray[globalIndex]
                    else
                        return d.centerYArray[globalIndex]-d.offsetArray[globalIndex]
                }

                return d.centerYArray[globalIndex+1]-d.offsetArray[globalIndex+1]+d.wordRealHeightArray[globalIndex+1]/2;
            })
            .attr("style",function(d,i){
                let styleStr="font-size:"+d.wordHeightArray[globalIndex+1]+"px;font-family:"+globalFont
                return styleStr;
            })
            .attr("fill",function(d,i){
                return d.color
            })
            .on("end",function(){
                animationBlock=false
            })
        aniTimeOut1=setTimeout(change3,2000+changeInterval);
        // aniTimeOut2=setTimeout(selected,1000+changeInterval);
        // clearInterval(output)
        globalIndex++;
        clickFrame=globalIndex
        console.log("++")

}

function startAnimation() {
    console.log("start animation!");
    d3.select("#playicon").style("display","none")
    // $("#record_scene_btn").attr("src","./assets/images/pausing.png")
    playing=true


    console.log("animateTime");
    change3()

}


function clearAll(){
     frameName=[]
     wordsArray=[]
     numOfFrames=-1
     Frames=[]
     imageSrc=[]
     minX=Number.MAX_VALUE
     minY=Number.MAX_VALUE
     maxX=Number.MIN_VALUE
     maxY=Number.MIN_VALUE
    isGenerate=false

    playing=false
    aniTimeOut1=null
    animationBlock=false


     globalIndex=0

     clickFrame=0

     forcebool=false
     layoutMode="normal"
     phrasePack=false
     frameNameFontSize=-1
     frameNameFontSize2=50

    $("#svg").html("")
    $("#stepper_svg").html("")


}

function initStepper(){
    var navigation_div = d3.select("#bottomrow").append("div").attr("id", "navigation_div").attr("class", "control_div");
    var playback_bar = navigation_div.append("div").attr("id", "playback_bar");

    playback_bar.append("div").attr("id", "prev_scene_div").attr("class", "nav_bttn").append("img").attr("id", "prev_scene_btn").attr("height", 30).attr("width", 30)
        .attr("src", "./assets/images/prevframe.png")
        .attr("class", "img_btn_enabled").attr("title", "Previous Frame")


    playback_bar.append("div").attr("id", "record_scene_div").attr("class", "nav_bttn").append("img")
        .attr("id","record_scene_btn")
        .attr("class","img_btn_enabled")
        .attr("src","./assets/images/playing.png")
        .attr("height",30)
        .attr("width",30)


    playback_bar.append("div")
        .attr("id", "next_scene_div")
        .attr("class", "nav_bttn").append("img").attr("height", 30).attr("width", 30)
        .attr("class", "img_btn_enabled").attr("id", "next_scene_btn")
        .attr("src", "./assets/images/nextframe.png")
        .attr("title", "Next Frame")

    playback_bar.append("div").attr("id", "stepper_container")
        .append("svg")
        .attr("id", "stepper_svg")
        .append("text")
        .attr("id", "stepper_svg_placeholder")
        .attr("y", 25)
        .attr("dy", "0.25em")
        .attr("dx",450)
        .text("Frames will appear here.");

    $("#record_scene_div").on("click",function(){
        console.log("click playing!")
            if(!playing){
                    startAnimation()

            }
            else{
                stopAnimation()

            }

    })
    $("#next_scene_div").on("click",function(){
        nextFrame(true)
    })
    $("#prev_scene_div").on("click",function(){
        nextFrame(false)
    })



}

function drawStepper(){

    //Initialize the thumbnail for controlbar
    for (let f=0;f<numOfFrames;f++){
        imageSrc.push("")
        if(minX<0||maxX>1000||minY<0||maxY>700) {
            var virtrualsvg = d3.select("body").append("svg").attr("id", "virtralSVG" + f).attr("class", "virtralSVG").attr("width", 1000).attr("height", 700).attr("viewBox", minX + " " + minY + " " + (maxX - minX) + " " + (maxY - minY+20))
        }
        else{
            var virtrualsvg=d3.select("body").append("svg").attr("id", "virtralSVG" + f).attr("class", "virtralSVG").attr("width", 1000).attr("height", 700)

        }
        virtrualsvg.append("rect").attr("width","100%").attr("height","100%").attr("fill","white")


        virtrualsvg.selectAll("text").data(wordsArray)
            .enter()
            .append("text")

            .text(function(d){
                return d.text;
            })
            .attr("style",function(d,i){
                let styleStr="font-size:"+d.wordHeightArray[f]+"px;font-family:"+globalFont;
                return styleStr;
            })
            .attr("x",function(d,i){
                return d.centerXArray[f]-d.widthArray[f]/2;
            })
            .attr("y",function(d,i){
                if(isNaN(d.centerYArray[f]-d.offsetArray[f]+d.wordRealHeightArray[f]/2)){
                    console.log(d)
                }
                return d.centerYArray[f]-d.offsetArray[f]+d.wordRealHeightArray[f]/2;
            })
            .attr("fill",function(d,i){
                return d.color;
            });


        var vsvgelement=document.querySelector("#virtralSVG"+f);
        var xml = new XMLSerializer().serializeToString(vsvgelement);
// make it base64
        var svg64 = btoa(unescape(encodeURIComponent(xml)));
        var b64Start = 'data:image/svg+xml;base64,';

// prepend a "header"
        var image64 = b64Start + svg64;

        imageSrc[f]=image64
        virtrualsvg.remove()

    }

    console.log("All tumbnail finish!")



    var STEPPER_STEP_WIDTH = 50;

    d3.select("#stepper_svg_placeholder").remove()

    d3.select("#stepper_svg").style("width", ((STEPPER_STEP_WIDTH+5)*(numOfFrames)+1)+"px")

    for (let i=0;i<numOfFrames;i++){
        Frames[i].image_src=imageSrc[i]
    }

    //draw thumbnail of each frame on control bar.


    var navigation_step_svg = d3.select("#stepper_svg");

    var navigation_step = navigation_step_svg.selectAll(".framePoint")
        .data(Frames);

    navigation_step.append().transition()
        .delay(1000)
        .remove();

    var navigation_step_update = navigation_step.transition()
        .duration(1000);

    var navigation_step_enter = navigation_step.enter()
        .append("g")
        .attr("class", "framePoint")
        .attr("id", function (d) {
            return "frame" + d.index;
        })
        .attr("transform", function (d) {
            return "translate(" + (d.index * STEPPER_STEP_WIDTH + d.index * 5+1) + ",1)";
        })
        .style("cursor", "pointer");

    navigation_step_update.attr("transform", function (d) {
        return "translate(" + (d.index * STEPPER_STEP_WIDTH + d.index * 5+1) + ",1)";
    })
        .attr("id", function (d) {
            return "frame" + d.index;
        });

    navigation_step_enter.append("title")
        .text(function (d) {
            return "Frame " + (d.index + 1);
        });

    navigation_step_update.select("title")
        .text(function (d) {
            return "Frame " + (d.index + 1);
        });

    navigation_step_enter.append("rect")
        .attr("fill", "white")
        .attr("width", STEPPER_STEP_WIDTH)
        .attr("height", STEPPER_STEP_WIDTH)
        .style("stroke", function (d) {
            return d.index === globalIndex? "#f00" : "#ccc";
        })
        .style("stroke-width", "2px")
        .on("click", function(d){
            switchFrame(d.index)
        });

    navigation_step_update.select("rect")
        .style("stroke", function (d) {
            return d.index === globalIndex? "#f00" : "#ccc";
        });

    navigation_step_enter.append("svg:image")
        .attr("xlink:href", function (d) {
            return d.image_src;
        })
        .attr("x", 2)
        .attr("y", 2)
        .attr("width", STEPPER_STEP_WIDTH - 4)
        .attr("height", STEPPER_STEP_WIDTH - 4)
        .on("click", function(d){
            switchFrame(d.index)
        });

    //initialize the mouseover event of each frame on controlbar

    navigation_step_svg.selectAll(".framePoint")
        .on("mouseover", function (d) {
            const popupWidth = 200;
            const popupHeight=popupWidth/4*3
            const frameRect = this.getBoundingClientRect();
            const relativeParentRect = d3.select("#lbox").node().getBoundingClientRect();
            const offscreenAmount = (frameRect.right + popupWidth) - relativeParentRect.right;

            // If we're offscreen, then adjust the position to take the offsceen amount into account
            const x_pos = frameRect.left - relativeParentRect.left - (offscreenAmount > 0 ? offscreenAmount : 0);
            const y_pos = frameRect.top - relativeParentRect.top;


            d3.select(this).select("rect")
                .style("stroke", "#666");


            d3.select("#lbox").append("div")
                .attr("class", "frame_hover")
                .attr("width",popupWidth)
                .attr("height",popupHeight)
                .style("left", `${x_pos}px`)
                .style("top", `${y_pos - popupHeight - 10}px`)
                .append("svg")
                .style("padding", "0px")
                .attr("width",popupWidth-5)
                .attr("height",popupHeight-5)
                .append("svg:image")
                .attr("xlink:href", d.image_src)
                .attr("x", 2.5)
                .attr("y", 2.5)
                .attr("width", popupWidth-5)
                .attr("height", popupHeight-5);
        })
        .on("mouseout", function (d) {
            if (d.index ===clickFrame) {
                d3.select(this).select("rect")
                    .style("stroke", function () {
                        return "#f00";
                    });
            } else {
                d3.select(this).select("rect")
                    .style("stroke", function () {
                        return "#ccc";
                    });
            }

            d3.select(".frame_hover").remove();
        });



}



function loadDataFromJSON(el){
    clearAll()
    let dataName=el.getAttribute("data-name")

    globalFont=el.getAttribute("data-font")

    layoutMode=dataName.split("_")[1]
    forcebool=dataName.split("_")[2]
    if(forcebool==='true')
        forcebool=true
    else
        forcebool=false
    phrasePack=dataName.split("_")[3]
    if(phrasePack==='true')
        phrasePack=true
    else
        phrasePack=false

    console.log(dataName)


        // console.log(data)
        frameName=frameNameJSON[dataName];
        numOfFrames=frameName.length
        for (let i = 0; i < numOfFrames; i++) {
            // allWords.push(documentProcess(documents_input[i], i))
            Frames.push(new Frame(i,frameName[i]))
        }

            wordsArray=dataJSON[dataName]
            console.log(wordsArray);
            //find the min max x and y axis.
            for(let f=0;f<numOfFrames;f++){
                for (let i=0;i<wordsArray.length;i++){
                    if(wordsArray[i].xArray[f]<minX){
                        minX=wordsArray[i].xArray[f]
                    }
                    if(wordsArray[i].yArray[f]-wordsArray[i].wordRealHeightArray[f]<minY){
                        minY=wordsArray[i].yArray[f]-wordsArray[i].wordRealHeightArray[f]
                    }
                    if (wordsArray[i].xArray[f]+wordsArray[i].widthArray[f]>maxX){
                        maxX=wordsArray[i].xArray[f]+wordsArray[i].widthArray[f]
                    }
                    if(wordsArray[i].yArray[f]>maxY){
                        maxY=wordsArray[i].yArray[f]
                    }

                }
            }

    //set the viewbox
    if((minX<0||maxX>1000) && !(minY<0||maxY>700)){
        d3.select("#svg").attr("viewBox",minX+" "+0+" "+(maxX-minX)+" "+700)
        // d3.select("#exportsvg").attr("viewBox",minX+" "+0+" "+(maxX-minX)+" "+700)
    }
    else if((minY<0||maxY>700) && !(minX<0||maxX>1000)  ){
        d3.select("#svg").attr("viewBox",0+" "+minY+" "+1000+" "+(maxY-minY+20))
        // d3.select("#exportsvg").attr("viewBox",0+" "+minY+" "+1000+" "+(maxY-minY+20))
    }
    else if(minX<0||maxX>1000||minY<0||maxY>700){
        d3.select("#svg").attr("viewBox",minX+" "+minY+" "+(maxX-minX)+" "+(maxY-minY+20))
        // d3.select("#exportsvg").attr("viewBox",minX+" "+minY+" "+(maxX-minX)+" "+(maxY-minY+20))
    }
    else{
        d3.select("#svg").attr("viewBox",0+" "+0+" "+1000+" "+700)

    }

            var fname=d3.select("#svg").append("text")
            fname.text(frameName[0])
                .attr("id","currentname")
                .attr("x", minX+10)
                .attr("y", 695)
                .attr("fill", "#808080")
                .style("font-size", "50px")
                .style("font-family", "Helvetica")
            let nheight=maxY-minY
            let nwidth=maxX-minX
            frameNameFontSize=nheight/15
            // let fontsize=50
            if((minX<0||maxX>1000) && !(minY<0||maxY>700)){
                frameNameFontSize=nheight/15
                // var dx = (1000 - nwidth / nheight * 700) / 2
                // let newFontSize=nheight/15
                let canvasRealHeight=nheight/nwidth*1000
                let gap=(700-canvasRealHeight)/2
                gap=nwidth/1000*gap
                d3.selectAll("#currentname")
                    .text(frameName[0])
                    .attr("x", minX)
                    .attr("y", maxY+gap)
                    .style("font-size", frameNameFontSize+"px")
                    .style("font-family", globalFont)
                var bbox=document.querySelector("#currentname").getBBox();
                while(bbox.width>nwidth){
                    frameNameFontSize-=10
                    d3.selectAll("#currentname")
                        .style("font-size", frameNameFontSize+"px")
                        .style("font-family", globalFont)
                    bbox=document.querySelector("#currentname").getBBox();
                }
            }
            else if((minY<0||maxY>700) && !(minX<0||maxX>1000)  ){
                // let newFontSize=nheight/15
                frameNameFontSize=nheight/15
                let canvasRealWidth=nwidth/nheight*700
                let gap=(1000-canvasRealWidth)/2
                gap=nheight/700*gap
                d3.selectAll("#currentname")
                    .text(frameName[0])
                    .attr("x", minX-gap)
                    .attr("y", maxY-10)
                    .style("font-size", frameNameFontSize+"px")
                    .style("font-family", globalFont)
                var bbox=document.querySelector("#currentname").getBBox();
                while(bbox.width>1000/700*nheight){
                    frameNameFontSize-=10
                    d3.selectAll("#currentname")
                        .style("font-size", frameNameFontSize+"px")
                        .style("font-family", globalFont)
                    bbox=document.querySelector("#currentname").getBBox();
                }
            }
            else if((minX<0||maxX>1000)&&(minY<0||maxY>700)){
                frameNameFontSize=nheight/15
                // let newFontSize=nheight/15
                if(1000<nwidth/nheight*700){
                    //nwidth变化为1000
                    let canvasRealHeight=nheight/nwidth*1000
                    let gap=(700-canvasRealHeight)/2
                    gap=nwidth/1000*gap
                    d3.selectAll("#currentname")
                        .text(frameName[0])
                        .attr("x", minX)
                        .attr("y", maxY+gap)
                        .style("font-size", frameNameFontSize+"px")
                        .style("font-family", globalFont)
                    var bbox=document.querySelector("#currentname").getBBox();
                    while(bbox.width>nwidth){
                        frameNameFontSize-=10
                        d3.selectAll("#currentname")
                            .style("font-size", frameNameFontSize+"px")
                            .style("font-family", globalFont)
                        bbox=document.querySelector("#currentname").getBBox();
                    }

                }
                else{
                    frameNameFontSize=nheight/15
                    let canvasRealWidth=nwidth/nheight*700
                    let gap=(1000-canvasRealWidth)/2
                    gap=nheight/700*gap
                    d3.selectAll("#currentname")
                        .text(frameName[0])
                        .attr("x", minX-gap)
                        .attr("y", maxY-10)
                        .style("font-size", frameNameFontSize+"px")
                        .style("font-family", globalFont)
                    var bbox=document.querySelector("#currentname").getBBox();
                    while(bbox.width>1000/700*nheight){
                        frameNameFontSize-=10
                        d3.selectAll("#currentname")
                            .style("font-size", frameNameFontSize+"px")
                            .style("font-family", globalFont)
                        bbox=document.querySelector("#currentname").getBBox();
                    }
                }

            }
            else{
                // let fontsize=50
                frameNameFontSize2=50
                d3.selectAll("#currentname")
                    .text(frameName[0])
                    .attr("x", 10)
                    .attr("y", 690)
                    .style("font-size", frameNameFontSize2+"px")
                    .style("font-family", globalFont)
                var bbox=document.querySelector("#currentname").getBBox();
                while(bbox.width>1000){
                    frameNameFontSize2-=5
                    d3.selectAll("#currentname")
                        .style("font-size", frameNameFontSize2+"px")
                        .style("font-family", globalFont)
                    bbox=document.querySelector("#currentname").getBBox();
                }
            }

            // uploadSVG()
            d3.selectAll("#importword").remove()

            for(let i=0;i<wordsArray.length;i++){
                var text=makeSVG('text',{id:"word"});
                $("#svg").append(text);
            }
            d3.selectAll("#word").data(wordsArray)
            d3.selectAll("#word")
                .text(function(d){
                    // console.log(d)
                    return d.text;
                })
                .attr("style",function(d,i){
                    let styleStr="font-size:"+d.wordHeightArray[0]+"px;font-family:"+globalFont
                    return styleStr;
                })
                .attr("x",function(d,i){
                    return d.centerXArray[0]-d.widthArray[0]/2;
                })
                .attr("y",function(d,i){
                    return d.centerYArray[0]-d.offsetArray[0]+d.wordRealHeightArray[0]/2;
                })
                .attr("fill",function(d,i){
                    return d.color;
                })
            // .attr("dominant-baseline","middle");

            d3.select("#svg").on("click",function(){
                if(d3.event.srcElement.nodeName=="svg"){
                    d3.selectAll("#word").filter(function(d){
                        return d.hasSelected
                    })
                        .each(function(d){
                            d.hasSelected=false
                        })
                    d3.selectAll(".textrec").remove()
                }

            })

            d3.selectAll("#word").on("click",function(d){
                // console.log(d3.event.srcElement.nodeName)

                if(d.hasSelected){
                    d.hasSelected=false
                }
                else{
                    // console.log(d.text)
                    // console.log(d)
                    var bbox=this.getBBox()
                    d.hasSelected=true
                    d3.select("#svg").append("rect")
                        .datum(d)
                        .attr("x",bbox.x)
                        .attr("y",bbox.y)
                        .attr("width",bbox.width)
                        .attr("height",bbox.height)
                        .attr("id","rec_"+this.innerHTML)
                        .attr("class","textrec")
                        .attr("fill","blue")
                        .attr("fill-opacity",0.3)
                        .on("click",function(){
                            d3.select(this).remove()
                            d.hasSelected=false
                        })
                        .data(d)
                }

            })
            // d3.select("#loadingDiv").style("display","none")
            stopAnimation()
            isGenerate=true

    d3.select("#playicon").style("display","block")
    d3.select("#playicon").on("click",function(){
        startAnimation()
    })
            // drawStepper()
            // startAnimation()



}