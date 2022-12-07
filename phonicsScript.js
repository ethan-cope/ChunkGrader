//Logic:
// for every group, represented by an array of words in the 'words' dict, determine right or wrong.
//
// TODO: 
// padding in the info TRs 
// copying into excel: maybe save as html instead of pdf? 
//    then you could have an html table to import, make it way easier!!!
//    copy-paste into excel by auto-selecting an output table in the future.

words = {}
results = {}
info = {}
groups=[]
var lang 

windex = 0
gindex = 0
nomore = false

function prepWords(){
	if (lang == "en")
	{
		words["Consonants"]  = ["d", "l", "n", "s", "x", 
								"z", "j", "t", "y", "p", 
								"c", "h", "m", "r", "k", 
								"w", "g", "b", "f", "q", "v"]

		words["Vowels"]      = ["short E", "short I", "short A", "short O", "short U",
								"long E", "long I", "long A", "long O", "long U"]
		words["Short vowel"] = ["sip", "mat", "let", "bun", "hog", "rut", "fit", "bat", "hot", "set"] 
		words["Consonant blend short vowel"] = ["slip", "brag", "trap", "skit", "camp", "drink", "glad", "clop", "plug", "stand"] 
		words["Long vowel"] = ["tape", "poke", "cute", "kite", "Pete", "file", "game", "here", "tube", "code"] 
		words["Digraph short vowel"] = ["when", "chop", "thin", "graph", "wick", "ship", "rash", "ring", "then", "rich"] 
		words["Vowel team"] = ["stain", "play", "boat", "light", "sheet", "try", "row", "rain", "heat", "roast"] 
		words["R-controlled vowel"] = ["harm", "dirt", "form", "fern", "surf", "worm", "pert", "bark", "turn", "bird"] 
		words["Variant vowel"] = ["soy", "town", "slaw", "good", "shout", "moon", "new", "count", "coin", "vault"] 



		//just a dictionary that keeps track of how many letters per group are currently correct.
		results["Consonants"] = words["Consonants"].length
		results["Vowels"] = words["Vowels"].length
		results["Short vowel"] = words["Short vowel"].length
		results["Consonant blend short vowel"] = words["Consonant blend short vowel"].length
		results["Digraph short vowel"] = words["Digraph short vowel"].length
		results["Long vowel"] = words["Long vowel"].length
		results["Vowel team"] = words["Vowel team"].length
		results["R-controlled vowel"] = words["R-controlled vowel"].length
		results["Variant vowel"] = words["Variant vowel"].length


		// info strings for teacher teaching.
		defInfoStr = "SAY: \"I want you to read each line of words aloud to me. Do your best!\""
		info["Consonants"] = ["SAY: \"Look at these letters. Can you tell me the sound that each letter makes?\"",
						  `If the student cannot name three or more consecutive letters, SAY: "Look at all of the letters and tell me which ones you do know"`]
		info["Vowels"] = [`SAY: "Can you tell me the sounds of each letter?"`,
						  `If the student names the letter, count it as the long vowel sound. Then ASK: "Can you tell me another sound for the letter?" The student should name the short vowel sound.`]
		info["Short vowel"] = [defInfoStr]
		info["Consonant blend short vowel"] = [defInfoStr] 
		info["Digraph short vowel"] = [defInfoStr]
		info["Long vowel"] = [defInfoStr]
		info["Vowel team"] = [defInfoStr]
		info["R-controlled vowel"] = [defInfoStr] 
		info["Variant vowel"] = [defInfoStr]
	}

	else if (lang == "es"){

		words["Las vocales"]      = ["o", "a", "i", "u", "e"]
		words["Las consonantes"]  = ["d", "l", "n", "s", "v", "z", "j", "t", "y", "p", "c", "m", "ch", "ñ", "ll", "g", "f", "b", "q", "r", "x"]
		words["Silabas abiertas"] = ["su", "yo", "luna", "tela", "jefe", "año", "iba", "oro", "esa", "mar"] 
		words["Digrafos y sonidos variables"] = ["gema", "hoja", "guiso", "cima", "coce", "quito", "chapa", "llega", "quema", "guerra"] 
		words["Silabas cerradas"] = ["sol", "pan", "tambor", "juntos", "artes", "vez", "por", "cansar", "partir", "bosque"] 
		words["Silabas trabadas"] = ["brazo", "grillo", "clase", "pluma", "globo", "tripa", "crece", "madre", "libro", "plato"] 
		words["Diptongos"] = ["puerta", "siempre", "treinta", "cuando", "viento", "cuesta", "guante", "sueño", "reina", "momia"] 
		words["Hiatos"] = ["feo", "cae", "leer", "poeta", "maestra", "creo", "toalla", "koala", "tarea", "cacao"] 

		//just a dictionary that keeps track of how many letters per group are currently correct.
		results["Las vocales"] = words["Las vocales"].length
		results["Las consonantes"] = words["Las consonantes"].length
		results["Silabas abiertas"] = words["Silabas abiertas"].length
		results["Digrafos y sonidos variables"] = words["Digrafos y sonidos variables"].length
		results["Silabas cerradas"] = words["Silabas cerradas"].length
		results["Silabas trabadas"] = words["Silabas trabadas"].length
		results["Diptongos"] = words["Diptongos"].length
		results["Hiatos"] = words["Hiatos"].length

		//info strings
		info["Las vocales"] = [`DIGA: "¿Puedes decirme cuales son los sonidos de estas letras?"`]

		info["Las consonantes"] = ["DIGA: \"Mira estas letras. ¿Puedes decirme qué sonido tiene cada letra? \"",
						  `Be sure to ask if he or she knows of another sound for the letters c and g. Do not expect the student to know more than one sound for r (either /r/ or /rr/ is acceptable). If the students cannot say the sound for three or more consecutive letters DIGA: "Mira todas las letras y dime qué sonidos conoces?"`]

		defInfoStr = "DIGA: \"Quiero que leas estas palabras. ¡Hazlo lo mejor que puedas!\""

		info["Silabas abiertas"] = [defInfoStr]
		info["Digrafos y sonidos variables"] = [defInfoStr] 
		info["Silabas cerradas"] = [defInfoStr]
		info["Silabas trabadas"] = [defInfoStr]
		info["Diptongos"] = [defInfoStr] 
		info["Hiatos"] = [defInfoStr]
	}

	for (group in words) {
		groups.push(group)
	}
}


