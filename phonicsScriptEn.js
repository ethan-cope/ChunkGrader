//Logic:
// for every group, represented by an array of words in the 'words' dict, determine right or wrong.
//
// TODO: printable + student's name
// click incorrect, see whole group
// print which ones they got wrong
// next set button
// optimize to print all that junk, make colors work when printing

words = {}

/*
words["Uppercase"]   = ["D", "A", "N", "S", "X", 
						"Z", "J", "L", "H", "T", 
						"Y", "E", "C", "O", "M", 
						"R", "P", "W", "K", "U", 
						"G", "B", "F", "Q", "V", "I"]

words["Lowercase"]   = ["d", "a", "n", "s", "x", 
						"z", "j", "l", "h", "t", 
						"y", "e", "c", "o", "m", 
						"r", "p", "w", "k", "u", 
						"g", "b", "f", "q", "v", "i"]
						*/

words["Consonants"]  = ["d", "l", "n", "s", "x", 
						"z", "j", "t", "y", "p", 
						"c", "h", "m", "r", "k", 
						"w", "g", "b", "f", "q", "v"]

words["Vowels"]      = ["e", "i", "a", "o", "u",
					    "E", "I", "A", "O", "U"]

words["Short vowel"] = ["sip", "mat", "let", "bun", "hog", "rut", "fit", "bat", "hot", "set"] 
words["Consonant blend short vowel"] = ["slip", "brag", "trap", "skit", "camp", "drink", "glad", "clop", "plug", "stand"] 
words["Digraph short vowel"] = ["when", "chop", "thin", "graph", "wick", "ship", "rash", "ring", "then", "rich"] 
words["Long vowel"] = ["tape", "poke", "cute", "kite", "Pete", "file", "game", "here", "tube", "code"] 
words["Vowel team"] = ["stain", "play", "boat", "light", "sheet", "try", "row", "rain", "heat", "roast"] 
words["R-controlled vowel"] = ["harm", "dirt", "form", "fern", "surf", "worm", "pert", "bark", "turn", "bird"] 
words["Variant vowel"] = ["soy", "town", "slaw", "good", "shout", "moon", "new", "count", "coin", "vault"] 



results = {}
//just a dictionary that keeps track of how many letters per group are currently correct.
//results["Uppercase"] = words["Uppercase"].length
//results["Lowercase"] = words["Lowercase"].length
results["Consonants"] = words["Consonants"].length
results["Vowels"] = words["Vowels"].length
results["Short vowel"] = words["Short vowel"].length
results["Consonant blend short vowel"] = words["Consonant blend short vowel"].length
results["Digraph short vowel"] = words["Digraph short vowel"].length
results["Long vowel"] = words["Long vowel"].length
results["Vowel team"] = words["Vowel team"].length
results["R-controlled vowel"] = words["R-controlled vowel"].length
results["Variant vowel"] = words["Variant vowel"].length


info = {}

defInfoStr = "SAY: \"I want you to read each line of words aloud to me. Do your best!\""
info["Consonants"] = ["SAY: \"Look at these letters. Can you tell me the sound that each letter makes?\"",
				  `If the student cannot name three or more consecutive letters, SAY: "Look at all of the letters and tell me which ones you do know"`]
info["Vowels"] = [`SAY: "Can you tell me the sounds of each letter?"`,
				  `If the student names the letter, count it as the long vowel sound. Then ASK: "Can you tell me another sound for the letter?" The student should name the short vowel sound.`,
				  `Click or tap the CAPITAL letter for long vowel and the LOWERCASE letter for short vowel sounds.`]
info["Short vowel"] = [defInfoStr]
info["Consonant blend short vowel"] = [defInfoStr] 
info["Digraph short vowel"] = [defInfoStr]
info["Long vowel"] = [defInfoStr]
info["Vowel team"] = [defInfoStr]
info["R-controlled vowel"] = [defInfoStr] 
info["Variant vowel"] = [defInfoStr]


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
	//deprecated? could be brought back tho.
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

