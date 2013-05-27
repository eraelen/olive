var deleteNote = function (noteid) {
	$.ajax({
		type: 'POST',
		url: '/deleteNote',
		data: {noteid: noteid},
		success: function(nid) {
			$('#nid_'+nid).remove();
		}
		}).done(function(msg) { 
			console.log("ejs msg ", msg); 
		});
};
	
var createNote = function (msg, cid, lid, ques) {
	$.ajax({
		type: 'POST',
		url: '/createNote',
		data: {msg : msg, cid: cid, lid: lid, ques: ques},
		success: function (note) {
			$('#noteList').prepend(addNoteHTML(note));
			deleteN();
		}
		}).done(function(msg) {
			console.log("ejs msg ", msg);
		});
};
	
function deleteN() {
	$('.delete').bind('click',
	function (event) {
		var noteid = $(this).attr("id");  
		deleteNote(noteid);

		return false;
	});
};

function createN() {
	$('#noteSubmit').bind('click',
		function (event) {
			var msg = $('textarea').val();
			var cid_lid = $('textarea').attr("name").split("_");
			var cid = cid_lid[0];
			var lid = cid_lid[1];
			var ques = $('#question').prop("checked");
			createNote(msg, cid, lid, ques);
			
			$('textarea').val('');
			return false;
		});
}