//words = {"pt1":["one","two","three"], "pt2":["four","five","six"], "pt3":["sev","eight","nine"]}
//results = {"pt1":0, "pt2":0, "pt3":0}
//no blocking input: gotta increment asynchronously.

function showResults(){
	//modify this for a final output table.
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
		//showResults()
		$("#nextbutton").text("Save")
		//$("#nextbutton").addClass("submit");	
		$(".form-control").slideDown()
	}
}

function populateTable(){
	//change values of table: or just add a divider in and start
	//make the below a case for if they are words. make another use case for letters.
	
	let rows //this could be programatically determined if the need arises.
	rows = Math.ceil(words[groups[gindex]].length/5)
	if (lang == "en")
	{
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
		}
		else if (groups[gindex]=="Short vowel"){
			$(`
			<tr class='table-active'>
				<th style="text-align: center;" colspan=5>Reading and Decoding</th>
			</tr>
			`).appendTo($("#wordstab"))
		}
		else if (groups[gindex]=="Long vowel"){
			$(`<tr class="trShowOnPrint" style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))
			$(".trShowOnPrint").hide()
		}
	}
	else if (lang == "es")
	{
		if (groups[gindex]=="Las vocales"){
			$(`
			<tr class="table-active trShowOnPrint" >
				<th style="text-align: center;" class="childInfo" colspan=5></th>
			</tr>
			<tr class='table-active'>
				<th style="text-align: center;" colspan=5>Alphabet Skills and Letter Sounds</th>
			</tr>
			`).appendTo($("#wordstab"))
		}
		else if (groups[gindex]=="Silabas abiertas"){
			$(`
			<tr class='table-active'>
				<th style="text-align: center;" colspan=5>Reading and Decoding</th>
			</tr>
			`).appendTo($("#wordstab"))
		}
		else if (groups[gindex]=="Silabas trabadas"){
			//need 2 blank rows here to pad out printing.
			$(`<tr class="trShowOnPrint" style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))
			$(`<tr class="trShowOnPrint" style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))
			$(".trShowOnPrint").hide()
		}
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
			<td colspan="${Math.ceil(numMembers/rows)}" class="info"> ${factoid} </td>
		</tr>
		`
	})

	rowStr=`<tr>`

	let rcount = 0

	//bottom divider with numbers is filled in.
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
	//add a blank row for each group.
	$(`<tr class="trHideOnPrint" style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))

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

function reparseResult(element, clickgroup){
	//this sets the correct background color for each part of the form.
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
		//border="solid 2px"
		//border = moving elements around
	}

	$(`.result${clickgroup}`).css({'backgroundColor': bgcolor})
	$(`.result${clickgroup}`).css({'border': border})
	//background-color: #FFEA00 !important;

}

function printPDF() {
	//this prepares the site to be printed and prints a PDF. 
	//note that this screws up the formatting of the site, and it needs to be reloaded to run another test.
	
	console.log("PRINTING PDF")
	studentname = `${$(".fnamein").val()} ${$(".lnamein").val()}`
	$(`<tr style="background-color: transparent;"><td colspan="5">&nbsp;</td></tr>`).appendTo($("#wordstab"))
	$(".trHideOnPrint").hide()

	curdate = new Date(Date.now())
	let day = curdate.getDate()
	let mon = curdate.getMonth()+1 //note that month 0 is January
	let year= curdate.getFullYear()

    //beginning of year: anything before december
	//middle of year: jan and feb
	//end of year: march to end of school.
	
	datestr = String(mon)+"/"+String(day)+"/"+String(year)
	let yeardes
	if (mon > 7){
		yeardes  = "BOY"
	}
	else if (mon <= 2) {
		yeardes = "MOY"
	}
	else{
		yeardes = "EOY"
	}

	//we want the date to be on the final report and in the filename.

	//add in name at top inside of printable div and show it.
	$(".childInfo").text(`${studentname} | Grade: ${$(".gradein").val()}, ${$(".schoolin").val()} | ${datestr}`)
	$(".trShowOnPrint").show()
	var element = document.getElementById("printable")
	element.style.width = '700px';
	element.style.height = '1800px';
	element.style.scale = '.95';

	var opt = {
		margin: 0.5,
		//TODO: include date, also grade and school at top of page
		//let date = new Date();
		//filename: `${studentname}-${date}-PhonicsSurvey.pdf`,
		filename: `${studentname.split(' ').join('')+"_"+yeardes}_Phonics.pdf`,
		image: {type: 'jpeg', quality: 1},
		html2canvas: {scale: 2},
		jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', precision: '12'}
	};

	html2pdf().set(opt).from(element).save().then(res => {
		//auto reload once saved.
		console.log("reload here!")
		//location.reload();
	})
}

$( document ).ready(function() {
	lang = "en" // set global var lang here!
	lang = (($("#stype").html().includes("English") ? "en" : "es"));

	prepWords()
	populateTable()
	$(".HIDE").hide()
	$(".trShowOnPrint").hide()
	$(".outputdiv").hide()
	$(".form-control").hide()
	$("#nextbutton").click(function(e) {nextButtonPress()})

	/*
	//this is to test the printing part.
	for( var i = 0; i<9; i++){
		console.log(i)
		nextButtonPress()
	}
	*/
	
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

	//no reload on form submit
	$(document).on('submit', '#endform', function() {
      return false;
    });
})
