//Where the magic happens.

class Chunk {
	// Chunks are smart. they know their own type, and can be queried as such.
  constructor(val,type, group = null){
	  this.val = val; //raw text of chunk
	  this.type = type; //vowel or consonant
	  this.group = this.retgroup(group); //what type of group is in it
  }

  retgroup(inthing){
	  if(inthing) return inthing;
	  if(this.val.length == 1 & /f|p|d|r|h|w|g/.test(this.val)){
		  return "ic"
		}
	  else if(this.val.length == 1 & /n|t|g|b|p|m/.test(this.val)){
		  return "fc"
		}
	  else if(this.val.length == 1 & /a|e|i|o|u/.test(this.val)){
		  return "sv"
		}
	  else if(/sh|ch|th/.test(this.val)){
		  return "di"
		}
	  else if(/sl|st|dr|bl|fr|cr|tr|sp|gr|cl/.test(this.val)){ // + removed mp
		  return "bl"
		}
	  else if(/ai|ea|oa|igh/.test(this.val)){
		  return "lv"
		}
	  else if(/ew|aw|or|ou|oi|ow|ir/.test(this.val)){
		  return "ov"
		}
	  else if(/ed|es|ies|pping|ding/.test(this.val)){
		  return "en"
		}
	  else //other 
		  return "ot"
  }
}

class Word {
  constructor(raw, chunks = null, chunkv = null, chunkc = null, problems = null, longvowel = false){

	  this.raw = raw; //raw string of the word
	  this.chunks = chunks; //array of the chunks in a word
	  this.chunkv = chunkv; //array of only vowels in word
	  this.chunkc = chunkc; //array of only consonants in a word
	  this.problems = problems; //the chunks that are incorrect?
	  this.longvowel = longvowel; //whether the word has a long vowel or not.
  }

  parse(){
	  //issues - vowels before long vowels = won't split.
	  let restr   = new RegExp("igh|[eao]w|[oi]r|[b-df-hj-np-tv-xz]+|[aeiouy]+","g")
	  let vowels  = new RegExp("[aeiouy]")
	  this.chunks = new Array(); //all chunks in a word.
	  this.chunkv = new Array(); //the vowels in a word
	  this.chunkc = new Array(); //the consonants in a word
	  this.problems = new Array(); //these are the incorrect chunks in a word. NOT JUST FOR OUTPUT, MUST MATCH

	  this.raw = this.raw.toLowerCase().trim();
	  //loading match with the first matching value

	  let endings = ["ed", "ies", "pping", "ding", "es"];
	  let chop = this.raw;
	  let end = null; endings.forEach(ending => { if (chop.endsWith(ending)) {
			  chop = chop.slice(0,chop.length - ending.length) // chop is the word without the ending.
			  end = new Chunk(ending, 'c')
		  }
		})

	  // regex on the string without the ending. ending is treated as a consonant.
	  let match = restr.exec(chop)
	  //filling the arrays with the correct values
	  while(match !== null){
		  this.chunks.push(new Chunk(match[0], ((vowels.test(match)) ? 'v' : 'c')));
		  if (vowels.test(match))
			  this.chunkv.push(match[0])
		  else
			  this.chunkc.push(match[0]) 
		  match = restr.exec(chop);
	  }

	  //fixing endings.
	  if (end){
		  this.chunks.push(end)
		  this.chunkc.push(end.val) //ending treated as consonant
	  }

	  //reversing to make FIFO
	  this.chunkv.reverse()
	  this.chunkc.reverse()
	  this.longvowel = /[oai]\w+e/.test(chop)

	  //long vowel edge case. we're assuming that long vowels are just the first two vowels.
	  //could possibly change this to match the first o/a/i and the next e, but more work.
	  let vcount = 0
	  if(this.longvowel){
		  this.chunks.forEach(c =>{
			  if(c.type == "v" & vcount < 2){
				  vcount += 1
				  c.group = "lv"
				}
			})
		}
  }

