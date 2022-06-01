//Logic:
// for every group, represented by an array of words in the 'words' dict, determine right or wrong.

words = {}
words["Short vowel"] = ["sip", "mat", "let", "bun", "hog", "rut", "fit", "bat", "hot", "set"] 
words["Consonant blend short vowel"] = ["sip", "mat", "let", "bun", "hog", "rut", "fit", "bat", "hot", "set"] 
words["Digraph short vowel"] = ["when", "chop", "thin", "shut", "wick", "ship", "rash", "ring", "then", "chat"] 
words["Long vowel"] = ["tape", "poke", "cute", "kite", "Pete", "file", "game", "here", "tube", "code"] 
words["Vowel team"] = ["deep", "they", "suit", "light", "sheet", "flea", "row", "rain", "boat", "play"] 
words["R-controlled vowel"] = ["harm", "dirt", "form", "fern", "surf", "worm", "pert", "bark", "turn", "bird"] 
words["Variant vowel"] = ["soy", "town", "slaw", "good", "shout", "moon", "new", "boy", "coin", "vault"] 

results = {}
results["Short vowel"] = 0
results["Consonant blend short vowel"] = 0
results["Digraph short vowel"] = 0
results["Long vowel"] = 0
results["Vowel team"] = 0
results["R-controlled vowel"] = 0
results["Variant vowel"] = 0

//words = {"pt1":["one","two","three"], "pt2":["four","five","six"], "pt3":["sev","eight","nine"]}
//results = {"pt1":0, "pt2":0, "pt3":0}
//no blocking input: gotta increment asynchronously.
windex = 0
gindex = 0
nomore = false

groups=[]
for (group in words) {
	groups.push(group)
}
//console.log(groups)

function DisplayWord(){
	//#console.log(words[groups[gindex]][windex])
	$("#testword").text(words[groups[gindex]][windex]);
	$("#testwordgroup").text("("+groups[gindex]+")");
}

function showResults(){
	$(".iact").slideUp()
	//build table
	let colorClass = ""	
	

	for (key in results)
	{
		let fracstring = `${results[key]}/${words[key].length}`
		let perc = Number(results[key])/words[key].length
		if(perc <= .8 && perc >= .7)
			colorClass="mid"
		else if (perc < .7)
			colorClass="wrong"
		else
			colorClass=""
		//console.log(colorClass)

//<tr class="${colorClass}">
		let row= `
<tr class="${colorClass}">
<td style="vertical-align:middle;"><span class="bigtext"> ${key} </span></td>
<td style="vertical-align:middle;"> 
		${fracstring}
</td>
</tr>
`
		//console.log(row)
		$(row).appendTo($("#resulttab"))
	}
	$(".outputdiv").slideDown()

}

function buttonPress(value){
	//groups[gindex] = group of word
	
	if (!nomore){

		if ( value == "Right" ){
			results[groups[gindex]] += 1		
		}

		windex += 1
		if(windex == words[groups[gindex]].length){ // handles rotation
			gindex += 1
			windex = 0
		}

		if (gindex == groups.length){
			/*
			for(r in results){
				perc = results[r]/words[r].length
				console.log(r+": "+ results[r]+"/"+words[r].length+": " + 100* perc+"%")
			}*/
			showResults()
			nomore = true //probably a better way to do this but idk what
		}
		else {
			DisplayWord()
		}
		//console.log("windex "+ windex +" gindex " + gindex)
	}
}
//console.log(results)

function test()
{
	for (let i = 0; i< 7; i++){ // why 8 times? idk
		for (let j=0; j < i; j++){
			buttonPress("Wrong")
		}
		for (let k=0; k < 10-i; k++){
			buttonPress("Right")
		}
		console.log(i)
	}
}


$( document ).ready(function() {
	DisplayWord()
	$(".outputdiv").hide()
	$("#RightButton").click(function(e) {buttonPress("Right")})
	$("#WrongButton").click(function(e) {buttonPress("Wrong")})
	//$("#WrongButton").click(buttonPress("Wrong"))
	//test()
	
})
