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

words["Vowel sounds"]      = ["o", "a", "i", "u", "e"]

words["Consonant sounds"]  = ["d", "l", "n", "s", "v", "z", "j", "t", "y", "p", "c", "h", "m", "ch", "ñ", "ll", "g", "f", "b", "q", "r", "x"]
//


words["Open Syllables (CV)"] = ["su", "yo", "luna", "techo", "jefe", "ne", "cu", "mepa", "sila", "rago"] 
words["Open Syllables (V, CV)"] = ["año", "iba", "oro", "ella", "ocho", "oba", "udo", "eca", "alle", "imo"] 
words["Closed Syllables (CVC, VC)"] = ["sol", "pan", "tambar", "juntos", "artes", "jez", "dor", "cambal", "portir", "entad"] 
words["Open Syllable Blends (CCV)"] = ["brazo", "grillo", "clase", "pluma", "globo", "flece", "crima", "bruco", "clopo", "pleso"] 
words["Vowel Combinations Open Syllables"] = ["cae", "lee", "hoy", "ruido", "quiere", "cheo", "moa", "ray", "yugia", "vaida"] 
words["Dipthongs in Closed Syllables"] = ["puerta", "siempre", "treinta", "cuando", "viento", "pueste", "guanto", "tiemba", "reina", "fianco"] 



results = {}
//just a dictionary that keeps track of how many letters per group are currently correct.
//results["Uppercase"] = words["Uppercase"].length
//results["Lowercase"] = words["Lowercase"].length
results["Vowel sounds"] = words["Vowel sounds"].length
results["Consonant sounds"] = words["Consonant sounds"].length
results["Open Syllables (CV)"] = words["Open Syllables (CV)"].length
results["Open Syllables (V, CV)"] = words["Open Syllables (V, CV)"].length
results["Closed Syllables (CVC, VC)"] = words["Closed Syllables (CVC, VC)"].length
results["Open Syllable Blends (CCV)"] = words["Open Syllable Blends (CCV)"].length
results["Vowel Combinations Open Syllables"] = words["Vowel Combinations Open Syllables"].length
results["Dipthongs in Closed Syllables"] = words["Dipthongs in Closed Syllables"].length


info = {}

info["Vowel sounds"] = [`SAY: "¿Puedes decirme cuales son los sonidos de estas letras?"`]

info["Consonant sounds"] = ["SAY to the student: \"Mira estas letras. ¿Puedes decirme qué sonido tiene cada letra? \"",
				  `Be sure to ask if he or she knows of another sound for the letters c and g. Do not expect the student to know more than one sound for r (either /r/ or /rr/ is acceptable). If the students cannot say the sound for three or more consecutive letters SAY: "Mira todas las letras y dime qué sonidos conoces?"`]

defInfoStr = "SAY: \"Quiero que leas estas palabras. La segunda línea de palabras son inventadas. ¡Hazlo lo mejor que puedas!\""

info["Open Syllables (CV)"] = [defInfoStr]
info["Open Syllables (V, CV)"] = [defInfoStr] 
info["Closed Syllables (CVC, VC)"] = [defInfoStr]
info["Open Syllable Blends (CCV)"] = [defInfoStr]
info["Vowel Combinations Open Syllables"] = [defInfoStr]
info["Dipthongs in Closed Syllables"] = [defInfoStr] 


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
	if (groups[gindex]=="Vowel sounds")
	{
	$(`
	<tr class="table-active trShowOnPrint" >
		<th style="text-align: center;" class="childInfo" colspan=5></th>
	</tr>
	<tr class='table-active'>
		<th style="text-align: center;" colspan=5>Alphabet Skills and Letter Sounds</th>
	</tr>
	`).appendTo($("#wordstab"))
		rows = 1
	}
	else if (groups[gindex]=="Consonant sounds"){
		rows = 5
	}
	else if (groups[gindex]=="Open Syllables (CV)"){
		$(`
		<tr class='table-active'>
			<th style="text-align: center;" colspan=5>Reading and Decoding</th>
		</tr>
		`).appendTo($("#wordstab"))
		rows = 2
	}
	else if (groups[gindex]=="Open Syllable Blends (CCV)"){
		//need 2 blank rows here to pad out printing.
		$(`<tr class="trShowOnPrint" style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))
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
	if (groups[gindex] == "Consonant sounds"){
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
