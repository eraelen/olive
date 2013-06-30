function addNoteHTML (note) {
	var content = '';
	var msg = note.message.split(" ");
	content += 	'<div class="note" id="nid_' + note.nid + '">'
			+	'<b>' + note.name + '<a href="/profile/' + note.username + '">@' + note.username + '</a></b><br>'
			+	'<div class="noteMsg">' + addMsgHTML(msg, note.ques, note.convo) + '<br> </div>'
			+	'<div class="noteDetails">'
			+	note.date + ' | <a href="/course/' + note.cid + '">' + note.code + '</a> | <a href="#">Detail</a> | <a href="#">Reply</a>'
			+ 	'| <a class="delete" id="' + note.nid + '" href=>Delete</a>'
			+	'</div>'
			+	'</div>';
	return content;
}

function addMsgHTML (msg, ques, convo) {
	var content = '';
	if ((ques == true) && (convo == null)) {
		content += '<font color = "red">';
	} else {
		content += '<font color = "black">';
	}
	for (var j=0; j < msg.length; j++) {
		if (msg[j].charAt(0) === "@" && msg[j].split("\@").length === 2) { 
			var word = msg[j].substring(1);
			content += '<a href="/profile/' + word + '">' + msg[j] + '</a> ';
		} else if (msg[j].charAt(0) === "#" && msg[j].split("\#").length === 2) {
			var word = msg[j].substring(1);
			content += '<a href="/searchN/' + word + '">' + msg[j] + '</a> ';
		} else {
			content += msg[j] + ' ';
		}
	}
	content += '</font>'
	return content;
}