  testAgainst(correct){
	  let refined = new Array();
	  let comp = ""

	  let wronglv = false
	  correct.chunks.forEach(corchunk => {
		  if (corchunk.type == "v" && this.chunkv.length !== 0)
			  comp = this.chunkv.pop();
		  else if (corchunk.type == "c" && this.chunkc.length !== 0)
			  comp = this.chunkc.pop();
		  else
			  comp = "_";

		  if (comp == corchunk.val)
			  refined.push(new Chunk(comp, "t"))
		  else
		  {
			  refined.push(new Chunk(comp, "f"))

			  //handle long vowels - if the a is wrong, the e is also and vice versa.
			  if(correct.longvowel & corchunk.group == "lv"){
				  wronglv = true 
			  }
		  }

		  //make a new chunk with value of correct or incorrect, and pass it as a list
		  //with the correctly chunked word to the output function.
		  //pad out the incorrect with spaces.
	  })

	  refined.forEach((c,idx) => {
		  //if they get one long vowel wrong, they get all long vowels wrong.
		  if(correct.chunks[idx].group == "lv" & wronglv){
			  c.type = "f";
			  this.problems.push(correct.chunks[idx])
		  }
		  else if(c.type == "f")
			this.problems.push(correct.chunks[idx])
		})
	  //refined is padded and has info on correct or incorrect. 

	  //console.log(refined)
	  this.renderWord(refined, correct)
  }

  renderWord(thisChunk, correct){
	  //thisChunk is an ARRAY that has chunks that are padded nicely
	  //correct is a WORD that can be used as normal.
	  let table = $("#outputtab")
	  let wrongrow = ""
	  let rightrow = ""
	  let probrow  = ""
	  let ccount = 0

	  thisChunk.forEach((c, idx) => {
		  ccount += 1
		  if (c.type == "t")
			rightrow += "<td>" + correct.chunks[idx].val + "</td>"
		  else if (c.type == "f")
		  {
			  rightrow += "<td class=\"wrong\">" + correct.chunks[idx].val + "</td>"
			  probrow += `<td class ="pco" id=" ${correct.chunks[idx].group}">` + correct.chunks[idx].val + "</td>"
			  //I KNOW id is supposed to be unique. but i'm not figuring out the intricacies of attr tonight.
		  }
		  wrongrow += "<td>" + c.val + "</td>";
		})
	  //if the kid's word is longer, slap those tds on there.
	  //doesn't work if refined screws with the order too much.
	  if(this.chunks.length > ccount){
		  this.chunks.slice(ccount).forEach(c => {
			  wrongrow += "<td class=\"wrong\">" + c.val + "</td>";
			})
		}
	  let rows = `
<tr>

<td style="vertical-align:middle;"><span class="bigtext"> ${correct.raw} </span></td>
<td style="vertical-align:middle;"><span class="bigtext"> ${this.raw} </span></td>

<td> 
  <table>
   <tr>
	${wrongrow}
   </tr>
  </table> 
</td>

<td> 
  <table>
   <tr>
	${rightrow}
   </tr>
  </table> 
</td>
<td class="teacherrem"> 
  <table>
   <tr>
   <!-- add table headers so people know what's what-->
	${probrow}
   </tr>
  </table> 
</td>

</tr>
`
	  $(rows).appendTo(table);
  }
} 


var teachermode = true //this mode hides the Problem Chunks and Analysis columns.

//TODO add a selector dropdown that lets you use different word lists (for spanish and the like)
//var key = ["fan", "blade", "camped"];
//var key = ["camped", "chewed"]
var key = ["fan", "pet", "dig", "rob", "hope", "wait", "gum", "sled", "stick", "shine", "dream", "blade", "coach", "fright", "chewed", "crawl", "wishes", "thorn", "shouted", "spoil", "growl", "third", "camped", "tries", "clapping", "riding"];
var groups = {"ic": {name: "Initial Consonants", corr: [], wrong: []},
			"fc": {name: "Final Consonants", corr: [], wrong: []},
			"sv": {name: "Short Vowels", corr: [], wrong: []},
			"di": {name: "Digraphs", corr: [], wrong: []},
			"bl": {name: "Blends", corr: [], wrong: []},
			"lv": {name: "Long Vowels", corr: [], wrong: []},
			"ov": {name: "Other Vowels", corr: [], wrong: []},
			"en": {name: "Inflected Endings", corr: [], wrong: []},
			"ot": {name: "Other Chunks", corr: [], wrong: []}}

var agg = []
var wrong = []
var vals = [];
var index = -1;

function hasbeen(words){
  //this logic is kinda backwards tbh
  if (index == -1){
	  index = 0;

	  if($(".infield").val().toLowerCase() == "password"){

		  //if you're a teacher, reading this field to access admin mode, you deserve it!
		  //but REMEMBER UNCLE BEN! with great power comes great responsibility.
		  //admin mode is never 100% correct! PLEASE PLEASE PLEASE verify the program's output as correct.

		  teachermode = false
		  alert("Admin mode on!")
		}
	  $(".infield").val(" ") 

	  $("#basic-addon1").text(words[0]);
	  $(".infobut").text("Next Word");
	  $(".infield").prop("placeholder", "")
	}
  else if (index == words.length-1){
	  vals.push($(".infield").val())
	  $(".infield").val(" ") 

	  $(".inputdiv").slideUp()
	  $(".outputdiv").slideDown()
	  parseCorr()
	}
  else{
	  vals.push($(".infield").val())
	  $(".infield").val(" ") 
	  //sets the NEXT word for reading in
	  index += 1
	  $("#basic-addon1").text(words[index])
	}
}