function nextButtonPress(){
	if (gindex < groups.length-1){
		gindex += 1
		populateTable()
	}
	else
	{
		$(".form-control").slideDown()
		if($(".namein").val() != ""){
			$(`<tr style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))
			printPDF()
		}
	}
}

function populateTable(){
	//change values of table: or just add a divider in and start
	//make the below a case for if they are words. make another use case for letters.
	
	let rows
	if (groups[gindex]=="Consonants")
	{
	$(`
	<tr class="table-active trShowOnPrint" >
		<th style="text-align: center;" class="childInfo" colspan=5></th>
	</tr>
	<tr class='table-active'>
		<th style="text-align: center;" colspan=5>Alphabet Skills and Letter Sounds</th>
	</tr>
	`).appendTo($("#wordstab"))
		rows = 5
	}
	else if (groups[gindex]=="Short vowel"){
		$(`
		<tr class='table-active'>
			<th style="text-align: center;" colspan=5>Reading and Decoding</th>
		</tr>
		`).appendTo($("#wordstab"))
		rows = 2
	}
	else if (groups[gindex]=="Long vowel"){
		$(`<tr class="trShowOnPrint" style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))
		$(".trShowOnPrint").hide()
		
		rows = 2
	}
	else{
		rows = 2
	}

	numMembers = words[groups[gindex]].length

	divider = `
	<tr class='table-active'>
		<th colspan="${Math.ceil(numMembers/rows)-1}">${groups[gindex]}</th>
		<th class="result${gindex}" style="background-color:limegreen;"> ${numMembers}/${numMembers} </th>
	</tr>
	`

	infoRow = ""
	info[groups[gindex]].forEach(factoid => {
		infoRow += `
		<tr class='table-active trHideOnPrint'>
			<td colspan="5" class="info"> ${factoid} </td>
		</tr>
		`
	})

	rowStr=`<tr>`

	let rcount = 0

	//bottom divider with numbers
	for (val in words[groups[gindex]]){
		//make this just 5 eventually
		if (rcount == Math.ceil(numMembers/rows)){
			rcount = 0
			rowStr+=`\n<tr>`
		}

		rowStr+=`\n    <td data-group="${gindex}" class="pco">${words[groups[gindex]][val]}</td>`
		rcount +=1
	}

	rowStr+=`\n<tr>`

	$(divider).appendTo($("#wordstab"))
	$(infoRow).appendTo($("#wordstab"))
	$(rowStr).appendTo($("#wordstab"))

	//this has kid's name at TOP maybe
	/*
	if (groups[gindex] == "Consonants"){
	//scuffed solution from the internet to add a blank row in a table
	//this makes the print page break in the right place.  
		$(`<tr style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))
		$(`<tr style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))
	}
	*/

}
//console.log(results)
function reparseResult(element, clickgroup){
	border = ""
	$(`.result${clickgroup}`).text(results[groups[clickgroup]]+"/"+words[groups[clickgroup]].length)

	//fraction of words that are correct.
	correctFrac = results[groups[clickgroup]]/words[groups[clickgroup]].length

	if (correctFrac > .8){
		bgcolor="limegreen"
	}
	else if (correctFrac <= .8 && correctFrac >= .7){
		bgcolor="FFEA00"
	}
	else if (correctFrac < .7){
		bgcolor="red"
		border="solid 2px"
	}

	$(`.result${clickgroup}`).css({'backgroundColor': bgcolor})
	$(`.result${clickgroup}`).css({'border': border})
	//background-color: #FFEA00 !important;

}

function printPDF() {
	//add in name at top inside of printable div and show it.
	$(".trHideOnPrint").hide()
	$(".childInfo").text(`${$(".namein").val()} | Grade: ${$(".gradein").val()} | ${$(".schoolin").val()}`)
	$(".trShowOnPrint").show()
	var element = document.getElementById("printable")
	console.log($(".form-control").val())
	element.style.width = '700px';
	element.style.height = '1600px';
	element.style.scale = '.95';
	studentname = $(".namein").val()

	var opt = {
		margin: 0.5,
		//TODO: include date, also grade and school at top of page
		//let date = new Date();
		//filename: `${studentname}-${date}-PhonicsSurvey.pdf`,
		filename: `${studentname}PhonicsSurvey.pdf`,
		image: {type: 'jpeg', quality: 1},
		html2canvas: {scale: 2},
		jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', precision: '12'}
	};

	html2pdf().set(opt).from(element).save();
	console.log("printing!")
}

$( document ).ready(function() {
	populateTable()
	$(".HIDE").hide()
	$(".trShowOnPrint").hide()
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
		  printPDF()
		  //maybe make this a promise so you can .then and reload the page
		  //for now, just keep it a func.
	  }
	});

	/*
	for( var i = 0; i<9; i++)
	{nextButtonPress()}
	*/



	//$("#WrongButton").click(buttonPress("Wrong"))
	//test()
	
})
