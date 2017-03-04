$(document).ready(function() {

function EXTRACT(prefix,s) {
return s.substr(prefix.length);
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

 // Wikipedia
function WIKIID(data) {
return EXTRACT("https://en.wikipedia.org/wiki/",data[3][0]);		
}

function WIKI(query) {
var url = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&search="+encodeURI(query)+"&callback=?";
return $.getJSON(url);
}

function WIKIAC(data,prop) {
if(prop=="title") return data[1][0];
if(prop=="desc") return data[2][0];
if(prop=="url") return data[3][0];	
}


function WIKICONT(title) {
var url = "https://en.wikipedia.org/w/api.php?action=query&titles="+title+"&prop=extracts&format=json&callback=?";	
return $.getJSON(url);	
}

function WIKIHTML(data,tag,el) {
$(el).html("...");
var key = Object.keys(data.query.pages)[0];	
var result = data.query.pages[key].extract ;
var parse = $.parseHTML(result);
var fst= $(parse).filter(tag);	
if(fst)  $(el).html(fst); 
}

function WIKITHUMB(title) {
var url = "https://en.wikipedia.org/w/api.php?action=query&titles="+title+"&prop=pageimages&format=json&pithumbsize=300&callback=?"	
return $.getJSON(url);	
}

function WIKIIMG(data,type) {
var key = Object.keys(data.query.pages)[0];
if(type=="src") return  data.query.pages[key].thumbnail.source;
if(type=="title") return  data.query.pages[key].pageimage;
if(type=="width") return data.query.pages[key].thumbnail.width;
if(type=="height") return data.query.pages[key].thumbnail.height;	
	
}

function WIKIMOB(title) {
var url =  "https://en.wikipedia.org/w/api.php?action=mobileview&page="+title+"&sections=0&callback=?&format=json";
return $.getJSON(url);		
}

function WIKIMHTML(title) {
var url = "https://en.wikipedia.org/w/api.php?action=mobileview&page="+title+"&sections=0&callback=?&format=json";	
return $.getJSON(url);
//$(".mob").html(data.mobileview.sections[0].text); is very nice
}


//Knowledge
function KG(query) {
var url = "https://kgsearch.googleapis.com/v1/entities:search?limit=1&query="+encodeURI(query)+"&key=AIzaSyBjAjBDEmEWipPv5RvheOJ_RpO6uS1c3tA"+"&callback=?";	
console.log("Searching for "+query);
return $.getJSON(url);
}

function KGDATA(data,type) {
if(type=="title") return data.itemListElement["0"].result.name;	
if(type=="subtitle") return data.itemListElement["0"].result.description;
if(type=="desc") return data.itemListElement["0"].result.detailedDescription.articleBody;
if(type=="score") return data.itemListElement["0"].resultScore;
if(type=="imgsrc") return data.itemListElement["0"].result.image.contentUrl;
}

function HINDI(query) {
var url = "https://www.googleapis.com/language/translate/v2?q="+encodeURI(query)+"&target=hi&key=AIzaSyBjAjBDEmEWipPv5RvheOJ_RpO6uS1c3tA"+"&callback=?";
console.log("Searching for "+query);
return $.getJSON(url);
}

//Youtube
function YT(query) {
var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+encodeURI(query)+"&key=AIzaSyBjAjBDEmEWipPv5RvheOJ_RpO6uS1c3tA"+"&maxResults=1"+"&safesearch=moderate &callback=?";	
return $.getJSON(url);	
}

function YTDATA(data,type) {
if(type=="id") return data.items["0"].id.videoId;
if(type=="desc") return data.items["0"].snippet.description;
if(type=="title") return data.items["0"].snippet.title;
if(type=="imgsrc") return data.items["0"].snippet.thumbnails.medium.url;
if(type=="channel") return data.items["0"].snippet.channelTitle;	
}

// YQL 
function YQL(site) {
var url =  'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=json&callback=?';
return $.getJSON(url);			
}


//PageSpeed
function PSP(site) {
var url = "https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+site+"&key=AIzaSyBjAjBDEmEWipPv5RvheOJ_RpO6uS1c3tA&callback=?";
return $.getJSON(url);		
}

function PSPIMG(data) {
var i;
for(i=0;i<data.formattedResults.ruleResults.OptimizeImages.urlBlocks[0].urls.length;i++)
console.log(data.formattedResults.ruleResults.OptimizeImages.urlBlocks[0].urls[i].result.args[0].value)	;
}
//.formattedResults.ruleResults.OptimizeImages.urlBlocks["0"].urls["0"].result.args["0"].value
//.formattedResults.ruleResults.OptimizeImages.urlBlocks["0"].urls[1].result.args["0"].value
//.formattedResults.ruleResults.OptimizeImages.urlBlocks["0"].urls.length

// Stack Overflow
function STACK(site) {
YQL(site).done(function(data){ 
var ques = {};
var ans = {};
if(/questions/.test(site)) {
ques = getObjects(data,'itemtype','http://schema.org/Question');
console.log(ques);
ans = getObjects(data,'itemtype','http://schema.org/Answer');
console.log(ans);
}
});	
	
}

// YTVIEWS
function YTVIEWS(data) {
str = getObjects(data,"class","watch-view-count")[0].content;
return str;	//.split(" ",1)[0]
}

//KEYWORDS
function KWORD(query) {
var words = query.match(/\b[-?(\w+)?]+\b/gi);	
if (words) {
    var nonStopWords = [];
    var stopWords = ["a", "able", "about", "above", "abst", "accordance", "according", "accordingly", "across", "act", "actually", "added", "adj", "affected", "affecting", "affects", "after", "afterwards", "again", "against", "ah", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anything", "anyway", "anyways", "anywhere", "apparently", "approximately", "are", "aren", "arent", "arise", "around", "as", "aside", "ask", "asking", "at", "auth", "available", "away", "awfully", "b", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "beginning", "beginnings", "begins", "behind", "being", "believe", "below", "beside", "besides", "between", "beyond", "biol", "both", "brief", "briefly", "but", "by", "c", "ca", "came", "can", "cannot", "can't", "cause", "causes", "certain", "certainly", "co", "com", "come", "comes", "contain", "containing", "contains", "could", "couldnt", "d", "date", "did", "didn't", "different", "do", "does", "doesn't", "doing", "done", "don't", "down", "downwards", "due", "during", "e", "each", "ed", "edu", "effect", "eg", "eight", "eighty", "either", "else", "elsewhere", "end", "ending", "enough", "especially", "et", "et-al", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "except", "f", "far", "few", "ff", "fifth", "first", "five", "fix", "followed", "following", "follows", "for", "former", "formerly", "forth", "found", "four", "from", "further", "furthermore", "g", "gave", "get", "gets", "getting", "give", "given", "gives", "giving", "go", "goes", "gone", "got", "gotten", "h", "had", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "hed", "hence", "her", "here", "hereafter", "hereby", "herein", "heres", "hereupon", "hers", "herself", "hes", "hi", "hid", "him", "himself", "his", "hither", "home", "how", "howbeit", "however", "hundred", "i", "id", "ie", "if", "i'll", "im", "immediate", "immediately", "importance", "important", "in", "inc", "indeed", "index", "information", "instead", "into", "invention", "inward", "is", "isn't", "it", "itd", "it'll", "its", "itself", "i've", "j", "just", "k", "keep", "keeps", "kept", "kg", "km", "know", "known", "knows", "l", "largely", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "lets", "like", "liked", "likely", "line", "little", "'ll", "look", "looking", "looks", "ltd", "m", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "mean", "means", "meantime", "meanwhile", "merely", "mg", "might", "million", "miss", "ml", "more", "moreover", "most", "mostly", "mr", "mrs", "much", "mug", "must", "my", "myself", "n", "na", "name", "namely", "nay", "nd", "near", "nearly", "necessarily", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "ninety", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "nothing", "now", "nowhere", "o", "obtain", "obtained", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "omitted", "on", "once", "one", "ones", "only", "onto", "or", "ord", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "owing", "own", "p", "page", "pages", "part", "particular", "particularly", "past", "per", "perhaps", "placed", "please", "plus", "poorly", "possible", "possibly", "potentially", "pp", "predominantly", "present", "previously", "primarily", "probably", "promptly", "proud", "provides", "put", "q", "que", "quickly", "quite", "qv", "r", "ran", "rather", "rd", "re", "readily", "really", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research", "respectively", "resulted", "resulting", "results", "right", "run", "s", "said", "same", "saw", "say", "saying", "says", "sec", "section", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sent", "seven", "several", "shall", "she", "shed", "she'll", "shes", "should", "shouldn't", "show", "showed", "shown", "showns", "shows", "significant", "significantly", "similar", "similarly", "since", "six", "slightly", "so", "some", "somebody", "somehow", "someone", "somethan", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specifically", "specified", "specify", "specifying", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "t", "take", "taken", "taking", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "there'll", "thereof", "therere", "theres", "thereto", "thereupon", "there've", "these", "they", "theyd", "they'll", "theyre", "they've", "think", "this", "those", "thou", "though", "thoughh", "thousand", "throug", "through", "throughout", "thru", "thus", "til", "tip", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "ts", "twice", "two", "u", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "up", "upon", "ups", "us", "use", "used", "useful", "usefully", "usefulness", "uses", "using", "usually", "v", "value", "various", "'ve", "very", "via", "viz", "vol", "vols", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "wed", "welcome", "we'll", "went", "were", "weren't", "we've", "what", "whatever", "what'll", "whats", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "who'll", "whom", "whomever", "whos", "whose", "why", "widely", "willing", "wish", "with", "within", "without", "won't", "words", "world", "would", "wouldn't", "www", "x", "y", "yes", "yet", "you", "youd", "you'll", "your", "youre", "yours", "yourself", "yourselves", "you've", "z", "zero"];	
for (var i = 0; i < words.length; i++) {
      if (stopWords.indexOf(words[i].toLowerCase()) === -1 && isNaN(words[i])) {
        nonStopWords.push(words[i].toLowerCase());
      }
    }
	    var keywords = {};
    for (var i = 0; i < nonStopWords.length; i++) {
      if (nonStopWords[i] in keywords) {
        keywords[nonStopWords[i]] += 1;
      } else {
        keywords[nonStopWords[i]] = 1;
      }
    }

    var sortedKeywords = [];
    for (var keyword in keywords) {
      sortedKeywords.push([keyword, keywords[keyword]])
    }
    sortedKeywords.sort(function(a, b) {
      return b[1] - a[1]
    });
	return sortedKeywords;
}
	}

// READABILITY
function RABILITY(data) {
 var requestUrl = "https://ipeirotis-readability-metrics.p.mashape.com/getReadabilityMetrics?text=";
 var url =  encodeURI(requestUrl + data);
 
return $.ajax({
	url:url,
	type: 'POST',
	beforeSend: function(xhr) {
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.setRequestHeader("X-Mashape-Authorization", "PQ4FOFuaR6mshI6qpnQKQvkDZQXjp1o6Zcqjsnug7GvNggTzUE");	
	}
	
});
  
}

function READDATA(data,type) {
if(type=="readability") return ((data).FLESCH_READING);
if(type=="sentences") return ((data).SENTENCES);
if(type=="words") return ((data).WORDS);
if(type=="characters") return ((data).CHARACTERS);
if(type=="syllables") return (data.SYLLABLES);	
if(type=="complexwords") return ((data).COMPLEXWORDS);	
}
	


$(document).keyup(function(e) {
    var query =$(".search").val();
    var nquery="";
	 for(i=0;i<KWORD(query).length;i++)
    nquery += KWORD(query)[i][0]+" " ;
    console.log(nquery);
	/*
	$(".kg-score").text(" ");
	$(".kg-desc").text(" ");
    $(".kg-detail").text(" ");
	$(".wk-table").html(" ");    
    $(".wk-para").html(" ");  
	 $(".wk-auto").html(" ");
  $(".frame").hide();
  */

	if(e.which == 17 || e.which == 13  ) {
    WIKI(query).done(function(data) {
        console.log(data);
		if(data[1].length)
        $(".wk-auto").html('<a href="'+data[3][0]+'" >'+data[1][0]+'<br/><p>'+data[2][0]+'</p></a>');  
	    else
		WIKI(nquery).done(function(data){ if(data[1].length) $(".wk-auto").html('<a href="'+data[3][0]+'" >'+data[1][0]+'</a><br/><p>'+data[2][0]+'</p>'); });
    });
    KG(query).done(function(data) {
    console.log(data);	
    if(data.itemListElement["0"].result){ 
	$(".kg-score").text(data.itemListElement["0"].resultScore);
    $(".kg-desc").text(data.itemListElement["0"].result.name+" : "+data.itemListElement["0"].result.description);
    $(".kg-detail").text(data.itemListElement["0"].result.detailedDescription.articleBody);
} });

    RABILITY(query).done(function(data){
		var arr = ["characters","syllables","words","complexwords","sentences","readability"];
		var i;
		$(".analysis").html(" <p>Query Analysis (FLESCH_READING)</p>");
		for(i=0;i<arr.length;i++)
		$(".analysis").html($(".analysis").html()+'<p>'+arr[i]+" : "+READDATA(data,arr[i])+'</p>');
	}); 
    }
	
	if(e.which == 13) {	
	YT(query).done(function(data) {
		if(data.items["0"].id.videoId) {
$(".frame").attr("src","https://www.youtube.com/embed/" + data.items["0"].id.videoId);
$(".frame").show(200);
 $(".yt-info").html('<p>'+YTDATA(data,"desc")+'</p>');
		}
        else if(data.items["0"].id.channelId) {
		$(".frame").attr("src"," ");	
		$(".frame").hide();
    $(".yt-info").html('<a href="https://www.youtube.com/channel/'+data.items["0"].id.channelId+'" ><img src="'+data.items["0"].snippet.thumbnails.high.url+'" ></a><p>'+YTDATA(data,"desc")+'</p>');
		}
});
        
    WIKI("-"+query).done(function(data) {
    WIKIMHTML(WIKIID(data)).done(function(dat) {
    $(".wk-table").html(dat.mobileview.sections[0].text);    
     $(".wk-para").html(dat.mobileview.sections[0].text);      
    });    
    });
	
	
    }
  
    
    
    
    });
  
});