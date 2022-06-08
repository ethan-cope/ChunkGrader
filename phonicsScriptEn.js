//Logic:
// for every group, represented by an array of words in the 'words' dict, determine right or wrong.
//
// TODO: printable + student's name
// click incorrect, see whole group
// print which ones they got wrong
// next set button
// optimize to print all that junk, make colors work when printing

words = {}
words["Short vowel"] = ["sip", "mat", "let", "bun", "hog", "rut", "fit", "bat", "hot", "set"] 
words["Consonant blend short vowel"] = ["sip", "mat", "let", "bun", "hog", "rut", "fit", "bat", "hot", "set"] 
words["Digraph short vowel"] = ["when", "chop", "thin", "shut", "wick", "ship", "rash", "ring", "then", "chat"] 
words["Long vowel"] = ["tape", "poke", "cute", "kite", "Pete", "file", "game", "here", "tube", "code"] 
words["Vowel team"] = ["deep", "they", "suit", "light", "sheet", "flea", "row", "rain", "boat", "play"] 
words["R-controlled vowel"] = ["harm", "dirt", "form", "fern", "surf", "worm", "pert", "bark", "turn", "bird"] 
words["Variant vowel"] = ["soy", "town", "slaw", "good", "shout", "moon", "new", "boy", "coin", "vault"] 

results = {}
results["Short vowel"] = words["Short vowel"].length
results["Consonant blend short vowel"] = words["Consonant blend short vowel"].length
results["Digraph short vowel"] = words["Digraph short vowel"].length
results["Long vowel"] = words["Long vowel"].length
results["Vowel team"] = words["Vowel team"].length
results["R-controlled vowel"] = words["R-controlled vowel"].length
results["Variant vowel"] = words["Variant vowel"].length

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
			colorClass="pcf"
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
	//deprecated
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

function nextButtonPress(){
	if (gindex < groups.length-1){
		gindex += 1
		populateTable()
	}
	else
	{
		$(".form-control").slideDown()
		if($(".namein").val() != ""){
			print()
		}
	}
}

function populateTable(){
	//change values of table: or just add a divider in and start
	divider = `
	<tr class='table-active'>
		<th colspan="4">${groups[gindex]}</th>
		<th class="result${gindex}" style="background-color:limegreen;"> 10/10 </th>
	</tr>
	`

	r1=`<tr>`
	r2=`<tr>`

	//bottom divider with numbers
	for (val in words[groups[gindex]]){
		if (val%2==0){
			r1+=`\n    <td data-group="${gindex}" class="pco">${words[groups[gindex]][val]}</td>`
		}
		else
		{
			r2+=`\n    <td data-group="${gindex}" class="pco">${words[groups[gindex]][val]}</td>`
		}
	}
	r1 += '\n</tr>'
	r2 += '\n</tr>'

	$(divider).appendTo($("#wordstab"))
	$(r1).appendTo($("#wordstab"))
	$(r2).appendTo($("#wordstab"))
	//scuffed solution from the internet
	$(`<tr style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))

}
//console.log(results)
function reparseResult(element, clickgroup){
	border = ""
	$(`.result${clickgroup}`).text(results[groups[clickgroup]]+"/"+words[groups[clickgroup]].length)

	if (results[groups[clickgroup]] > 8){
		bgcolor="limegreen"
	}
	else if (results[groups[clickgroup]] <= 8 && results[groups[clickgroup]] >= 7){
		bgcolor="FFEA00"
		border = "3px dashed"
	}
	else if (results[groups[clickgroup]] < 7){
		bgcolor="tomato"
		border = "3px solid"
	}

	$(`.result${clickgroup}`).css({'backgroundColor': bgcolor})
	$(`.result${clickgroup}`).css({'border': border})
	//background-color: #FFEA00 !important;

}

$( document ).ready(function() {
	populateTable()
	$(".HIDE").hide()
	$(".outputdiv").hide()
	$(".form-control").hide()
	$("#nextbutton").click(function(e) {nextButtonPress()})

	$(document).on('click', '.pco', function(e) { 
		let clickgroup = $(this).data("group")
		results[groups[clickgroup]] -= 1

		reparseResult($(this),clickgroup)
		$(this).attr('class', 'wrongtoggle')
	})

	$(document).on('click', '.wrongtoggle', function(e) { 
		let clickgroup = $(this).data("group")
		results[groups[clickgroup]] += 1

		reparseResult($(this),clickgroup)
		$(this).attr('class', 'pco')
	})

	$('.form-control').keypress(function (e) {
	  if (e.which == 13) {
		  console.log($(".form-control").val())
		  print()
	  }
	});



	//$("#WrongButton").click(buttonPress("Wrong"))
	//test()
	
})