function parseCorr(wrongIn= null){
  //everything that runs after the words are parsed happens here.

  groups = {"ic": {name: "Initial Consonants", corr: [], wrong: []},
			"fc": {name: "Final Consonants", corr: [], wrong: []},
			"sv": {name: "Short Vowels", corr: [], wrong: []},
			"di": {name: "Digraphs", corr: [], wrong: []},
			"bl": {name: "Blends", corr: [], wrong: []},
			"lv": {name: "Long Vowels", corr: [], wrong: []},
			"ov": {name: "Other Vowels", corr: [], wrong: []},
			"en": {name: "Inflected Endings", corr: [], wrong: []},
			"ot": {name: "Other Chunks", corr: [], wrong: []}}

  //here's the deal. javascript only has shallow copies as far as I can tell
  //we need to fix this in a smart way. probably need a groups object
  //or just remove the ability to re-parse

  if (!wrongIn){
	  $("#outputtab tr").remove()
	  tabhead = `        <tr>
		  <th>Correct Word</th>
		  <th>Attempt Word</th>
		  <th>Attempt Chunks</th>
		  <th>Correct Chunks</th>
		  <th class="teacherrem">Problem Chunks</th>
		</tr>`
	  $(tabhead).appendTo($("#outputtab"))

	  key.forEach((n,idx) =>{
		  let kids = new Word(vals[idx]); kids.parse();
		  let corr = new Word(n); corr.parse();
		  kids.testAgainst(corr);
		  //aggregate
		  //TODO this needs to be done every time to make rejecting issues work.
		  agg = agg.concat(corr.chunks)
		  wrong = wrong.concat(kids.problems)
	  })
	}
  //console.log(agg)
  //console.log(wrong)
  agg.forEach(c => {
	  groups[c.group]["corr"].push(c)
	})

  wrong.forEach(c => {
	  groups[c.group]["wrong"].push(c)
	})

  if (teachermode){
	  $('.teacherrem').hide();
	  //hide all elements with class teacherrem
	}
  else{
	  showAnswers()
	}
}

function showAnswers(){
	//this may be wrong: check for bugginess later.
  $("#resulttab tr").remove()
  row = `  <tr>
		<th>Chunk Group </th>
		<th>Right / Total </th>
		<th>Problem Chunks</th>
	  </tr>`

  $(row).appendTo($("#resulttab"))

  Object.keys(groups).forEach(key => {
	  fracstring = `${(groups[key]["corr"].length-groups[key]["wrong"].length)}/${groups[key]["corr"].length}`

	  wrongrow = ""
	  groups[key]["wrong"].forEach(c => {
		  wrongrow += "<td>" + c.val + "</td>";
		})
	  //time to output this bad boy
	  let row = `
<tr>
<td style="vertical-align:middle;"><span class="bigtext"> ${groups[key]["name"]} </span></td>
<td style="vertical-align:middle;"> ${fracstring} </td>
<td> 
  <table>
   <tr>
	${wrongrow}
   </tr>
  </table> 
</td>
</tr>
`
	  $(row).appendTo($("#resulttab"))
	})
}

//enter key handler
$( document ).ready(function() {
  $(".outputdiv").hide()
  //$(".results").hide()

  $('#wordtext').on('keyup',function(code){
	  if (code.which === 13){
		  hasbeen(key);
		}
	})

  //clickables boiiii
  $(document).on('click', ".pco", function(e){
	  $(this).attr('class', 'pcf')
	  //remove one ed from the thing
	  i= -1
	  wrong.forEach((c, idx) => {
		  if (c.val == $(this).text()){
			  i= idx;
			}
		})
	  wrong = wrong.slice(0, i).concat(wrong.slice(i + 1, wrong.length))
	  parseCorr(true)
	})

  $(document).on('click', ".pcf", function(e){
	  $(this).attr('class', 'pco')
	  wrong.push(new Chunk($(this).text(),"f", group = $(this).attr('id').trim())) 
	  parseCorr(true)
	})
});
